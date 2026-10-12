"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect } from "react";
import HeaderSheadulePlaning from "./components/Header";
import PlanningBody from "./components/body";
import Info from "./components/sidebar/Info";
import { UsePlanningStore } from "@/stores/PlanningStore";
import CreateDayOff from "./components/sidebar/Create";
import UpdateDayOff from "./components/sidebar/Update";
import { useFilters } from "@/contexts/Filter/filterContext";

export default function SheduleManagementPage() {
    const { setTitle } = useTitle();
    const { currentFilter } = useFilters(); 
    const { sideType } = UsePlanningStore();

    useEffect(() => {
        setTitle("Gestion de planning");
    }, []);

    const getSidebar = () => {
        switch (sideType) {
            case 'Info':
                return <Info />
            case 'Create':
                return <CreateDayOff />
            case 'Update':
                return <UpdateDayOff />
            default:
                return <Info />
        }
    }

    return (
        <div className="flex w-full">
            <div className=" w-[75%]">
                <HeaderSheadulePlaning />
                <PlanningBody filter={currentFilter} search={currentFilter.search_text || ""} />
            </div>
            <div className=" w-[25%]">
                {getSidebar()}
            </div>
        </div>
    )
};