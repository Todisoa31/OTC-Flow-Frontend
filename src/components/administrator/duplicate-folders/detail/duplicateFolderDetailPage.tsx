"use client";

import TitleWithBack from "@/components/TitleWithBack";
import { ADMIN_DUPLICATE_FOLDERS_ROUTE } from "@/constants/routes";
import { useTitle } from "@/providers/TitleProvider";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import HeaderDuplicateFolderDetail from "./components/header";
import SimilarSubmission from "./components/similarSubmission";
import HistoriqueSide from "./components/historySide";

export default function DuplicateFolderDetailPage() {
    const { setTitle } = useTitle();
    const { folder_id } = useParams();

    useEffect(() => {
        setTitle(<TitleWithBack title={`Nom du dossier`} selectPage={ADMIN_DUPLICATE_FOLDERS_ROUTE} />)
    }, []);

    return (
        <div className="  flex w-full">
            <div className=" w-[75%] h-[86vh] flex-col">
                <HeaderDuplicateFolderDetail />
                <SimilarSubmission/>
            </div>
            <div className=" w-[25%] ">
                <HistoriqueSide/>
            </div>
        </div>
    )
}