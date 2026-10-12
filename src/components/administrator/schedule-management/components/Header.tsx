import { useFilters } from "@/contexts/Filter/filterContext";
import GlobalFilters, { FilterType } from "@/components/GlobalFilters";
import { ADMIN_SCHCEDURE_MANSGEMENT_ROUTE } from "@/constants/routes";
import { UsePlanningStore } from "@/stores/PlanningStore";
import { usePathname } from "next/navigation";
import AddIcon from "@/assets/icons/AddIcon";
import { useMemo } from "react";

export default function HeaderSheadulePlaning() {
  const pathname = usePathname();
  const { toogleSide } = UsePlanningStore();
  const { currentFilter, setFiltersForStorageKey, currentStorageKey } = useFilters();

  const hiddenFilters = useMemo<FilterType[]>(() => {
    return pathname?.includes(ADMIN_SCHCEDURE_MANSGEMENT_ROUTE)
      ? ["status", "date", "type", "installater_status", "installateur", "controlleur_conformite", "contrat_type", "status_contrat"]
      : [];
  }, [pathname]);

  const updateFilter: React.Dispatch<React.SetStateAction<typeof currentFilter>> = (value) => {
    if (typeof value === "function") {
        const newState = value(currentFilter);
        setFiltersForStorageKey(currentStorageKey, newState);
    } else {
        setFiltersForStorageKey(currentStorageKey, value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-[30px] bg-[#FFFFFF66]">
      <h2 className="text-black text-[24px] font-bold">
        Gestion de Planning des Membres
      </h2>

      <div className="flex items-center w-full gap-4">
        <GlobalFilters
          params={currentFilter}
          setParams={updateFilter}
          hiddens={hiddenFilters}
        />

        <button
          className="flex items-center gap-2 p-3 bg-[#61A1BFB2] text-white rounded-[10px] shadow-lg text-[12px]"
          onClick={() => toogleSide("Create")}
        >
          <AddIcon color="#fff" />
          Ajouter jour off
        </button>
      </div>
    </div>
  );
}