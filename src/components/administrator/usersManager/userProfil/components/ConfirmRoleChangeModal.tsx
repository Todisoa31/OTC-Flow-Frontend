'use client';

import React from 'react';

interface ConfirmRoleChangeModalProps {
  isOpen: boolean;
  newRoleName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmRoleChangeModal({
  isOpen,
  newRoleName,
  onCancel,
  onConfirm,
}: ConfirmRoleChangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center rounded-r-[30px] justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm overflow-hidden rounded-[30px] text-center bg-white relative">
        {/* Close button */}
        <button className="absolute top-5 right-5 text-gray-600 text-xl" onClick={onCancel}>
          &times;
        </button>

        {/* Header section */}
        <div className="bg-[#E8F1F9] px-8 pt-10 pb-6 flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center mb-6">
            {/* SVG Confirmation Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-[#2B6670]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.371 0 0 5.372 0 12c0 6.628 5.371 12 12 12s12-5.372 12-12C24 5.372 18.629 0 12 0zm5.707 9.293-6.364 6.364a1 1 0 0 1-1.414 0l-3.182-3.182a1 1 0 1 1 1.414-1.414L11 13.536l5.657-5.657a1 1 0 0 1 1.414 1.414z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#2B6670] mb-1">
            Changer le type de profil ?
          </h2>
          <p className="text-sm text-[#2B6670]">
            Ce rôle sera remplacé par <strong>{newRoleName}</strong>
          </p>
        </div>

        {/* Body section */}
        <div className="bg-white py-6 px-6">
          <div className="text-[#667085] text-sm mb-4">
            <p>Ce changement peut affecter les droits actuels de l’utilisateur.</p>
            <p className="mt-1">Souhaitez-vous continuer ?</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className="flex items-center gap-2 px-5 h-10 text-sm font-bold text-white bg-[#22C55E] rounded-[10px] shadow-[0_10px_40px_rgba(34,197,94,0.5)] hover:bg-green-600 transition"
            >
              {/* SVG Confirm icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" />
              </svg>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}