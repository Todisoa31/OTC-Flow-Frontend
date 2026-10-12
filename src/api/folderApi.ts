import { GlobalParamsType } from "@/types/folderType";
import { FolderWorklogPayloadType } from "@/types/general";
import axiosInstance from "@/utils/axiosConfig";

export const GetFolders = async (params?: GlobalParamsType) => {
    try {
        const response = await axiosInstance.get('/controlleur/get_all_dossier', {
            params
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getCountFolder = async () => {
    try {
        const response = await axiosInstance.get('/controlleur/count_dossiers');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getFolderCountReferent = async () => {
    return axiosInstance.get('/referent/get_dossier_count_controllers')
};

export const deleteFolderApi = async (folder_id: number) => {
    return axiosInstance.delete(`/dossier/delete/${folder_id}`);
};

export const folderWorklog = async (payload: FolderWorklogPayloadType) => {
    return axiosInstance.post('/dossier/worklogs/add', payload);
};