import {
    computeScoreApi,
    createRecordMasseApi,
} from "@/api/recordInstallerApi";
import { requiredFilePatterns } from "@/constants/records";
import { FileMutlipleType } from "@/providers/CreateRecordProvider";
import {
    Dossier,
    ExtractedDataItem,
    ExtractedResult,
    FileMasse,
    RecordPayload,
} from "@/types/recordType";
import { Dispatch, SetStateAction } from "react";

export const transformPayload = (
  payload: ExtractedResult,
  form_type: string,
  contrat_id?: number | null | undefined
): RecordPayload[] => {
  const result: RecordPayload[] = [];

  for (const folderName in payload) {
    const entries = payload[folderName]; // array of VerificationExtractionResult
    const jobId = payload[folderName]?.[0]?.jobId ?? ""; // Assuming all entries have the same jobId

    const itemsContent: Record<
      string,
      {
        verification_results: any[] | null;
        extraction_data: Record<string, any> | null;
      }
    > = {};

    for (const entry of entries) {
      itemsContent[entry.type] = {
        verification_results: entry.verification_results,
        extraction_data: entry.extraction_data,
      };
    }

    const allVerificationResults: ExtractedDataItem[] = [];

    for (const type in itemsContent) {
      const verification = itemsContent[type]?.verification_results;
      if (Array.isArray(verification)) {
        allVerificationResults.push(...verification);
      }
    }

    const record: Partial<RecordPayload> = {
      name: folderName,
      form_type: form_type,
      company_name:
        itemsContent.facture?.extraction_data?.professionel?.raison_sociale ??
        "",
      siret: itemsContent.facture?.extraction_data?.professionel?.siret ?? "",
      work_address:
        itemsContent.facture?.extraction_data?.professionel?.adresse ?? "",
      work_postal_code: "",
      work_city: "",
      address:
        itemsContent.facture?.extraction_data?.beneficiaire?.adresse ?? "",
      postal_code: "",
      city: "",
      quantity_length: 0,
      brand: "",
      reference: "",
      date_of_quote_signature:
        itemsContent.devis?.extraction_data?.date_devis ?? "",
      date_of_invoice_issue:
        itemsContent.facture?.extraction_data?.facture?.date ?? "",
      date_of_honor_statement_signature: "",
      items: allVerificationResults,
      statusCode: "",
      job_id: jobId,
      installed_by: "",
      contrat_id: contrat_id ?? null, // Use the provided contrat_id or null if not defined
    };

    result.push(record as RecordPayload);
  }

  return result;
};

export const extractGroupedVerificationAndExtraction = (
  data: any
): ExtractedResult => {
  //data ==> response from /installateur/upload_mass ( objet complexe )
  const grouped: ExtractedResult = {};
  const typesToCheck = [
    "attestation",
    "attestation_pose",
    "devis",
    "facture",
  ] as const;

  if (!Array.isArray(data)) return grouped;

  for (const item of data) {
    const results = item?.results ?? {};

    for (const folderKey in results) {
      const fileResults = results[folderKey]?.file_results ?? {};
      const jobId = results[folderKey]?.job_id ?? "";

      for (const type of typesToCheck) {
        // Ici `type` est bien "attestation" | "attestation_pose" | ...
        const file = fileResults[type];

        if (file) {
          if (!grouped[folderKey]) grouped[folderKey] = [];

          grouped[folderKey].push({
            jobId: jobId,
            type,
            verification_results: file.verification_results ?? null,
            extraction_data: file.extraction_data ?? null,
          });
        }
      }
    }
  }

  return grouped;
};

export const handleCreateRecordMasse = async (
  payloadExtracted: ExtractedResult,
  form_type: string,
  setStatusFolder: Dispatch<SetStateAction<Record<string, any>>>,
  contrat_id?: number | null | undefined,
  taskId?: string
) => {
  try {
    const payloadToSend = transformPayload(payloadExtracted, form_type, contrat_id );
    
    const response = await createRecordMasseApi(payloadToSend);

    for (const item of payloadToSend) {
      await computeScoreApi(item.job_id, item.form_type);
    }
     if (taskId) {
      setStatusFolder(prev => ({
        ...prev,
        [taskId]: response, // 🟢 Ajoute ou met à jour la tâche en cours
      }));
    }
    return true;
  } catch (error) {
    console.error("Error creating record:", error);
    if (taskId) {
      setStatusFolder(prev => ({
        ...prev,
        [taskId]: { error: true, message: error },
      }));
    }
    return false;
  }
};

export const transformPayloadToPayloadMasse = (
  payload: FileMutlipleType
): FileMasse => {
  const dossiers: Dossier[] = [];
  const restrictedFiles: File[] = [];
  const otherFiles: File[] = [];

  const isRestrictedFile = (fileName: string, formType?: string): boolean => {
  // Cas normal → check tous les patterns
    const matchBase = Object.values(requiredFilePatterns).some((patterns) =>
      patterns.some((pattern) => pattern.test(fileName))
    );

    // Cas spécial TRA_EQ_114 ou TRA_EQ_117 → forcer Devis + Facture
    const isTRA_EQ =
      formType !== undefined &&
      ["TRA_EQ_114", "TRA_EQ_117"].includes(formType);
    
    const isBarSE108109 = formType !== undefined && ['BAR_SE_109', 'BAR_SE_108'].includes(formType);

    const matchSpecial =
      isTRA_EQ &&
      (
        requiredFilePatterns["Devis"].some((pattern) => pattern.test(fileName)) ||
        requiredFilePatterns["Facture"].some((pattern) => pattern.test(fileName))
      );
    
      const matchBARSESpecial = isBarSE108109 && (
        requiredFilePatterns["Attestation de désembouage"].some((pattern) => pattern.test(fileName)) ||
        requiredFilePatterns["Cadre de contribution"].some((pattern) => pattern.test(fileName))
      )

    return matchBase || matchSpecial || matchBARSESpecial;
  };

  Object.entries(payload.items).forEach(([folderName, files]) => {
    const fichierNamesRequis: string[] = [];

    files.forEach((uploaded) => {
      const fileBlob =
        uploaded.file instanceof File ? uploaded.file : new Blob();
      const fileWithPath = new File([fileBlob], uploaded.name, {
        type: uploaded.type,
        lastModified: uploaded.file?.lastModified ?? Date.now(),
      });

      Object.defineProperty(fileWithPath, "webkitRelativePath", {
        value: `${folderName}/${uploaded.name}`,
        writable: false,
      });

      // Catégoriser
      if (isRestrictedFile(uploaded.name, payload.form_type)) {
        restrictedFiles.push(fileWithPath);
        fichierNamesRequis.push(uploaded.name); 
      } else {
        otherFiles.push(fileWithPath);
      }
    });

    if (fichierNamesRequis.length > 0) {
      dossiers.push({
        folder_name: folderName,
        fichiers: fichierNamesRequis,
        other_files: otherFiles
          .filter((file) =>
            file.webkitRelativePath.startsWith(folderName + "/")
          )
          .map((file) => file.name),
      });
    }
  });

  return {
    dossiers,
    restrictedFiles,
    otherFiles,
    type_formulaire: payload.form_type,
    contrat_id: payload.contrat_id ?? null,
  };
};


  export const handleComputeScore = async (job_id: string, form_type: string) => {
    try {
      return await computeScoreApi(job_id, form_type);
    } catch (error) {
      console.error("Error computing score:", error);
      return null;
    }
  };

export const handleDownloadJson = async (setDownloading: React.Dispatch<React.SetStateAction<boolean>>, payload: RecordPayload) => {
    try {
      setDownloading(true);
      const score_json = await handleComputeScore(
        payload.job_id,
        payload.form_type
      );
      if (score_json !== null && score_json !== undefined) {
        const blob = new Blob([JSON.stringify(score_json, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${payload.job_id}.json`;
        a.click();
      }
    } catch (error) {
      console.error("Error downloading json:", error);
    } finally {
      setDownloading(false);
    }
  };