// src/api/authorisationApi.ts
import { toast } from 'react-toastify';
import { txt } from '@/utils/texts';
import axiosInstance from '@/utils/axiosConfig';
import { addQueryToUrl } from '@/utils/commonUtils';

export interface Feature {
  id: number;
  name: string;
  description: string;
  code: string;
}

export interface RolePermissionsResponse {
  role: {
    id: number;
    name: string;
  };
  features: {
    [featureId: string]: {
      read: boolean;
      edit: boolean;
    };
  };
}

export const getProfilesApi = async () => {
  try {
    const response = await axiosInstance.get('/authorisation/profiles');
    return response.data as Array<{ id: number; name: string; description: string; code: string }>;
  } catch (error) {
    console.error('Error fetching data (get profiles):', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const getFeaturesApi = async () => {
  try {
    const response = await axiosInstance.get<Feature[]>('/authorisation/features');
    return response.data;
  } catch (error) {
    console.error('Error fetching data (get features):', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

/**
 * Récupère pour un rôle donné l’objet { role: {id,name}, features: { "1": {read,edit}, ... } }
 */
export const getRolePermissionsApi = async (roleId: number) => {
  try {
    const response = await axiosInstance.get<RolePermissionsResponse>(
      `/authorisation/list?role_id=${roleId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data (get role permissions):', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

/**
 * Envoie payload = { role: { id, name }, features: { "1": {read,edit}, ... } }
 */
export const assignPermissionsApi = async (payload: {
  role: { id?: string; name: string };
  features: { [featureId: string]: { read: boolean; edit: boolean } };
}) => {
  try {
    const response = await axiosInstance.post('/authorisation/assign_permissions', payload);
    return response.data;
  } catch (error) {
    console.error('Error posting data (assign permissions):', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const createRoleApi = async (payload: {
  role: { name: string };
  features: { [featureId: string]: { read: boolean; edit: boolean } };
}) => {
  try {
    const response = await axiosInstance.post('/authorisation/create_authorization', payload);
    return response.data;
  } catch (error) {
    console.error('Error posting data (assign permissions):', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};


export const guestToken = async(dashboard_id: number) => {
  try {
    const url = addQueryToUrl('/users/generate-token-guest', {dashboard_id});
    const response = await axiosInstance.post(url);
    return response;
  } catch (error) {
    console.error('Error fetching guest token:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}