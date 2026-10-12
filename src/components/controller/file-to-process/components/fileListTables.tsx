"use client";

import { useRouter } from "next/navigation";
import { FILES_TO_PROCESS_ROUTE } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";
import RecordStatusesButton from "@/components/inputs/RecordStatusesButton";
import { Statuses } from "@/types/recordType";

type Props = {
  folders: FolderOutputType[];
};

export default function TableFileMonitoring({ folders }: Props) {
  const router = useRouter();
  const tableHead = [
    "Date",
    "Nom du dossier",
    "Type de dossier",
    "Référence",
    "Volume CEE",
    "Volume précarité",
    "Statut Administratif",
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
                  className="text-start px-4 py-2 font-medium text-[12px] text-grey"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {folders.map((dossier) => {
              const file_to = dossier.files.find((item) => item.type_file === "file_devis")?.id;

              return (
                <tr
                  key={dossier.id}
                  onClick={() =>
                    router.push(`${FILES_TO_PROCESS_ROUTE}/${dossier.id}/file-details/${file_to}`)
                  }
                  className="cursor-pointer shadow text-[12px] text-grey rounded-[15px] hover:shadow-md transition duration-200 hover:scale-[1]"
                >
                  <td className="px-4 py-3 rounded-l-[15px] bg-[#FFFFFF66] font-bold ">
                    {dossier.created_at &&
                      new Date(dossier.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                  </td>
                  <td className="px-4 py-3 bg-[#FFFFFF66] font-bold ">{dossier.name || "-"}</td>
                  <td className="px-4 py-3 bg-[#FFFFFF66] font-bold ">{dossier.type_dossier || "-"}</td>
                  <td className="px-4 py-3 bg-[#FFFFFF66] font-bold ">{dossier.job_id}</td>
                  <td className="px-4 py-3 bg-[#FFFFFF66] font-bold ">{dossier.volume} MWhc</td>
                  <td className="px-4 py-3 bg-[#FFFFFF66] font-bold ">{dossier.volume_precarite} Mwhc</td>
                  <td
                    className="px-4 py-3 bg-[#FFFFFF66] font-bold "
                  >
                    <RecordStatusesButton
                      status={(dossier.status?.code || "draft") as Statuses}
                    />
                  </td>
                  <td
                    className="pr-4 py-3 rounded-r-[15px] bg-[#FFFFFF66] font-bold "
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${FILES_TO_PROCESS_ROUTE}/${dossier.id}`);
                    }}
                  >
                    <span className="bg-[#646E81]/50 rounded-[5px] text-white font-bold text-xs py-2 px-5">Détail</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}