import { addQueryToUrl } from "@/utils/commonUtils";
import { txt } from "@/utils/texts";
import axios from '@/utils/axiosConfig';
import { toast } from "react-toastify";
import { ExportMachineFilterParams } from "@/types/exportMachineFilterParams";

export const getExportMachineApiV2 = async (params: ExportMachineFilterParams) => {
  try {
    const url = addQueryToUrl("/controlleur/get_export_machine_refactor", params);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récuperation des données export machine :", error);
    toast.error(txt.serverErrorMessage);
    throw error;
  }
}

