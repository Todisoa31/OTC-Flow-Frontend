"use client";
import { useEffect, useState } from "react";
import SubmitFileTimeline from "./SubmitFileTimeline";
import SubmitFileBanner from "./SubmitFileBanner";

import SubmitFileStepTwo, { FileUploadingStatus } from "./stepComponent/SubmitFileStepTwo";

import SubmitFileStepFour from "./stepComponent/SubmitFileStepFour";
import { Steppers } from "@/types/recordType";
import {
  DEFAULT_TIMELINE_STEPS,
  TIMELINE_STEPS_MASS,
  DEFAULT_UPLOAD_STATUS,
  NUMBER_OF_FOLDER,
  DEFAULT_RECORD_IMPORT_FILE_PAYLOAD,
  DEFAULT_RECORD_PAYLOAD,
} from "@/constants/records";
import { useTitle } from "@/providers/TitleProvider";
import SubmitFileStepOne from "./stepComponent/SubmitFileStepOne";
import SubmitFileStepThree from "./stepComponent/SubmitFileStepThree";
import SubmitNumberDossier, { NumberFolderType } from "./stepComponent/SubmitNumberDossier";
import SubmitFileStepContratChoice from "./stepComponent/SubmitFileStepContratChoice";
import AddFolderIcon from "@/assets/icons/AddFolderIcon";
import DocumentIcon2 from "@/assets/icons/DocumentIcon2";
import MoveToFolderIcon from "@/assets/icons/MoveToFolderIcon";
import { PROGRESS_TRACKING, SUBMIT_FILE_ROUTE } from "@/constants/routes";
import Button from "../inputs/Button";
import InfoPopup from "../popup/InfoPopup";
import { useRecords } from "@/providers/CreateRecordProvider";
import { useRouter } from "next/navigation";


function SubmitFile() {
  const { setTitle } = useTitle();
  const [step, setStep] = useState<number>(1);
  const [steppers, setSteppers] = useState<Steppers[]>([]);
  const [stepTitle, setStepTitle] = useState<string>("");
  const [fileUploadingStatus, setUploadingFileStatus] =
    useState<FileUploadingStatus>(DEFAULT_UPLOAD_STATUS);
    const [numberDossier] = useState<NumberFolderType[]>(NUMBER_OF_FOLDER);
    const [typeDossier, setTypeDossier] = useState('one_folder');
    const { showModalMasseConfirmation, setShowModalMasseConfirmation, setPayloadMasse, setUploadPayload, setPayload } = useRecords();
    const router = useRouter();
    
  // const handleSetNumberDossier = (dossier: string) => {
  //   setNumberDossier(dossier);
  // };
  useEffect(() => {
    setSteppers(prev => {
        const initialSteppers = DEFAULT_TIMELINE_STEPS.map((stepper, index) => ({
          ...stepper,
          completed: index === 0 ? true : false // Only the first step is completed initially
        }));
        return initialSteppers;
      });
  },[])
  
  const manageStep = (step: number) => {
    const steps = [
      <SubmitFileStepContratChoice key={1} />, // Contract choice
      <SubmitNumberDossier key={2} setTypeDossier={setTypeDossier} typeDossier={typeDossier} numberDossier={numberDossier} setSteppers = {setSteppers}/>,
      <SubmitFileStepOne typeDossier={typeDossier} setSteppers = {setSteppers} key={3} />,//type dossier
      <SubmitFileStepTwo
        key={4}
        typeDossier={typeDossier}
        fileUploadingStatus={fileUploadingStatus}
        setUploadingFileStatus={setUploadingFileStatus}
      />, // upload Dossier
      <SubmitFileStepThree key={4} typeDossier={typeDossier}/>,
      <SubmitFileStepFour key={5}  typeDossier={typeDossier}/>,
    ];
    return steps[step - 1] || <SubmitFileStepOne typeDossier={typeDossier} setSteppers = {setSteppers}/>;
  };

  useEffect(() => {
    if (steppers?.[step - 1]) {
      setStepTitle(steppers[step - 1].name);
    }
  }, [step]);

  useEffect(() => {
    setTitle("Soumettre un dossier");
  }, []);

  const handleReset = () => {
    setShowModalMasseConfirmation(false);
    setPayloadMasse({form_type: "", items: {}})
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
  }

  return (
    <>
      {showModalMasseConfirmation && (
        <InfoPopup
          isOpen={showModalMasseConfirmation}
          onClose={() => {
            handleReset();
            router.push(PROGRESS_TRACKING);
          }}
          text={<span>Votre dossier a été envoyé, vous serez notifié par la suite</span>}
          title={"Confirmation d'upload de plusieurs dossiers"}
          icon={<DocumentIcon2 />}
          type= {"success"}
          footer = {
            <div className="flex gap-2">
              <Button
                label="Soumettre un dossier"
                iconLeft={<AddFolderIcon active={true} />}
                onClick={() => {
                  handleReset();
                  router.push(SUBMIT_FILE_ROUTE);
                }}
                width="w-auto"
              />
              <Button
                label="Suivre mes dossiers"
                iconLeft={<MoveToFolderIcon active={true} />}
                onClick={() => {
                  handleReset();
                  router.push(PROGRESS_TRACKING);
                }}
                bg="bg-black"
                width="w-auto p-[10px]"
              />
            </div>
          }
        />
      )}
      <div className="grow justify-start items-start inline-flex self-stretch">
        <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-[30px] inline-flex">
          <SubmitFileBanner title={stepTitle} />
          {manageStep(step)}
        </div>
        <SubmitFileTimeline
          step={step}
          typeDossier={typeDossier}
          setStep={setStep}
          steppers={steppers}
          setSteppers={setSteppers}
          fileUploadingStatus={fileUploadingStatus}
          setUploadingFileStatus={setUploadingFileStatus}
        />
      </div>
    </>
  );
}

export default SubmitFile;
