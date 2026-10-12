import { AditHistoryOutputType } from "@/types/auditType";
import axiosInstance from "@/utils/axiosConfig";

export async function GetAuditLog(params?: AditHistoryOutputType) {
    try {
        const response = await axiosInstance.get("/audit/get_history", {
            params
        });
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
};