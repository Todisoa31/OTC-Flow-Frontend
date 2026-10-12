"use client";

import { useRouter } from "next/navigation";
import { ADMIN_FILE_MONITORING_ROUTE } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";
import DeleteIconV2 from "@/assets/icons/DeleteIconV2";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { deleteFolderApi } from "@/api/folderApi";
import CheckCircleIcon from "@/assets/icons/CheckCircleIcon";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";

type Props = {
  folders?: FolderOutputType[]; // facultatif, valeur par défaut []
  setFolders: Dispatch<SetStateAction<FolderOutputType[]>>;
};

export default function TableFileMonitoring({ folders = [], setFolders }: Props) {
  const router = useRouter();

  const tableHead = [
    "Contrôleur en charge",
    "Date",
    "Nom du dossier",
    "Type de dossier",
    "Référence",
    "Volume CEE",
    "Volume précarité",
    "Statut administratif",
    "",
  ];

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-64px)] page-container">
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-separate border-spacing-y-[10px]">
          <thead>
            <tr>
              {tableHead.map((head, index) => (
                <th
                  key={index}
                  className="text-start px-4 py-2 font-bold text-[12px] text-grey"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {folders?.length > 0 ? (
              folders.map((dossier) => {
                const firstFile = dossier.files.find(
                  (file) => file.type_file === "file_devis"
                )?.id;

                return (
                  <tr
                    key={dossier.id}
                    className="bg-[#FFFFFF66] font-bold rounded-[12px] shadow-md text-[12px] text-grey cursor-pointer group"
                    onClick={() =>
                      router.push(
                        `${ADMIN_FILE_MONITORING_ROUTE}/${dossier.id}//file-details/${firstFile}`
                      )
                    }
                  >
                    <td className="px-4 py-3 w-[15%]">
                      <div className="flex items-center gap-2">
                        <img
                          src="/images/usProfil.jpg"
                          alt="avatar"
                          className="w-[40px] h-[40px] rounded-md"
                          width={40}
                          height={40}
                        />
                        <span>
                          {dossier.processed_by?.firstname +
                            " " +
                            dossier.processed_by?.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="w-[12%] px-4">
                      {dossier.created_at
                        ? new Date(dossier.created_at).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </td>
                    <td
                      className="w-[15%] text-grey text-[12px] truncate overflow-hidden whitespace-nowrap max-w-[270px] font-bold px-4"
                      title={dossier.name}
                    >
                      {dossier.name || "-"}
                    </td>
                    <td className="w-[15%] px-4">{dossier.type_dossier || "-"}</td>
                    <td
                      className="w-[10%] max-w-[120px] truncate px-4"
                      title={dossier.job_id}
                    >
                      {dossier.job_id}
                    </td>
                    <td className="w-[10%] px-4 font-bold">{dossier.volume} MWhc</td>
                    <td className="w-[10%] px-4 font-bold">{dossier.volume_precarite} Mwhc</td>
                  <td className="w-[15%] px-4">
                      <div
                        className="rounded-[10px] p-2 text-white w-fit font-bold"
                        style={{
                          backgroundColor: dossier.status?.color_background || "#ccc",
                          color: dossier.status?.color_text || "#000",
                        }}
                      >
                        {dossier.status?.title || "Inconnu"}
                      </div>
                    </td>
                    <td
                      className="px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`${ADMIN_FILE_MONITORING_ROUTE}/${dossier.id}`);
                      }}
                    >
                      <span className="bg-[#646E81]/50 rounded-[5px] text-white font-bold text-xs py-2 px-5">
                        Détail
                      </span>
                    </td>
                    <td className="px-4 w-[10%] opacity-0 group-hover:opacity-100 transition-all">
                      <DeleteButton dossier={dossier} setFolders={setFolders} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-grey">
                  Aucun dossier disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ====== DELETE BUTTON ======
type ButtonProps = {
  dossier: FolderOutputType;
  setFolders: Dispatch<SetStateAction<FolderOutputType[]>>;
};

const DeleteButton = ({ dossier, setFolders }: ButtonProps) => {
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!confirm) {
      setConfirm(true); // Première étape : demander confirmation
      return;
    }

    try {
      await deleteFolderApi(dossier.id);
      setFolders((prev) =>
        prev.filter((d: FolderOutputType) => d.id !== dossier.id)
      );
      toast.success(`Le dossier "${dossier.name}" a été supprimé avec succès.`);
    } catch (error) {
      console.error(error);
      toast.error(
        `Une erreur s'est produite lors de la suppression du dossier : ${dossier.name}`
      );
    } finally {
      setConfirm(false);
    }
  };

  return (
    <button onClick={handleDelete}>
      {confirm ? (
        <div className="flex items-center gap-2">
          <button title="Confirmer">
            <CheckCircleIcon size="25" />
          </button>
          <button
            title="Annuler"
            onClick={(e) => {
              e.stopPropagation();
              setConfirm(false);
            }}
          >
            <CloseIcon color="#C80043" />
          </button>
        </div>
      ) : (
        <DeleteIconV2 color="#C80043" />
      )}
    </button>
  );
};