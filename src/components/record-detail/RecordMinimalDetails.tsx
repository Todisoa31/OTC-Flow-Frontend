import { CONTROL_NON_REGULATORY_DETAIL_ROUTE, routeWithParams } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";
import Link from "next/link";

function RecordMinimalDetails(props: FolderOutputType ) {
    const { name, job_id, id, other_file, volume, type_dossier, information_file_reference_facture, information_file_beneficiaire_telephone } = props;
    return (
        <div className="self-stretch flex flex-col justify-start items-start gap-[15px]">
            <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                <div className="flex-1 justify-start text-[#101828] text-sm font-bold leading-[18px]">Informations détaillées</div>
                <Link
                    className="justify-start text-[#65a5bf] text-sm font-bold leading-[18px]"
                    href={routeWithParams(CONTROL_NON_REGULATORY_DETAIL_ROUTE, { id })}
                >
                    Plus d’infos
                </Link>
            </div>
            <div className="self-stretch p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-center items-start gap-2.5">
                <div className="justify-start text-[#3a5f6e] text-xs font-medium">Nom du dossier :</div>
                <div className="justify-start text-[#101828] text-xs font-bold leading-[18px]">{name}</div>
            </div>
            <div className="self-stretch p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-center items-start gap-2.5">
                <div className="justify-start text-[#3a5f6e] text-xs font-medium">Fiche :</div>
                <div className="justify-start text-[#101828] text-xs font-bold leading-[18px]">{type_dossier}</div>
            </div>
            <div className="self-stretch p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-center items-start gap-2.5">
                <div className="justify-start text-[#3a5f6e] text-xs font-medium">N ° Facture:</div>
                <div className="justify-start text-[#101828] text-xs font-bold leading-[18px]">
                    {information_file_reference_facture || "Aucune"}
                </div>
            </div>
            <div className="self-stretch p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-center items-start gap-2.5">
                <div className="justify-start text-[#3a5f6e] text-xs font-medium">Volume CEE (classique)</div>
                <div className="justify-start text-[#101828] text-xs font-bold leading-[18px]">{volume} GWh cumac</div>
            </div>
            <div className="self-stretch p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-center items-start gap-2.5">
                <div className="justify-start text-[#3a5f6e] text-xs font-medium">Téléphone</div>
                <div className="justify-start text-[#101828] text-xs font-bold leading-[18px]">{information_file_beneficiaire_telephone || "Aucun"}</div>
            </div>
        </div>
    )
}

export default RecordMinimalDetails