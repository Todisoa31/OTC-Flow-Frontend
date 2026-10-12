"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { GetAuditLog } from "@/api/audit";
import CenterSpinner from "@/components/loader/CenterSpinner";
import RecordDetailChat from "@/components/record-detail/RecordDetailChat";
import { ActivityLogType } from "@/types/auditType";
import { formatTimestamp } from "@/utils/getHourMinute";
import { useParams } from "next/navigation";
import HistoriqueDossier from "@/components/StatusDossier/resumeDossier/HistoriqueDossier";


export default function HistoriqueSide() {
    const [selectedMenu, setSelectedMenu] = useState<"historique" | "conversation">("historique");
    const [folderHistory, setFolderHistory] = useState<ActivityLogType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { folder_id } = useParams()

    useEffect(() => {
        const getHistory = async () => {
            setLoading(true);
            try {
                const res = await GetAuditLog({
                    per_page: 999999,
                    page: 1,
                    folder_id: Number(folder_id),
                });
                setFolderHistory(res?.data || []);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'historique :", error);
            } finally {
                setLoading(false);
            }
        };

        getHistory();
    }, [selectedMenu, folder_id]);

    const MenuButton = ({
        label,
        value,
    }: {
        label: string;
        value: "historique" | "conversation";
    }) => (
        <button
            onClick={() => setSelectedMenu(value)}
            className={`p-2 rounded-[10px] w-[150px] font-bold ${selectedMenu === value ? "bg-black text-white" : "bg-transparent text-black"
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-[30px] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <MenuButton label="Historique" value="historique" />
                <MenuButton label="Conversation" value="conversation" />
            </div>

            {selectedMenu === "historique" ? (
                <HistoriqueDossier
                    folderHistory={folderHistory}
                    loading={loading}
                />
            ) : (
                <RecordDetailChat
                    hideTitle
                    folder_id_props={Number(folder_id)}
                    custopm_width="w-full"
                    hideInput
                />
            )}

        </div>
    );
}