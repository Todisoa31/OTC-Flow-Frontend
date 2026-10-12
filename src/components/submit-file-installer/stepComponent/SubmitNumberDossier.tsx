import { Dispatch, SetStateAction, useEffect } from "react";
import {
    DEFAULT_TIMELINE_STEPS,
    installed_by,
    TIMELINE_STEPS_MASS
} from "@/constants/records";
import WarningIcon from "@/assets/icons/WarningIcon";
import { useRecords } from "@/providers/CreateRecordProvider";
import { Steppers } from "@/types/recordType";

import { getUserInfo } from "@/api/user";
import { getContratApi } from "@/api/contrat";
import SubmitAuthorInstallation from "../SubmitAuthorInstallation";

export type NumberFolderType = {
  code: string;
  label: string;
};

type Props = Readonly<{
  numberDossier: NumberFolderType[];
  typeDossier: string;
  setTypeDossier: Dispatch<SetStateAction<string>>;
  setSteppers: Dispatch<SetStateAction<Steppers[]>>;
}>;

function SubmitNumberDossier(props: Props) {
  const { numberDossier, setTypeDossier, typeDossier, setSteppers } = props;
  const { contratId, setPayload, setPayloadMasse, payloadMasse, extractedMass, contrats, setContrats} = useRecords();  
  const handleSelectTypeDossier = (code: string) => {
    setTypeDossier(code);
    if (code === "one_folder") {
      setSteppers((prev) => {
        const initialSteppers = DEFAULT_TIMELINE_STEPS.map(
          (stepper, index) => ({
            ...stepper,
            completed: index < 2 ? true : false, // Only the first step is completed initially
          })
        );
        return initialSteppers;
      });
    } else {
      setSteppers((prev) => {
        const initialSteppers = TIMELINE_STEPS_MASS.map((stepper, index) => ({
          ...stepper,
          completed: index < 2 ? true : false, // Only the first step is completed initially
        }));
        return initialSteppers;
      });
    }
  };

  const getContracts = async () => {
    try {
      const idUser = await getUserInfo()
      const response = await getContratApi(idUser?.id);
      setContrats(response.contrats || null);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    getContracts();
    
  }, []);


  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      contrat_id: contratId.code,
    }));

     setPayloadMasse((prev) => ({
      ...prev,
      contrat_id: contratId.code,
    }));
  },[contratId.code])

  return (
    <div className="self-stretch p-7 inline-flex flex-col justify-start items-start gap-5">
      {/* { contrats && 
        <ContractChoice
          contrats={contrats}
        />
      } */}
      {contratId && (
        <>
          <div className="justify-start text-slate-600 text-sm font-medium leading-none">
            Souhaitez-vous soumettre un seul dossier ou plusieurs à la fois ?
          </div>
          <div className="self-stretch inline-flex justify-start items-start gap-5">
            {numberDossier.map((item, index) => (
              <div
                onClick={() => handleSelectTypeDossier(item.code)}
                key={index}
                className={`${
                  item.code === typeDossier
                    ? "border-[3px] border-primary-blue"
                    : ""
                } grow cursor-pointer shrink basis-0 h-[80px] px-[15px] bg-white rounded-[10px] justify-center items-center gap-2.5 flex`}
              >
                <div
                  className={`text-center ${
                    item.code === typeDossier
                      ? "text-primary-blue"
                      : "text-dark-blue"
                  } text-base font-bold`}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          {typeDossier == "one_folder" && (
            <SubmitAuthorInstallation authorTypes={installed_by} />
          )}
          <div className="self-stretch px-3.5 py-5 bg-orange-50 rounded-[10px] outline outline-2 outline-offset-[-2px] outline-orange-300 inline-flex justify-start items-start gap-2.5">
            <div className="w-6 h-6 relative overflow-hidden">
              <WarningIcon />
            </div>
            <div className="inline-flex flex-col justify-start items-start gap-2.5">
              <div className="text-center justify-center text-orange-300 text-base font-bold leading-none">
                Important
              </div>
              <div className="text-center justify-center text-slate-600 text-sm font-bold leading-none">
                Ne soumettez pas un dossier déjà traité
              </div>
              <div className="text-center justify-center text-slate-600 text-sm font-medium leading-none">
                Avant d’uploader un dossier, assurez-vous qu’il n’a pas déjà été
                traité précédemment.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SubmitNumberDossier;
