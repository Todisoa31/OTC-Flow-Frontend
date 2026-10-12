"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import TitleWithBack from "@/components/TitleWithBack";
import { useParams } from "next/navigation";
import { getRecordByIdApi } from "@/api/recordInstallerApi";
import { FolderOutputType } from "@/types/folderType";

import DocumentsContent from "./components/documentsContent";
import Historique from "./components/historique";
import HeaderDetailFileMonitoring from "@/components/StatusDossier/resumeDossier/HeaderDetailFileMonitoring";
import ContratDossier from "@/components/StatusDossier/resumeDossier/ContratDossier";
import DetailDossier from "@/components/StatusDossier/resumeDossier/DetailDossier";

export default function FileDetailToProcessPage() {
    const { setTitle } = useTitle();
    const { folder_id } = useParams();

    const [folder, setFolder] = useState<FolderOutputType>();

    const getFolderDetail = useCallback(async () => {
        if (folder_id) {
            try {
                const res = await getRecordByIdApi(Number(folder_id));
                setFolder(res);
            } catch (error) {
                console.error(error);
            }
        }
    }, [folder_id]);

    useEffect(() => {
        setTitle(<TitleWithBack title={"Détail du Dossier"} />);
        getFolderDetail();
    }, [folder_id, setTitle, getFolderDetail]);

    if(folder) return(<DetailDossier folder={folder} />);   
};