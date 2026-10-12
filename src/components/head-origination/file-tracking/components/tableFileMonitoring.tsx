"use client";

import { useRouter } from "next/navigation";
import { useFilter } from "@/providers/FilterProvider";
import { HEAD_ORIGINATION_FILE_TRACKIN_ROUTE } from "@/constants/routes";
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
    <div className="flex flex-col flex-1 min-h-[calc(100vh-64px)] page-container grow">
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-separate border-spacing-y-[10px]">
          <thead>
            <tr>
              {tableHead.map((head, index) => (
                <th
                  key={index}
                  className="text-start px-4 py-2 font-medium text-[12px] text-grey"
                >
                  <span className="font-bold">{head}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {folders?.map((dossier) => {

              const file_to = dossier.files.find((item) => item.type_file === "file_facture")?.id;

              return (
                <tr
                  key={dossier.id}
                  className="bg-[#FFFFFF66] rounded-[12px] shadow-md text-[12px] text-grey cursor-pointer"
                  onClick={() =>
                    router.push(`${HEAD_ORIGINATION_FILE_TRACKIN_ROUTE}/${dossier.id}/file-details/${file_to}`)
                  }
                >
                  <td className="px-4 py-3 w-[15%]">
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/usProfil.jpg"
                        alt="avatar"
                        width={40}
                        height={40}
                        className="!w-[40px] !h-[40px] rounded-lg"
                      />
                      <span className="font-bold">
                        {dossier.processed_by
                          ? `${dossier.processed_by.firstname} ${dossier.processed_by.lastname}`
                          : "Non renseigné"}
                      </span>
                    </div>
                  </td>
                  <td className="w-[12%] px-4 font-bold">
                    {dossier.created_at &&
                      new Date(dossier.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                  </td>
                  <td className="w-[15%] px-4 truncate overflow-hidden whitespace-nowrap  max-w-[270px] font-bold">{dossier.name || "-"}</td>
                  <td className="w-[15%] px-4 font-bold">{dossier.type_dossier || "-"}</td>
                  <td className="w-[10%] max-w-[200px] truncate px-4 font-bold" title={dossier.job_id}>
                    {dossier.job_id}
                  </td>
                  <td className="w-[10%] px-4 font-bold">{dossier.volume} MWhc</td>
                  <td className="w-[10%] px-4 font-bold">{dossier.volume_precarite} MWhc</td>
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
                  <td className="px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${HEAD_ORIGINATION_FILE_TRACKIN_ROUTE}/${dossier.id}`)
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
