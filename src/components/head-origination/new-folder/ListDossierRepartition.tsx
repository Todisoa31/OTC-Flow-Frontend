import React, { use, useEffect, useState } from "react";
import ListDossierHeader from "./ListDossierHeader";
import CheckBox from "@/components/inputs/CheckBox";
import { DossierType } from "@/types/repartitionChargeType";
import CenterSpinner from "@/components/loader/CenterSpinner";
import EmptyRecord from "@/components/empty/EmptyRecord";
import DossierItem from "./DossierItem";
import AffectationModal from "./AffectationModal";
import { useTeamMember } from "@/providers/TeamProvider";

type Props = {
  listDossier?: DossierType[];
  loading?: boolean;
  control: string;
};


const ListDossierRepartition = (props: Props) => {
  const { listDossier, loading, control } = props;
  const [showModalAffectation, setShowModalAffectation] = useState<boolean>(false);
  const { controlAssign } = useTeamMember();

    if(!listDossier || !Array.isArray(listDossier)) return <EmptyRecord />

    if(listDossier.length === 0) {
        return <EmptyRecord />
    }
  
    if(loading){
        return <CenterSpinner />
    }

    if(listDossier.length === 0) {
        return <EmptyRecord />
    }

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 h-[60vh] pb-[54px] pr-[15px] overflow-y-auto">
      <ListDossierHeader setShowModalAffectation={setShowModalAffectation} control={control}/>

      {listDossier &&
        listDossier.length > 0 &&
        listDossier.map((dossier, index) => (
          <DossierItem dossier={dossier} key={index} index={index} setShowModalAffectation={setShowModalAffectation} control={control}/>
        ))}

        {
          controlAssign?.dossier_id!=null && 
          <AffectationModal
            showModalAffectation={showModalAffectation}
            setShowModalAffectation={setShowModalAffectation}
            dossier_id={controlAssign?.dossier_id}
            control={control}
          />
        }
    </div>
  );
};

export default ListDossierRepartition;
