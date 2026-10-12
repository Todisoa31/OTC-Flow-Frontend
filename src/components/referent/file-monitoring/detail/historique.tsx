"use client";

import { GetAuditLog } from "@/api/audit";
import RecordDetailChat from "@/components/record-detail/RecordDetailChat";
import HistoriqueDossier from "@/components/StatusDossier/resumeDossier/HistoriqueDossier";
import SwitchButtonHeadDetail from "@/components/StatusDossier/resumeDossier/SwitchButtonHeadDetail";
import { UseDetailFolderSideStore } from "@/stores/DetailFolderSideStore";
import { ActivityLogType } from "@/types/auditType";
import { ConverstionGetType } from "@/types/conversationType";
import { FolderOutputType } from "@/types/folderType";
import { useEffect, useState } from "react";

type Props = {
    folder: FolderOutputType;
}

export default function RightDetailFileMonitoring({ folder }: Props) {
    const { swicther, selectSwitcher, selectChat, setSelectChat } = UseDetailFolderSideStore();
    const [folderHistory, setFolderHistory] = useState<ActivityLogType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [conversationT, setConversationT] = useState<ConverstionGetType>("Installateur");


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
    }, [swicther])

    useEffect(() => {
        if (selectChat === "Controlleur") {             
            setUserId(folder?.assigned_by?.id ?? null);
            setConversationT("Contrôleur");
        } else if (selectChat === "Installateur") {
            setUserId(folder?.installateur?.id ?? null);
            setConversationT("Installateur")
        }
    }, [selectChat])

    // <CenterSpinner />
    return (//w-80 self-stretch p-7 bg-white/40 border-l border-white backdrop-blur-lg inline-flex flex-col justify-start items-start gap-7">

        <div className=" p-0 py-[15px] flex flex-col gap-4 bg-white/40 border-white backdrop-blur-lg">
            
              <SwitchButtonHeadDetail />
            

            {swicther === "historique" ?
                <HistoriqueDossier
                    folderHistory={folderHistory}
                    loading={loading}
                />
                :
                <div className=" flex flex-col gap-2">
                    <RecordDetailChat
                        hideTitle
                        folder_id_props={folder.id}
                        custopm_width="w-full"
                        userId={userId}
                        conversationT={'Installateur'}
                    />
                </div>

            }
        </div>
    )
};