import AddFileIcon from "@/assets/icons/AddFileIcon";
import CheckCircleIcon from "@/assets/icons/CheckCircleIcon";
import CloseButtonCircle from "@/assets/icons/CloseButtonCircle";
import DangerCircleIcon from "@/assets/icons/DangerCircleIcon";
import FileTextIcon from "@/assets/icons/FileTextIcon";
import { useRecords } from "@/providers/CreateRecordProvider";
import { TraFicheType } from "@/types/recordType";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useId, useState } from "react";

type Props = {
  label: string;
  fileType: keyof TraFicheType;
};

type FileItem = {
  file: File;
};

const AddMultiFile = ({ label, fileType }: Props) => {
  const {payloadTra, setPayloadTra} = useRecords();
  const [files, setFiles] = useState<FileItem[]>([]);
  const uniqueId = useId();



  // Ajouter fichiers et lancer traitement
 const addFiles = (fileList: FileList | null, resetInput?: HTMLInputElement | null) => {
    if (!fileList) return;

    const newFiles: FileItem[] = [...fileList]
      .filter(file => !files.some(f => f.file.name === file.name && f.file.size === file.size))
      .map(file => ({ file }));

    if (newFiles.length === 0) return;

    // Met à jour la liste locale
    setFiles(prev => [...prev, ...newFiles]);

    // Met à jour payloadTra
    setPayloadTra(prev => {
      const current: TraFicheType = prev || {};

      return {
        ...current,
        [fileType]: [
          ...(current[fileType] as File[] ?? []),
          ...newFiles.map(f => f.file)
        ]
      };
    });

    // 🔹 Vide la valeur de l'input pour permettre re-upload du même fichier
    if (resetInput) {
      resetInput.value = "";
    }
  };


  // Supprimer un fichier
  const removeFile = (index: number, fileType: keyof TraFicheType) => {
    // Supprime dans le state local
    setFiles(prev => prev.filter((_, i) => i !== index));

    // Supprime dans le payloadTra
    setPayloadTra(prev => {
      if (!prev) return prev;

     const currentFiles = (prev[fileType] as File[] | null) || [];
     const updatedFiles = currentFiles.filter((_, i) => i !== index);

      return {
        ...prev,
        [fileType]: updatedFiles.length > 0 ? updatedFiles : null
      };
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 px-[30px]">
      {/* Input dossier */}
      <input
        type="file"
        id={`folderInput-${uniqueId}`}
        multiple
        style={{ display: "none" }}
        onChange={(e) =>  addFiles(e.target.files, e.target)}
      />

      {label && (
        <div className="text-dark-blue text-sm font-medium leading-[18px]">
          {label} :
        </div>
      )}

      {files.length === 0 && (
        <button
          onClick={() => document.getElementById(`folderInput-${uniqueId}`)?.click()}
          className="flex justify-center parent-div h-[50px] px-[15px] bg-white rounded-[10px] border border-dashed border-[#101828]/20 flex items-center gap-2.5 cursor-pointer"
        >
          <AddFileIcon />
          <div className="text-dark-blue text-xs font-bold">
            Ajouter plusieurs fichiers (Docx, PDF)
          </div>
        </button>
      )}

      {/* Input fichier */}
      <input
        type="file"
        id={`fileInput-${uniqueId}`}
        multiple
        style={{ display: "none" }}
        onChange={(e) => addFiles(e.target.files, e.target)}
      />

      {files.length > 0 && (
        <div className="w-full bg-white rounded-[10px] px-[30px] py-[35px]">
          <div className="w-full flex flex-col gap-2">
            {files.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3.5 mb-2 rounded-md"
              >
                <FileTextIcon />
                <div className="flex-1 text-slate-600 text-xs font-bold">
                  {item.file.name}
                </div>                
                <button onClick={() => removeFile(index, fileType as keyof TraFicheType)}>
                  <CloseButtonCircle />
                </button>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center mt-2 p-[20px]">
            <button
              onClick={() => document.getElementById(`fileInput-${uniqueId}`)?.click()}
              className="justify-center w-full h-[50px] px-[15px] bg-white rounded-[10px] border border-dashed border-[#101828]/20 flex items-center gap-2.5 cursor-pointer"
            >
              <AddFileIcon />
              <div className="text-dark-blue text-xs font-bold flex justify-center">
                Ajouter un fichier (Docx, PDF)
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMultiFile;
