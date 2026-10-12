"use client";

import CheckBox from "@/components/inputs/CheckBox";
import { useTeamMember } from "@/providers/TeamProvider";
import { FolderExportFinal, FolderExportMachineType } from "@/types/repartitionChargeType";
import React from "react";

const ExportMachineHeader = () => {
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const {
    setListDossier,
    listDossier,
    setListFileExportMachine,
  } = useTeamMember();

  const handleToggleAllFolders = (
    shouldAssign: boolean
  ) => {
    if (shouldAssign) {
    const filteredDossiers = listDossier.filter(
      (d) => d.job_id && Array.isArray(d.files) && d.files.length > 0
    );

    const exportData: FolderExportMachineType[] = filteredDossiers.map((dossier) => ({
      jobId: dossier.job_id,
      files: dossier.dossier?.files ?? [],
      other_file: dossier.other_file || [],
      controlleur: `${dossier.dossier?.processed_by.firstname}_${dossier.dossier?.processed_by.lastname}` || "",
      installateur: `${dossier.installateur?.firstname}_${dossier.installateur?.lastname}` || "",
      nameDossier: dossier.name || "",
    }));

    const typeFormulaire = filteredDossiers[0]?.type_dossier || "inconnu";

    const exportFinal: FolderExportFinal = {
      typeFormulaire,
      listFolder: exportData,
    };

    setListFileExportMachine(exportFinal);
  } else {
    setListFileExportMachine({
      typeFormulaire: "",
      listFolder: [],
    });
  }

    // setListFileExportMachine(prev =>{
    //   const newData = prev.map((folder) => ({}));
    //   return isEqual(prev, newData) ? prev : newData;
    // })

    setListDossier((prev) =>
      prev.map((dossier) => ({
        ...dossier,
        checked: shouldAssign,
      }))
    );

    setSelectAll(shouldAssign);
  };

  return (
    <div className="self-stretch px-5 pb-2.5  inline-flex justify-center items-center gap-3.5">
      <CheckBox
        onChange={() => handleToggleAllFolders(!selectAll)}
        data-property-1="Mi checked"
        className="w-6 h-5 bg-primary-blue rounded-[3px] flex justify-center items-center"
        checked={selectAll}
        id="select-all-checkbox"
        stopPropagation={true}
      />
      <div className="w-48 flex justify-start items-center gap-2.5">
        <div className="justify-start text-gray-500 text-xs font-bold">
          Contrôleur en charge
        </div>
      </div>
      <div className="flex-1 flex justify-start items-center gap-2.5">
        <div className="justify-start text-gray-500 text-xs font-bold">
          Date de validation
        </div>
      </div>
      <div className="flex-1 flex justify-start items-center gap-2.5">
        <div className="justify-start text-gray-500 text-xs font-bold">
          Nom du dossier
        </div>
      </div>
      <div className="flex-1 flex justify-start items-center gap-2.5">
        <div className="justify-start text-gray-500 text-xs font-bold">
          Type de dossier
        </div>
      </div>
      <div className="flex-1 flex justify-start items-center gap-2.5">
        <div className="justify-start text-gray-500 text-xs font-bold w-[250px]">
          Référence
        </div>
      </div>
      <div className="flex-1 flex justify-start items-center gap-2.5">
        <div className="justify-start text-gray-500 text-xs font-bold">
          Volume
        </div>
      </div>
    </div>
  );
};

export default ExportMachineHeader;
