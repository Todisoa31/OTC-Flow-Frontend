import FileToCorrectIcon from "@/assets/icons/FileToCorrectIcon";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function FileToCorrectModal({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-[1000] flex rounded-r-[30px] items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm overflow-hidden rounded-[30px] bg-white relative text-center">
        
        <button className="absolute top-5 right-5 text-gray-600 text-xl" onClick={onClose}>
          &times;
        </button>
        
        <div className="bg-[#FCC5671A] px-8 pt-10 pb-6 flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full mb-4">
            <FileToCorrectIcon />
          </div>
          <h2
            className="text-[#FCC567] text-[16px] font-roboto font-bold leading-[18px]"
          >
            Dossier à modifier
          </h2>
        </div>

        <div className="bg-white px-6 py-6 flex flex-col items-center gap-6">
          <p className="text-sm text-slate-600 font-medium font-roboto text-center leading-none">
            Des corrections ont été demandées.
            <br />
            L’installateur sera notifié pour effectuer les modifications.
          </p>

          <div className="flex justify-center items-start gap-5">
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
