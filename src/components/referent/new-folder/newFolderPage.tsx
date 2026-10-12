"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect } from "react";

export default function NEwFolderPage() {
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Répartition Charge");
    }, [])

    return (
        <div className=" p-[30px]">
            Nouveau dossier
        </div>
    )
}