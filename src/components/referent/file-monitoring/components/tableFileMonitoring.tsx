"use client";

import { useRouter } from "next/navigation";
import { useFilter } from "@/providers/FilterProvider";
import { REFERENT_FILE_MONITORING_ROUTE } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";
import EmptyRecord from "@/components/empty/EmptyRecord";

type Props = {
  folders: FolderOutputType[]
}

export default function TableFileMonitoring({ folders }: Props) {
  const {
    data,
    filters: { per_page },
    totalItems,
  } = useFilter();

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

  if(folders.length === 0) return <EmptyRecord />

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
            {folders.map((dossier) => {

              const firstFile = dossier.files.find((file) => file.type_file === "file_devis")?.id;

              return (
                <tr
                  key={dossier.id}
                  className="bg-[#FFFFFF66] rounded-[12px] shadow-md text-[12px] text-grey cursor-pointer"
                  onClick={() =>
                    router.push(`${REFERENT_FILE_MONITORING_ROUTE}/${dossier.id}/file-details/${firstFile}`)
                  }
                >
                  {/* Contrôleur en charge */}
                  <td className="px-4 py-3  flex items-center gap-2 ">
                    <img
                      src={dossier.processed_by?.photo_profil || "/images/usProfil.jpg"}
                      alt="avatar"
                      className="!w-[40px] !h-[40px] rounded-full object-cover"
                    />
                    <span className="font-bold">
                      {dossier.processed_by
                        ? `${dossier.processed_by.firstname} ${dossier.processed_by.lastname}`
                        : "Non renseigné"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 w-[12%] font-bold">
                    {dossier.created_at &&
                      new Date(dossier.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                  </td>

                  {/* Nom du dossier */}
                  <td className="px-4 py-3 w-[15%] font-bold">{dossier.name || "-"}</td>

                  {/* Type de dossier */}
                  <td className="px-4 py-3 w-[15%] font-bold">{dossier.type_dossier || "-"}</td>

                  {/* Référence */}
                  <td
                    className="pl-4 py-3 max-w-[120px] font-bold truncate overflow-hidden whitespace-nowrap"
                    title={dossier.job_id}
                  >
                    {dossier.job_id}
                  </td>

                  {/* Volume CEE */}
                  <td className="px-4 py-3 font-bold">{dossier.volume} MWhc</td>
                  <td className="px-4 py-3 font-bold">{dossier.volume_precarite} MWhc</td>

                  {/* Statut administratif */}
                  <td className="px-4 py-3 w-[20%]">
                    <span
                      className="rounded-[10px] p-2 text-white font-bold"
                      style={{
                        backgroundColor: dossier.status?.color_background || "#ccc",
                        color: dossier.status?.color_text || "#000",
                      }}
                    >
                      {dossier.status?.title || "Inconnu"}
                    </span>
                  </td>

                  {/* Icône « Go » */}
                  <td className="px-4 py-3 text-end"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`${REFERENT_FILE_MONITORING_ROUTE}/${dossier.id}`)
                    }}
                  >
                    <span className="bg-[#646E81]/50 rounded-[5px] text-white font-bold text-xs py-2 px-5">Détail</span>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
