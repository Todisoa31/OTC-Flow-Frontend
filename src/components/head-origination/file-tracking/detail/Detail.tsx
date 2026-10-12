"use client";

import { useTitle } from "@/providers/TitleProvider";
import DocumentsContent from "./DocumentsContent";
import { useEffect, useState } from "react";
import TitleWithBack from "@/components/TitleWithBack";
import { useParams } from "next/navigation";
import { getRecordByIdApi } from "@/api/recordInstallerApi";
import { FolderOutputType } from "@/types/folderType";
import RightDetailFileMonitoring from "./historique";
import { HEAD_ORIGINATION_FILE_TRACKIN_ROUTE } from "@/constants/routes";
import HeaderDetailFileMonitoring from "@/components/StatusDossier/resumeDossier/HeaderDetailFileMonitoring";
import ContratDossier from "@/components/StatusDossier/resumeDossier/ContratDossier";
import { Statuses } from "@/types/recordType";
import DetailDossier from "@/components/StatusDossier/resumeDossier/DetailDossier";

export default function FileMonitoringDetailPage() {
    const { setTitle } = useTitle();
    const { folder_id } = useParams();

    const [folder, setFolder] = useState<FolderOutputType>();

    const getFolderDetail = async () => {
        if (folder_id) {
            try {
                const res = await getRecordByIdApi(Number(folder_id));
                setFolder(res);
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        setTitle(<TitleWithBack title={"Détail du Dossier"} selectPage={HEAD_ORIGINATION_FILE_TRACKIN_ROUTE} />);
        getFolderDetail();
    }, [folder_id]);

   if(folder) return(<DetailDossier folder={folder} />); 
};