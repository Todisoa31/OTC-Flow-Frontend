"use client";

import { useEffect, useState } from "react";
import { useTitle } from "@/providers/TitleProvider";
import ExportMachineHeader from "./ExportMachineHeader";
import FilterExportMachine from "./FilterExportMachine";
import { DossierType } from "@/types/repartitionChargeType";
import { useFilter } from "@/providers/FilterProvider";
import isEqual from "lodash.isequal";
import Pagination from "../../Pagination_V2";
import FolderList from "./FolderList";
import { useTeamMember } from "@/providers/TeamProvider";
import { formatCSVFile } from "@/utils/fileUtils";
import { convertAllJobsToSingleCsv } from "@/utils/csv";
import { getExportMachineApiV2 } from "@/api/exportMachineApi";

const ExportMachine = () => {
  const { setTitle } = useTitle();
  const { filters, setFilters } = useFilter();

  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const { setListDossier, listDossier } = useTeamMember();

  const getAllDossier = async () => {
    try {
      setLoading(true);
      const _filters = { ...filters };

      if (!_filters.status) {
        _filters.status = "fully_validated";
      }

      if (!_filters.type_dossier) {
        _filters.type_dossier = "RES_EC_104";
      }
      const { page, per_page, ...filteredFilters } = _filters;
      const response = await getExportMachineApiV2({ page, per_page, ...filteredFilters });
      setTotalPages(response.pagination.total_pages);

      const dossiersWithCSV = await Promise.all(
        response.data.map(async (dossier: DossierType) => {
          const responseExportMachine = await getExportMachineApiV2({
            page,
            per_page,
            ...filteredFilters
          });

          if (!responseExportMachine) {
            console.error("No export machine data found for dossier:", dossier.job_id);
            return { ...dossier, checked: false };
          }

          const csvContent = convertAllJobsToSingleCsv(responseExportMachine);
          const csvFile = formatCSVFile(csvContent, dossier);

          // Vérifie si ce fichier existe déjà dans les files
          const files = dossier.files || dossier.dossier?.files || [];
          const alreadyHasCSV = files.some((file) => file.name === csvFile?.name);
          const updatedFiles = alreadyHasCSV || !csvFile ? files : [...files, csvFile];

          return {
            ...dossier,
            checked: false,
            files: updatedFiles // ✅ Le CSV est bien injecté ici
          };
        })
      );

      setListDossier((prev) => {
        const isSame = isEqual(prev, dossiersWithCSV);
        return isSame ? prev : dossiersWithCSV;
      });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTitle("Export Machine");
  }, [setTitle]);

  useEffect(() => {
    setFilters({
      page: 1,
      per_page: 10,
      type_dossier: "RES_EC_104"
    });
  }, []);

  useEffect(() => {
    getAllDossier();
  }, [filters]);

  return (
    <div className="self-stretch p-7 inline-flex flex-col justify-start items-start gap-7 w-full">
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 justify-start text-gray-900 text-2xl font-bold ">
          Liste des dossiers validés
        </div>
      </div>
      <FilterExportMachine />
      <div className="self-stretch flex flex-col justify-start items-start gap-5 min-h-[calc(100vh-450px)]">
        <ExportMachineHeader />
        <FolderList listDossier={listDossier} loading={loading} />
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ExportMachine;
