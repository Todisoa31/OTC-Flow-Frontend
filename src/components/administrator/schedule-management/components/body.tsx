"use client";

import { PlaningFilterType } from "@/types/general";
import PlanningContent from "./planningContent";
import { useState } from "react";

type Props = {
  filter: PlaningFilterType;
  search: string;
}

export default function PlanningBody({ filter, search }: Props) {
  const [currentDate, setCurrentDate] = useState(getMonday(new Date()));

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const previousWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const startOfWeek = new Date(currentDate);
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(startOfWeek.getDate() + 4);

  const formatDate = (date: Date) =>
    `${date.getDate().toString().padStart(2, "0")} ${getMonthName(date)}`;

  // const weekNumber = getWeekNumber(startOfWeek);

  return (
    <div className="flex flex-col p-[30px] gap-4">
      <div className="flex justify-between">
        <h3 className="text-[#101828] text-[16px] font-bold">
          Semaine du {formatDate(startOfWeek)} au {formatDate(endOfWeek)}
        </h3>
        <div className="flex items-center gap-4">
          <div className=" flex items-center gap-2">
            <span className=" h-[20px] w-[20px] rounded-[3px] bg-[#65BFAA]"></span>
            <span className=" text-[#646E81] text-[14px]">Disponible</span>
          </div>

          <div className=" flex items-center gap-2">
            <span className=" h-[20px] w-[20px] rounded-[3px] bg-[#FCC567]"></span>
            <span className=" text-[#646E81] text-[14px]">Off</span>
          </div>
        </div>
      </div>
      <PlanningContent
        referenceDate={startOfWeek}
        previousWeek={previousWeek}
        nextWeek={nextWeek}
        filter={filter}
        search={search}
      />
    </div>
  );
}

// Utilitaires
function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day; // Lundi
  d.setDate(d.getDate() + diff);
  return d;
}

function getMonthName(date: Date) {
  return date.toLocaleDateString("fr-FR", { month: "long" });
}

