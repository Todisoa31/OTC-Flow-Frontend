"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";

import SearchIcon2 from "@/assets/icons/SearchIcon2";
import Select from "@/components/inputs/Select";
import UserSelect from "./inputs/UserSelect";

import {
  CONTRACT_STATUS_OPTION,
  CONTROL_STATUSES_OPTIONS,
  ROLE_USER,
  STATUS_USER,
  STATUSES_OPTIONS,
  TYPE_DOSSIER
} from "@/constants/records";
import { ROLE_COFRAC, ROLE_INSTALLER } from "@/constants/userConst";
import { useFilters } from "@/contexts/Filter/filterContext";
import { GlobalParamsType } from "@/types/folderType";
import { useDebounce } from "@/hooks/useDebounce";
import { ADMIN_CONTRACT_ROUTE, ADMIN_SCHCEDURE_MANSGEMENT_ROUTE, HEAD_ORIGINATION_ROUTE, INSTALLER_CONTRACT_ROUTE } from "@/constants/routes";
import { GetContratType } from "@/api/contrat";

export type FilterType =
  | "search"
  | "status"
  | "date"
  | "type"
  | "installateur"
  | "controlleur_conformite"
  | "installater_status"
  | "role"
  | "status_contrat"
  | "contrat_type";

type GlobalFiltersProps = {
  params: GlobalParamsType;
  setParams: React.Dispatch<React.SetStateAction<GlobalParamsType>>;
  hiddens?: FilterType[];
  isCofrac?: boolean;
};

// Supprime les filtres cachés (ok)
const sanitizeParams = (params: GlobalParamsType, hiddens?: FilterType[]) => {
  if (!hiddens?.length) return params;
  return Object.fromEntries(
    Object.entries(params).filter(([key]) => !hiddens.includes(key as FilterType))
  ) as GlobalParamsType;
};

// Normalisation : valeur vide = ""
const normalizeFilterValue = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  return String(v).trim();
};

// Comparaison tableau
const arrayEqual = (a: number[], b: number[]) =>
  a.length === b.length && a.every((val, idx) => val === b[idx]);

export default function GlobalFilters({
  params,
  setParams,
  hiddens,
  isCofrac,
}: Readonly<GlobalFiltersProps>) {
  const { currentStorageKey, getFilterForStorageKey } = useFilters();
  const storedFilter = getFilterForStorageKey(currentStorageKey) ?? {};

  const [searchText, setSearchText] = useState(storedFilter.search_text ?? params.search_text ?? "");
  const debouncedText = useDebounce(searchText, 500);

  const [contractTypeOptions, setContractTypeOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchContractTypes = async () => {
      try {
        const res = await GetContratType();
        if (Array.isArray(res?.data)) {
          setContractTypeOptions(res.data.map((item: { id: string; name: string }) => ({
            label: item.name,
            value: item.name,
          })));
        }
      } catch (error) {
        console.error("Erreur récupération types contrat", error);
      }
    };
    fetchContractTypes();
  }, []);

  const updateParam = (key: keyof GlobalParamsType, value: unknown) => {
    setParams((prev) => {
      const updated = { ...prev, [key]: normalizeFilterValue(value) };
      return sanitizeParams(updated, hiddens);
    });
  };

  // Sync search
  useEffect(() => {
    updateParam("search_text", debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    setSearchText(storedFilter.search_text ?? params.search_text ?? "");
  }, [currentStorageKey]);

  const installerValue = useMemo(() => {
    if (!params.installateur) return [];
    return params.installateur.split(",").filter(Boolean).map(Number);
  }, [params.installateur]);

  const controllerValue = useMemo(() => {
    if (!params.controlleur_conformite) return [];
    return params.controlleur_conformite.split(",").filter(Boolean).map(Number);
  }, [params.controlleur_conformite]);

  const pathname = usePathname();
  const contractRoutes = [ADMIN_CONTRACT_ROUTE, INSTALLER_CONTRACT_ROUTE, HEAD_ORIGINATION_ROUTE];
  const searchPlaceholder = contractRoutes.some(route => pathname?.includes(route))
    ? "Rechercher un contrat / installateur ..."
    : pathname?.includes(ADMIN_SCHCEDURE_MANSGEMENT_ROUTE)
      ? "Rechercher un membre ..."
      : "Rechercher un dossier ...";

  return (
    <div className="flex items-center gap-5 w-full flex-wrap">
      {!hiddens?.includes("search") && (
        <div className="bg-white rounded-[10px] flex items-center justify-between h-[45px] w-[30%] px-2">
          <input
            type="search"
            className="outline-none border-none bg-transparent w-full text-grey text-[12px] px-[10px]"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="button">
            <SearchIcon2 />
          </button>
        </div>
      )}

      {!hiddens?.includes("status") && (
        <Select
          options={isCofrac ? CONTROL_STATUSES_OPTIONS : STATUSES_OPTIONS}
          value={params.status ?? ""}
          onChange={(v) => updateParam("status", v)}
          multiple={false}
          search={false}
          placeholder="Tous les statuts"
          className="bg-white !h-[45px] w-full"
        />
      )}

      {!hiddens?.includes("status_contrat") && (
        <Select
          options={CONTRACT_STATUS_OPTION}
          value={params.status_contrat ?? ""}
          onChange={(v) => updateParam("status_contrat", v)}
          multiple={false}
          search={false}
          placeholder="Status du contrat"
          className="bg-white !h-[45px] w-full"
        />
      )}

      {!hiddens?.includes("contrat_type") && (
        <Select
          options={contractTypeOptions}
          value={params.contrat_type ?? ""}
          onChange={(v) => updateParam("contrat_type", v)}
          multiple={false}
          search={false}
          placeholder="Type de contrat"
          className="bg-white !h-[45px] w-full"
        />
      )}

      {!hiddens?.includes("type") && (
        <Select
          options={TYPE_DOSSIER}
          value={params.type_dossier ?? ""}
          onChange={(v) => updateParam("type_dossier", v)}
          multiple={false}
          search={false}
          placeholder="Tous les types de dossier"
          className="bg-white !h-[45px] w-full"
        />
      )}

      {!hiddens?.includes("date") && (
        <div className="bg-white rounded-[10px] flex gap-2 px-2 h-[45px] items-center justify-evenly text-[12px] text-[#3A5F6E]">
          <input
            type="date"
            value={params.start_date ? dayjs(params.start_date, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
            onChange={(e) => updateParam("start_date", e.target.value ? dayjs(e.target.value).format("DD/MM/YYYY") : "")}
          />
          <span>|</span>
          <input
            type="date"
            value={params.end_date ? dayjs(params.end_date, "DD/MM/YYYY").format("YYYY-MM-DD") : ""}
            onChange={(e) => updateParam("end_date", e.target.value ? dayjs(e.target.value).format("DD/MM/YYYY") : "")}
          />
        </div>
      )}

      {!hiddens?.includes("installateur") && (
        <UserSelect
          value={installerValue}
          onChange={(value: number[]) => updateParam("installateur", value.length ? value.join(",") : "")}
          role={ROLE_INSTALLER}
          label="Installateur"
        />
      )}

      {!hiddens?.includes("controlleur_conformite") && (
        <UserSelect
          value={controllerValue}
          onChange={(value: number[]) => {
            if (!arrayEqual(controllerValue, value)) {
              updateParam("controlleur_conformite", value.length ? value.join(",") : "");
            }
          }}
          role={ROLE_COFRAC}
          label="Contrôleur conformité"
        />
      )}

      {!hiddens?.includes("installater_status") && (
        <Select
          multiple={false}
          search={false}
          value={params.userStatus ?? ""}
          onChange={(v) => updateParam("userStatus", v)}
          options={STATUS_USER}
          placeholder="Tous les status"
        />
      )}

      {!hiddens?.includes("role") && (
        <Select
          multiple={false}
          search={false}
          value={params.role ?? ""}
          onChange={(v) => updateParam("role", v)}
          options={ROLE_USER}
          placeholder="Tous les rôles"
        />
      )}
    </div>
  );
}