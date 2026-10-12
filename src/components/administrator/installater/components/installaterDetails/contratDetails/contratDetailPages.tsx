"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getContratInfo } from "@/api/contrat";
import HeaderDetailContrat from "./headerDetail";
import ContentDetailContrat from "./contentDetailContrat";
import TitleWithBack from "@/components/TitleWithBack";
import CenterSpinner from "@/components/loader/CenterSpinner";
import { DownloadFile } from "@/utils/download";
import { UseAdminStore } from "@/stores/AdministratorStore";
import SideAvenant from "@/components/avenant/SideAvenant";
import { AvenantSelectionProvider } from "@/contexts/Avenant/AvenantSelectionContext";
import { useContratDetailStore } from "@/stores/ContratDetailStore";

export default function DetailContratPage() {
    const { id, contract_id } = useParams();
    const { updateContratDetail } = UseAdminStore();
    const { setTitle } = useTitle();
    const [contratData, setContratData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTrigger = useContratDetailStore((state) => state.refreshTrigger);

    useEffect(() => {
        setTitle(<TitleWithBack title="Détails Contrat" />);
    }, [setTitle]);

    // fetchData défini ici, accessible partout
    const fetchData = useCallback(async () => {
        const contract = id || contract_id

        try {
            setLoading(true);
            const contratInfo = await getContratInfo(Number(contract));
            if (!contratInfo) {
                setError("Contrat non trouvé.");
                return;
            }
            setContratData(contratInfo);
        } catch (err: any) {
            console.error(err);
            setError("Erreur lors de la récupération du contrat.");
        } finally {
            setLoading(false);
        }
    }, [contract_id, id]);

    // Chargement initial à l'ouverture ou quand `id` change
    useEffect(() => {
        if (id || contract_id) fetchData();
    }, [fetchData, id, updateContratDetail]);

    const hasRefreshed = useRef(false);

    // Recharge quand refreshTrigger change (>0)
    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchData();
            hasRefreshed.current = true;

        }
    }, [fetchData, refreshTrigger]);

    if (loading) return <div className="w-full h-[calc(100vh-90px)] overflow-y-auto p-20"><CenterSpinner /></div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!contratData) return null;

    const contratHeader = {
        name: contratData.contrat_name?.replaceAll('_', ' ') || 'Contrat sans nom',
        title: contratData.contratID,
        category: contratData.contrat_nature,
        type: contratData.contrat_type,
        rai: contratData.compte_oblige_nom_societe,
        dispositif: contratData.mf_dispositif_cee,
        duree: contratData.duree_contrat_en_mois,
        startDate: contratData.signature_date,
        dateFin: contratData.date_livraison,
    };

    return (
        <AvenantSelectionProvider>
            <div className="flex w-full">
                <div className="w-[75%] h-[calc(100vh-90px)] overflow-y-auto">
                    <div className="pb-4">
                        <HeaderDetailContrat
                            {...contratHeader}
                            onDownload={() => {
                                DownloadFile(contratData.file.file || '', contratData.file.name || 'contrat.pdf');
                            }}
                        />
                    </div>
                    <div className="px-8 py-8">
                        <ContentDetailContrat details={contratData} />
                    </div>
                </div>
                <div className="w-[25%]">
                    <SideAvenant />
                </div>
            </div>
        </AvenantSelectionProvider>
    );
}