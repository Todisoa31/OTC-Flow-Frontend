"use client";

import { GetAuditLog } from "@/api/audit";
import Historique from "@/components/controller/file -validated/components/detail-By-File/components/historique";
import CenterSpinner from "@/components/loader/CenterSpinner";
import RecordDetailChat from "@/components/record-detail/RecordDetailChat";
import HistoriqueDossier from "@/components/StatusDossier/resumeDossier/HistoriqueDossier";
import SwitchButtonHeadDetail from "@/components/StatusDossier/resumeDossier/SwitchButtonHeadDetail";
import { UseDetailFolderSideStore } from "@/stores/DetailFolderSideStore";
import { ActivityLogType } from "@/types/auditType";
import { FolderOutputType } from "@/types/folderType";
import { formatTimestamp } from "@/utils/getHourMinute";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
    folder: FolderOutputType;
}

export default function RightDetailFileMonitoring({ folder }: Props) {
    const { swicther } = UseDetailFolderSideStore();

    const [selectedMenu, setSelectedMenu] = useState<'historique' | 'conversation'>('historique');
    const [folderHistory, setFolderHistory] = useState<ActivityLogType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getHistory = async () => {
        setLoading(true);
        try {
            const res = await GetAuditLog({
                per_page: 999999,
                page: 1,
                folder_id: folder.id
            });
            setFolderHistory(res?.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHistory()
    }, [selectedMenu])

    // <CenterSpinner />
    return (
        <div className="p-0 py-[15px] flex flex-col gap-4 bg-white/40 border-white backdrop-blur-lg">
            <SwitchButtonHeadDetail />

            {swicther  === "historique" ?
                <HistoriqueDossier
                    folderHistory={folderHistory}
                    loading={loading} />
                :
                <RecordDetailChat
                    hideTitle
                    folder_id_props={folder.id}
                    custopm_width="w-full"
                    userId={folder?.installateur?.id}
                    conversationT={'Installateur'}
                />

            }
        </div>
    )
};