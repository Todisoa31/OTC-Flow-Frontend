import { RegisterPayload } from '@/types/authType';
import axiosInstance, { authAxiosInstance } from '@/utils/axiosConfig';
import { txt } from '@/utils/texts';
import { toast } from 'react-toastify';

export const loginApi = async (email: string, password: string) => {
    try {
        const response = await authAxiosInstance.post('/users/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const refreshTokenApi = async (refresh: string) => {
    try {
        const response = await authAxiosInstance.post('/users/refresh', { refresh });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const registerApi = async (registerPayload: RegisterPayload) => {
    try {
        const response = await authAxiosInstance.post('/users/register', registerPayload);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(txt.serverErrorMessage);
        throw error;
    }
};

export const logoutApi = async () => {
    try {
        await axiosInstance.post('/users/logout');
    } catch (error) {
        console.error('Error on logout:', error);
        throw error;
    }
}
