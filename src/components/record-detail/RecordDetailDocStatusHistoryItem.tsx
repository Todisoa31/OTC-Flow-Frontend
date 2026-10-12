'use client';
import CalendarFilledIcon from "@/assets/icons/CalendarFilledIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import { toast } from "react-toastify";

type Props = Readonly<{
    file_title: string;
    file_name: string;
    file_path?: string;
    date: string;
}>

function RecordDetailDocStatusHistoryItem(props: Props) {
    const { file_title, file_name, date, file_path } = props

    const handleDownloadDocument = async () => {
        try {
            if (!file_path) {
                toast.error("URL de téléchargement introuvable");
                return;
            }

            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + file_path);
            if (!response.ok) {
                throw new Error("Erreur lors du téléchargement du fichier");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${file_name || "document"}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Téléchargement réussi");
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            toast.error("Erreur lors du téléchargement du fichier");
        }
    }

    return (
        <div className="self-stretch w-[48%] p-[15px] bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
            <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-start text-gray-900 text-sm font-bold leading-[18px]">
                    {file_title}
                </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
                <div className="w-[361px] inline-flex justify-start items-center gap-2.5">
                    <div data-svg-wrapper className="relative">
                        <CalendarFilledIcon />
                    </div>
                    <div className="justify-center text-slate-600 text-xs font-bold leading-[18px]">
                        {date}
                    </div>
                </div>
                <div
                    onClick={handleDownloadDocument}
                    className="cursor-pointer self-stretch inline-flex justify-start items-center gap-2.5">
                    <div data-svg-wrapper className="relative">
                        <DownloadIcon />
                    </div>
                    <div className="justify-center text-slate-600 text-xs font-bold leading-[18px]">
                        {file_name}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecordDetailDocStatusHistoryItem