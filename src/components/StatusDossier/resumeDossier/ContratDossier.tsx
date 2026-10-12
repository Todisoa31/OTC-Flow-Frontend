import DetailsContrat from "@/components/contracts/DetailsContrat";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";
import { ContractType } from "@/types/contratType";
import React from "react";

type Props = {
  contrat: ContractType
}

const ContratDossier = (props : Props) => {
  const { contrat } = props;
  const {setFilePdfModal, filePdfModal} = useStatusDosserProvider();


  const handlePreviewFile = () => {
    setFilePdfModal({showPdfViewer: true, file: contrat.file});
  }


  return (
    <div className="w-full p-[30px]">
      <div className="w-full self-stretch p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-3.5">
        <div className="self-stretch inline-flex justify-start items-center gap-5">
          <div className="flex-1 flex justify-start items-center gap-5">
            <div className="justify-start text-zinc-700 text-sm font-bold leading-none truncate overflow-hidden whitespace-nowrap  max-w-[370px] w-[370px] pr-4" title={contrat.contrat_name?contrat.contrat_name:contrat.contratID}>
              {contrat.contrat_name?contrat.contrat_name:contrat.contratID}
            </div>
            <div className="p-2.5 bg-slate-200 rounded-[5px] inline-flex flex-col justify-center items-center gap-2.5">
              <div title={contrat.contrat_type} className="self-stretch justify-start text-zinc-700 text-xs font-bold truncate overflow-hidden whitespace-nowrap  max-w-[270px] w-[270px]" >
              {contrat.contrat_type}
              </div>
            </div>
            {contrat.compte_oblige_nom_societe && <div className="flex-1 inline-flex flex-col gap-3.5 text-gray-500 text-xs font-bold"><div>RAI : <span className=" text-[#101828] font-bold">{contrat.compte_oblige_nom_societe}</span></div></div>}
          </div>
          <div className="h-7 px-2.5 bg-gray-900 rounded-[5px] flex justify-start items-center gap-2.5">
            <button onClick={handlePreviewFile} className="justify-start text-white text-xs font-bold leading-none">
              Voir le contrat
            </button>
          </div>
        </div>
        <DetailsContrat contrat={contrat} />        
      </div>
    </div>
  );
};

export default ContratDossier;
