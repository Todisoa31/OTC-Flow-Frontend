import CloseButtonCircle from "@/assets/icons/CloseButtonCircle";
import FileTextIcon from "@/assets/icons/FileTextIcon";
import FolderIcon from "@/assets/icons/FolderIcon";
import PencilIcon from "@/assets/icons/PencilIcon";
import { FOLDER_TYPES, requiredFilePatterns } from "@/constants/records";
import { useRecords } from "@/providers/CreateRecordProvider";
import { Uploadedfile } from "@/types/recordType";
import React, { useMemo } from "react";

type Props = {
  files: Uploadedfile[];
  folder: string;
  removeFile: (fileToRemove: Uploadedfile) => void;
};

const ListFiles = (props: Props) => {
  const { files, folder, removeFile } = props;

  const { payloadMasse, setPayloadMasse } = useRecords();
  const forbiddenTexts = [
    "erreur",
    "pas bon",
    "error",
    "wrong",
    "invalid",
    "incorrect",
    "faux",
    "fake",
    "sample",
    "draft",
    "temp",
    "annulé",
    "cancel",
    "deprecated",
    "corrupt",
    "bug"
  ];

  const honorPatterns = requiredFilePatterns["Attestation sur l'honneur"] || [];
  const honorFiles = files.filter(file =>
    honorPatterns.some(regex => regex.test(file.name))
  );
  const honorDuplicateIds = honorFiles.length > 1 ? new Set(honorFiles.map(f => f.id)) : new Set<string>();

  //devis et facture
  const devisPatterns = requiredFilePatterns["Devis"] || [];
  const devisFiles = files.filter(file =>
    devisPatterns.some(regex => regex.test(file.name))
  );
  const devisDuplicateIds = devisFiles.length > 1 ? new Set(devisFiles.map(f => f.id)) : new Set<string>();

  const facturePatterns = requiredFilePatterns["Facture"] || [];
  const factureFiles = files.filter(file =>
    facturePatterns.some(regex => regex.test(file.name))
  );
  const factureDuplicateIds = factureFiles.length > 1 ? new Set(factureFiles.map(f => f.id)) : new Set<string>();

  //attesation desembouage et contribution
  const desembouagePatterns = requiredFilePatterns["Attestation de désembouage"] || [];
  const desembouageFiles = files.filter(file =>
    desembouagePatterns.some(regex => regex.test(file.name))
  );
  const desembouageDuplicateIds = desembouageFiles.length > 1 ? new Set(desembouageFiles.map(f => f.id)) : new Set<string>();

  const contributionPatterns = requiredFilePatterns["Cadre de contribution"] || [];
  const contributionFiles = files.filter(file =>
    contributionPatterns.some(regex => regex.test(file.name))
  );
  const contributionDuplicateIds = contributionFiles.length > 1 ? new Set(contributionFiles.map(f => f.id)) : new Set<string>();

  
  const isRequiredFileInvalid = (file: Uploadedfile) => {
    const { payloadMasse } = useRecords();
    const fileRequired = FOLDER_TYPES.find(item => item.code === payloadMasse.form_type)?.requiredDocuments || [];

    const matchedLabel = fileRequired.find(label => {
      const patterns = requiredFilePatterns[label] || [];
      const isHonorDuplicate = honorDuplicateIds.has(file.id);
      return patterns.some((regex) => regex.test(file.name));
    });

    if (!matchedLabel) return false; // fichier non requis

    return forbiddenTexts.some(text => file.name.toLowerCase().includes(text));
  };

  const getDuplicateFileIds = (allFiles: Uploadedfile[]) => {
    const nameMap = new Map<string, string[]>(); // nom => liste d'IDs
    const duplicates = new Set<string>();

    allFiles.forEach((file) => {
      const key = file.name.trim().toLowerCase();
      if (!nameMap.has(key)) {
        nameMap.set(key, []);
      }
      nameMap.get(key)!.push(file.id);
    });

    for (const ids of nameMap.values()) {
      if (ids.length > 1) {
        ids.forEach(id => duplicates.add(id));
      }
    }

    return duplicates;
  };

  const modifyFile = (e: React.ChangeEvent<HTMLInputElement>, file: Uploadedfile) => {
    const newFile = e.target.files?.[0];
    if (!newFile) return;

    setPayloadMasse((prevPayload) => {
      const newPayload = { ...prevPayload };
      const updatedItems = { ...newPayload.items };

      if (!updatedItems[folder]) return prevPayload; // Sécurité

      // Vérifier si doublon (même nom dans ce dossier, sauf le fichier en cours de modif)
      const isDuplicate = updatedItems[folder].some(
        (f) => f.name === newFile.name && f.id !== file.id
      );

      if (isDuplicate) {
        // Supprimer le fichier modifié (celui en doublon)
        const filteredFiles = updatedItems[folder].filter(
          (f) => f.id !== file.id
        );

        alert(
          "Ce fichier existe déjà dans la liste. Le fichier en doublon a été supprimé. Veuillez choisir un fichier différent."
        );

        updatedItems[folder] = filteredFiles;

        return {
          ...newPayload,
          items: updatedItems,
        };
      }

      // Pas de doublon, on remplace normalement
      const updatedFile: Uploadedfile = {
        id: file.id,
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        file: newFile,
      };

      updatedItems[folder] = updatedItems[folder].map((f) =>
        f.id === file.id ? updatedFile : f
      );

      return {
        ...newPayload,
        items: updatedItems,
      };
    });
  };

  const isFileNameValid = (_fileName: string) => true;

  const getFileIcon = (file: Uploadedfile) => {
    if (file.type.includes("zip")) {
      return <FolderIcon />;
    }
    return <FileTextIcon />;
  };

const duplicateIds = useMemo(() => {
  const allFiles = Object.values(payloadMasse.items || {}).flat();
  return getDuplicateFileIds(allFiles);
}, [payloadMasse]);

  return (
    <div className="accordion-content mx-4 border-t border-gray-900/10">
      <div className="flex flex-col mt-4">
        {files.map((file) => {
          const isDuplicate = duplicateIds.has(file.id);
          const isInvalidRequiredFile = isRequiredFileInvalid(file);
          const isHonorDuplicate = honorDuplicateIds.has(file.id);
          const isFactureDuplicate = factureDuplicateIds.has(file.id);
          const isDevisDuplicate = devisDuplicateIds.has(file.id);
          const isDesembouageDuplicate = desembouageDuplicateIds.has(file.id);
          const isContributionDuplicate = contributionDuplicateIds.has(file.id);
          const isFileEmpty = file.size === 0;
          const fileClassName = `self-stretch h-12 px-3.5 mb-2 inline-flex justify-start items-center gap-2.5 rounded-md ${
            isDuplicate || isInvalidRequiredFile || isHonorDuplicate || isDevisDuplicate || isFactureDuplicate || isDesembouageDuplicate || isContributionDuplicate || isFileEmpty ? "border border-red bg-[#c70042]/10" : ""
          }`;

          return (
            <div key={file.id} className={fileClassName}>
              <div className="w-4 h-4 relative overflow-hidden">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 justify-center text-slate-600 text-xs font-bold leading-none">
                {file.name}
              </div>

              {(isDuplicate || isInvalidRequiredFile || isHonorDuplicate || isDevisDuplicate || isFactureDuplicate || isDesembouageDuplicate || isContributionDuplicate || isFileEmpty ) && (
                <>
                  <label
                    htmlFor={file.id}
                    data-svg-wrapper
                    className="cursor-pointer text-blue-600 text-xs font-semibold mr-2"
                  >
                    <PencilIcon />
                  </label>
                  <input
                    type="file"
                    accept=".docx,.pdf"
                    onChange={(e) => modifyFile(e, file)}
                    className="hidden"
                    id={file.id}
                  />
                </>
              )}
              <span className="text-xs font-semibold">{(file.size / 1024).toFixed(2)} ko</span>
              <button
                onClick={() => removeFile(file)}
                className="relative overflow-hidden"
              >
                <CloseButtonCircle />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListFiles;
