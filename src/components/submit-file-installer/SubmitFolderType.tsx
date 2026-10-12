
import { useRecords } from "@/providers/CreateRecordProvider";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { convertDateToString } from "@/utils/date";
import { FolderTypes, Steppers } from "@/types/recordType";
import { DEFAULT_TIMELINE_STEPS, DEFAULT_TIMELINE_TRA_STEPS } from "@/constants/records";

type Props = Readonly<{
    folderTypes: FolderTypes[];
    setSelectedFolderType: Dispatch<SetStateAction<FolderTypes | null>>;
    typeDossier: string;
    setSteppers: Dispatch<SetStateAction<Steppers[]>>;
}>;

function SubmitFolderType(props: Props) {
    const { folderTypes, setSelectedFolderType, typeDossier, setSteppers } = props;
    const { payload, setPayload, setPayloadMasse, payloadMasse, folderTypeDynamics } = useRecords();
    
    const { form_type: formTypeSingle } = payload;
    const {form_type: formTypeMulti} = payloadMasse;
    const { user } = useAuth();
    const selectedFormType = typeDossier === 'one_folder' ? formTypeSingle : formTypeMulti;

    

    const handleSelectFolderType = (type: string) => {
        setSelectedFolderType(folderTypes.find((item) => item.code === type) || null);
        
        if(typeDossier === 'one_folder'){
          if(type === 'TRA_EQ_114' || type === 'TRA_EQ_117'){
            setSteppers((prev) => {
              const initialSteppers = DEFAULT_TIMELINE_TRA_STEPS.map(
                (stepper, index) => ({
                  ...stepper,
                  completed: index < 3 ? true : false, // Only the first step is completed initially
                })
              );
              return initialSteppers;
            });
          }else{
            setSteppers((prev) => {
              const initialSteppers = DEFAULT_TIMELINE_STEPS.map(
                (stepper, index) => ({
                  ...stepper,
                  completed: index < 3 ? true : false, // Only the first step is completed initially
                })
              );
              return initialSteppers;
            });
          }
          setPayload((prev) => ({
              ...prev,
              form_type: type,
              job_id: `${user?.id}_${type}_${convertDateToString(new Date())}`
          }))
        }else{
          setPayloadMasse(prev => ({
            ...prev,
            form_type: type            
          }))
        }
    }

    useEffect(() => {
        const selectedCode = typeDossier === 'one_folder' ? formTypeSingle : formTypeMulti;
        if (selectedCode) {
            setSelectedFolderType(folderTypes.find((item) => item.code === selectedCode) || null);
        }
    }, [formTypeSingle, formTypeMulti, typeDossier]);

    return (
        <div className="self-stretch flex-col justify-start items-start gap-[15px] flex">
            <div className="text-dark-blue text-sm font-medium  leading-[18px]">Type de dossier :</div>
            <div className="self-stretch gap-5 grid grid-cols-4 grid-rows-1">
                {folderTypeDynamics.map((item, index) => (
                    <div 
                    key={index} 
                    onClick={() => handleSelectFolderType(item.code)}
                    className={`${item.code === selectedFormType  ? 'border-[3px] border-primary-blue' : 'border-[3px] border-white'} grow cursor-pointer shrink basis-0 py-[20px] px-[15px] bg-white rounded-[10px] justify-center items-center gap-2.5 flex`}>
                        <div dangerouslySetInnerHTML={{ __html:  item.label }} className={`text-center ${item.code === selectedFormType ? 'text-primary-blue' : 'text-dark-blue'} text-base font-bold `}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubmitFolderType