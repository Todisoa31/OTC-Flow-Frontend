import { FolderOutputType } from "@/types/folderType";

function NonRegulatoryDetailsContrepartie(props: FolderOutputType) {
    const { installateur} = props;
    return (
        <div className="flex-1 h-[320px] p-2.5 relative bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-5 overflow-scroll">
            <div className="self-stretch p-5 bg-[#fefefe]/40 rounded-[5px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-start text-[#101828] text-sm font-bold leading-[18px]">Contrepartie</div>
                <div className="justify-start text-[#101828] text-xs font-bold leading-[18px]">{installateur?.installer_info?.company_name || '-'}</div>
            </div>
            <div className="px-2.5 flex flex-col justify-start items-start gap-[15px]">
                <div className="flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Nom et prénom</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">
                        {installateur?.firstname} {installateur?.lastname}
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Adresse</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">
                        {installateur?.installer_info?.address || "-"}
                    </div>
                </div>
                <div className="hidden flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Code postal</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">-</div>
                </div>
                <div className="hidden flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Commune</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">-</div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Téléphone</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">
                        {installateur?.installer_info?.phone || "-"}
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5">
                    <div className="justify-start text-[#646d81] text-xs font-medium">Email</div>
                    <div className="justify-start text-[#101828] text-sm font-medium leading-[18px]">{installateur?.email}</div>
                </div>
            </div>

            <div className="hidden self-stretch flex flex-col justify-start items-start gap-[15px]">
                <div className="self-stretch inline-flex justify-start items-start gap-[15px]">
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Nom et prénom :</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{ '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Adresse :</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{ '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">N ° Facture:</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{ '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Volume CEE (classique)</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{' GWh cumac'}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NonRegulatoryDetailsContrepartie