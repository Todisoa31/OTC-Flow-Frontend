import axiosInstance from "@/utils/axiosConfig";
import { addQueryToUrl } from '@/utils/commonUtils';
import { AxiosError, AxiosProgressEvent } from "axios";
import axios from '@/utils/axiosConfig';
import { ContractListPayload, ContractPayload, ContratAndAvenantsProps, DetailContratProps, UpdateContractType } from "@/types/contratType";
import { toast } from "react-toastify";

// Type du contrat
export interface ContractStatus {
  title: string;
  color_text: string;
  color_background: string;
}

// export interface Contract {
//   id: number | string;
//   status: ContractStatus;
//   secteurs?: { name: string }[];
//   volume?: string;
//   type?: string;
//   prix?: string;
//   date_debut?: string;
//   date_fin?: string;
//   [key: string]: any;
// }

export const addContratFileApi = async (
  installateur_id: number,
  file_contrat: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("installateur_id", installateur_id.toString());
    formData.append("file_contrat", file_contrat);

    const response = await axiosInstance.post("/contrat/import_contract", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'import du contrat :", error);
    toast.error("Erreur lors du traitement du contrat, veuillez réessayer");
    throw error?.response?.data || error;
  }
}

// Appel API pour récupérer les détails d’un contrat
export const getContratInfo = async (contractId: number): Promise<DetailContratProps | null> => {
  try {
    const { data } = await axiosInstance.get(`/contrat/detail/${contractId}`);
    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erreur API getContratInfo :", err.response?.data || err.message);
    return null;
  }
};

// Appel API pour récupérer les contrats liés à un utilisateur
export const getContratInfoForAnUser = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/contrat/contrat_user`, {
      params: { user_id: userId },
    });
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      console.warn("Réponse inattendue :", response);
      return null;
    }
  } catch (error: any) {
    console.error("Erreur API getContratInfoForAnUser:", error?.response || error?.message || error);
    return null;
  }
};

// Appel API pour mettre à jour un contrat existant
export const updateContratAPI = async (contract_id: number | string, payload: ContractPayload): Promise<DetailContratProps> => {
  try {
    const response = await axiosInstance.put(`/contrat/update/${contract_id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Erreur API updateContratAPI :", error?.response || error?.message || error);
    throw error?.response?.data || error;
  }
};

export const updateContratv2API = async (contract_id: number, payload: UpdateContractType) => {
  try {
    const response = await axiosInstance.put(`/contrat/update/${contract_id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Erreur API updateContratAPI :", error);
    toast.error("Une erreur s'est produite lors de mis a jour du contrat")
  }
};



export const getContractDetail = async (contract_id: number) => {
  const res = await axiosInstance.get(`/contrat/detail/${contract_id}`);
  return res.data
}

export const getContratApi = async (user_id: number) => {
  try {
    const url = addQueryToUrl('/contrat/contrat_user', { user_id });
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
  }
}


export const getDetailContratApi = async (contratId: number | null | undefined) => {
  if (!contratId) {
    console.error("Contract ID is required to fetch contract details.");
    return null;
  }
  try {
    const response = await axiosInstance.get(`/contrat/detail/${contratId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contract details:", error);
    throw error;
  }
};

export const GetContractListWithParams = async (payload?: ContractListPayload) => {
  return await axiosInstance.get('/contrat/list', {
    params: payload
  })
};

// Appel API pour ajouter ou mettre à jour une fiche opération liée à un contrat
export const addContratAPI = async (
  id_contrat: number | string,
  payload: any
): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/contrat/fiche-op/add-or-update/${id_contrat}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Erreur API addContratAPI:", error?.response || error?.message || error);
    throw error?.response?.data || error;
  }
};
export const GetContratType = async () => {
  return axiosInstance.get('/contrat/get-type-contrat');
};

export const GetOverviewContract = async () => {
  return axiosInstance.get('/contrat/overview');
};

export const addAvenant = async (
  contractId: number,
  installateurId: number,
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<any> => {
  const formData = new FormData();
  formData.append('installateur_id', installateurId.toString());
  formData.append('file_avenant', file);

  try {
    const response = await axios.post(
      `/contrat/import-avenant/${contractId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      }
    );
    return response.data;
  } catch {
    // Erreurs inattendues
    throw new Error('Erreur inconnue lors de l’import de l’avenant.');
  }
};

// Appel API pour récupérer les avenants d’un contrat
export const getAvenantsForUser = async (contractId: number): Promise<ContratAndAvenantsProps> => {
  try {
    const response = await axiosInstance.get(`/contrat/avenant/list/${contractId}`);

    // Ta réponse est dans response.data.data
    const data = response.data;

    // Vérifie que data est bien un objet avec avenants et contrat_principale
    if (response.status === 200 && data && typeof data === 'object' && !Array.isArray(data)) {
      return data as ContratAndAvenantsProps;
    } else {
      console.warn("Format de réponse inattendu :", data);
      // Renvoie un objet vide conforme au type pour éviter erreur
      return { avenants: [], contrat_principale: {} as DetailContratProps };
    }
  } catch (error: any) {
    console.error("Erreur API getAvenantsForUser:", error?.response || error?.message || error);
    return { avenants: [], contrat_principale: {} as DetailContratProps };
  }
};

// Appel API pour supprimer fiche_op d’un contrat
export const deleteFicheOp = async (contractId: number, payload: Record<string, any>) => {
  // const payload = {
  //   contrat_fiche_op: {
  //     [`fiche_op_${sector}_applicable`]: "",
  //   },
  // };

  const { data } = await axios.delete(
    `/contrat/fiche-op/delete/${contractId}`,
    { data: payload }
  );
  
  return data;
};

export const DeleteContractApi = async (contractId: number) => {
  const { data } = await axios.delete(
    `/contrat/delete-contrat/${contractId}`,
  );
  
  return data;
};