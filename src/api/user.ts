import { GetRecordParams } from '@/types/recordType';
import { ControllerDossierStatsType, CreateTeamPayload, TeamAssignment, UnasignedParams } from '@/types/teamType';
import axiosInstance from "@/utils/axiosConfig";
import axios from '@/utils/axiosConfig';
import { addQueryToUrl } from '@/utils/commonUtils';
import { toast } from 'react-toastify';
import { txt } from '@/utils/texts';
import { User } from '@/types/authType';
import { GetUsersParamsType } from '@/types/userType';
import { cp } from 'fs';
import { ChargeDetails } from '@/types/chargeType';

// Get user info
export const getUserInfo = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUsersList = async (params: GetRecordParams) => {
  try {
    const url = addQueryToUrl('/users/list', params);
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const registerUser = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    
    return response.data;
  } catch (error) {
    console.error("Erreur d'enregistrement :", error);
    throw error;
  }
};

export const getUsersByRole = async (role: string): Promise<User[]> => {
  try {
    const response = await axiosInstance.get("/users/profil", {
      params: { role },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des utilisateurs avec le rôle ${role} :`, error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<User | any> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    const data = response.data  as User;

    if (!data || typeof data !== 'object' || !('id' in data) || !('status' in data)) {
      throw new Error("Format inattendu de l'utilisateur");
    }

    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${userId} :`, error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

// Met à jour un utilisateur par ID (gère aussi les fichiers via FormData)
export const updateUserById = async (
  userId: number,
  data: {
    email: string;
    password?: string;
    role: string;
    firstname: string;
    lastname: string;
    photo_profil?: File | string;
    status?: string;
    referentId?: number;
    features?: { [featureId: number]: { read: boolean; edit: boolean } };
  }
): Promise<User> => {
  try {
    let payload: FormData | typeof data = data;
    let headers = {};

    // Si un fichier est fourni, construire un FormData
    if (data.photo_profil instanceof File) {
      const formData = new FormData();
      formData.append('email', data.email);
      if (data.password) formData.append('password', data.password);
      formData.append('role', data.role);
      formData.append('firstname', data.firstname);
      formData.append('lastname', data.lastname);
      formData.append('status', data.status || 'Actif');
      formData.append('photo_profil', data.photo_profil);

      if (data.referentId !== undefined) {
        formData.append('referentId', String(data.referentId));
      }

      if (data.features) {
        formData.append('features', JSON.stringify(data.features));
      }

      payload = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      payload = {
        ...data,
        status: data.status || 'Actif',
        referentId: data.referentId,
      };
    }

    const response = await axiosInstance.put(`/users/update/${userId}`, payload, { headers });
    toast.success('Utilisateur mis à jour avec succès !');
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId} :`, error);
    toast.error("Une erreur est survenue lors de la mise à jour.");
    throw error;
  }
};

// Supprime un utilisateur par ID
export const deleteUserById = async (userId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/delete/${userId}`);
    toast.success("Utilisateur supprimé avec succès !");
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${userId} :`, error);
    toast.error("Une erreur est survenue lors de la suppression de l'utilisateur.");
    throw error;
  }
};

// Change le statut d’un utilisateur
export const changeUserStatus = async (userId: number, status: string): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/users/change_status/${userId}`, { status });
    toast.success("Statut mis à jour avec succès !");
    return response.data;
  } catch (error) {
    console.error(`Erreur changement de statut pour l'utilisateur ${userId} :`, error);
    toast.error("Échec du changement de statut.");
    throw error;
  }
};


export const getUsersUnasigned = async (params: UnasignedParams) => {
  try {
    const url = addQueryToUrl('/users/unassigned', params);
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching unassigned users:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}


export const createNewTeam = async (data: CreateTeamPayload ): Promise<any> => {
  try {
    const response = await axiosInstance.post('/users/teams/create', data);    
    toast.success("Equipe crée avec succès !");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe :", error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}


export const getTeamListApi = async () => {
  try {
    const response = await axiosInstance.get('/users/teams/list'); 
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes :", error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const updateTeam = async(teamId: number , data: CreateTeamPayload) => {
  try {
    const response = await axiosInstance.put(`/users/teams/update/${teamId}`, {
      ...data,
    });
    toast.success("Équipe mise à jour avec succès !");
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'équipe ${teamId} :`, error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}


export const getUsersProfil = async (params: UnasignedParams) => {
  try {
    const url = addQueryToUrl('/users/profil', params);
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching profil users:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}


export const removeTeamMember = async (params: {teamId: number}): Promise<{ id: number; name: string; created_by: number; is_active: boolean; }> => {
  try {
    const response = await axiosInstance.delete(`users/teams/delete/${params.teamId}`);
    toast.success("Membre de l'équipe supprimé avec succès !");
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du membre de l'équipe ${params.teamId} :`, error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}


export const affectControlleur = async (params: TeamAssignment) : Promise<any> => {
  try{
    const response = await axios.put('/users/teams/affectation', params);
    toast.success("Contrôleur affecté avec succès !");
    return response.data;
  }catch(error) {
    console.error("Erreur lors de l'affectation du contrôleur :", error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}


export const getTeamDetail = async (teamId: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/users/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des équipes ${teamId} :`, error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};



export const getUsersV2 = async (params?: GetUsersParamsType) => {
  try {
    const response = await axiosInstance.get("/users/list", { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};


export const getControllersRetrieved = async (params: GetUsersParamsType) => {
  try {
    const url = addQueryToUrl("/users/list/retrieve_charges", params );
    const response = await axios.get(url)
    return response.data;
  } catch (error) {
    console.error('Error fetching controllers:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}

export const getDetailControllerRetrieved = async (controllerId: number) => {
  try {
    const response = await axiosInstance.get(`/users/charges-details/${controllerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching controller details for ID ${controllerId}:`, error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}


export const getChargeForAnUser = async (userId: string): Promise<ChargeDetails> => {
  try {
    const response = await axiosInstance.get(`/users/charges-details/${userId}`);
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des charges pour l'utilisateur ${userId}:`, error);
    toast.error("Erreur lors de la récupération des données. Veuillez réessayer.");
    throw error;
  }
};