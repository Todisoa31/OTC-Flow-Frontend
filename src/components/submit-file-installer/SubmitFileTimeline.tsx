"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "@/components/inputs/Button";
import CloseSquareIcon from "@/assets/icons/CloseSquareIcon";
import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import {
    ExtractedData,
    FileKeys,
    FileMasse,
    RecordPayload,
    Steppers,
} from "@/types/recordType";
import { FileMutlipleType, useRecords } from "@/providers/CreateRecordProvider";
import {
    DEFAULT_RECORD_IMPORT_FILE_PAYLOAD,
    DEFAULT_RECORD_PAYLOAD,
    DEFAULT_UPLOAD_STATUS,
    FILE_TYPES,
    FOLDER_TYPES,
    // TIMELINE_STEPS_MASS,
} from "@/constants/records";
import { extractDataItems } from "@/utils/common";
import { FileUploadingStatus } from "./stepComponent/SubmitFileStepTwo";
import {
    createRecordApi,
    createFileMassApi,
    uploadOtherFilesSingleDossierApi,
    uploadRecordFileTRA_EQ_114,
    uploadRecordFileMassTRA_EQ_114,    
    createRecordApiv4,
    createFileMassApiv4,
} from "@/api/recordInstallerApi";
import AddFolderIcon from "@/assets/icons/AddFolderIcon";
import DocumentIcon2 from "@/assets/icons/DocumentIcon2";
import InfoPopup from "../popup/InfoPopup";
import { useRouter } from "next/navigation";
import { PROGRESS_TRACKING, SUBMIT_FILE_ROUTE } from "@/constants/routes";
import MoveToFolderIcon from "@/assets/icons/MoveToFolderIcon";
import { extractGroupedVerificationAndExtraction, handleComputeScore, handleCreateRecordMasse, transformPayloadToPayloadMasse } from "./masse-files/utilsMass";
import { v4 as uuidv4 } from "uuid";
import { AxiosProgressEvent } from "axios";
import UploadProgressOverlay from "../modal/UploadProgress";

type Props = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  steppers: Steppers[];
  setSteppers: Dispatch<SetStateAction<Steppers[]>>;
  fileUploadingStatus: FileUploadingStatus;
  setUploadingFileStatus: Dispatch<SetStateAction<FileUploadingStatus>>;
  typeDossier: string;
};

function SubmitFileTimeline(props: Props) {
  const { fileUploadingStatus, setUploadingFileStatus, typeDossier } = props;
  const {
    payload,
    setPayload,
    setUploadPayload,
    setShowModalMasseConfirmation,
    payloadMasse,
    setPayloadMasse,
    errorFileMass,
    setExtractedMass,
    setStatusFolder,
    otherFiles,
    setOtherFiles,
    contratId,
    isAttInsideAttPose,
    beneficiary,
    payloadTra,
    isDevisInsideCertificat,
    isInvoiceInsideCertificat,
    loadingFiche,
    
  } = useRecords();
  const { step, setStep, steppers, setSteppers } = props;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const taskId = uuidv4();

  // Pour l'estimation et progress event
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [uploadStartTime, setUploadStartTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  useEffect(() => {
    if (uploadProgress === 100) {
      const timer = setTimeout(() => {
        setUploadProgress(0);
        setEstimatedTimeRemaining(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress]);

  const handleUploadProgress = (progressEvent: AxiosProgressEvent) => {
    setStartTime(Date.now());
    if (!uploadStartTime) {
      setUploadStartTime(Date.now());
    }

    if (progressEvent.total) {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percent);

      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      if (percent > 0 && percent < 100) {
        const estimatedTotal = elapsed / (percent / 100);
        const remaining = estimatedTotal - elapsed;
        setEstimatedTimeRemaining(Math.max(0, Math.floor(remaining)));
      }

      if (percent === 100) {
        // Reset après une courte attente
        setTimeout(() => {
          setUploadProgress(0);
          setEstimatedTimeRemaining(null);
          setUploadStartTime(null);
        }, 1000);
      }
    }
  };

  const validFileKeys = [
  "file_attestation",
  "file_devis",
  "file_facture",
  "file_attestation_pose",
  "file_photos",
  "file_certificat",
  "file_immatriculation",
  "file_cadre_contribution",
  "file_attestation_desembouage",
  "other_file",
  "images",
  "file_precarite"
] as const;

  const isFileKey = (key: string): key is FileKeys => {
    return validFileKeys.includes(key as FileKeys);
  };

  const REVERSE_FILE_TYPES: Record<string, FileKeys> = Object.entries(FILE_TYPES).reduce(
    (acc, [key, label]) => {
      if (isFileKey(key)) {
        acc[label] = key; // ✅ maintenant TypeScript est d'accord
      }
      return acc;
    },
    {} as Record<string, FileKeys>
  );

  const hasAllRequiredDocuments = (
    typeDossier: string,
    items: ExtractedData
  ): boolean => {
    const folderConfig = FOLDER_TYPES.find((f) => f.code === typeDossier);
    if (!folderConfig) return false;

    return folderConfig.requiredDocuments.every((label) => {
      const key = REVERSE_FILE_TYPES[label];
      if (!key) return false;

      // ⚠️ Cas particulier : l’attestation de pose est incluse
      if (
        key === "file_attestation_pose" &&
        isAttInsideAttPose &&
        Array.isArray(items["file_attestation"]) &&
        items["file_attestation"].length > 0
      ) {
        return true; // On considère que c’est fourni
      }

      const files = items[key];
      return Array.isArray(files) && files.length > 0;
    });
  };

  const isDisableNext = () => {
    if (step === 1 && !loadingFiche ) {
      return true;
    }
    if (step === 2 && !typeDossier) {
      return true;
    }

    if (step === 2 && typeDossier === "one_folder") {
      return !payload.installed_by;
    }

    if (step === 2 && typeDossier === "multi_folder") {
      return false;
    }
    if (step === 3 && typeDossier === "one_folder" && !payload.form_type) {
      return true;
    }
    if (step === 3 && typeDossier === "multi_folder" && !payloadMasse.form_type) {
      return true;
    }

    if  (step === 4 && typeDossier === "one_folder" && ["TRA_EQ_117", "TRA_EQ_114"].includes(payload.form_type)) {  
      if(!payloadTra) return false;

      const hasAttestation = payloadTra.file_attestation && payloadTra.file_attestation.length > 0;
      const hasImmatriculation = payloadTra.file_immatriculation && payloadTra.file_immatriculation.length > 0;

      const isDevisOk = isDevisInsideCertificat ? true : (payloadTra.file_devis && payloadTra.file_devis.length > 0);
      const isFactureOk = isInvoiceInsideCertificat ? true : (payloadTra.file_facture && payloadTra.file_facture.length > 0);

      
      if (hasAttestation && hasImmatriculation && isDevisOk && isFactureOk) {
        return false;
      }

      return true;
    }
    if  (step === 4 && typeDossier === "one_folder" && (payload.form_type === 'TRA_EQ_117')) {  
      if(!payloadTra) return false;

      const hasAttestation = payloadTra.file_attestation && payloadTra.file_attestation.length > 0;
      const hasImmatriculation = payloadTra.file_immatriculation && payloadTra.file_immatriculation.length > 0;

      const isDevisOk = isDevisInsideCertificat ? true : (payloadTra.file_devis && payloadTra.file_devis.length > 0);
      const isFactureOk = isInvoiceInsideCertificat ? true : (payloadTra.file_facture && payloadTra.file_facture.length > 0);
      
      const hasPrecarite = payloadTra.file_precarite && payloadTra.file_precarite.length > 0;

      
      if (hasAttestation && hasImmatriculation && hasPrecarite && isDevisOk && isFactureOk) {
        return false;
      }

      return true;
    }
    if (
      step === 4 &&
      typeDossier === "one_folder" &&
      (
        Object.values(fileUploadingStatus).some(
          (status) => status === "extracting" || status === "uploading"
        ) ||
        (
          extractDataItems(payload.items as ExtractedData).length === 0 &&
          !(Object.keys(payloadMasse.items).length > 0)
        ) ||
        !hasAllRequiredDocuments(payload.form_type, payload.items as ExtractedData) ||
        errorFileMass === true
        
      )
    ) {
      return true;
    }

    if (
      step === 4 &&
      typeDossier === "multi_folder" &&
      (
        Object.values(fileUploadingStatus).some(
          (status) => status === "extracting" || status === "uploading"
        ) ||
        (
          extractDataItems(payload.items as ExtractedData).length === 0 &&
          !(Object.keys(payloadMasse.items).length > 0)
        ) ||
        errorFileMass === true
      )
    ) {
      return true;
    }

    if(step === 5 && typeDossier === "one_folder" && beneficiary === false){
      return true;
    }

    
    

    if (step === 5) {
      return false;
    }
    // if (step === 6 && !payload.company_name) {
    //   return true;
    // }

    return false;
  };

   const handelClickNext = async () => {
      try {
        if  (step === 4 && typeDossier === "multi_folder" && ["TRA_EQ_117", "TRA_EQ_114"].includes(payloadMasse.form_type)) { 
          try{
            const currentPayloadMasse = { ...payloadMasse };         
            setShowModalMasseConfirmation(true);
            // await uploadRecordFileMassTRA_EQ_114(payloadTosend, handleUploadProgress);
            const response = await handleFolderMassExtraction(currentPayloadMasse);
            if (!response) return;
          }catch(error){
            console.error("Error in step 4 TRA_EQ_114:", error);
          }finally{
            setPayloadMasse({ form_type: "", items: {} });
          }
          return;
        }

        if (step === 4 && typeDossier === "multi_folder") {
          try {
            const currentPayloadMasse = { ...payloadMasse };
            setShowModalMasseConfirmation(true);
            const response = await handleFolderMassExtraction(currentPayloadMasse);
            if(["RES_EC_104", "BAT_TH_146", "BAR_TH_160"].includes(payloadMasse.form_type)){
              const cleanApiResponse = extractGroupedVerificationAndExtraction(response);
              setExtractedMass(cleanApiResponse);
                const responseExtracted = await handleCreateRecordMasse(
                  cleanApiResponse,
                  payloadMasse.form_type,
                  setStatusFolder,
                  contratId.code,
                  taskId
                );
                if (!responseExtracted) return;
            }
          } finally {
            setPayloadMasse({ form_type: "", items: {} });
          }
          return;
        }

        if (step === 6) {
          try {
            const response = await handleCreateRecord(payload);

            await uploadOtherFilesSingleDossierApi(
              {
                job_id: payload.job_id,
                other_files: otherFiles,
              },
              handleUploadProgress
            );

            await handleComputeScore(payload.job_id, payload.form_type);

            if (!response) return;
          } catch (error) {
            console.error("Error in step 6:", error);
          } finally {
            setOtherFiles([]);

          }
        }

         if  (step === 4 && typeDossier === "one_folder" && ["TRA_EQ_117", "TRA_EQ_114"].includes(payload.form_type)) { 
          if (!payloadTra) return; //tsy possibile ho tafiidtra ato mitsy aloha anh
          try{
            setModalIsOpen(true);
            const responsse = await uploadRecordFileTRA_EQ_114(payloadTra);
            if (!responsse) return;
          }catch(error){
            console.error("Error in step 4 TRA_EQ_114:", error);
          }
          
          return;
        }

        if (step + 1 <= 7) {
          setStep(step + 1);
          setSteppers((prev) => {
            if (prev?.[step]) prev[step].completed = true;
            return prev;
          });
        }
      } catch (error) {
        console.error("Error clicking next:", error);
      }
    };

  const handleResetAll = () => {
    setModalIsOpen(false);
    setShowModalMasseConfirmation(false);
    setPayloadMasse({ form_type: "", items: {} });
    setPayload(DEFAULT_RECORD_PAYLOAD);
    setUploadPayload(DEFAULT_RECORD_IMPORT_FILE_PAYLOAD);
    setUploadingFileStatus(DEFAULT_UPLOAD_STATUS);
    setSteppers(prev => {
      const initialSteppers = prev.map((stepper, index) => ({
        ...stepper,
        completed: index === 0 ? true : false // Only the first step is completed initially
      }));

      return initialSteppers
    });
    setStep(1);
  };

  const handleCreateRecord = async (payload: RecordPayload) => {
    try {
      setLoading(true);
      const items = extractDataItems(payload.items as ExtractedData);
      if (items.length > 0) {
        switch (payload.form_type) {
          case 'BAR_SE_109':
          case 'BAR_SE_108':
            await createRecordApiv4(payload);//'/installateur/v4/create_folder
            break;          
          default:
            await createRecordApi(payload); //'/installateur/v1/create_dossier
            break;
        }
        setModalIsOpen(true);
      }
      return true;
    } catch (error) {
      console.error("Error creating record:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFolderMassExtraction: (payload: FileMutlipleType) => Promise<any> = async (payload) => {
    const payloadTosend = transformPayloadToPayloadMasse(payload);
    // console.log("Payload to send:", payloadTosend);
    try {
      // setModalIsOpen(true);
      let response;
      switch (payload.form_type) {
        case 'BAR_SE_109':
        case 'BAR_SE_108':
          response = await createFileMassApiv4(payloadTosend, handleUploadProgress);
          break;
        case 'TRA_EQ_114':
        case 'TRA_EQ_117':
          response = await uploadRecordFileMassTRA_EQ_114(payloadTosend, handleUploadProgress);
          break;

        default:
          response = await createFileMassApi(payloadTosend, handleUploadProgress);
          break;
      }

      return response;
    } catch (error) {
      console.error("Error handling folder mass extraction:", error);
    }
  };


  return (
    <>
      <div className="w-[350px] self-stretch p-[30px] bg-secondary-white/40 border-l border-white backdrop-blur-[30px] flex-col justify-start items-start gap-[30px] inline-flex">
        <div className="text-black text-2xl font-bold">Timeline</div>
        <div className="relative self-stretch grow shrink basis-0 flex-col justify-start items-start gap-[60px] flex">
          {steppers.map((stepper, index) => (
            <div
              key={index}
              className="relative self-stretch justify-start items-start gap-[15px] inline-flex"
            >
              {index !== steppers.length - 1 && (
                <div
                  className={`absolute left-4 top-[20%] h-[135px] w-[0px] border-[1px] ${
                    stepper.completed && steppers[index + 1].completed
                      ? "border-solid border-primary-blue"
                      : "border-dashed border-[rgba(16, 24, 40, 0.20)]"
                  }`}
                ></div>
              )}
              <div data-svg-wrapper className="z-10">
                {typeof stepper.icon === "function" ? (
                  <stepper.icon active={stepper.completed} />
                ) : (
                  stepper.icon
                )}
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                <div
                  className={`text-${
                    stepper.completed ? "primary-blue" : "black"
                  } text-sm font-bold  leading-[18px]`}
                >
                  {stepper.name}
                </div>
                <div className="self-stretch text-grey text-xs font-medium ">
                  {stepper.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="self-stretch justify-start items-start gap-5 inline-flex">
          <Button
            label=""
            iconRight={<ArrowRightIcon />}
            className={`${step === 1 ? "bg-grey": "bg-primary-blue"} !px-3 rotate-180`}
            onClick={() => {
              setSteppers((prev) => {
                const newSteps = [...prev];
                if (step > 1 && newSteps[step - 1]) {
                  newSteps[step - 1].completed = false;
                }
                return newSteps;
              });
              setStep(step - 1);
            }}
            disabled={step === 1 ? true : false}
          />
          <Button
            label="Annuler"
            iconRight={<CloseSquareIcon />}
            className={step === 1 ? "bg-grey !px-3" :"bg-primary-blue !px-3"  }
            onClick={handleResetAll}
            disabled={step === 1 ? true : false}
          />
          
          <Button
            label="Suivant"
            iconRight={<ArrowRightIcon />}
            className={isDisableNext() ? "bg-grey !px-3" :"bg-primary-blue !px-3" }
            loading={loading}
            onClick={handelClickNext}
            disabled={isDisableNext()}
          />
        </div>
      </div>

      <InfoPopup
        isOpen={modalIsOpen}
        onClose={() => {
          handleResetAll();
          router.push(PROGRESS_TRACKING);
        }}
        text={
          <span>
            Votre dossier a été envoyé pour validation.
            <br />
            Vous serez notifié dès qu&apos;il aura été traité.
          </span>
        }
        title={"Dossier soumis avec succès !"}
        icon={<DocumentIcon2 />}
        type="success"
        footer={
          <div className="flex gap-2">
            <Button
              label="Soumettre un dossier"
              iconLeft={<AddFolderIcon active={true} />}
              onClick={() => {
                handleResetAll();
                router.push(SUBMIT_FILE_ROUTE);
              }}
              width="w-auto"
            />
            <Button
              label="Suivre mes dossiers"
              iconLeft={<MoveToFolderIcon active={true} />}
              onClick={() => {
                handleResetAll();
                router.push(PROGRESS_TRACKING);
              }}
              bg="bg-black"
              width="w-auto p-[10px]"
            />
          </div>
        }
      />

      {/* UploadProgressOverlay affiché dynamiquement */}
      {uploadProgress > 0 && (
        <UploadProgressOverlay
          progress={uploadProgress}
          estimatedTimeRemaining={estimatedTimeRemaining}
        />
      )}
    </>
  );
}

export default SubmitFileTimeline;