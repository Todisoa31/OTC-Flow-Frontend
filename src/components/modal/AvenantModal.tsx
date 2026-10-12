import { UseAvenantStore } from "@/stores/AvenantStore";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddAvenantModal({ open, setOpen }: Props) {
  const { setNewAvenant } = UseAvenantStore();
  //setNewAvenant() une fonction quand l'upload est ok pour declancher la maj sur la liste des avenant !!

  const handleUpload = async () => {
    try {
      // api upload avenant
      // if code 200

      setNewAvenant();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite lors d'upload du fichier")
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex rounded-r-[30px] items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md overflow-hidden rounded-[30px] bg-white relative text-center">
        <button
          className="absolute top-5 right-5 text-gray-600 text-xl"
          onClick={() => setOpen(false)}
        >
          &times;
        </button>

        <div className="bg-[#65BFAA1A] px-8 pt-10 pb-6 flex flex-col items-center">
          <div className="flex items-center flex-col gap-2 justify-center   mb-4 text-[#65BFAA] font-bold">
            Upload form
          </div>
        </div>

        <div className="w-full p-7 flex flex-col justify-center items-center gap-7 bg-white">
          <div className="w-full flex justify-center items-start gap-5">
            <button
              onClick={() => setOpen(false)}
              className="h-10 px-5 bg-red rounded-[10px] shadow-[0_10px_40px_rgba(100,110,129,0.70)] text-white text-xs font-bold font-roboto leading-none"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}