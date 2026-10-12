import { GetRecordParams, RecordImportFilePayload, RecordPayload } from '@/types/recordType';
import axios from '@/utils/axiosConfig';
import { addQueryToUrl } from '@/utils/commonUtils';
import { getErrrorMessage } from '@/utils/getErrorPermission';
import { txt } from '@/utils/texts';
import { toast } from 'react-toastify';

export const createRecordApi = async (payload: RecordPayload) => {
    try {
        const parsePayload = {
            ...payload,
            items: Object.values(payload.items).filter(item => item !== null)
        }
        const response = await axios.post('/installateur/create_dossier', parsePayload);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const getExportMachineDataApi = async (file_id: number) => {
    try {
        const response = await axios.get(`/controlleur/get_data_file/${file_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}

export const getRecordMetricControllererApi = async () => {
    try {
        const response = await axios.get('/controlleur/get_count_dossier');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const getRecordApi = async (params: GetRecordParams) => {
    try {
        const url = addQueryToUrl('/controlleur/get_all_dossier', params);
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        getErrrorMessage(error)

        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};


export const getInformationFileApi = async (job_id: string) => {
    try {
        const response = await axios.post('/installateur/get_information_file', { job_id });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const postCommentApi = async (file_id: number, comment: string) => {
    try {
        const response = await axios.post('/controlleur/post_commentaire', { file_id, comment });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};


export const getCommentByFileIdApi = async (file_id: number) => {
    try {
        const response = await axios.get(`/controlleur/get_comment/${file_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        // toast.error(txt.serverErrorMessage);
        // throw error;
    }
};


export const createCorrectionApi = async (file_id: number, correction_value: string, variable: string, infos: string) => {
    try {
        const response = await axios.post('/controlleur/create_correction', { file_id, correction_value, variable, infos });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const getExportMachineApi = async (job_id: string[], type_formulaire: string) => {
    try {
        const url = addQueryToUrl('/controlleur/get_export_machine', { job_id, type_formulaire });
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const createExportMachineApi = async (job_id: string, type_formulaire: string) => {
    try {
        const response = await axios.post('/controlleur/export_machine', { job_id, type_formulaire });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const getInformationV1FileApi = async (job_id: string, file_type: keyof RecordImportFilePayload) => {
    try {
        const response = await axios.post('/installateur/v1/get_information_file', { job_id, file_type });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const uploadRecordFilesApi = async (key: keyof RecordImportFilePayload, value: File, type_formulaire: string) => {
    const formData = new FormData();
    formData.append(key, value);
    formData.append("type_formulaire", type_formulaire);

    try {
        const response = await axios.post('/installateur/import_fichier', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const uploadRecordFileApi = async (key: keyof RecordImportFilePayload, value: File, type_formulaire: string, job_id: string) => {
    const formData = new FormData();
    formData.append("file", value);
    formData.append("type_file", key);
    formData.append("type_formulaire", type_formulaire);
    formData.append("job_id", job_id);

    try {
        const response = await axios.post('/installateur/v1/import_fichier', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const postBonus = async (bonus: number) => {
  try {
    const res = await axios.post('/controlleur/post_bonus',
      { bonus },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Erreur lors de l'envoi du bonus";
    throw new Error(message);
  }
};
export const updateThresholdController = async (userId: number, daily_dossier_threshold:number) => {
    try {
        const response = await axios.post(`/users/daily-dossier-threshold/${userId}`, { daily_dossier_threshold});
        return response.data;
    } catch (error) {
        console.error('Error updating threshold:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
}
