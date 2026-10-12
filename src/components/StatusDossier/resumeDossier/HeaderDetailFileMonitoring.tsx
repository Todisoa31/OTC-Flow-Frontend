"use client";

import { createExportMachineApi } from "@/api/recordControllerApi";
import { updateRecordApi } from "@/api/recordInstallerApi";
import LoadDistributionIcon from "@/assets/icons/SideMenu/LoadDistributionIcon";
import Select from "@/components/inputs/Select";
import FileRefusedModal from "@/components/modal/FileRefusedModal";
import FileConfirmationToCorrectModal from "@/components/modal/FileToCorrectModal";
import FileValidatedModal from "@/components/modal/FileValidatedModal";
import { STATUSES_OPTIONS } from "@/constants/records";
import { UseDetailFolderSideStore } from "@/stores/DetailFolderSideStore";
import { Role } from "@/types/authType";
import { ChatSelectType, FolderOutputType } from "@/types/folderType";
import { Statuses } from "@/types/recordType";
import { getFile } from "@/utils/getFile";
import { formatFrenchDate } from "@/utils/getHourMinute";
import { Dispatch, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FolderInfoY from "./FolderinfoY";
import FolderInfoX from "./FolderInfoX";
import { UserTypeOutput } from "@/types/userType";
import { getUserInfo } from "@/api/user";
import { parseErrorMessage } from "@/utils/commonUtils";
import { getColorByStatus } from "@/utils/record";
import { updateFolderStatusApi } from "@/api/dossier";

type Props = {
    folder: FolderOutputType | null;
    setIsControlStatus: Dispatch<React.SetStateAction<boolean>>;
    isControlStatus: boolean
};

type folderValueType = {
  value: string;
  title: string;
}

type FolderRole = {
  key: string;
  type: Role;
  user: UserTypeOutput | null | undefined;
  chatLabel: ChatSelectType;
};



type LocalStateType = "Open" | "Close";

type GenericObject = {
  [key: string]: string | number | boolean | null | undefined;
}

export default function HeaderDetailFileMonitoring({ folder, isControlStatus, setIsControlStatus }: Props) {
    const { selectSwitcher, setSelectChat, selectChat } = UseDetailFolderSideStore();
    const [selectStatus, setSelectStatus] = useState<Statuses | null>("tobeprocessed");
    const [localState, setLocalState] = useState<LocalStateType>("Close");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [userConnected, setUserConnected] = useState<any>(null);
    const [exportError, setExportError] = useState<string | null>(null);
    const [statusObject, setStatusObject] = useState<GenericObject | null>(null);
    const [bgClass, setBgClass] = useState<string>('');
    
    
    const getCurrentUserConnected = async () => {
          try {
              const response = await getUserInfo();
              setUserConnected(response);
          } catch (error) {
              console.error("Error fetching user info:", error);
              return null;
          }
      };

    const folderInfoXData:folderValueType[] = [
      {
        title:'Type de dossier :',
        value:folder?.type_dossier ?? ""
      },
      {
        title:'Référence :',
        value:String(folder?.job_id ?? "")
      },
      {
        title:'Volume CEE :',
        value:`${folder?.volume} MWhc`
      },
      {
        title: 'Volume précarité :',
        value: `${folder?.volume_precarite ?? 0} MWhc`
      },
      {
        title:'Soumission :',
        value:formatFrenchDate(folder?.created_at ?? "")
      },
      {
        title:'Mise à jour :',
        value:formatFrenchDate(folder?.updated_at ?? "")  
      }
    ];

    // Définition de la constante typée
    const folderRoles: FolderRole[] = [
      {
        key: "Controlleur",
        type: "Contrôleur",
        user: folder?.processed_by,
        chatLabel: "Controlleur",
      },
      // {
      //   key: "Référent",
      //   type: "Référent",
      //   user: folder?.referent,
      //   chatLabel: "Référent",
      // },
      {
        key: "Installateur",
        type: "Installateur",
        user: folder?.installateur,
        chatLabel: "Installateur",
      },
      // {
      //   key: "Référent",
      //   type: "Référent",
      //   user: folder?.referent,
      //   chatLabel: "Référent",
      // },
      
    ];

    const handleUpdateStatusFolder = async () => {
      if (!folder?.id) {
        toast.error("Dossier invalide ou non sélectionné");
        return;
      }

      setExportError(null); // réinitialise les erreurs d’export

      // CAS 1 : statut = approved
      if (selectStatus === "approved") {
        const jobId = folder?.files?.[0]?.job_id;
        const typeFormulaire = folder?.type_dossier;

        if (!jobId || !typeFormulaire) {
          const message = "Impossible de faire l'export : données manquantes.";
          setExportError(message);
          toast.error(message);
          return;
        }

        try {
          await updateFolderStatusApi(folder.id, selectStatus);
        } catch (error: any) {
          console.error(error)
          const message = parseErrorMessage(error, "Erreur export machine");
          setExportError(message);
          return; // ⚠️ Ne pas continuer
        }
      }else{
        try {
          await updateRecordApi(folder.id, { statusCode: selectStatus });
          toast.success("Statut mis à jour avec succès");
          setLocalState("Close");
        } catch (error: any) {
          const message = parseErrorMessage(error, "Erreur lors de la mise à jour du statut");
          toast.error(message);
        }
      }
      
      
    };

    const handleUpdateStatus = (statusCode: Statuses) => {
      const config = getColorByStatus(statusCode);
      setBgClass(config.bgClass);
    }


    useEffect(() => {
        if (folder) {
            setSelectStatus(folder.status.code as Statuses);
            setStatusObject(folder.status);
        }
    }, [folder, statusObject])

    useEffect(() => {
      getCurrentUserConnected();
    },[]);

    
    useEffect(() => {
        handleUpdateStatus(selectStatus as Statuses);
    }, [selectStatus]);

    const handleConfirm = () => {
        handleUpdateStatusFolder();
        setLocalState("Close");
        setOpenModal(false);
    };

    const handleSoumettre = () => {
        switch (selectStatus) {
            case "tocorrect":
                setOpenModal(true);
                break;

            case "refused":
                setOpenModal(true);
                break;

            case "approved":
                setOpenModal(true);
                break;

            default:
                handleUpdateStatusFolder();
                setLocalState("Close");
                break;
        }
    };

    useEffect(() => {
      setIsControlStatus(
        STATUSES_OPTIONS.some(option => option.value === selectStatus) &&
        (selectStatus !== "approved" || statusObject?.title !== "Validé")
      );
    },[selectStatus]);


    useEffect(() => {
        console.log('elemetn === > ', selectStatus, statusObject)
    }, [selectStatus]);

    return (
        <div className="w-full flex flex-col">
            <div className=" p-[30px] bg-[#FFFFFF66]">
                <div className=" flex items-center justify-between">
                    <h2 className=" text-grey text-[24px] font-bold">{folder?.name}</h2>
                    {exportError && (
                      <div className="py-2 px-3 bg-red rounded-xl">
                        <p className="text-white text-xs font-bold">Erreur export machine : {exportError}</p>
                      </div>
                    )}                    
                    { isControlStatus ? 
                      <div className=" flex items-center gap-3">
                          <Select
                              options={STATUSES_OPTIONS}
                              onChange={(value) => {
                                  setSelectStatus(String(value) as Statuses);
                                  // handleUpdateStatusFolder(String(value) as Statuses);
                                  setLocalState("Open");
                              }}
                              value={selectStatus ?? ''}
                              multiple={false}
                              search={false}
                          // icon={<DocumentStatusIcon status='approved' />}
                          />

                          {/* apparait uniquement quand on fait unr maj dans les fichier */}
                          {localState === "Open" &&
                              <button
                                  onClick={handleSoumettre}
                                  className=" rounded-[10px] bg-[#65A5BF] px-[20px] py-2 flex items-center gap-3 w-fit text-white text-xs font-bold shadow-xl">
                                  <LoadDistributionIcon active />
                                  Soumettre
                              </button>
                          }
                      </div> : 
                      <div className=" flex items-center gap-3">
                        <div>
                          {statusObject && (
                            <div className={`text-xs rounded-[10px] px-5 py-2 font-bold ${bgClass} text-white`}>
                              {statusObject.title}
                            </div>
                          )}  
                        </div>
                      </div>
                    }
                </div>
                <div className=" grid grid-cols-6 gap-2 mt-4">
                        {
                          folderInfoXData.map((info, index) => (
                            <FolderInfoX key={index} title={info.title} value={info.value} />
                          ))
                        }
                </div>
                  <div className=" grid grid-cols-2 gap-4 mt-4">
                      {folderRoles
                        .filter((role) => role.user) // izay misy anle donnée ihany no alaina eto => processed_by sy installateur => 
                        .map(({ key, type, user, chatLabel }) => (
                          <FolderInfoY
                            key={key}
                            type={type}                          
                            userimage={user?.photo_profil ? getFile(user.photo_profil) : "/images/usProfil.jpg"}
                            username={
                              `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Non renseigné"
                            }
                            // onClick={() => {
                            //   selectSwitcher("conversation");
                            //   setSelectChat(chatLabel);
                            // }}
                          />
                        ))}
                  </div>
            </div>

            {openModal && selectStatus === "tocorrect" && <FileConfirmationToCorrectModal onClose={() => setOpenModal(false)} onConfirm={handleConfirm} />}
            {openModal && selectStatus === "refused" && <FileRefusedModal onClose={() => setOpenModal(false)} onConfirm={handleConfirm} />}
            {openModal && selectStatus === "approved" && <FileValidatedModal onClose={() => setOpenModal(false)} onConfirm={handleConfirm} />}
            {/* FileValidatedModal */}
        </div>
    )
};

