"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect } from "react";
import DashboardAdminHeader from "./components/header";
import LastActions from "./components/lastAction";
import FileMonitoringSection from "./components/fileMonitoring";
import SupersetClientWrapper from "@/components/Superset/SupersetClientWrapper";

export default function DashboardAdminPage() {

    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Tableau de bord");
    }, [setTitle]);


    return (
        <div className=" p-[30px] w-full flex flex-col gap-6">
            <DashboardAdminHeader />
            <LastActions />
            <SupersetClientWrapper
              id={14}  // Assuming the ID is 14, adjust as necessary
            />
            {/* <FileMonitoringSection/> */}
        </div>
    )
};