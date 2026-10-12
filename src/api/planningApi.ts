import { AvailabilityPayload, PlanningPayloadType } from "@/types/planningType";
import axiosInstance from "@/utils/axiosConfig";

export const getPlanningList = async (payload: PlanningPayloadType) => {
    const { page, per_page, start_date, role, search_text } = payload;
    const params = {
        page,
        per_page,
        start_date,
        role,
        search_text,
    };
    return axiosInstance.get('/users/list/plannings', { params });
};

export const createPlanning = async (payload: AvailabilityPayload) => {
    return axiosInstance.post('/planning/create', payload)
};

export const getDaysOff = async (page: number, per_page: number, offStatus: "actual" | "planned") => {
    return axiosInstance.get(`/users/list/off?offStatus=${offStatus}&page=${page}&per_page=${per_page}`)
};

export const searchPlanning = async (user_id: number, day: string) => {
    return axiosInstance.get(`/planning/search?user_id=${user_id}&day=${day}`);
};

export const deletePlanning = async (user_id: string, day: string) => {
    return axiosInstance.post('/planning/delete', {
        user_id, day
    })
}

export const updatePlanning = async (id: number, payload: AvailabilityPayload) => {
    return axiosInstance.put(`/planning/update/${id}`, payload)
};
// /planning/update/{id}