import React from "react";
import { DossierType } from "@/types/repartitionChargeType";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { HEAD_ORIGINATION_NEW_FOLDER_ROUTE } from "@/constants/routes";
import CheckBox from "@/components/inputs/CheckBox";
import AssignController from "./AssignController";
import AssignInstallateur from "./AssignInstallateur";
import { useTeamMember } from "@/providers/TeamProvider";

type Props = {
  dossier: DossierType;
  index: number;
  setShowModalAffectation: React.Dispatch<React.SetStateAction<boolean>>;
  control: string;
};

const DossierItem = (props: Props) => {
  const { setControlAssign, setListDossier } = useTeamMember();
  const { dossier, index, setShowModalAffectation, control } = props;
  const router = useRouter();

  const folderHandler = (
    router: AppRouterInstance,
    id: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    router.push(`${HEAD_ORIGINATION_NEW_FOLDER_ROUTE}/${id}`);
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setControlAssign((prev) => {
      const currentIds = prev?.dossier_id ?? [];

      const updatedIds = checked
        ? [...currentIds, id] // Ajout si coché
        : currentIds.filter((dossierId) => dossierId !== id); // Retrait si décoché

      return {
        ...prev,
        dossier_id: updatedIds,
      };
    });
    setListDossier((prev) =>
      prev.map((dossier) =>
       dossier.id === id ? { ...dossier, checked } : dossier
      )
    );
  };

  const reassignHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModalAffectation(true);
    //id monitoring
    setControlAssign((prev) => ({
      ...prev,
      dossier_id: [dossier.id],
    }));
  };

  return (
    <div
      className="self-stretch py-3 pl-5 pr-3.5 bg-white/40 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex justify-start items-center gap-3.5 cursor-pointer"
    >
      <CheckBox
        id={`feat-${index}`}
        checked={dossier.checked}
        onChange={(checkedDossier) => {
          handleCheckboxChange(dossier.id, checkedDossier);
        }}
        stopPropagation={true}
      />
      <div className="flex-1 flex justify-start items-start gap-2.5">
        <div className="justify-start text-dark-blue text-xs font-bold">
          {dossier.id}
        </div>
      </div>
      <AssignInstallateur installateur={dossier.installateur} />
      <div className="flex-1 flex justify-start items-start gap-2.5">
        <div className="justify-start text-dark-blue text-xs font-bold">
          {dossier.name || dossier.nom_dossier}
        </div>
      </div>
      <div className="flex-1 flex justify-start items-start gap-2.5">
        <div className="justify-start text-dark-blue text-xs font-bold">
          {dossier.type_dossier || dossier.dossier?.type_dossier}
        </div>
      </div>
      <AssignController controlleur={control === 'controlleur' ? dossier.processed_by : dossier.controlleur_conformite} />
      <button
        onClick={(e) => {
          reassignHandler(e);
        }}
        className="h-7 px-2.5 bg-primary-blue rounded-[5px] inline-flex flex-col justify-center items-center gap-2.5 text-xs font-bold leading-none text-white"
      >
        Réassigner
      </button>
      <button
        onClick={(e) => {
          folderHandler(router, dossier.id, e);
        }}
        className="h-7 w-20 px-2.5 bg-gray-900/10 rounded-[5px] inline-flex flex-col justify-center items-center gap-2.5 text-xs font-bold leading-none text-gray-900"
      >
        Detail
      </button>
    </div>
  );
};

export default DossierItem;
