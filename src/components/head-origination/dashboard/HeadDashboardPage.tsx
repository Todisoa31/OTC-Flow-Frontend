"use client";

import { useTitle } from "@/providers/TitleProvider";
import FileMonitoringSection from "./fileMonitoring";
import DashboardHeadOriginationHeader from "./header";
import LastActions from "./lastAction";
import { useEffect } from "react";

export default function HeadDashboardPage() {

    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Tableau de bord");
    }, []);

    return (
        <div className=" p-[30px] w-full flex flex-col gap-6">
            <DashboardHeadOriginationHeader />
            <LastActions />
            <FileMonitoringSection />
        </div>
    )
}