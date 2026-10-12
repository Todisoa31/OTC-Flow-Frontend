import axiosInstance from "@/utils/axiosConfig";

export async function getControlOverview() {
    try {
        const response = await axiosInstance.get("/dossier/count_by_control_statuses");
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
