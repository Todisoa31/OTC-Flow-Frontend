import { ContractTypeDetail } from "@/types/contratType"

type Props = {
    contract: ContractTypeDetail | null
}


type GridPropsType = {
    title: string;
    company?: string;
    typeCompany?: string;
    capital?: string;
    address?: string;
    city?: string;
    rcs?: string;
    fullName?: string;
    fonction?: string
};

export default function ContractContent({ contract }: Props) {
    return (
        <div className=" flex flex-col gap-8 p-[30px]">
            <div className=" grid grid-cols-2 gap-8">
                {contract?.acheteur &&
                    <GridTopContent
                        title="Acheteur"
                        company={contract?.acheteur?.acheteur_nom_societe ?? ""}
                        typeCompany={contract?.acheteur?.acheteur_type_societe ?? ""}
                        capital={contract?.acheteur?.acheteur_capital ?? ""}
                        address={contract?.acheteur?.acheteur_adresse ?? ""}
                        city={contract?.acheteur?.acheteur_ville ?? ""}
                        rcs={contract?.acheteur?.acheteur_numero_rcs ?? ""}
                        fullName={contract?.acheteur?.acheteur_prenom_nom ?? ""}
                        fonction={contract?.acheteur?.acheteur_fonction ?? ""}
                    />
                }
                {contract?.vendeur &&
                    <GridTopContent
                        title="Vendeur"
                        company={contract?.vendeur?.vendeur_nom_societe ?? ""}
                        typeCompany={contract?.vendeur?.vendeur_type_societe ?? ""}
                        capital={contract?.vendeur?.vendeur_capital ?? ""}
                        address={contract?.vendeur?.vendeur_adresse ?? ""}
                        city={contract?.vendeur?.vendeur_ville ?? ""}
                        rcs={contract?.vendeur?.vendeur_numero_rcs ?? ""}
                        fullName={contract?.vendeur?.vendeur_prenom_nom ?? ""}
                        fonction={contract?.vendeur?.vendeur_fonction ?? ""}
                    />
                }
                {contract?.beneficiaire &&
                    <GridTopContent
                        title="Bénéficiaire"
                        company={contract?.beneficiaire?.beneficiaire_nom_societe ?? ""}
                        typeCompany={contract?.beneficiaire?.beneficiaire_type_societe ?? ""}
                        capital={contract?.beneficiaire?.beneficiaire_capital ?? ""}
                        address={contract?.beneficiaire?.beneficiaire_adresse ?? ""}
                        city={contract?.beneficiaire?.beneficiaire_ville ?? ""}
                        rcs={contract?.beneficiaire?.beneficiaire_numero_rcs ?? ""}
                        fullName={contract?.beneficiaire?.beneficiaire_prenom_nom ?? ""}
                        fonction={contract?.beneficiaire?.beneficiaire_fonction ?? ""}
                    />
                }
                {contract?.mandataire &&
                    <GridTopContent
                        title="Mandataire"
                        company={contract?.mandataire?.mandataire_nom_societe ?? ""}
                        typeCompany={contract?.mandataire?.mandataire_type_societe ?? ""}
                        capital={contract?.mandataire?.mandataire_capital ?? ""}
                        address={contract?.mandataire?.mandataire_adresse ?? ""}
                        city={contract?.mandataire?.mandataire_ville ?? ""}
                        rcs={contract?.mandataire?.mandataire_numero_rcs ?? ""}
                        fullName={contract?.mandataire?.mandataire_prenom_nom ?? ""}
                        fonction={contract?.mandataire?.mandataire_fonction ?? ""}
                    />
                }
            </div>
            <div className=" grid grid-cols-3 gap-8">
                <div className=" flex flex-col gap-4 ">
                    <h4 className=" text-[#101828] font-bold">Modalité financière</h4>
                    <div className=" shadow-md bg-[#FFFFFF66] rounded-[10px] p-[20px] text-[12px] flex flex-col justify-center gap-2 text-[#3A5F6E] h-[130px]">
                        <div>Somme globale HT par MWhc : <span className=" text-[#101828] font-bold">{contract?.prix_total_ht_par_mwhc ?? 0} €</span></div>
                        {contract?.mf_somme_globale_ht_par_mwhc &&
                            Object.entries(contract?.mf_somme_globale_ht_par_mwhc).map(([key, value]) => (
                                <div key={key}>
                                    Prix {key.replaceAll("_", " ").toLowerCase()} : <span className=" text-[#101828] font-bold">{value ?? 0} €</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className=" flex flex-col gap-4">
                    <h4 className=" text-[#101828] font-bold">Volume</h4>
                    <div className=" shadow-md bg-[#FFFFFF66] rounded-[10px] p-[20px] text-[12px] flex flex-col justify-center gap-2 text-[#3A5F6E] h-[130px]">
                        <div>Volume total contractuel : <span className=" text-[#101828] font-bold"> {contract?.mf_volume_total_gwhc ?? 0} GWhc</span></div>
                        <div>Volume total livré : <span className=" text-[#101828] font-bold">{contract?.total_classique_gwhc ?? 0} GWhc</span></div>
                        <div>Volume mensuel contractuel : <span className=" text-[#101828] font-bold">{contract?.mf_volume_par_mois_gwhc ?? 0} GWhc</span></div>
                        <div>Volume livré ce mois-ci : <span className=" text-[#101828] font-bold">{contract?.volume_livre_mois ?? 0} GWhc</span></div>
                    </div>
                </div>

                <div className=" flex flex-col gap-4">
                    <h4 className=" text-[#101828] font-bold">Dates</h4>
                    <div className=" shadow-md bg-[#FFFFFF66] rounded-[10px] p-[20px] text-[12px] flex flex-col justify-center gap-2 text-[#3A5F6E] h-[130px]">
                        <div>Livraison : <span className=" text-[#101828] font-bold">{contract?.date_livraison?.split('-').reverse().join('/')}</span></div>
                        <div>Signature : <span className=" text-[#101828] font-bold">{contract?.signature?.signature_date.split('-').reverse().join('/')}</span></div>
                    </div>
                </div>
            </div>

            {contract?.fiche_op ? (
                <div className="flex flex-col gap-8">
                    <h3 className="text-[#101828] font-bold">Fiche opération</h3>
                    {Object.entries(contract.fiche_op)
                    .filter(([key, value]) => key.endsWith('_cee') && Array.isArray(value) && value.length > 0)
                    .map(([key, value]) => {
                        const label = key
                        .replace('fiche_op_', '')      
                        .replace('_cee', '')           
                        .replace(/_/g, ' ')  
                        .replace(/\b\w/g, l => l.toUpperCase()); 

                        return (
                        <div key={key} className="flex flex-col gap-4 bg-[#FFFFFF66] p-[20px] rounded-[10px] shadow-md">
                            <h4 className="text-[#101828] font-bold text-[14px]">{label}</h4>
                            <div className="flex gap-2 flex-wrap items-center">
                            {(value as string[]).map((item, index) => (
                                <div key={index} className="bg-white text-[#3A5F6E] p-[10px] rounded-[5px] text-[14px] shadow-md">
                                {item.split(':')[0]}
                                </div>
                            ))}
                            </div>
                        </div>
                        );
                    })}
                </div>
                ) : (
                <div className="flex flex-col gap-8">
                    <h3 className="text-[#101828] font-bold">Fiche opération</h3>
                    <div>Aucune fiche d&apos;opération disponible.</div>
                </div>
            )}

            <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-4">
                    <h4 className="text-[#101828] font-bold">Signature</h4>
                    <div className="shadow-md bg-[#FFFFFF66] rounded-[10px] p-[20px] text-[12px] text-[#3A5F6E]">
                    <div className="flex justify-between items-center w-full">
                        <div className="min-w-[180px]">
                        Ville : <span className="text-[#101828] font-bold">{contract?.signature.signature_ville ?? "—"}</span>
                        </div>

                        {/* <div className="flex-1 flex justify-center gap-[40px]"> */}
                            <div>
                                Date : <span className="text-[#101828] font-bold">{contract?.signature.signature_date ?? "—"}</span>
                            </div>
                            <div>
                                Nom de la société : <span className="text-[#101828] font-bold">{contract?.signature.signature_vendeur_nom_societe ?? "—"}</span>
                            </div>
                            <div>
                                Prénom et nom : <span className="text-[#101828] font-bold">{contract?.signature.signature_vendeur_prenom_nom ?? "—"}</span>
                            </div>
                        {/* </div> */}

                        <div className="min-w-[180px] text-right">
                        Fonction : <span className="text-[#101828] font-bold">{contract?.signature.signature_vendeur_fonction ?? "—"}</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
};

const GridTopContent = ({ title, company, typeCompany, capital, address, city, rcs, fullName, fonction }: GridPropsType) => {
    return (
        <div className=" flex flex-col gap-4 ">
            <h4 className=" text-[#101828] font-bold">{title}</h4>
            <div className=" grid grid-cols-2 gap-2 bg-[#FFFFFF66] rounded-[10px] p-[20px] text-[12px] shadow-md">
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">Société : </span> <span className=" text-[#101828] font-bold">{company}</span></div>
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">Type de société : </span> <span className=" text-[#101828] font-bold">{typeCompany}</span></div>
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">Capital : </span> <span className=" text-[#101828] font-bold"> {Number(capital).toLocaleString('fr-FR')} €</span></div>
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">Adresse : </span> <span className=" text-[#101828] font-bold">{address}</span></div>
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">Ville : </span> <span className=" text-[#101828] font-bold">{city}</span></div>
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">RCS : </span> <span className=" text-[#101828] font-bold">{rcs}</span></div>
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">Nom et prénom : </span> <span className=" text-[#101828] font-bold">{fullName}</span></div>
                <div className=" flex flex-col gap-1"><span className=" text-[#3A5F6E]">Fonction : </span> <span className=" text-[#101828] font-bold">{fonction}</span></div>
            </div>
        </div>
    )
};