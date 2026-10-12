"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { GetAuditLog } from "@/api/audit";
import CenterSpinner from "@/components/loader/CenterSpinner";
import RecordDetailChat from "@/components/record-detail/RecordDetailChat";
import { ActivityLogType } from "@/types/auditType";
import { FolderOutputType } from "@/types/folderType";
import { formatTimestamp } from "@/utils/getHourMinute";
import HistoriqueDossier from "@/components/StatusDossier/resumeDossier/HistoriqueDossier";
import SwitchButtonHeadDetail from "@/components/StatusDossier/resumeDossier/SwitchButtonHeadDetail";
import { UseDetailFolderSideStore } from "@/stores/DetailFolderSideStore";

type Props = {
  folder: FolderOutputType;
};

/**
 * Composant affichant l'historique et la conversation liés à un dossier.
 */
export default function Historique({ folder }: Props) {  
  const [folderHistory, setFolderHistory] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { swicther } = UseDetailFolderSideStore();

  /**
   * Récupère l'historique du dossier via l'API `GetAuditLog`
   */
  useEffect(() => {
    const getHistory = async () => {
      setLoading(true);
      try {
        const res = await GetAuditLog({
          per_page: 999999,
          page: 1,
          folder_id: folder.id,
        });
        setFolderHistory(res?.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique :", error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, [folder.id]);

  /**
   * Rendu du bouton de navigation entre les onglets.
   */
 

  return (
    <div className="p-0 py-[15px] flex flex-col gap-4 bg-white/40 border-white backdrop-blur-lg">
      {/* Menu de sélection */}
      
        <SwitchButtonHeadDetail />

      {swicther === "historique" ? (
        <HistoriqueDossier
          folderHistory={folderHistory}
          loading={loading}
          />
      ) : (
        // Affiche la section conversation
        <RecordDetailChat
          hideTitle
          folder_id_props={folder.id}
          custopm_width="w-full"
          userId={folder?.installateur?.id}
          hideInput
          conversationT={'Installateur'}
        />
      )}
    </div>
  );
}