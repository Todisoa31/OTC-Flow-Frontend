"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { GlobalParamsType } from "@/types/folderType";
import { ControleKeysType } from "@/types/general";

type FiltersContextType<T extends object = GlobalParamsType> = {
  filtersByKey: { [storageKey: string]: T };
  currentFilter: T;
  currentStorageKey: string;
  isStatusForced: boolean;
  setFiltersForStorageKey: (storageKey: string, values: T) => void;
  getFilterForStorageKey: (storageKey: string) => T;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

const EXPIRATION_DELAY = 2 * 60 * 60 * 1000; // 2h

// ----- Normalisation interne ↔ API -----
function normalizeForStorage(value?: string) {
  return value && value !== "" ? value : "default";
}
function normalizeForApi(value?: string) {
  return value === "default" ? "" : value ?? "";
}

// ----- Génération dynamique de tabKey -----
export function generateTabKey(pathname: string, status?: string): ControleKeysType {
  const cleaned = pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "_");
  const s = normalizeForStorage(status);
  const tabKey = cleaned ? `tab_${cleaned}_${s}` : `tab_root_${s}`;
  return tabKey as ControleKeysType;
}

// ----- Génération storageKey -----
export function getStorageKey(pathname: string, tab?: ControleKeysType, status?: string, refresh?: string) {
  const cleanedPath = pathname.replace(/^\/+/, "").replace(/\//g, "_");
  const s = normalizeForStorage(status);
  const r = normalizeForStorage(refresh);
  return `filters_${cleanedPath}_${s}_${r}${tab ? `_${tab}` : ""}`;
}

// ----- Helpers localStorage -----
function loadFilters(storageKey: string): GlobalParamsType {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return {};
  try {
    const parsed = JSON.parse(saved) as { data: GlobalParamsType; timestamp: number };
    if (Date.now() - parsed.timestamp >= EXPIRATION_DELAY) {
      console.log(`[FiltersProvider] ⏰ Expiration du cache pour ${storageKey}`);
      localStorage.removeItem(storageKey);
      return {};
    }
    return parsed.data;
  } catch {
    console.log(`[FiltersProvider] ⚠️ Corruption détectée sur ${storageKey}`);
    localStorage.removeItem(storageKey);
    return {};
  }
}

function saveFilters(storageKey: string, values: GlobalParamsType) {
  const cleaned: GlobalParamsType = Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );
  console.log(`[FiltersProvider] 💾 Sauvegarde ${storageKey}`, cleaned);
  localStorage.setItem(
    storageKey,
    JSON.stringify({ data: cleaned, timestamp: Date.now() })
  );
}

// ----- Merge intelligent -----
export function mergeFilters(defaults: GlobalParamsType, stored: GlobalParamsType): GlobalParamsType {
  return { ...defaults, ...stored };
}

// ----- Provider -----
export function FiltersProvider({
  children,
  depth,
  defaultFilter = { page: 1, per_page: 10 },
}: {
  children: ReactNode;
  depth?: number;
  defaultFilter?: GlobalParamsType;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filtersByKey, setFiltersByKey] = useState<Record<string, GlobalParamsType>>({});
  const [currentStorageKey, setCurrentStorageKey] = useState<string>("");
  const [isStatusForced, setIsStatusForced] = useState<boolean>(false);

  const rehydrated = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!pathname) return;

    const statusParam = searchParams.get("status") || undefined;
    const refreshParam = searchParams.get("refresh") || undefined;

    const tabKey = generateTabKey(pathname, statusParam);
    const storageKey = getStorageKey(pathname, tabKey, statusParam, refreshParam);

    console.log(`[FiltersProvider] 📍 Nouvelle page → storageKey=${storageKey}`);
    setCurrentStorageKey(storageKey);
    setIsStatusForced(Boolean(statusParam && statusParam !== "default"));
  }, [pathname, depth, searchParams?.toString()]);

  useEffect(() => {
    if (!currentStorageKey || rehydrated.current[currentStorageKey]) return;

    const stored = loadFilters(currentStorageKey);
    const merged = mergeFilters(defaultFilter, stored);

    setFiltersByKey((prev) => {
      if (JSON.stringify(prev[currentStorageKey]) === JSON.stringify(merged)) {
        rehydrated.current[currentStorageKey] = true;
        return prev;
      }
      saveFilters(currentStorageKey, merged);
      rehydrated.current[currentStorageKey] = true;
      console.log(`[FiltersProvider] 🔄 Réhydratation storageKey=${currentStorageKey}`, merged);
      return { ...prev, [currentStorageKey]: merged };
    });
  }, [currentStorageKey, defaultFilter]);

  const setFiltersForStorageKey = useCallback(
    (storageKey: string, values: GlobalParamsType) => {
      setFiltersByKey((prev) => {
        const prevValues = prev[storageKey] ?? {};
        const next = mergeFilters(prevValues, values);

        if (JSON.stringify(prevValues) === JSON.stringify(next)) return prev;

        saveFilters(storageKey, next);
        console.log(`[FiltersProvider] ✏️ Mise à jour storageKey=${storageKey}`, next);
        return { ...prev, [storageKey]: next };
      });
    },
    []
  );

  const getFilterForStorageKey = useCallback(
    (storageKey: string) => filtersByKey[storageKey] ?? {},
    [filtersByKey]
  );

  const currentFilter: GlobalParamsType = Object.fromEntries(
    Object.entries(filtersByKey[currentStorageKey] ?? {}).map(([k, v]) => [
      k,
      normalizeForApi(v as string),
    ])
  ) as GlobalParamsType;

  return (
    <FiltersContext.Provider
      value={{
        filtersByKey,
        currentFilter,
        currentStorageKey,
        isStatusForced,
        setFiltersForStorageKey,
        getFilterForStorageKey,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

// ----- Hook -----
export function useFilters<T extends object = GlobalParamsType>() {
  const ctx = useContext(FiltersContext) as FiltersContextType<T> | undefined;
  if (!ctx) throw new Error("useFilters doit être utilisé dans FiltersProvider");
  return ctx;
}
