import { useEffect, useState } from "react";

import CloseButtonCircle from "@/assets/icons/CloseButtonCircle";
import Folder3Icon from "@/assets/icons/Folder3Icon";
import { useRecords } from "@/providers/CreateRecordProvider";
import ListFiles from "./ListFiles";
import AddFileToFolder from "./AddFileToFolder";
import { requiredFilePatterns } from "@/constants/records";
import { Uploadedfile } from "@/types/recordType";
import { FOLDER_TYPES } from "@/constants/records";


const FolderContentFile = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [fileRequired, setFileRequired] = useState<string[]>([]);

  const {
    uploadedFiles,
    setUploadedFiles,
    payloadMasse,
    setPayloadMasse,
    setErrorFileMass
  } = useRecords();

  const forbiddenTexts = [
    "erreur",
    "pas bon",
    "error",
    "wrong",
    "invalid",
    "incorrect",
    "faux",
    "fake",
    "sample",
    "draft",
    "temp",
    "annulé",
    "cancel",
    "deprecated",
    "corrupt",
    "bug"
  ];


  const getForbiddenFileNames = (files: Uploadedfile[]): string[] => {
    return files
      .filter((file) =>
        forbiddenTexts.some((text) => file.name.toLowerCase().includes(text))
      )
      .map((file) => file.name);
  };

  const hasForbiddenTextInRequiredFiles = (files: Uploadedfile[]): string[] => {
    const requiredLabels = getMissingRequiredLabels(files).length === 0 ? fileRequired : [];

    const matchedFiles: string[] = [];

    requiredLabels.forEach((label) => {
      const patterns = requiredFilePatterns[label] || [];
      files.forEach((file) => {
        const matchesLabel = patterns.some((regex) => regex.test(file.name));
        if (matchesLabel) {
          if (forbiddenTexts.some((text) => file.name.toLowerCase().includes(text))) {
            matchedFiles.push(file.name);
          }
        }
      });
    });

    return matchedFiles;
  };


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

  const verifyNbFilesHonorQtty = (files: Uploadedfile[]): number => {
    let count = 0;
    files.forEach((file) => {
      const patterns = requiredFilePatterns["Attestation sur l'honneur"] || [];
      const matchesLabel = patterns.some((regex) => regex.test(file.name));
      if (matchesLabel) {
        count += 1;
      }
    });
    return count;
  }

  const verifyNbFilesFacture = (files: Uploadedfile[]): number => {
    let count = 0;
    files.forEach((file) => {
      const patterns = requiredFilePatterns["Facture"] || [];
      const matchesLabel = patterns.some((regex) => regex.test(file.name));
      if (matchesLabel) {
        count += 1;
      }
    });
    return count;
  }

  const verifyNbFilesDevis = (files: Uploadedfile[]): number => {
    let count = 0;
    files.forEach((file) => {
      const patterns = requiredFilePatterns["Devis"] || [];
      const matchesLabel = patterns.some((regex) => regex.test(file.name));
      if (matchesLabel) {
        count += 1;
      }
    });
    return count;
  }

  const verifyNbFilesDesembouage = (files: Uploadedfile[]): number => {
    let count = 0;
    files.forEach((file) => {
      const patterns = requiredFilePatterns["Attestation de désembouage"] || [];
      const matchesLabel = patterns.some((regex) => regex.test(file.name));
      if (matchesLabel) {
        count += 1;
      }
    });
    return count;
  }

  const verifyNbFilesContribution = (files: Uploadedfile[]): number => {
    let count = 0;
    files.forEach((file) => {
      const patterns = requiredFilePatterns["Cadre de contribution"] || [];
      const matchesLabel = patterns.some((regex) => regex.test(file.name));
      if (matchesLabel) {
        count += 1;
      }
    });
    return count;
  }
  

  useEffect(() => {
    const hasError = Object.entries(payloadMasse.items).some(([folder, files]) => {
      return  hasDuplicateInFolder(folder, files, payloadMasse.items) ||
        getMissingRequiredLabels(files).length > 0;
    });   
    setErrorFileMass(hasError);
  }, [payloadMasse, fileRequired]);


  useEffect(() => {
    if (openSection && !payloadMasse.items[openSection]) {
      setOpenSection(null);
    }
  }, [payloadMasse.items, openSection]);

  useEffect(() => {
    const dossierRequired = FOLDER_TYPES.find((item) => item.code === payloadMasse.form_type);
    setFileRequired(dossierRequired?.requiredDocuments || []);
  }, [payloadMasse]);

  useEffect(() => {
    const hasError = Object.entries(payloadMasse.items).some(([folder, files]) => {
      return hasDuplicateInFolder(folder, files, payloadMasse.items) ||
            getMissingRequiredLabels(files).length > 0 ||
            hasForbiddenTextInRequiredFiles(files).length > 0 || 
            getForbiddenFileNames(files).length > 0 || 
            verifyNbFilesHonorQtty(files) > 1 || 
            verifyNbFilesFacture(files) > 1 || 
            verifyNbFilesDevis(files) > 1 || 
            verifyNbFilesDesembouage(files) > 1 || 
            verifyNbFilesContribution(files) > 1 ||
            files.some(file => file.size === 0);
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
          const errorInvalidRequiredFiles = hasForbiddenTextInRequiredFiles(files);
          const errorInvalidFiles = getForbiddenFileNames(files);
          const qttyHonor = verifyNbFilesHonorQtty(files);
          const qttyFacture = verifyNbFilesFacture(files);
          const qttyDevis = verifyNbFilesDevis(files);
          const qttyDesembouage = verifyNbFilesDesembouage(files);
          const qttyContribution = verifyNbFilesContribution(files);
          const fileEmpty = files.some(file => file.size === 0);

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
                    {(
                      invalid || 
                      duplicate || 
                      missingLabels.length > 0 || 
                      errorInvalidFiles.length > 0 || 
                      errorInvalidRequiredFiles.length > 0 ||
                      qttyHonor > 1 || 
                      qttyContribution > 1 || 
                      qttyDevis > 1 || 
                      qttyFacture > 1 || 
                      qttyDesembouage > 1 || 
                      qttyContribution > 1 || fileEmpty ) && (
                      <div className="px-2.5 py-[7px] bg-[#c70042]/10 rounded-[10px] justify-center items-center gap-2.5 flex">
                        <div className="text-[#c70042] text-xs font-medium">
                          {duplicate && " Ce dossier contient des fichiers dupliqués avec d'autres dossiers. "}
                          {missingLabels.length > 0 && `Fichiers manquants : ${missingLabels.join(", ")}`}
                          {errorInvalidFiles.length > 0 && "Enlevez les fichiers erronnés."}
                          {qttyHonor > 1 && " Un seul fichier d'attestation d'honneur est autorisé."}
                          {qttyFacture > 1 && " Une seule facture est autorisée."}
                          {qttyDevis > 1 && " Un seul devis est autorisé."}
                          {qttyDesembouage > 1 && " Un seul certificat de désembouage est autorisé."}
                          {qttyContribution > 1 && " Un seul justificatif de contribution est autorisé."}
                          {fileEmpty && " Un ou plusieurs fichiers sont vides."}
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

export default FolderContentFile;
