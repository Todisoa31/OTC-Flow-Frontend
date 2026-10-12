"use client";

import { useTitle } from "@/providers/TitleProvider"
import { useEffect } from "react";
import HistoryActivityLogContent from "./components/HistoryActivityLogContent";

export default function HistoryAndActivityLogPage() {

    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Historique et Journal d\'activité") 
    },[])

    return (
        <div className=" p-[30px] flex flex-col gap-4 w-full">
            <HistoryActivityLogContent/>
        </div>
    )
}