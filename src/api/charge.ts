import { GetRecordParams } from "@/types/recordType";
import { addQueryToUrl } from "@/utils/commonUtils";
import { txt } from "@/utils/texts";
import axios from '@/utils/axiosConfig';
import { toast } from "react-toastify";

export const getAllDossierApi = async (params: GetRecordParams) => {
  try {
    const url = addQueryToUrl("/controlleur/get_all_dossier", params);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'affectation du contrôleur :", error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}

export const getControllersApi = async () => {
  try {
    const response = await axios.get("/controlleur/get_all_dossier");//mila ovaina amn le api tena misy
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des contrôleurs :", error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}