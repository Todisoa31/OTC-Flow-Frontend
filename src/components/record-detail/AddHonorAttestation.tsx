import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import AddFileIcon from "@/assets/icons/AddFileIcon";
import FileTextIcon from "@/assets/icons/FileTextIcon";
import CloseButtonCircle from "@/assets/icons/CloseButtonCircle";
import { RecordFileJobId } from "@/types/recordType";
import PencilIcon from "@/assets/icons/PencilIcon";
import SaveIcon from "@/assets/icons/SaveIcon";
import Button from "../inputs/Button";

type Props = Readonly<{
  label: string;
  onSend?: (file: File, key: keyof RecordFileJobId) => void;
  loading?: boolean;
}>;

const AddHonorAttestation = ({ label, onSend, loading }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);  

  const handleAddFileClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      e.target.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSendFile = () => {
    if (file && onSend) {
      onSend(file, "file_attestation");      
    }
  };

  
  return (
    <div className="self-stretch flex-col justify-start items-start gap-[15px] flex mb-[30px]">
      {label && (
        <div className="self-stretch justify-start text-black-secondary text-sm font-bold leading-[18px]">
          {label} :
        </div>
      )}

      {file ? (
        <>
          <div className="w-full bg-white rounded-[10px] px-[12px] py-[18px] flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileTextIcon />
                <span className="text-dark-blue text-xs font-bold leading-[18px]">
                  {file.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddFileClick}
                  title="Modifier"
                  className="text-xs text-blue-600 font-semibold underline"
                >
                  <PencilIcon />
                </button>
                <button
                  className="text-red-600 font-bold text-lg"
                  onClick={handleRemoveFile}
                  title="Supprimer"
                >
                  <CloseButtonCircle />
                </button>
              </div>
            </div>

            {/* Bouton Envoyer */}
            
          </div>

          <div className="flex justify-end">

             <Button
              label="Envoyer le fichier"
              iconLeft={<SaveIcon active={true} />}
              onClick={handleSendFile}
              width="w-auto"
              loading={loading}
            />
          </div>
        </>
      ) : (
        // Bouton Ajouter si aucun fichier
        <button
          type="button"
          onClick={handleAddFileClick}
          className="self-stretch h-[42px] px-[15px] bg-white rounded-[10px] border border-dashed border-[#101828]/20 justify-center items-center gap-2.5 inline-flex cursor-pointer"
        >
          <div data-svg-wrapper className="relative">
            <AddFileIcon />
          </div>
          <div className="text-dark-blue text-xs font-bold leading-[18px]">
            Ajouter un fichier (Docx, PDF, JPG, PNG)
          </div>
        </button>
      )}

      {/* Input caché */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
      />
    </div>
  );
};

export default AddHonorAttestation;
