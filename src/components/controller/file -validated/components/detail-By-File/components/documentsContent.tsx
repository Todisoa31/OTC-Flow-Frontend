
'use client';

import DownloadIcon from "@/assets/icons/DownloadIcon";
import Button from "@/components/inputs/Button";
import OtherFileContainer from "@/components/StatusDossier/OtherFileContainer";
import DocumentInfo from "@/components/StatusDossier/resumeDossier/DocumentInfo";
import { FILES_VALIDATED_ROUTE } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";
import {  StatusesType } from "@/types/general";
import { handleDownloads } from "@/utils/fileUtils";
import { formatFrenchDate } from "@/utils/getHourMinute";
import { useParams } from "next/navigation";
import { useState } from "react";


type Props = {
    folder: FolderOutputType | null
};

export default function DocumentsContent({ folder }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const { folder_id } = useParams();
    const firstIdByType: Record<string, number> = {};
    
    folder && folder.files.forEach((file) => {
      if (!firstIdByType[file.type_file]) {
        firstIdByType[file.type_file] = file.id;
      }
    });
    return (
        <div className="p-[30px]">
            <div className=" flex items-center justify-between">
                <h2 className=" text-grey text-[24px] font-bold">Documents</h2>
                {folder && 
                <Button
                  label="Télécharger les documents"
                  className="bg-black px-[20px] py-[8px]  flex items-center gap-2 text-white rounded-[10px] shadow-xl"
                  iconLeft={<DownloadIcon fill="#fff" />}
                  onClick={() => handleDownloads(folder, setLoading)}
                  width="w-auto"
                  loading={loading}
                />}
            </div>

            <div className=" grid grid-cols-2 gap-3 mt-4">
                {folder?.files.map((file) => {
                  const effectiveId = firstIdByType[file.type_file] || file.id;
                  return(
                    <DocumentInfo
                        key={file.id}
                        id={effectiveId}
                        title={file.title_file}
                        status={file.status as StatusesType}
                        status_name={file.status_display}
                        date={formatFrenchDate(folder.created_at)}
                        document_name={file.name}
                        file={file}
                        folderId={Number(folder_id)}
                    />
                  )
                })}
            </div>
            {
              Array.isArray(folder?.other_file) && folder?.other_file.length > 0  && (
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
              )
            }
        </div>
    )
};
