"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import HeaderDuplicateFolder from "./components/header";
import { DuplicateFilterType } from "@/types/general";
import TableDuplicateFolders from "./components/table";

export default function DuplicateFolderPage() {
    const { setTitle } = useTitle();
    const [filter, setFilter] = useState<DuplicateFilterType>({
        searchText: "",
        folder_type: "",
        date_submission: ""
    })

    useEffect(() => {
        setTitle("Dossiers Doublons");
    }, []);

    return (
        <div className=" p-[30px] flex-col gap-8 w-full">
            <HeaderDuplicateFolder filter={filter} setFilter={setFilter} />
            <TableDuplicateFolders/>
        </div>
    )
}