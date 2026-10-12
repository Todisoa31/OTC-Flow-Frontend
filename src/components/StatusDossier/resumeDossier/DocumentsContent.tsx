'use client';
import DownloadIcon from "@/assets/icons/DownloadIcon";
import Button from "@/components/inputs/Button";
import OtherFileContainer from "@/components/StatusDossier/OtherFileContainer";
import DocumentInfo from "@/components/StatusDossier/resumeDossier/DocumentInfo";
import { FolderOutputType } from "@/types/folderType";
import { StatusesType } from "@/types/general";
import { handleDownloads } from "@/utils/fileUtils";
import { formatFrenchDate } from "@/utils/getHourMinute";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  folder: FolderOutputType | null;
};

export default function DocumentsContent({ folder }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { folder_id } = useParams();
  const firstIdByType: Record<string, number> = {};
  const pathName = usePathname();
  const router = useRouter();

  folder &&
    folder.files.forEach((file) => {
      if (!firstIdByType[file.type_file]) {
        firstIdByType[file.type_file] = file.id;
      }
    });

  // 🔹 Regrouper les fichiers par type_file
  const groupedFiles = folder?.files.reduce((acc: any, file: any) => {
    if (!acc[file.type_file]) {
      acc[file.type_file] = [];
    }
    acc[file.type_file].push(file);
    return acc;
  }, {});

  // 🔹 Labels lisibles
  const typeLabels: Record<string, string> = {
    file_immatriculation: "Immatriculations",
    file_devis: "Devis",
    file_facture: "Factures",
    file_attestation: "Attestation sur l’honneur",
    // ajoute d’autres si besoin
  };
  

  return (
    <div className="p-[30px]">
      <div className="flex items-center justify-between">
        <h2 className="text-grey text-[24px] font-bold">Documents</h2>
        {folder && (
          <Button
            label="Télécharger les documents"
            className="bg-black px-[20px] py-[8px] flex items-center gap-2 text-white rounded-[10px] shadow-xl"
            iconLeft={<DownloadIcon fill="#fff" />}
            onClick={() => handleDownloads(folder, setLoading)}
            width="w-auto"
            loading={loading}
          />
        )}
      </div>

      {/* 🔹 Affichage par groupe ou document seul */}
      <div className="flex flex-col gap-6 mt-4">
        {groupedFiles &&
          Object.entries(groupedFiles as Record<string, any[]>).map(([type, files]) => {
            const effectiveId = firstIdByType[type];

            // Cas 1 : plusieurs fichiers → on fait un bloc avec un titre
            if (files.length > 1) {
              return (
                <div
                  key={type}
                  className="bg-[#F7FAFC]/50 rounded-[10px] p-4 shadow-sm"
                >
                  <h3 className="text-lg cursor-pointer font-bold text-gray-700 mb-3" onClick={() => {router.push(`${pathName}/file-details/${effectiveId || file.id}`)}}>
                    {typeLabels[type] || type}
                  </h3>

                  <div className="grid gap-3">
                    {files.map((file) => (
                      <DocumentInfo
                        key={file.id}
                        id={effectiveId || file.id}
                        title={file.title_file}
                        status={file.status as StatusesType}
                        status_name={file.status_display}
                        date={formatFrenchDate(folder?.created_at)}
                        document_name={file.name}
                        file={file}
                        folderId={Number(folder_id)}
                        multifile={true}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            // Cas 2 : un seul fichier → on affiche directement sans regroupement
            const file = files[0];
            return (
              <DocumentInfo
                key={file.id}
                id={effectiveId || file.id}
                title={file.title_file}
                status={file.status as StatusesType}
                status_name={file.status_display}
                date={formatFrenchDate(folder?.created_at)}
                document_name={file.name}
                file={file}
                folderId={Number(folder_id)}
              />
            );
          })}
      </div>

      {/* 🔹 Autres fichiers */}
      {Array.isArray(folder?.other_file) &&
        folder?.other_file.length > 0 && (
          <div className="flex flex-col gap-2 mt-4 bg-[#FFFFFF66] p-[15px] rounded-[10px]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-black text-[18px]">
                Autres documents
              </h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <OtherFileContainer docs={folder.other_file} />
            </div>
          </div>
        )}
    </div>
  );
}
