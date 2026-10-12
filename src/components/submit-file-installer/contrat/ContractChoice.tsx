import CenterSpinner from "@/components/loader/CenterSpinner";
import { useRecords } from "@/providers/CreateRecordProvider";
import { ContractType, FicheCEEData } from "@/types/contratType";
import { useEffect } from "react";
import { FOLDER_TYPES } from "@/constants/records";
import DetailsContrat from "@/components/contracts/DetailsContrat";
import { getDetailContratApi } from "@/api/contrat";
import { FolderTypes } from "@/types/recordType";

type Props = {
  contrats: ContractType[];
  loading: boolean;
};


const ContractChoice = (props: Props) => {
  const { contrats, loading } = props;
  const { setContratId, contratId, setFolderTypeDynamics, detailContrat, setDetailContrat, loadingFiche, setLoadingFiche } = useRecords();   

  function isAnyFolderLabelPresent(fiche: FicheCEEData): boolean {
    const labelsToCheck = FOLDER_TYPES.map(ft => ft.label.trim().toUpperCase());
    const ceeKeys = Object.keys(fiche).filter(key => key.endsWith("_cee"));

    const allCEEValues = ceeKeys.flatMap(key =>
      (fiche[key] || []).map(val => val.trim().toUpperCase()) // Nettoie chaque valeur
    );
    return labelsToCheck.some(label =>
      allCEEValues.some(val => val.includes(label))
    );
}

  const handleSelect = async (code: number, fiche_op: FicheCEEData, index: number) => {
    setLoadingFiche(false)
    if (fiche_op!==null && isAnyFolderLabelPresent(fiche_op)) {
      setContratId({index: null, available: false, code});
      await getDetailContrat(code);
    }else{
      setContratId({index, available: true, code: null});
    }
    
  };


  const getDetailContrat = async (contratId: number | null | undefined) => {
    if (contratId) {
      try{
        const response = await getDetailContratApi(contratId);
        setDetailContrat(response);   
        setLoadingFiche(true)    
      }catch(error){
        console.error("Error fetching contract details:", error);
      }
    }
  }


  const getAllFicheFromContrat = () => {
    if (detailContrat?.fiche_op) {
      const allCEELabels: string[] = Object.keys(detailContrat.fiche_op)
        .filter(key => {
          // Vérifie si la clé termine par '_cee' ET si sa valeur est un tableau
          const val = detailContrat.fiche_op[key];
          return key.endsWith('_cee') && Array.isArray(val);
        })
        .flatMap(key => (detailContrat.fiche_op as Record<string, any>)[key])
        .map(item => item?.trim());

      return allCEELabels.filter(Boolean); 
    }

    return [];
  };


  useEffect(() => {
  const allCeeLabels = getAllFicheFromContrat();
  console.log("All CEE Labels from contract:", allCeeLabels);

  const check: FolderTypes[] = allCeeLabels
    .map(text => {
      // Cherche le folder dont le label est présent dans le texte
      const folder = FOLDER_TYPES.find(f => text.includes(f.label));
      if (!folder) return null;

      const label = folder.label;

      // Séparer le code et la description
      const description = text.includes(label)
        ? text.replace(label, '').trim()
        : '';
        const labelHtml = `<span class="font-bold">${label}</span>` +
        (description ? `<span class="text-sm text-gray-500 block">${description}</span>` : '');

      return {
        ...folder,
        label: labelHtml
      };
    })
    .filter(Boolean) as FolderTypes[];

  setFolderTypeDynamics(check);
}, [detailContrat, contratId]);


  return (
    // <div className="self-stretch p-5 relative bg-white rounded-[20px] shadow-[0px_0px_35px_0px_rgba(95,123,151,0.08)]">
    <div className="self-stretch relative flex flex-col gap-7">
      {loading ? (
        <CenterSpinner />
      ) : (
        <div className="h-[calc(100vh-360px)] overflow-y-auto w-full inline-flex flex-col justify-start items-start gap-7 pr-[15px]">
          {contrats && contrats.length > 0 ? (
            contrats.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item.id, item.fiche_op, index)}
                className={`cursor-pointer self-stretch p-5 rounded-[10px] border-[3px] transition-all bg-white relative ${
                  contratId.code === item.id ? "border-primary-blue" : "border-white"
                } flex flex-col justify-start items-start gap-3.5`}
              >
                <div className="self-stretch inline-flex justify-start items-center gap-5">
                  <div className="flex-1 flex justify-start items-center gap-5">
                    <div className="text-zinc-700 text-sm font-bold truncate overflow-hidden whitespace-nowrap  max-w-[370px] w-[370px] pr-4" title={item.contrat_name ? item.contrat_name : item.contratID}>
                      {item.contrat_name ? item.contrat_name : item.contratID}
                    </div>
                    <div
                      className={`p-2.5 ${
                        contratId.code === item.id
                          ? "bg-primary-blue"
                          : "bg-gray-200"
                      }  rounded-[5px] inline-flex flex-col justify-center items-center gap-2.5`}
                    >
                      <div
                        title={item.contrat_type}
                        className={`${
                          contratId.code === item.id ? "text-white" : "text-zinc-700"
                        }  text-xs font-bold truncate overflow-hidden whitespace-nowrap  max-w-[270px] w-[270px]`}
                      >
                        {item.contrat_type}
                      </div>                      
                    </div>
                    {item.compte_oblige_nom_societe && <div className="flex-1 inline-flex flex-col gap-3.5 text-gray-500 text-xs font-bold"><div>RAI : <span className=" text-[#101828] font-bold">{item.compte_oblige_nom_societe}</span></div></div>}
                  </div>
                  {(item.fiche_op!==null && isAnyFolderLabelPresent (item.fiche_op)) ? (
                    <div className="h-8 px-3 bg-primary-blue  rounded-[5px] flex justify-center items-center gap-1.5 text-white text-xs font-bold">
                      Valide
                    </div>
                  ) : (
                    <div className="h-8 px-3 bg-[#EC4899]  rounded-[5px] flex justify-center items-center gap-1.5 text-white text-xs font-bold">
                      Invalide
                    </div>
                  )}
                </div>

                  <DetailsContrat contrat={item} />
                
                {contratId.index === index && contratId.available && (
                  <div className="absolute inset-0 bg-grey/50  backdrop-blur-sm rounded-[5px] flex justify-center items-center">
                    <span className="text-red-600 bg-[#EC4899] py-2 px-5 text-sm rounded-[5px] text-white font-bold shadow-[0px_10px_40px_0px_#ec489aa0]">Veuillez sélectionner un autre type de contrat. Aucune fiche correspondante n’est disponible ou elle n’a pas encore été prise en compte.</span>
                  </div>
                )}
                
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-sm font-bold">
              Aucun contrat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractChoice;
