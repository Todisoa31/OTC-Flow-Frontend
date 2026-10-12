
import { SubcontractorInputType, UserInstallerUpdateType } from '@/types/userType';
import axiosInstance from '@/utils/axiosConfig';
import axios from '@/utils/axiosConfig';
import { txt } from '@/utils/texts';
import { toast } from 'react-toastify';

export const getUserInfoApi = async () => {
    try {
        const response = await axios.get('/users/get_user');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        // toast.error(txt.serverErrorMessage);
        return null
    }
};


export const getUserInstalleur = async (user_id: number) => {
    try {
        const response = await axiosInstance.get(`/users/installer/${user_id}`);
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const addSubcontractorApi = async (user_id: number, payload: SubcontractorInputType) => {
    try {
        return await axiosInstance.post(`/users/installer/add_subcontractor/${user_id}`, payload);
    } catch (error) {
        console.error("une erreur s'est produite lors de l'ajout du sous-traitant", error);
        toast.error("Une erreur s'est produite lors de l'ajout du sous-traitant.");
    }
};

export const updateUserInstallerApi = async (user_id: number, payload: UserInstallerUpdateType) => {
    try {
        const formData = new FormData();

        // Ajoute chaque champ non nul au formData
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        });

        return await axiosInstance.put(`/users/installer/update/${user_id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors de la mise à jour de l'installateur", error);
        toast.error("Une erreur s'est produite lors de la mise à jour des informations de l'utilisateur.");
    }
};

export const updateSubcontractorApi = async (subcontractor_id: number, payload: SubcontractorInputType) => {
    try {
        return axiosInstance.put(`/subcontractors/${subcontractor_id}`, payload);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la mise à jour du sous-traitant", error);
        toast.error("Une erreur s'est produite lors de la mise à jour du sous-traitant.");
    }
}

export const deleteSubcontractor = async (subcontractor_id: number) => {
    try {
        return await axiosInstance.delete(`/subcontractors/delete/${subcontractor_id}`)
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression du sous-traitant", error);
        toast.error("Une erreur s'est produite lors de la suppression du sous-traitant.");
    }
};