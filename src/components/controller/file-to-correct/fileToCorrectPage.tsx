"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState, useCallback } from "react";

import { GetFolders } from "@/api/folderApi";
import PaginationApi from "@/components/Pagination_API";
import { FolderOutputType, GlobalParamsType } from "@/types/folderType";
import { PaginationType } from "@/types/general";
import CenterSpinner from "@/components/loader/CenterSpinner";
import FilterTables from "./components/filterTables";
import FileListTables from "./components/fileListTables";

export default function FileToCorrectPage() {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Dossiers à Corriger");
  }, [setTitle]);

  const [folders, setFolders] = useState<FolderOutputType[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    per_page: 10,
    total_entries: 0,
    total_pages: 0,
  });

  const [filters, setFilters] = useState<GlobalParamsType>({
    start_date: "",
    end_date: "",
    status: "tocorrect",
    type_dossier: "",
    search_text: "",
    page: 1,
    per_page: 10,
  });

  const [loading, setLoading] = useState(false);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GetFolders({
        ...filters,
        search_text: searchText,
        page: pagination.page,
        per_page: pagination.per_page,
      });

      // Filtrer côté client juste au cas où l'API renvoie plus que nécessaire
      const filteredFolders = (response?.data || []).filter(
        (folder: FolderOutputType) => folder.status?.code === "tocorrect"
      );


      setFolders(filteredFolders);

      setPagination((prev) => ({
        ...prev,
        total_entries: response.pagination.total_entries,
        total_pages: response.pagination.total_pages,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dossiers :", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.per_page, searchText]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return (
    <div className="p-[30px] flex flex-col gap-6 w-full">
      <h2 className="text-black text-[24px] font-bold">
        Dossiers à Corriger ({folders.length})
      </h2>

      <FilterTables
        setText={setSearchText}
        params={filters}
        setParams={(newParams) => {
          setFilters(newParams);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
      />

      {loading ? (
        <CenterSpinner />
      ) : (
        <FileListTables folders={folders} />
      )}

      <PaginationApi
        pagination={pagination}
        setPagination={(data) => {
          setPagination((prev) => ({
            ...prev,
            page: data.page,
            per_page: data.per_page,
          }));
        }}
      />
    </div>
  );
}