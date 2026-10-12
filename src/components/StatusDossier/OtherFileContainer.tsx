import DownloadIcon2 from '@/assets/icons/DownloadIcon2';
import { FolderFileType } from '@/types/folderType';
import { forceDownload } from '@/utils/fileUtils';
import { getFile } from '@/utils/getFile';
import React from 'react';

type Props = {
  docs: FolderFileType[];
};

const OtherFileContainer = (props: Props) => {
  const { docs } = props;
  return (
    <>
      {docs.map((doc, index) => {
          const handleDownloadFile = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!doc?.file) return;
            await forceDownload(getFile(doc.file), doc.name);
          };
          return (
            <div key={index} className="bg-white p-4 pb-10 rounded-lg shadow-md">
              <div
                className="flex items-center justify-between relative h-full truncate rounded-md"
                title={doc.name}
              >
                <img
                  src={doc.content_type !== "image/jpeg" && doc.content_type !== "image/png" ? "/images/file-512.webp": doc.file}
                  alt={doc.title_file}
                  className="w-full h-full object-cover rounded-md mb-2"
                />
                <button
                  onClick={handleDownloadFile}
                  className="text-blue-500 hover:underline absolute top-0 right-0 bg-[#65a5bf] p-1 rounded-md"
                >
                  <DownloadIcon2 fill="#fff" />
                </button>
              </div>
              <div className="text-sm font-semibold text-gray-800 w-full truncate overflow-hidden whitespace-nowrap">
                {doc.name}
              </div>
            </div>
          );
        })}
    </>
  );
}

export default OtherFileContainer;
