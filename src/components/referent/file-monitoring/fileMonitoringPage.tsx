"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import HeaderFileMonitoring from "./components/headerFileMonitoring";
import TableFileMonitoring from "./components/tableFileMonitoring";
import { GetFolders } from "@/api/folderApi";
import PaginationApi from "@/components/Pagination_API";
import { FolderOutputType, GlobalParamsType } from "@/types/folderType";
import { PaginationType } from "@/types/general";
import CenterSpinner from "@/components/loader/CenterSpinner";


export default function FileMonitoringPage() {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Suivi des Dossiers");
  }, [setTitle]);

  const [folders, setFolders] = useState<FolderOutputType[]>([])
  const [text, setText] = useState<string>("");
  const [paginationFolder, setPaginationFolder] = useState<PaginationType>({
    total_pages: 0,
    per_page: 50,
    page: 1,
    total_entries: 0
  });
  const [params, SetParams] = useState<GlobalParamsType>({
    end_date: "",
    page: 1,
    per_page: paginationFolder.per_page,
    search_text: "",
    start_date: "",
    status: "",
    type_dossier: "",
  });

  const [loading, setLoading] = useState(false);



  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await GetFolders({ ...params, search_text: text });
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
  };

  useEffect(() => {
    fetchRecords();
  }, [paginationFolder.page, text, params]);

  return (
    <div className="p-[30px] flex flex-col gap-6 w-full">
      <h2 className="text-black text-[24px] font-bold">Liste des dossiers</h2>

      <HeaderFileMonitoring
        setText={setText}
        params={params}
        setParams={SetParams}
      />

      {loading ? <CenterSpinner /> : <TableFileMonitoring folders={folders} />}

      <PaginationApi
        pagination={paginationFolder}
        setPagination={(data) => {
          setPaginationFolder(data);
          SetParams({ ...params, page: data.page, per_page: data.per_page });
        }}
      />

    </div>
  );
}
