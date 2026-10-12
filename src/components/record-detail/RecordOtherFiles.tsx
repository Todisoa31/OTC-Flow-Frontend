import { FolderFileType } from "@/types/folderType";
import React, { useEffect } from "react";
import OtherFileContainer from "../StatusDossier/OtherFileContainer";
type Props = {
  otherFiles: FolderFileType[];
};
const RecordOtherFiles = (props: Props) => {
  const { otherFiles } = props;
  return (
    <div className="p-[30px] pt-0">
      {Array.isArray(otherFiles) && otherFiles.length > 0 && (
        <div className="flex flex-col gap-2 mt-4 bg-[#FFFFFF66] p-[15px] rounded-[10px]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-black text-[18px]">
              Autres documents
            </h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <OtherFileContainer docs={otherFiles} />
          </div>
        </div>
      )}
    </div>
  );
};
export default RecordOtherFiles;
