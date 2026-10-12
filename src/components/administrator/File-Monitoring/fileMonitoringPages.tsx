"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState, useCallback, useMemo } from "react";
import { GetFolders } from "@/api/folderApi";
import PaginationApi from "@/components/Pagination_API";
import { FolderOutputType, GlobalParamsType } from "@/types/folderType";
import { PaginationType } from "@/types/general";
import CenterSpinner from "@/components/loader/CenterSpinner";
import FileListTables from "./components/fileListTables";
import GlobalFilters, { FilterType } from "@/components/GlobalFilters";
import { useFilters } from "@/contexts/Filter/filterContext";

export default function FileMonitoringPage() {
  const { setTitle } = useTitle();
  const { currentFilter, setFiltersForStorageKey, currentStorageKey } = useFilters();

  const [folders, setFolders] = useState<FolderOutputType[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationFolder, setPaginationFolder] = useState<PaginationType>({
    total_pages: 0,
    per_page: 10,
    page: 1,
    total_entries: 0,
  });

  // --- Fetch des dossiers
  const fetchRecords = useCallback(async () => {
    setLoading(true);

    // --- payload à jour à chaque fetch
    const payload: GlobalParamsType = {
      ...currentFilter,
      per_page: currentFilter.per_page ?? 10,
      page: currentFilter.page ?? 1,
    };

    try {
      const response = await GetFolders(payload);
      const paginationData = response?.pagination;

      setFolders(response?.data);
      setPaginationFolder({
        page: paginationData.pages,
        per_page: paginationData.per_page,
        total_entries: paginationData.total_entries,
        total_pages: paginationData.total_pages,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des dossiers :", error);
    } finally {
      setLoading(false);
    }
  }, [currentFilter]);

  useEffect(() => {
    setTitle("Suivi des Dossiers");
  }, [setTitle]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // --- Filtres à cacher si besoin
  const hiddenFilters = useMemo<FilterType[]>(() => {
    return ["installater_status", "controlleur_conformite", "role", "contrat_type", "status_contrat"];
  }, []);

  return (
    <div className="p-[30px] flex flex-col gap-6 w-full">
      <h2 className="text-black text-[24px] font-bold">Liste des dossiers</h2>

      {/* Global Filters */}
      <GlobalFilters
        params={currentFilter}
        setParams={(newParams: GlobalParamsType | ((prev: GlobalParamsType) => GlobalParamsType)) => {
          const next = typeof newParams === "function" ? newParams(currentFilter) : newParams;
          setFiltersForStorageKey(currentStorageKey, next);
        }}
        hiddens={hiddenFilters}
      />

      {/* Liste des dossiers ou spinner */}
      <div className="flex-1 w-full">
        {loading ? <CenterSpinner /> : <FileListTables folders={folders} setFolders={setFolders} />}
      </div>

      {/* Pagination */}
      <PaginationApi
        pagination={paginationFolder}
        setPagination={(data) => {
          setPaginationFolder(data);
          setFiltersForStorageKey(currentStorageKey, {
            ...currentFilter,
            page: data.page,
            per_page: data.per_page,
          });
        }}
      />
    </div>
  );
}
