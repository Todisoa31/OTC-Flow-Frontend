'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getHistoriqueActivite } from '@/api/auditApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

type HistoriqueItem = {
  title: string;
  description: string;
  date: string;
};

export default function HistoriqueDetailUser() {
  const { id } = useParams();
  const [historique, setHistorique] = useState<HistoriqueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        setLoading(true);
        const data = await getHistoriqueActivite(Number(id));

        if (!data) {
          setHistorique([]);
        } else if (Array.isArray(data)) {
          type ApiHistoriqueItem = {
            action_type: string;
            description?: string;
            model_name?: string;
            model_id?: string | number;
            timestamp: string;
          };

          const mapped: HistoriqueItem[] = (data as ApiHistoriqueItem[]).map((item) => ({
            title: mapActionTypeToTitle(item.action_type),
            description: item.description || `${item.model_name} #${item.model_id}`,
            date: dayjs(item.timestamp).format('DD/MM/YYYY - HH:mm'),
          }));
          setHistorique(mapped);
        } else {
          
          const item = data as unknown as { action_type: string; description?: string; model_name?: string; model_id?: string | number; timestamp: string };
          const mapped: HistoriqueItem[] = [
            {
              title: mapActionTypeToTitle(item.action_type),
              description: item.description || `${item.model_name} #${item.model_id}`,
              date: dayjs(item.timestamp).format('DD/MM/YYYY - HH:mm'),
            },
          ];
          setHistorique(mapped);
        }
      } catch {
        toast.error(`Erreur lors de la récupération de l'historique de l'utilisateur ${id}`);
        setHistorique([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHistorique();
  }, [id]);

  const mapActionTypeToTitle = (actionType: string) => {
    switch (actionType) {
      case 'CREATE':
        return 'Création';
      case 'UPDATE':
        return 'Mise à jour';
      case 'DELETE':
        return 'Suppression';
      case 'LOGIN':
        return 'Connexion';
      case 'LOGOUT':
        return 'Déconnexion';
      default:
        return 'Action';
    }
  };

  return (
    <div className="p-[30px]">
      <h2 className="text-[#101828] text-[20px] font-roboto font-bold break-words py-2">
        Historique d&#39;activité
      </h2>
      <div className="h-full py-4 overflow-y-auto flex flex-col gap-[20px]">
        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : historique.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-5 py-3 bg-[rgba(255,255,255,0.5)] shadow-[4px_4px_30px_rgba(0,0,0,0.05)] rounded-[15px] outline outline-[1.5px] outline-white backdrop-blur-[15px] flex flex-col items-center gap-2">
              « Aucune activité enregistrée pour cet utilisateur pour le moment. Il est peut-être nouveau. »
            </div>
          </div>
        ) : (
          historique.map((item, index) => (
            <div
              key={index}
              className="w-full h-full p-5 py-3 bg-[rgba(255,255,255,0.5)] shadow-[4px_4px_30px_rgba(0,0,0,0.05)] rounded-[15px] outline outline-[1.5px] outline-white backdrop-blur-[15px] flex flex-col justify-start items-start gap-2"
            >
              <div className="text-[#65A5BF] text-[14px] font-roboto font-bold leading-[18px] break-words">
                {item.title}
              </div>
              <div className="w-full text-[#3A5F6E] text-[12px] font-roboto font-medium break-words">
                {item.description}
              </div>
              <div className="w-full text-[#646E81] text-[12px] font-roboto font-medium break-words">
                {item.date}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
