// import { FileMutlipleType } from '@/providers/CreateRecordProvider';
import { InstallerpayloadType } from '@/types/installerTypes';
import { ExtractedDataItem, GetRecordParams, RecordImportFilePayload, RecordPayload, Statuses, FileMasse, OtherFilesType, TraFicheType, ApiResponse } from '@/types/recordType';
import { InstallerUser } from '@/types/userType';
import axios from '@/utils/axiosConfig';
import { addQueryToUrl } from '@/utils/commonUtils';
import { txt } from '@/utils/texts';
import { AxiosProgressEvent } from 'axios';
import { toast } from 'react-toastify';

type GenericItem = { [key: string]: any };


export const createRecordApi = async (payload: RecordPayload) => {
  try {
    const allItems: GenericItem[] = Object.entries(payload.items)
      .filter(([, arr]) => Array.isArray(arr))
      .flatMap(([, arr]) =>
        (arr as GenericItem[]).map(obj => {
          const cleaned: GenericItem = {};
          for (const key in obj) {
            if (obj[key] != null) { // filtre null ET undefined
              cleaned[key] = obj[key];
            }
          }
          return cleaned;
        })
      );


    const parsePayload = {
      ...payload,
      // items: Object.values(payload.items).filter(item => item !== null)
      items: allItems
    }
    const response = await axios.post('/installateur/v1/create_dossier', parsePayload);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const createRecordApiv4 = async (payload: RecordPayload) => {
  try {
    const allItems: GenericItem[] = Object.entries(payload.items)
      .filter(([, arr]) => Array.isArray(arr))
      .flatMap(([, arr]) =>
        (arr as GenericItem[]).map(obj => {
          const cleaned: GenericItem = {};
          for (const key in obj) {
            if (obj[key] != null) { // filtre null ET undefined
              cleaned[key] = obj[key];
            }
          }
          return cleaned;
        })
      );


    const parsePayload = {
      ...payload,
      // items: Object.values(payload.items).filter(item => item !== null)
      items: allItems
    }
    const response = await axios.post('/installateur/v4/create_folder', parsePayload);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};



export const createRecordMasseApi = async (payloadMass: RecordPayload[]) => {
  try {
    const response = await axios.post('/installateur/create_dossier_mass', payloadMass);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}

export const createFileMassApi = async (
  payload: FileMasse,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData();

  payload.restrictedFiles.forEach((file) => {
    formData.append('restricted_files', file, (file as any).webkitRelativePath || file.name);
  });
  payload.otherFiles.forEach((file) => {
    formData.append('other_files', file, (file as any).webkitRelativePath || file.name);
  });
  formData.append('dossiers', JSON.stringify(payload.dossiers));
  formData.append('type_formulaire', payload.type_formulaire);

  try {
    const response = await axios.post('/installateur/upload_mass', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const createFileMassApiv4 = async (
  payload: FileMasse,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData();
  
  payload.restrictedFiles.forEach((file) => {
    formData.append('restricted_files', file, (file as any).webkitRelativePath || file.name);
  });
  payload.otherFiles.forEach((file) => {
    formData.append('other_files', file, (file as any).webkitRelativePath || file.name);
  });
  formData.append('dossiers', JSON.stringify(payload.dossiers));
  formData.append('contrat_id', String(payload.contrat_id));
  formData.append('type_formulaire', payload.type_formulaire);
  try {
    const response = await axios.post('/installateur/v4/create_file/mass', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};


export const uploadOtherFilesSingleDossierApi = async (
  payload: OtherFilesType,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const formData = new FormData();

    // Ajoute le job_id dans le formData
    formData.append('job_id', payload.job_id);

    // Ajoute tous les fichiers dans formData, un par un
    payload.other_files.forEach((file: File) => {
      formData.append('other_files', file); // nom du champ côté backend (à adapter si besoin)
    });

    const response = await axios.post("/installateur/upload-other-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l’upload des fichiers :", error);
    throw error;
  }
};

export const updateRecordApi = async (dossier_id: number, payload: Record<string, any>) => {
  try {
    const response = await axios.put(`/installateur/update_dossier/${dossier_id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};


export const updateFileStatusApi = async (file_id: number, status_code: Statuses) => {
  try {
    const response = await axios.put(`/installateur/update_status_file/${file_id}`, { status_code });
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}

export const getInfosExtractDataApi = async (file_id: number) => {
  try {
    const response = await axios.get(`/extract/get-file-data/${file_id}`);
    return response.data;
  }catch (error) {
    console.error('Error fetching data:', error);   
    throw error;
  }
}

export const getRecordApi = async (params: GetRecordParams) => {
  try {
    const url = addQueryToUrl('/installateur/get_dossier_user', params);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const getRecordByIdApi = async (id: number) => {
  try {
    const response = await axios.get(`/installateur/get_information_folder/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const getRecordMetricInstallerApi = async (installateur?: number) => {
  try {
    const response = await axios.get('/installateur/get_dossier_count', {
      params: installateur ? { installateur } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getRecordMetricAnalystApi = async () => {
  try {
    const response = await axios.get('/controlleur/statistics_dossier');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

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

export const updateInformationV1FileApi = async (job_id: string, type_formulaire: string, items: ExtractedDataItem[]) => {
  try {
    const response = await axios.put(`/installateur/update_information_file/${job_id}`, { type_formulaire, items });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const computeScoreApi = async (job_id: string, form_type: string) => {
  try {
    const response = await axios.post(`/installateur/compute_score`, { job_id, type_formulaire: form_type });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
};

export const uploadRecordFilev4 = async (key: keyof RecordImportFilePayload, value: File, type_formulaire: string, job_id: string, dossier_id?: string) => {
  const formData = new FormData();
  formData.append("file", value);
  formData.append("type_file", key);  
  formData.append("type_formulaire", type_formulaire);
  formData.append("job_id", job_id);
  if (dossier_id) {
    formData.append("dossier_id", dossier_id);
  }

  try {
    const response = await axios.post('/installateur/v4/create_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

    export const uploadRecordFileMassTRA_EQ_114 = async (
      payload: FileMasse,
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ) => {
      const formData = new FormData();

      payload.restrictedFiles.forEach((file) => {
        formData.append('restricted_files', file, (file as any).webkitRelativePath || file.name);
      });
      payload.otherFiles.forEach((file) => {
        formData.append('other_files', file, (file as any).webkitRelativePath || file.name);
      });
      formData.append('dossier', JSON.stringify(payload.dossiers));
      formData.append('type_formulaire', payload.type_formulaire);

      try {
        const response = await axios.post('/extract/extract-mass-tra-eq', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress,
        });

        return response.data;
      } catch (error) {
        console.error('Error uploading files:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
      }
    };

export const uploadRecordFileTRA_EQ_114 = async (payload: TraFicheType): Promise<Record<string, any>> => {
  const formData = new FormData();
  

  if (payload.job_id) formData.append("job_id", payload.job_id);
  if (payload.contrat_id) formData.append("contrat_id", String(payload.contrat_id));
  if (payload.type_formulaire) formData.append("type_formulaire", payload.type_formulaire);
  const appendFiles = (key: string, files?: File[] | null) => {
    if (files && files.length > 0) {
      files.forEach(file => formData.append(key, file));
    }
  };
  if(payload.type_formulaire === "TRA_EQ_117") {
    appendFiles('file_precarite', payload.file_precarite);
  }


  appendFiles('file_devis', payload.file_devis);
  appendFiles('file_facture', payload.file_facture);
  appendFiles('file_attestation', payload.file_attestation);
  appendFiles('file_immatriculation', payload.file_immatriculation);

  try {
    const response = await axios.post('/extract/store_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data as Record<string, any>;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};


export const uploadRecordFilev2Api = async (key: keyof RecordImportFilePayload, value: File, type_formulaire: string, job_id: string, dossier_id?: string) => {
  const formData = new FormData();
  formData.append("file", value);
  formData.append("type_file", key);
  formData.append("type_formulaire", type_formulaire);
  formData.append("job_id", job_id);
  if (dossier_id) {
    formData.append("dossier_id", dossier_id);
  }

  try {
    const response = await axios.post('/installateur/v2/import_fichier', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateUploadRecordFilev2Api = async (key: keyof RecordImportFilePayload, value: File, type_formulaire: string, job_id: string, file_id: number) => {
  const formData = new FormData();
  formData.append("file", value);
  formData.append("type_file", key);
  formData.append("type_formulaire", type_formulaire);
  formData.append("job_id", job_id);

  try {
    const response = await axios.put(`/installateur/update_extract/${file_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


export interface InstallaterListFilters {
  page: number;
  per_page: number;
  [key: string]: string | number | boolean | undefined;
}

export interface InstallaterListResponse {
  users: InstallerUser[];
  pagination: {
    total_pages: number;
    total_items: number;
  };
}

export async function getInstallaterList(
  filters: InstallaterListFilters
): Promise<InstallaterListResponse> {
  try {
    const response = await axios.get("/users/installer/list", {
      params: filters,
    });

    return response.data;
  } catch (error: any) {
    console.error("Erreur API getInstallaterList:", error);
    throw error.response?.data || error.message;
  }
}

export const getInstallateurList = async (params?: InstallerpayloadType) => {
  try {
    const response = await axios.get("/users/installer/list", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Une erreur est survenue", error);
  }
};

export const getDataRecap = async (jobId: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`/extract/get-recaputilative/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recap data:', error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}

export const updateStatusRecap = async (jobId: string, status_code: string): Promise<ApiResponse> => {
  try {
    const response = await axios.put(`/extract/update-status-recap/${jobId}`, { status_code });
    return response.data;
  } catch (error) {
    console.error('Error updating recap status:', error);    
    throw error;
  }
}


export const updateCSVFile = async (jobId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try{
    const response = await axios.put(`/extract/update-file-recap/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  }catch(error){
    console.error('Error updating CSV file:', error);    
    throw error;
  }
}