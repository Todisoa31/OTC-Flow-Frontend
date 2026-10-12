import { FolderOutputType } from "@/types/folderType";

function NonRegulatoryDetailsWork(props: FolderOutputType) {
    const {
        information_file_addresse_travaux
    } = props;
    return (
        <div className="h-[320px] flex-1 p-2.5 bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-5 overflow-scroll">
            <div className="self-stretch p-5 bg-[#fefefe]/40 rounded-[5px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-center items-start gap-2.5">
                <div className="justify-start text-[#101828] text-sm font-bold leading-[18px]">Travaux</div>
            </div>
            <div className="px-2.5 flex flex-col justify-start items-start gap-[15px]">
                <div className="flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Adresse</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">
                        {information_file_addresse_travaux || "-"}
                    </div>
                </div>
                <div className="hidden flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Code postal </div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">-</div>
                </div>
                <div className="hidden flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Commune</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">-</div>
                </div>
                <div className="hidden flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Parcelle cadastrale</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">-</div>
                </div>
            </div>
        </div>
    )
}

export default NonRegulatoryDetailsWork