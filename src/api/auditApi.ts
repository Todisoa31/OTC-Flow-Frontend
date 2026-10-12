
import axiosInstance from "@/utils/axiosConfig";
// import { User } from '@/types/authType';

type ApiHistoriqueItem = {
    action_type: string;
    description?: string | undefined;
    model_name?: string | undefined;
    model_id?: string | number | undefined;
    timestamp: string;
}

export const getHistoriqueActivite = async (userId: number): Promise<ApiHistoriqueItem[]> => {
  try {
    const response = await axiosInstance.get(`/audit/get_history/${userId}`);

    // Cas où l'API répond avec succès mais aucun historique
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Si ce n'est pas un tableau, c’est une anomalie
    console.warn(`Format inattendu pour l'historique utilisateur ${userId}`, response.data);
    return [];
  } catch (error: unknown) {
    type AxiosErrorWithResponse = { response?: { status?: number } };
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as AxiosErrorWithResponse).response?.status === 404
    ) {
      console.info(`Aucune activité pour l'utilisateur ${userId}.`);
      return []; // Pas d'erreur, juste pas de données
    }

    // Vraie erreur réseau ou serveur
    console.error(`Erreur récupération historique d'activité pour l'utilisateur ${userId} :`, error);
    throw error;
  }
};
