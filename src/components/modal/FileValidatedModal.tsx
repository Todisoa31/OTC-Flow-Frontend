import React from "react";
import FolderValidateIcon from "@/assets/icons/FolderValidateIcon";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function FileValidatedModal({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-[1000] flex rounded-r-[30px] items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md overflow-hidden rounded-[30px] bg-white relative text-center">
        {/* Bouton Fermer */}
        <button
          className="absolute top-5 right-5 text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="bg-[#65BFAA1A] px-8 pt-10 pb-6 flex flex-col items-center">
          <div className="flex items-center flex-col gap-2 justify-center   mb-4 text-[#65BFAA] font-bold">
            <div>
              <FolderValidateIcon />
            </div>
            Dossier validé
          </div>
        </div>

        <div className="w-full p-7 flex flex-col justify-center items-center gap-7 bg-white">
          <p className="text-center text-slate-600 text-sm font-medium font-roboto leading-none">
            Le dossier est validé.
            <br />
            L’installateur en sera informé.
          </p>
          <div className="w-full flex justify-center items-start gap-5">
            <button
              onClick={onClose}
              className="h-10 px-5 bg-gray-500 rounded-[10px] shadow-[0_10px_40px_rgba(100,110,129,0.70)] text-white text-xs font-bold font-roboto leading-none"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="h-10 px-5 bg-gray-900 rounded-[10px] shadow-[0_10px_40px_rgba(16,24,40,0.50)] text-white text-xs font-bold font-roboto leading-none"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}