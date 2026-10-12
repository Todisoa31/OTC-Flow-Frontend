"use client";

import { useRouter } from "next/navigation";
import { FILES_TO_CORRECT_ROUTE } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";

type Props = {
  folders: FolderOutputType[];
};

export default function TableFileMonitoring({ folders }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-64px)] page-container">
      <div className="overflow-x-auto flex-1">
        <table className="w-full table-fixed border-separate border-spacing-y-[10px]">
          <thead>
            <tr>
              <th className="text-start px-4 py-2 font-medium text-[12px] text-grey w-[10%]">Date</th>
              <th className="text-start px-4 py-2 font-medium text-[12px] text-grey w-[15%]">Nom du dossier</th>
              <th className="text-start px-4 py-2 font-medium text-[12px] text-grey w-[10%]">Type de dossier</th>
              <th className="text-start px-4 py-2 font-medium text-[12px] text-grey w-[15%]">Référence</th>
              <th className="text-start px-4 py-2 font-medium text-[12px] text-grey w-[10%]">Volume CEE</th>
              <th className="text-start px-4 py-2 font-medium text-[12px] text-grey w-[10%]">Volume Précarité</th>
              <th className="w-[5%] px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((dossier) => {
                const file_to = dossier.files.find(
                  (item) => item.type_file === "file_devis"
                )?.id;

                return (
                  <tr
                    key={dossier.id}
                    onClick={() =>
                      router.push(
                        `${FILES_TO_CORRECT_ROUTE}/${dossier.id}/file-details/${file_to}`
                      )
                    }
                    className="cursor-pointer shadow text-[12px] text-grey rounded-[15px] hover:shadow-md transition duration-200"
                  >
                    <td className="px-4 py-3 rounded-l-[15px] bg-[#FFFFFF66] font-bold">
                      {dossier.created_at &&
                        new Date(dossier.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </td>
                    <td
                      className="px-4 py-3 bg-[#FFFFFF66] font-bold max-w-[16%] truncate"
                      title={dossier.name}
                    >
                      {dossier.name || "-"}
                    </td>
                    <td className="px-4 py-3 bg-[#FFFFFF66] font-bold">
                      {dossier.type_dossier || "-"}
                    </td>
                    <td
                      className="px-4 py-3 bg-[#FFFFFF66] font-bold max-w-[16%] truncate"
                      title={dossier.job_id}
                    >
                      {dossier.job_id}
                    </td>
                    <td className="px-4 py-3 bg-[#FFFFFF66] font-bold">
                      {dossier.volume} MWhc
                    </td>
                    <td className="px-4 py-3 bg-[#FFFFFF66] font-bold">
                      {dossier.volume_precarite} MWhc
                    </td>
                    <td className="pr-4 py-3 bg-[#FFFFFF66] font-bold rounded-r-[15px] text-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`${FILES_TO_CORRECT_ROUTE}/${dossier.id}`);
                        }}
                        className="p-1"
                        title="Voir le détail du dossier"
                      >
                        <span className="bg-[#646E81]/50 rounded-[5px] text-white font-bold text-xs py-2 px-5">
                          Détail
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-grey">
                  Aucun dossier à corriger.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}