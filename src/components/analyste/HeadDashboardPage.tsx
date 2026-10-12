"use client";

import { useTitle } from "@/providers/TitleProvider";
import DashboardAnalystHeader from "./header";
import { useEffect } from "react";

export default function HeadDashboardPage() {

    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Tableau de bord");
    }, []);

    return (
        <div className=" p-[30px] w-full flex flex-col gap-6">
            <DashboardAnalystHeader />
        </div>
    )
}