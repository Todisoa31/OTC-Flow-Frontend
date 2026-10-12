import React, { useState, useRef, useEffect } from "react";
import AddBigFolder from "@/assets/icons/AddBigFolder";
import AddFolder2Icon from "@/assets/icons/AddFolder2Icon";
import { useRecords } from "@/providers/CreateRecordProvider";
import { Uploadedfile } from "@/types/recordType";
import FolderContentFileTRA from "./masse-files/FolderContentFileTRA";
import { file } from "jszip";

// Déclaration du type pour webkitdirectory

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 Mo en bytes
const MAX_FILES = 15;

type GroupedFiles = {
  [folder: string]: Uploadedfile[];
};

const MultipleDossierTRA = () => {
  const [error, setError] = useState<string>("");

  const fileInputRefTra = useRef<HTMLInputElement>(null);
  const {
    uploadedFiles,
    setUploadedFiles,
    setPayloadMasse
  } = useRecords();


  // Set webkitdirectory attribute after initial render
  useEffect(() => {
    if (fileInputRefTra.current) {
      fileInputRefTra.current.setAttribute("webkitdirectory", "");
      fileInputRefTra.current.setAttribute("multiple", "");
    }
  }, []);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const existingFilePaths = new Set(
      uploadedFiles.map((file) => (file.file as any).webkitRelativePath)
    );

    // On garde seulement les nouveaux fichiers
    const filteredNewFiles = Array.from(files).filter(
      (file) => !existingFilePaths.has((file as any).webkitRelativePath)
    );

    // Vérification taille max
    const invalidFiles = filteredNewFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (invalidFiles.length > 0) {
      alert(`Certains fichiers dépassent la taille maximale de 20 Mo`);
      return;
    }

    const newFiles: Uploadedfile[] = filteredNewFiles.map((file) => {
      const path = (file as any).webkitRelativePath;
      let name = file.name;

      if (path) {
        const segments = path.split("/");
        if (segments.length > 2) {
          // Si on est dans un sous-dossier
          const subFolder = segments[segments.length - 2];
          const parentFolder = segments[segments.length - 3];
          name = `${subFolder}_${file.name}`; // Préfixer
        }
      }

      return {
        id: Math.random().toString(36).substring(2, 10),
        name,
        size: file.size,
        type: file.type,
        file: file,
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Groupement : toujours par le dossier parent
    const groupedFiles: GroupedFiles = {};
    newFiles.forEach((file) => {
      const path = (file.file as any).webkitRelativePath;
      if (path) {
        const segments = path.split("/");
        let folder = "";
        if (segments.length >= 2) {
          folder = segments[segments.length - 2]; // par défaut
        }
        if (segments.length >= 3) {
          // si sous-dossier → on prend le parent
          folder = segments[segments.length - 3];
        }
        if (!groupedFiles[folder]) groupedFiles[folder] = [];
        groupedFiles[folder].push(file);
      }
    });

    // Limite dossiers
    const currentFolders = new Set(
      Object.keys(
        uploadedFiles.reduce((acc, file) => {
          const path = (file.file as any).webkitRelativePath;
          if (path) {
            const segments = path.split("/");
            let folder = "";
            if (segments.length >= 2) {
              folder = segments[segments.length - 2];
            }
            if (segments.length >= 3) {
              folder = segments[segments.length - 3];
            }
            acc[folder] = true;
          }
          return acc;
        }, {} as Record<string, boolean>)
      )
    );

    for (const folder in groupedFiles) {
      currentFolders.add(folder);
    }

    if (currentFolders.size > 50) {
      alert("Vous ne pouvez pas aller au-delà de 50 dossiers.");
      return;
    }

    // Mise à jour du payload
    setPayloadMasse((prev) => {
      const updatedItems = { ...prev.items };
      for (const folder in groupedFiles) {
        if (!updatedItems[folder]) updatedItems[folder] = [];
        updatedItems[folder] = [...updatedItems[folder], ...groupedFiles[folder]];
      }
      return {
        ...prev,
        items: updatedItems,
      };
    });

    event.target.value = "";
  };


  const handleButtonClick = () => {
    console.log(fileInputRefTra);
    if(fileInputRefTra.current){
      fileInputRefTra.current.value ="";
    }
    fileInputRefTra.current?.click();
  };

  return (
    <div className="self-stretch px-7 inline-flex flex-col justify-start items-start gap-7">
      <div className="self-stretch pt-7 pb-12 bg-white rounded-[20px] outline outline-[3px] outline-offset-[-3px] outline-slate-400 flex flex-col justify-center items-center gap-2.5">
        <div className="w-40 h-40 relative overflow-hidden">
          <AddBigFolder />
        </div>
        <div className="flex flex-col justify-start items-center gap-7">
          <div className="justify-start text-gray-900 text-2xl font-bold">
            Ajout des dossiers de type TRA
          </div>
          <input
            type="file"
            id="file-picker"
            name="fileList"
            ref={fileInputRefTra}
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={handleButtonClick}
            className="h-10 px-5 rounded-[10px] shadow-[0px_10px_40px_0px_rgba(97,161,191,0.70)] inline-flex justify-start items-center gap-2.5 bg-primary-blue"
          >
            <div className="w-5 h-5 relative overflow-hidden">
              <AddFolder2Icon />
            </div>
            <div className="justify-start text-white text-xs font-bold leading-none">
              Soumettre des dossiers
            </div>
          </button>
          <div className="inline-flex justify-center items-center gap-3.5">
            <div className="justify-start text-gray-500 text-sm font-medium leading-none">
              Nombre de dossier max : 50
            </div>
            <div className="w-px h-3.5 bg-gray-900/20" />
            <div className="justify-start text-gray-500 text-sm font-medium leading-none">
              Taille max : 20 Mo
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
        </div>
      </div>
      <FolderContentFileTRA />
    </div>
  );
};

export default MultipleDossierTRA;
