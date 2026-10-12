"use client";

import { getPlanningList } from "@/api/planningApi";
import ArrowIcon from "@/assets/icons/ArrowIcon";
import PlanningModal from "@/components/modal/planningModal";
import { UsePlanningStore } from "@/stores/PlanningStore";
import { Role } from "@/types/authType";
import { PlaningFilterType } from "@/types/general";
import { AvailabilityType, UserPlannigModal, UserPlanning } from "@/types/planningType";
import { getFile } from "@/utils/getFile";
import { use, useEffect, useRef, useState } from "react";

const openDays = ["Lun", "Mar", "Mer", "Jeu", "Ven"];

function getOpenDaysWithDates(referenceDate: Date) {
  const result: string[] = [];
  let currentDate = new Date(referenceDate);

  while (result.length < 5) {
    const day = currentDate.getDay();
    if (day >= 1 && day <= 5) {
      const jour = openDays[day - 1];
      const date = currentDate.getDate().toString().padStart(2, "0");
      result.push(`${jour} ${date}`);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

const statusColors: Record<string, string> = {
  "Disponible": "bg-[#65BFAA]",
  "Off": "bg-[#FCC567]",
};

type Props = {
  referenceDate: Date;
  previousWeek: () => void;
  nextWeek: () => void;
  filter: PlaningFilterType;
  search: string;
};


export default function PlanningContent({ referenceDate, nextWeek, previousWeek, filter, search }: Props) {
  const { update, toogleSide, setCreatePlanning } = UsePlanningStore();
  const [userPlanning, setUserPlanning] = useState<UserPlanning[]>([]);
  const [page, setpage] = useState<number>(1);
  const days = getOpenDaysWithDates(referenceDate);
  const planningDivRef = useRef<HTMLDivElement | null>(null);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const [parametter, setParametter] = useState<UserPlannigModal | any | null>(null);
  const [currentStatus, setCurrentStatus] = useState<AvailabilityType>('Disponible');
  const [currentDate, setCurrentDate] = useState<string>("");

  function getMonthName(date: Date) {
    return date.toLocaleDateString("fr-FR", { month: "long" });
  }

  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = referenceDate.toISOString().split("T")[0];
      try {
        const res = await getPlanningList({
          start_date: formattedDate,
          role: filter.role as Role,
          search_text: search,
          page: 1,
          per_page: 20
        });
        setUserPlanning(res.data?.users || []);
        setpage(1);
        setMaxPage(res?.data?.pagination?.total_pages)

      } catch (error) {
        console.error("Erreur lors de la récupération initiale du planning :", error);
      }
    };
    fetchData();
  }, [referenceDate, filter.role, search, update]);

  useEffect(() => {
    if (page === 1 || page > maxPage) return;

    const fetchNextPage = async () => {
      const formattedDate = referenceDate.toISOString().split("T")[0];
      try {
        const res = await getPlanningList({
          start_date: formattedDate,
          role: filter.role as Role,
          search_text: search,
          page,
          per_page: 20
        });
        setUserPlanning((prev) => [...prev, ...(res.data?.users || [])]);
      } catch (error) {
        console.error("Erreur lors du chargement de la page suivante :", error);
      }
    };

    fetchNextPage();
  }, [page]);


  const handleScroll = () => {
    const div = planningDivRef.current;
    if (
      div &&
      div.offsetHeight !== undefined &&
      div.scrollTop !== undefined &&
      div.scrollHeight !== undefined &&
      div.offsetHeight + div.scrollTop + 1 >= div.scrollHeight
    ) {
      if (page === maxPage) return;
      setpage(prev => prev + 1)
    }
  }

  useEffect(() => {
    const div = planningDivRef.current;
    if (!div) return;

    div.addEventListener("scroll", handleScroll);

    return () => {
      div.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div className="w-full max-h-[60vh] overflow-y-auto" ref={planningDivRef}>
      <div className="grid grid-cols-[1.5fr_repeat(5,1fr)] w-full">
        <div className="p-2 flex justify-center font-bold text-sm text-gray-800 bg-[#fff] mx-2 mt-2 rounded-[10px] text-center sticky top-0 border border-white ">
          <div className="flex items-center justify-between gap-2 w-full">
            <button onClick={previousWeek}>
              <ArrowIcon />
            </button>
            <span className="text-grey text-[14px]">
              {getMonthName(referenceDate)} {referenceDate.getFullYear()}
            </span>
            <button onClick={nextWeek} className="rotate-180">
              <ArrowIcon />
            </button>
          </div>
        </div>
        {days.map((day, i) => (
          <div
            key={i}
            className="p-2 font-bold text-sm text-gray-800 flex justify-center items-center bg-[#fff] mx-2 mt-2 rounded-[10px] sticky top-0 border border-white "
          >
            {day}
          </div>

        ))}

        {userPlanning.map((user, userIndex) => (
          <div key={`${user.id}-page-${page}-index-${userIndex}`} className="contents">
            <div className="flex items-center gap-3 p-2">
              <img
                src={user.photo_profil ? getFile(user.photo_profil) : "/images/usProfil.jpg"}
                alt={`${user.firstname} ${user.lastname}`}
                width={30}
                height={30}
                className="rounded-full w-[30px] h-[30px] object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-[#3A5F6E]">
                  {user.firstname} {user.lastname}
                </div>
                <div className="text-xs text-[#3A5F6E]">{user.role}</div>
              </div>
            </div>

            {user.planning.map((currentStatus, index) => (
              <div
                key={`${user.id}-${index}`}
                className={`flex items-center justify-center text-[12px] text-white font-semibold bg-[#FFFFFF66] mx-2 mt-2 rounded-[10px]`}
                onClick={() => {
                  const clickedDate = new Date(referenceDate);
                  let addedDays = 0;

                  while (addedDays < index) {
                    clickedDate.setDate(clickedDate.getDate() + 1);
                    const day = clickedDate.getDay();
                    if (day >= 1 && day <= 5) {
                      addedDays++;
                    }
                  }

                  const thisDate = clickedDate.toISOString().split("T")[0];

                  // console.log({ currentStatus, user, thisDate });
                  setCurrentStatus(currentStatus as AvailabilityType)
                  setCurrentDate(thisDate);
                  setParametter(user);
                  setCreatePlanning(user, thisDate)
                  currentStatus === "Off" && setOpen(true);
                  currentStatus === "Disponible" && toogleSide("Create")
                }}
              >
                <span
                  className={`${statusColors[currentStatus]} cursor-pointer h-[32px] w-[32px] rounded-[10px]`}
                />
              </div>
            ))}
          </div>
        ))}

      </div>

      <PlanningModal
        open={open}
        setOpen={setOpen}
        parametter={parametter}
        currenStatus={currentStatus}
        currentDate={currentDate}
      />
    </div>
  );
}
