import { useEffect, useState } from "react";

import CloseButtonCircle from "@/assets/icons/CloseButtonCircle";
import Folder3Icon from "@/assets/icons/Folder3Icon";
import { useRecords } from "@/providers/CreateRecordProvider";
import ListFiles from "./ListFiles";
import AddFileToFolder from "./AddFileToFolder";
import { requiredFilePatterns } from "@/constants/records";
import { Uploadedfile } from "@/types/recordType";
import { FOLDER_TYPES } from "@/constants/records";


const FolderContentFileTRA = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [fileRequired, setFileRequired] = useState<string[]>([]);

  const {
    uploadedFiles,
    setUploadedFiles,
    payloadMasse,
    setPayloadMasse,
    setErrorFileMass
  } = useRecords();

  useEffect(() => {
    if (openSection && !payloadMasse.items[openSection]) {
      setOpenSection(null);
    }
  }, [payloadMasse.items, openSection]);

  useEffect(() => {
    const dossierRequired = FOLDER_TYPES.find((item) => item.code === payloadMasse.form_type);
    setFileRequired(dossierRequired?.requiredDocuments || []);
  }, [payloadMasse]);

  const toggle = (folder: string) => {
    setOpenSection(openSection === folder ? null : folder);
  };

  const removeFolder = (folderToRemove: string) => {
    const remainingFiles = uploadedFiles.filter((file) => {
      const path = (file.file as any).webkitRelativePath;
      return !(path && path.includes(`/${folderToRemove}/`));
    });
    setUploadedFiles(remainingFiles);

    setPayloadMasse((prev) => {
      const updatedItems = { ...prev.items };
      delete updatedItems[folderToRemove];
      return {
        ...prev,
        items: updatedItems,
      };
    });

    if (openSection === folderToRemove) {
      setOpenSection(null);
    }
  };

  const isFolderInvalid = (_files: Uploadedfile[]) => false;

  const hasDuplicateInFolder = (
    folderName: string,
    files: Uploadedfile[],
    allFolders: Record<string, Uploadedfile[]>
  ) => {
    const currentNames = files.map((f) => f.name.trim().toLowerCase());

    return Object.entries(allFolders)
      .filter(([name]) => name !== folderName)
      .some(([_, otherFiles]) =>
        otherFiles
          .map((f) => f.name.trim().toLowerCase())
          .some(name => currentNames.includes(name))
      );
  };

  const removeFile = (fileToRemove: { id: string }) => {
    const fileIdToRemove = fileToRemove.id;

    setPayloadMasse((prev) => {
      const updatedItems: Record<string, Uploadedfile[]> = {};

      for (const folder in prev.items) {
        const filtered = prev.items[folder].filter(
          (uploadedFile) => uploadedFile.id !== fileIdToRemove
        );

        if (filtered.length > 0) {
          updatedItems[folder] = filtered;
        }
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };


  const addFileToFolder = (folder: string, newFile: Uploadedfile) => {
    setPayloadMasse((prev) => {
      const updated = { ...prev };
      if (!updated.items[folder]) {
        updated.items[folder] = [];
      }
      updated.items[folder].push(newFile);
      return updated;
    });
  };

  // Vérifie les labels requis manquants
  const getMissingRequiredLabels = (files: Uploadedfile[]): string[] => {
    return fileRequired.filter((label) => {
      const patterns = requiredFilePatterns[label] || [];

      const isMatched = files.some((file) =>
        patterns.some((regex) => regex.test(file.name))
      );

      return !isMatched;
    });
  };

  useEffect(() => {
    const hasError = Object.entries(payloadMasse.items).some(([folder, files]) => {
      return  hasDuplicateInFolder(folder, files, payloadMasse.items) ||
        getMissingRequiredLabels(files).length > 0;
    });   
    setErrorFileMass(hasError);
  }, [payloadMasse, fileRequired]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full">
      <div className="accordion w-full">
        {Object.entries(payloadMasse.items).map(([folder, files]) => {
          const invalid = isFolderInvalid(files);
          const duplicate = hasDuplicateInFolder(folder, files, payloadMasse.items);
          const missingLabels = getMissingRequiredLabels(files);

          return (
            <div key={folder} className="bg-white mb-4 rounded-xl w-full cursor-pointer">
              <div
                className="accordion-header text-slate-600 text-xs font-bold leading-none px-4 py-5"
                onClick={() => toggle(folder)}
              >
                <div className="self-stretch flex justify-between items-center gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Folder3Icon />
                    <div className="flex flex-col">
                      <span className="text-slate-600 text-xs font-bold leading-none">{folder}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {(invalid || duplicate || missingLabels.length > 0) && (
                      <div className="px-2.5 py-[7px] bg-[#c70042]/10 rounded-[10px] justify-center items-center gap-2.5 flex">
                        <div className="text-[#c70042] text-xs font-medium">
                          {duplicate && " Ce dossier contient des fichiers dupliqués avec d'autres dossiers. "}
                          {missingLabels.length > 0 && `Fichiers manquants : ${missingLabels.join(", ")}`}
                        </div>
                      </div>
                    )}
                    <button
                      className="relative overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFolder(folder);
                      }}
                    >
                      <CloseButtonCircle />
                    </button>
                  </div>
                </div>
              </div>
              {openSection === folder && (
                <>
                  <ListFiles folder={folder} files={files} removeFile={removeFile} />
                  <AddFileToFolder folder={folder} onAddFile={addFileToFolder} />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FolderContentFileTRA;
