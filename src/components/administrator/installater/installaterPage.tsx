"use client";

import { useEffect, useState, useMemo } from "react";
import { useTitle } from "@/providers/TitleProvider";
import CenterSpinner from "@/components/loader/CenterSpinner";

import InstallaterLists from "./components/installaterLists";
import { getInstallateurList } from "@/api/recordInstallerApi";
import { InstallateurOutputType, InstallerpayloadType } from "@/types/installerTypes";
import { PaginationType } from "@/types/general";
import PaginationApi from "@/components/Pagination_API";

import { useFilters } from "@/contexts/Filter/filterContext";
import { GlobalParamsType } from "@/types/folderType";
import GlobalFilters, { FilterType } from "@/components/GlobalFilters";

export default function InstallaterManage() {
  const { setTitle } = useTitle();
  const { currentFilter, setFiltersForStorageKey, currentStorageKey } = useFilters();

  const [loading, setLoading] = useState(false);
  const [installers, setInstallers] = useState<InstallateurOutputType[]>([]);
  const [paginationFolder, setPaginationFolder] = useState<PaginationType>({
    total_pages: 0,
    per_page: 50,
    page: 1,
    total_entries: 0,
  });

  // --- payload normalisé pour l'API
  // const payload: InstallerPayloadType = {
  //   search_text: currentFilter.search_text ?? "",
  //   status: currentFilter.status ?? "",
  //   page: currentFilter.page ?? 1,
  //   per_page: currentFilter.per_page ?? 50,
  // };

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const payload: InstallerpayloadType = {
        installateur: currentFilter.installateur ?? "",
        userStatus: currentFilter.userStatus ?? "",
        page: currentFilter.page ?? 1,
        per_page: currentFilter.per_page ?? 50,
      };

      const res = await getInstallateurList(payload);
      setInstallers(res.users);
      setPaginationFolder(res.pagination);
    } catch (error) {
      console.error("Une erreur s'est produite", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [currentFilter]); 


  useEffect(() => {
    setTitle("Gestion des utilisateurs");
  }, [setTitle]);

  // --- filtres à cacher si besoin
  const hiddenFilters = useMemo<FilterType[]>(() => {
    return ["search", "status", "date", "type", "controlleur_conformite", "role", "contrat_type", "status_contrat"]; 
  }, []);

  return (
    <div className="p-[30px] flex flex-col gap-[30px] w-full">
      {/* Filtres */}
      <GlobalFilters
        params={currentFilter}
        setParams={(newParams: GlobalParamsType | ((prev: GlobalParamsType) => GlobalParamsType)) => {
          const next =
            typeof newParams === "function" ? newParams(currentFilter) : newParams;
          setFiltersForStorageKey(currentStorageKey, next);
        }}
        hiddens={hiddenFilters}
      />

      {/* Liste ou spinner */}
      <div className="flex-1 w-full">
        {loading ? <CenterSpinner /> : <InstallaterLists data={installers} loading={loading} />}
      </div>

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
