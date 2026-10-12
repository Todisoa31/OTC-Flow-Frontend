"use client";

import { folderWorklog } from "@/api/folderApi";
import { CONTROLLER_ROUTE } from "@/constants/routes";
import { useAuth } from "@/providers/AuthProvider";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function CounterController() {
    const path = usePathname();
    const { user } = useAuth();
    const { folder_id, file_id } = useParams();

    const isDetailFilePath = () => {
        if (!folder_id || !file_id) return false;

        const validPaths = [
            `/controller/files-to-process/${folder_id}/file-details/${file_id}`,
            `/controller/files-to-correct/${folder_id}/file-details/${file_id}`,
            `/controller/files-validated/${folder_id}/file-details/${file_id}`
        ];

        return validPaths.includes(path);
    };

    const startCompteur = async () => {
        try {
            if (!user) return;
            await folderWorklog({
                dossier_id: Number(folder_id),
                user_id: user.id,
                event_type: 'in',
            });

        } catch (error) {
            console.error("Erreur API folderWorklog:", error);
        }
    };

    useEffect(() => {        
        if (path.startsWith(CONTROLLER_ROUTE) && isDetailFilePath() && user) {
            startCompteur();

            const intervalId = setInterval(() => {
                if (path.startsWith(CONTROLLER_ROUTE) && isDetailFilePath()) {
                    startCompteur();
                }
            }, 300000);

            return () => clearInterval(intervalId); 
        }
    }, [user, folder_id, path]);

    return null;
}
