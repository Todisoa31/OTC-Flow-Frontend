import React, { ChangeEvent, useEffect, useRef } from "react";
import AddFileIcon from "@/assets/icons/AddFileIcon";
import { useRecords } from "@/providers/CreateRecordProvider";
import FileTextIcon from "@/assets/icons/FileTextIcon";
import CloseButtonCircle from "@/assets/icons/CloseButtonCircle";

type Props = Readonly<{
  label: string;
}>;

export default function OtherFilesUploaderV2({ label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { otherFiles, setOtherFiles } = useRecords();

  const handleAddFileClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setOtherFiles((prevFiles) => [...prevFiles, ...newFiles]);
      e.target.value = ""; // reset input pour pouvoir ré-uploader le même fichier
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setOtherFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  useEffect(() => {
    console.log("otherFiles", otherFiles);
  }, [otherFiles]);

  return (
    <div className="self-stretch px-[30px] flex-col justify-start items-start gap-[15px] flex mb-[30px]">
      {label && (
        <div className="text-dark-blue text-sm font-medium leading-[18px]">
          {label} :
        </div>
      )}

      {/* Liste des fichiers ajoutés */}
      {otherFiles.map((file, index) => (
        <div
          key={index}
          className="w-full bg-white rounded-[10px] px-[12px] py-[18px] flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <FileTextIcon />
            <span className="grow shrink basis-0 text-dark-blue text-xs font-bold leading-[18px]">
              {file.name}
            </span>
          </div>
          <button
            className="text-red-600 font-bold text-lg"
            onClick={() => handleRemoveFile(index)}
            title="Supprimer"
          >
            <CloseButtonCircle />
          </button>
        </div>
      ))}

      {/* Bouton Ajouter */}
      <button
        type="button"
        onClick={handleAddFileClick}
        className="self-stretch h-[42px] px-[15px] bg-white rounded-[10px] border border-dashed border-[#101828]/20 justify-center items-center gap-2.5 inline-flex cursor-pointer"
      >
        <div data-svg-wrapper className="relative">
          <AddFileIcon />
        </div>
        <div className="text-dark-blue text-xs font-bold leading-[18px]">
          Ajouter un ou plusieurs fichiers (Docx, PDF, JPG, PNG)
        </div>
      </button>

      {/* Input caché avec multiple */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        multiple   // 👉 permet l'upload multiple
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
      />
    </div>
  );
}
