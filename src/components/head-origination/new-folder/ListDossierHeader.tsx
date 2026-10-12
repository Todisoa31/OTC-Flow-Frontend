import CheckBox from "@/components/inputs/CheckBox";
import { useTeamMember } from "@/providers/TeamProvider";
import React from "react";
type Props = {
  setShowModalAffectation: React.Dispatch<React.SetStateAction<boolean>>;
  control: string;
}
const ListDossierHeader = (props: Props) => {
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const {controlAssign, setControlAssign, setListDossier, listDossier} = useTeamMember();
  const { setShowModalAffectation, control } = props;

  const handleToggleAllFolders = (shouldAssign: boolean) => {
    const allFolderIds: number[] = listDossier?.map((dossier) => dossier.id) || [];

    setControlAssign((prev) => ({
      ...prev,
      dossier_id: shouldAssign ? allFolderIds : [],
    }));

    setListDossier((prev) =>
      prev.map((dossier) => ({
        ...dossier,
        checked: shouldAssign,
      }))
    );

    setSelectAll(shouldAssign);
  };

  const handleAssign = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if(controlAssign===null) return;
    if(controlAssign?.dossier_id && controlAssign?.dossier_id?.length > 0) {      
      setShowModalAffectation(true);
    }
  }
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch px-5 rounded-2xl inline-flex justify-center items-center gap-3.5">
        <CheckBox 
          onChange={() => handleToggleAllFolders(!selectAll)}
          checked={selectAll}
          id="select-all-checkbox"
          stopPropagation={true}
          data-property-1="Mi checked"
          className="w-6 h-5 bg-primary-blue rounded-[3px] flex justify-center items-center"
        />
        <div className="flex-1 flex justify-start items-center gap-2.5">
          <div className="justify-start text-gray-500 text-xs font-bold">
            Référence
          </div>
        </div>
        <div className="flex-1 flex justify-start items-center gap-2.5">
          <div className="justify-start text-gray-500 text-xs font-bold">
            Installateur
          </div>
        </div>
        <div className="flex-1 flex justify-start items-start gap-2.5">
          <div className="justify-start text-gray-500 text-xs font-bold">
            Nom du dossier
          </div>
        </div>
        <div className="flex-1 flex justify-start items-start gap-2.5">
          <div className="justify-start text-gray-500 text-xs font-bold">
            Type de dossier
          </div>
        </div>
        <div className="w-48 flex justify-start items-start gap-2.5">
          <div className="justify-start text-gray-500 text-xs font-bold">
            {control === 'controlleur' ? 'Contrôleur assigné' : 'Contrôleur conformité'}
          </div>
        </div>
        <button onClick={(e) =>{handleAssign(e)}}className="w-20 h-7 px-2.5 bg-primary-blue text-white rounded-[5px] inline-flex flex-col justify-center items-center gap-2.5 text-xs font-bold leading-none">
            Assigner          
        </button>
        <div className="w-20"></div>
      </div>
    </div>
  );
};

export default ListDossierHeader;