import React from "react";
import SuspendedIcon from "@/assets/icons/SuspendedIcon";
import PauseIcon from "@/assets/icons/PauseIcon";

type Props = {
  status: string;
  fullName: string;
  roleLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SuspendUserModal({ status, fullName, roleLabel, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-[1000] flex rounded-r-[30px] items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm overflow-hidden rounded-[30px] bg-white relative text-center">
        <button className="absolute top-5 right-5 text-gray-600 text-xl" onClick={onClose}>
          &times;
        </button>

        <div className="bg-[#E8F1F9] px-8 pt-10 pb-6 flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-md mb-6">
            <PauseIcon />
          </div>
          <h2 className="text-base font-bold text-[#2B6670] mb-1">
            {status === "Actif" ? "Suspendre" : "Réactiver"} cet utilisateur ?
          </h2>
          <p className="text-sm text-[#2B6670]">{fullName}{roleLabel}</p>
        </div>

        <div className="bg-white py-6 text-[#667085] text-sm">
          <div className="leading-relaxed mb-4">
            {status === "Actif" ? (
              <>
                <p>Le compte sera temporairement désactivé.</p>
                <p>Vous pourrez le réactiver à tout moment.</p>
              </>
            ) : (
              <>
                <p>Le compte sera réactivé.</p>
                <p>L’utilisateur pourra à nouveau se connecter.</p>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className={`flex items-center gap-2 px-5 h-10 text-sm font-bold rounded-[10px] ${
                status === "Actif"
                  ? "bg-[#FCC567] text-[#344054] shadow-[0_10px_40px_rgba(252,197,103,0.7)] hover:bg-yellow-400"
                  : "bg-[#2B6670] text-white shadow-[0_10px_40px_rgba(43,102,112,0.4)] hover:bg-[#205158]"
              } transition`}
            >
              <SuspendedIcon />
              {status === "Actif" ? "Suspendre le compte" : "Réactiver le compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}