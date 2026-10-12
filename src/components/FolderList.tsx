"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { updateMultipleFolderStatusApi } from "@/api/dossier";
import { GetFolders } from "@/api/folderApi";
import { FolderOutputType, GlobalParamsType } from "@/types/folderType";
import { PaginationType } from "@/types/general";
import { Statuses } from "@/types/recordType";
import { CONTROL_STATUSES_OPTIONS, STATUSES_OPTIONS } from "@/constants/records";
import { CONTROL_COFRAC_ROUTE } from "@/constants/routes";
import { useFilters } from "@/contexts/Filter/filterContext";

import GlobalFilters, { FilterType } from "./GlobalFilters";
import ListAsTable from "./ListTable";
import PaginationApi from "./Pagination_API";
import CenterSpinner from "./loader/CenterSpinner";
import Select from "./inputs/Select";
import { formatFrenchDate } from "@/utils/getHourMinute";

type HiddenColumnsType =
  | "installer"
  | "reference"
  | "date"
  | "name"
  | "controlType"
  | "folderType"
  | "volume"
  | "controller"
  | "status"
  | "controllerConformite";

type FolderListProps = {
  onClick?: (item: any) => void;
  useFilter?: boolean;
  usePagination?: boolean;
  hiddenFilters?: FilterType[];
  hiddenColumns?: HiddenColumnsType[];
  title?: string;
  editableStatus?: boolean;
  isCofrac?: boolean;
  checkbox?: boolean;
};

// --- Utilitaire pour comparer deux filtres ---
const isFilterChanged = (a: GlobalParamsType, b: GlobalParamsType) => {
  const normalize = (val: any) => {
    if (val === undefined || val === null) return "";
    if (typeof val === "string") return val.trim();
    return val;
  };

  const keysToCompare: (keyof GlobalParamsType)[] = [
    "search_text",
    "start_date",
    "end_date",
    "type_dossier",
    "status",
    "is_cofrac"
  ];

  // Comparer uniquement les clés significatives
  for (const key of keysToCompare) {
    if (normalize(a[key]) !== normalize(b[key])) {
      return true;
    }
  }

  return false;
};

const mergeWithStored = (stored: GlobalParamsType = {}, current: GlobalParamsType = {}) => {
  const result: GlobalParamsType = { ...stored };
  Object.entries(current).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      result[key as keyof GlobalParamsType] = value;
    }
  });
  return result;
};


function FolderList(props: Readonly<FolderListProps>) {
  const { useFilter, usePagination, hiddenFilters, hiddenColumns, editableStatus, isCofrac, checkbox, title = "Liste des dossiers", onClick } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { getFilterForStorageKey, setFiltersForStorageKey, currentStorageKey } = useFilters();

  // --- State ---
  const [folders, setFolders] = useState<FolderOutputType[]>([]);
  const [checkedFolders, setCheckedFolders] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [commonStatus, setCommonStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    total_pages: 0,
    per_page: 10,
    page: 1,
    total_entries: 0,
  });

  // --- Initialisation du filtre pour ce storageKey ---
  const initParamsForStorageKey = (): GlobalParamsType => {
    const savedFilter = getFilterForStorageKey(currentStorageKey) ?? {};
    const urlStatus = searchParams.get("status");

    return {
      // ...savedFilter,
      page: savedFilter?.page ?? 1,
      per_page: savedFilter?.per_page ?? 10,
      status: urlStatus ?? savedFilter?.status ?? "",
      ...(pathname.startsWith(CONTROL_COFRAC_ROUTE) ? { is_cofrac: true } : {}),
    };
  };

  const [params, setParams] = useState<GlobalParamsType>(initParamsForStorageKey());

  // --- Resync params si storageKey ou filtre stocké change ---
  useEffect(() => {
    const newParams = initParamsForStorageKey();
    if (isFilterChanged(newParams, params)) {
      setParams(newParams);
    }
  }, [currentStorageKey, pathname, searchParams]);

  // --- Synchronisation dans le contexte par storageKey ---
  useEffect(() => {
    const prevFilter = getFilterForStorageKey(currentStorageKey);
    const merged = mergeWithStored(prevFilter, params);
    if (isFilterChanged(merged, prevFilter)) {
      setFiltersForStorageKey(currentStorageKey, merged);
    }
  }, [params, currentStorageKey]);

  // --- Fetch API ---
  const getFoldersData = async () => {
    setFolders([]);
    setLoading(true);
    try {
      const res = await GetFolders({ ...params });
      setFolders(res?.data);
      setPagination({
        page: res?.pagination.pages,
        per_page: res?.pagination.per_page,
        total_entries: res?.pagination.total_entries,
        total_pages: res?.pagination.total_pages,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFoldersData();
  }, [params, pagination.page]);

  // --- Update multiple status ---
  const handleUpdateMultipleStatus = async (statusCode: Statuses) => {
    if (!commonStatus) return;
    try {
      setLoading(true);
      await updateMultipleFolderStatusApi(checkedFolders, statusCode);
      setCheckedFolders([]);
      setCommonStatus(null);
      getFoldersData();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (commonStatus) handleUpdateMultipleStatus(commonStatus as Statuses);
  }, [commonStatus]);

  // --- Helpers ---
  const checkHidden = (key: string) => hiddenColumns?.includes(key as HiddenColumnsType) ? "hidden" : "";

  const headers = [
    { key: "installer", label: "Installateur", imageKey: "installerPhoto", className: `w-[15%] ${checkHidden("installer")}` },
    { key: "reference", label: "Référence", className: `!w-[15%] ${checkHidden("reference")}` },
    { key: "date", label: "Date", className: `${checkHidden("date")}` },
    { key: "name", label: "Nom", className: `${checkHidden("name")}` },
    { key: "phone", label: "Téléphone", className: `${checkHidden("phone")}` },
    { key: "controlType", label: "Type contrôle", className: `${checkHidden("controlType")}` },
    { key: "folderType", label: "Type de dossier", className: `${checkHidden("folderType")}` },
    { key: "volume", label: "Volume (GWhc)", className: `${checkHidden("volume")}` },
    { key: "controller", label: "Contrôleur", imageKey: "controllerPhoto", className: ` w-[15%] ${checkHidden("controller")}` },
    { key: "controllerConformite", label: "Contrôleur de conformité", imageKey: "controllerConformitePhoto", className: ` w-[10%] ${checkHidden("controllerConformite")}` },
    { key: "status", label: "Statut", className: `!max-w-[190px] !min-w-[190px] items-end justify-end text-right ${checkHidden("status")}` },
  ];

  const parseFolderItem = (folder: any) => ({
    id: folder.id,
    installer: folder?.installateur?.firstname + " " + folder?.installateur?.lastname,
    installerPhoto: folder?.installateur?.photo_profil,
    reference: folder?.job_id,
    date: formatFrenchDate(folder?.created_at),
    name: folder?.name,
    phone: folder?.installateur?.installer_info?.phone || "-",
    controlType: folder?.is_cofrac ? "Cofrac" : "Non réglementaire",
    folderType: folder?.type_dossier,
    volume: folder?.volume,
    controller: folder?.processed_by?.firstname + " " + folder?.processed_by?.lastname,
    controllerPhoto: folder?.processed_by?.photo_profil,
    controllerConformite: folder?.controlleur_conformite?.firstname + " " + folder?.controlleur_conformite?.lastname,
    controllerConformitePhoto: folder?.controlleur_conformite?.photo_profil,
    status: folder?.status?.code,
  });

  // --- Render ---
  return (
    <>
      <div className="flex items-center gap-2.5">
        <h2 className="flex-1 text-[#101828] text-2xl font-bold">{title}</h2>
      </div>

      {useFilter && (
        <GlobalFilters
          params={params}
          setParams={setParams}
          hiddens={hiddenFilters}
          isCofrac={isCofrac}
          // tabKey={tabKey}
        />
      )}

      {checkbox && checkedFolders.length > 0 && (
        <Select
          options={isCofrac ? CONTROL_STATUSES_OPTIONS : STATUSES_OPTIONS}
          onChange={(value) => setCommonStatus(value as string)}
          value={commonStatus as string}
          multiple={false}
          search={false}
          placeholder="Changer le statut"
          className="bg-black"
          labelClassName="text-white"
          iconColor="white"
          width="w-[200px]"
        />
      )}

      {loading ? (
        <CenterSpinner />
      ) : (
        <ListAsTable
          headers={headers}
          data={folders.map(parseFolderItem)}
          originalData={folders}
          onClick={onClick}
          onCheck={setCheckedFolders}
          editableStatus={editableStatus}
          isCofrac={isCofrac}
          checkBox={checkbox}
        />
      )}

      {usePagination && (
        <div className="flex self-stretch justify-between items-center mt-4 gap-4">
          <PaginationApi
            pagination={pagination}
            setPagination={(data) => {
              setPagination(data);
              setParams({ ...params, page: data.page, per_page: data.per_page });
            }}
          />
        </div>
      )}
    </>
  );
}

export default FolderList;

