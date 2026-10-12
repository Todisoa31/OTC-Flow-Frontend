import axiosInstance from "@/utils/axiosConfig";

// Post de fcm token pour l'user
export async function postNotificationFcmToken(fcm_token: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post("/notification/api/register-fcm-token/", {
            fcm_token
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


// Get notification
export async function getNotifications(page: number = 1) {
    try {
        const response = await axiosInstance.get(`/notification/get-notifications/?page=${page}&per_page=50`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export async function ReadNotification(notification_id: number) {
    try {
        const response = await axiosInstance.put(`/notification/mark-notification-as-read/${notification_id}/`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};