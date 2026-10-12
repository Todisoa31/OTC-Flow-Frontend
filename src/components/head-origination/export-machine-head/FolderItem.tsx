import React, { useEffect } from "react";
import CheckBox from "../../inputs/CheckBox";
import { DossierType } from "@/types/repartitionChargeType";
import AssignController from "./AssignController";
import { useTeamMember } from "@/providers/TeamProvider";
import { useFilter } from "@/providers/FilterProvider";
import { formatIsoToDateTime } from "@/utils/commonUtils";
import { ExportMachineType } from "@/types/teamType";

type FolderItemProps = {
  index: number;
  dossier: DossierType;
};

const FolderItem = (props: FolderItemProps) => {
  const { index, dossier } = props;
  const { setExportMachine, setListDossier, setListFileExportMachine, listDossier } =
    useTeamMember();
  const { filters } = useFilter();

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setListDossier((prev) =>
      prev.map((dossier) => (dossier.id === id ? { ...dossier, checked } : dossier))
    );

    // à voir si on change le exportMachine multiple
    setExportMachine((prev: ExportMachineType) => ({
      ...prev,
      job_id: dossier.job_id || "",
      type_formulaire: String(filters.type_dossier) || ""
    }));
  };

  useEffect(() => {
    const selectedDossiers = listDossier.filter(
      (d) => d.checked === true && d.job_id && Array.isArray(d.files) && d.files.length > 0
    );

    const listFolder = selectedDossiers.map((dossier) => ({
      jobId: dossier.job_id,
      files: dossier.dossier?.files ?? [],
      other_file: dossier.other_file || [],
      controlleur:
        `${dossier.dossier?.processed_by.firstname}_${dossier.dossier?.processed_by.lastname}` ||
        "",
      installateur: `${dossier.installateur?.firstname}_${dossier.installateur?.lastname}` || "",
      nameDossier: dossier.name || dossier.nom_dossier || ""
    }));

    const typeFormulaire = selectedDossiers[0]?.type_dossier || selectedDossiers[0]?.dossier?.type_dossier || "";

    setListFileExportMachine({
      typeFormulaire,
      listFolder
    });
  }, [listDossier]);

  return (
    <div className="self-stretch h-14 pl-5 pr-3.5 bg-white/40 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex justify-center items-center gap-3.5">
      <CheckBox
        id={`feat-${index}`}
        checked={dossier.checked}
        onChange={(checkedDossier) => {
          handleCheckboxChange(dossier.id, checkedDossier);
        }}
        stopPropagation={true}
      />
      <div className="w-48 flex justify-start items-center gap-2.5">
        <AssignController controlleur={dossier.dossier?.processed_by ?? null} />
      </div>
      <div className="flex-1 flex justify-start items-start gap-2.5">
        <div className="justify-start text-dark-blue text-xs font-bold ">
          {dossier.dossier?.last_control_date
            ? formatIsoToDateTime(dossier.dossier.last_control_date)
            : "-"}
        </div>
      </div>
      <div className="flex-1 flex justify-start items-start gap-2.5">
        <div className="justify-start text-dark-blue text-xs font-bold ">
          {dossier.name || dossier.nom_dossier || "-"}
        </div>
      </div>
      <div className="flex-1 flex justify-start items-start gap-2.5">
        <div className="justify-start text-dark-blue text-xs font-bold ">
          {dossier.type_dossier || dossier.dossier?.type_dossier || "-"}
        </div>
      </div>
      <div className="flex-1 flex justify-start items-start gap-2.5">
        <div
          className="justify-start text-dark-blue text-xs font-bold truncate w-[250px]"
          title={dossier.job_id}
        >
          {dossier.job_id}
        </div>
      </div>
      <div className="flex-1 flex justify-start items-center gap-2.5">
        <div className="flex-1 justify-start text-dark-blue text-xs font-bold ">
          {dossier.total_classique}
        </div>
      </div>
    </div>
  );
};

export default FolderItem;
