import { ContractType } from "@/types/contratType";
import React, { useEffect } from "react";

type Props = {
  contrat: ContractType;
}
const DetailsContrat = (props: Props) => {
  const { contrat } = props;

  const formatDateFr = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="self-stretch inline-flex justify-start items-start gap-7">
      <div className="flex-1 inline-flex flex-col gap-3.5 text-gray-500 text-xs font-bold">
        <div>Somme globale HT par MWhc : <span className=" text-[#101828] font-bold">{contrat?.prix_total_ht_par_mwhc ?? 0} €</span></div>
        {contrat?.mf_somme_globale_ht_par_mwhc &&
            Object.entries(contrat?.mf_somme_globale_ht_par_mwhc).map(([key, value]) => (
                <div key={key}>
                    Prix {key.replaceAll("_", " ").toLowerCase()} : <span className=" text-[#101828] font-bold">{value ?? 0} €</span>
                </div>
            ))
        }
        
      </div>
      
      <div className="flex-1 inline-flex flex-col gap-3.5 text-gray-500 text-xs font-bold">
        <div>Volume total : <span className=" text-[#101828] font-bold">{contrat.mf_volume_total_gwhc ? contrat.mf_volume_total_gwhc + ' GWhc': 'n/a'}</span></div>
        <div>Volume par mois : <span className=" text-[#101828] font-bold">{contrat.mf_volume_par_mois_gwhc ? contrat.mf_volume_par_mois_gwhc + ' GWhc' : 'n/a'}</span></div>
        
      </div>
      <div className="flex-1 inline-flex flex-col gap-3.5 text-gray-500 text-xs font-bold">
        <div>Livraison : <span className=" text-[#101828] font-bold">{contrat.date_livraison ? formatDateFr(contrat.date_livraison):'n/a'}</span></div>
        <div>Signature : <span className=" text-[#101828] font-bold">{contrat.signature.signature_date?formatDateFr(contrat.signature.signature_date):'n/a'}</span></div>
        <div>Date de création : <span className=" text-[#101828] font-bold">{contrat.date_creation ? formatDateFr(contrat.date_creation): 'n/a'}</span></div>
      </div>
      <div className="flex-1 inline-flex flex-col gap-3.5 text-gray-500 text-xs font-bold">
        <div>Acheteur : <span className=" text-[#101828] font-bold">{contrat.signature.signature_acheteur_nom_societe ? contrat.signature.signature_acheteur_nom_societe: 'n/a'}</span></div>
        <div>Vendeur : <span className=" text-[#101828] font-bold">{contrat.signature.signature_vendeur_nom_societe ? contrat.signature.signature_vendeur_nom_societe:'n/a'}</span></div>
      </div>
      
    </div>
  );
};

export default DetailsContrat;
