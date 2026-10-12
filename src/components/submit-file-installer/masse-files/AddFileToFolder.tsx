import React from "react";
import { Uploadedfile } from "@/types/recordType";
import AddFileIcon from "@/assets/icons/AddFileIcon";

type Props = {
  folder: string;
  onAddFile: (folder: string, newFile: Uploadedfile) => void;
};

const AddFileToFolder = (props: Props) => {
  const { folder, onAddFile } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      const uploadedFile: Uploadedfile = {
        id: Math.random().toString(36).substring(2, 10),
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        file: newFile,
      };

      onAddFile(folder, uploadedFile);
    }
    e.target.value = "";
  };

  return (
    <div className="self-stretch grow pb-[20px] px-[30px] flex-col justify-center items-start flex">
      <label
        htmlFor="add-file"
        className="parent-div self-stretch h-[50px] px-[15px] bg-white rounded-[10px] border border-dashed border-[#101828]/20 justify-center items-center gap-2.5 inline-flex cursor-pointer"
      >
        <div data-svg-wrapper className="relative">
          <AddFileIcon />
        </div>
        <div className="text-dark-blue text-xs font-bold leading-[18px]">
          Ajouter un fichier (Docx, PDF, JPG, PNG)
        </div>
      </label>
      <input
        type="file"
        accept=".pdf, .jpeg, .png, .docx"
        onChange={handleChange}
        className="hidden"
        id="add-file"
      />
    </div>
  );
};

export default AddFileToFolder;
