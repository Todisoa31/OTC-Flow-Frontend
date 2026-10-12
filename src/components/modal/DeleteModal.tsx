import React from "react";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import TrashIcon from "@/assets/icons/TrashIcon";

type Props = {
  title?: string;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  confirmLabel?: string;
  confirmColor?: string;
  fullName?: string;
  roleLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  title,
  message,
  icon,
  confirmLabel,
  confirmColor,
  fullName,
  roleLabel,
  onClose,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-[1000] flex rounded-r-[30px] items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm overflow-hidden rounded-[30px] bg-white relative text-center">
        {/* Bouton fermer */}
        <button
          className="absolute top-5 right-5 text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* En-tête */}
        <div className="bg-[#E8F1F9] px-8 pt-10 pb-6 flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center mb-6">
            {icon || <TrashIcon />}
          </div>
          <h2 className="text-base font-bold text-[#2B6670] mb-1">
            {title || "Supprimer cet élément ?"}
          </h2>
          {(fullName || roleLabel) && (
            <p className="text-sm text-[#2B6670]">
              {fullName} {roleLabel}
            </p>
          )}
        </div>

        {/* Corps */}
        <div className="bg-white py-6 text-[#667085] text-sm mb-4">
          {message || (
            <>
              <p>Cette action est irréversible.</p>
              <p>L’élément sera supprimé définitivement.</p>
            </>
          )}

          {/* Bouton de confirmation */}
          <div className="flex justify-center mt-6">
            <button
              onClick={onConfirm}
              className={`flex items-center gap-2 px-5 h-10 text-sm font-bold text-white rounded-[10px] shadow-[0_10px_40px_rgba(236,72,153,0.7)] hover:bg-pink-600 transition ${
                confirmColor || "bg-[#EC4899]"
              }`}
            >
              <DeleteIcon color="white" />
              {confirmLabel || "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}