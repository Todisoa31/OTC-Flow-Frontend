import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getControlOverview } from "@/api/control";
import NavigationDynamicIcon from "@/assets/icons/SideMenu/navigations/NavigationDynamicIcon";
import { CONTROL_STATUSES_OPTIONS } from "@/constants/records";
import { UseSidebarMenuStore } from "@/stores/sidebarStore";
import { ControleKeysType } from "@/types/general";
import { Statuses } from "@/types/recordType";
import { addQueryToUrl } from "@/utils/commonUtils";
import { cn } from "@/utils/tailwind";

type StatuseSidebarProps = {
  activePathname: string;
  controlType: "non_reglementaire" | "cofrac";
};

type Value = {
  name: string;
  total: number;
  cofrac: number;
  non_reglementaire: number;
};

type MetricKey = Statuses | "all" | "lots";
type MetricMap = Record<MetricKey, number>;

type MenuItemsProps = {
  metricData: MetricMap;
  activePathname: string;
};

const MenuItems = ({ metricData, activePathname }: MenuItemsProps) => {
  // On extrait les entrées
  const entries = Object.entries(metricData) as [MetricKey, number][];
  const { sideMenuOpen } = UseSidebarMenuStore();
  const [showLabel, setShowLabel] = useState(sideMenuOpen);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (sideMenuOpen) {
      timer = setTimeout(() => {
        setShowLabel(true);
      }, 200); // 1 seconde
    } else {
      setShowLabel(false); // cacher immédiatement quand le menu se ferme
    }

    return () => clearTimeout(timer);
  }, [sideMenuOpen]);

  // On met "all" à la fin
  const orderedEntries = entries.sort((a, b) => {
    if (a[0] === "all") return 1; // "all" va après les autres
    if (b[0] === "all") return -1; // si b est "all", a passe avant
    return 0;
  });

  const handleClickItem = (key: MetricKey) => {
    const currentSearchParams = Object.fromEntries(searchParams.entries());
    currentSearchParams.status = key !== "all" ? key : "";
    currentSearchParams.refresh = "true";
    const url = addQueryToUrl(activePathname, currentSearchParams);
    router.push(url);
  };

  return (
    <>
      {orderedEntries.map(([key, value]) => {
        let label = CONTROL_STATUSES_OPTIONS.find((item) => item.value === key)?.label || key;
        if (key === "all") label = "Tous les dossiers";
        if (key === "lots") label = "Gestion des lots";

        let active = pathname.startsWith(activePathname) && searchParams.get("status") === key;
        if (pathname.startsWith(activePathname) && !searchParams.get("status")) {
          active = key === "all";
        }

        return (
          <button
            key={key}
            title={label}
            onClick={() => handleClickItem(key as Statuses & "all")}
            className={cn(
              "h-10 hover:bg-[#FFFFFF66] hover:cursor-pointer px-3 rounded-xl inline-flex justify-start items-center gap-2",
              active ? "bg-[#65a5bf]" : ""
            )}
          >
            <div className="flex items-center">
              {<NavigationDynamicIcon iconKey={key as ControleKeysType} active={active} />}
            </div>
            {showLabel && (
              <div
                className={cn(
                  "flex-1 justify-start text-sm/4.5 capitalize font-bold",
                  active ? "text-white" : "text-[#3a5f6e]"
                )}
              >
                {label}
              </div>
            )}
            <div
              className={cn(
                "size-4 rounded shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-center",
                active ? "bg-white" : "bg-[#fefefe]/40"
              )}
            >
              <div
                className={cn(
                  "text-[10px] font-medium leading-4.5",
                  active ? "text-[#65a5bf]" : "text-[#3a5f6e]"
                )}
              >
                {value?.toString() || 0}
              </div>
            </div>
          </button>
        );
      })}
    </>
  );
};

function StatuseSidebar(props: Readonly<StatuseSidebarProps>) {
  const { activePathname, controlType } = props;
  const [metricData, setMetricData] = useState<MetricMap>({} as MetricMap);

  const { sideMenuOpen } = UseSidebarMenuStore();

  const handleGetOverview = async (isCofrac: boolean) => {
    try {
      const response = await getControlOverview();
      if (response) {
        const responseWithTotal = response as Record<Statuses, Value>;
        const allMetricValue = Object.values(responseWithTotal).reduce(
          (acc, value) => acc + (value?.[controlType] || 0),
          0
        );
        // TODO : Get value of metric lots
        const lotsMetric = (isCofrac ? { lots: 0 } : {}) as Pick<MetricMap, "lots">;
        const newMetricData: MetricMap = {
          ...lotsMetric,
          all: allMetricValue,
          ...Object.entries(responseWithTotal).reduce((acc, [key, value]) => {
            acc[key as Statuses] = value?.[controlType] || 0;
            return acc;
          }, {} as Record<Statuses, number>)
        };

        setMetricData(newMetricData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reorderMetricData = (data: MetricMap): MetricMap => {
    const entries = Object.entries(data) as [MetricKey, number][];
    entries.sort((a, b) => (a[0] === "refused_control" ? 1 : b[0] === "refused_control" ? -1 : 0));
    return Object.fromEntries(entries) as MetricMap;
  };

  useEffect(() => {
    handleGetOverview(controlType === "cofrac");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlType]);

  return (
    <div className="self-stretch px-6 pt-6 border-t border-[#fefefe]/30 inline-flex flex-col justify-start items-start gap-3">
      <div className="justify-start text-black-secondary text-sm/4.5 font-bold uppercase">
        {sideMenuOpen ? "Navigation" : "Nav"}
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <MenuItems metricData={metricData} activePathname={activePathname} />
      </div>
    </div>
  );
}

export default StatuseSidebar;
