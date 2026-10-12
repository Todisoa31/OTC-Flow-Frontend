'use client';
import { refreshTokenApi } from '@/api/authApi';
import { OTC_ACCESS_TOKEN, OTC_REFRESH_TOKEN } from '@/constants/localStorage';
import axios from 'axios';
import jwt from "jsonwebtoken";

export const authAxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (req) => {
        let access = localStorage.getItem(OTC_ACCESS_TOKEN);        

        if (access && isTokenExpired(access)) {
            try {
                access = await refreshToken();
            } catch (error) {
                return Promise.reject(error);
            }
        }

        if (access) {
            req.headers["Authorization"] = `Bearer ${access}`;
        }

        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export function isTokenExpired(access_token: string) {
    const decodedToken = jwt.decode(access_token, { complete: true });
    const payload = decodedToken?.payload
    if (typeof payload === 'object' && payload !== null && 'exp' in payload) {
        const { exp } = payload;
        const currentTime = Math.floor(Date.now() / 1000);
        const isTokenValid = exp && exp < currentTime;
        return isTokenValid;
    }
    return true;
}

async function refreshToken() {
    try {
        const refreshToken = localStorage.getItem(OTC_REFRESH_TOKEN);
        const response = await refreshTokenApi(refreshToken || '');
        const { access, refresh } = response;
        localStorage.setItem(OTC_ACCESS_TOKEN, access);
        localStorage.setItem(OTC_REFRESH_TOKEN, refresh);
        return access;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
    }
}

export default axiosInstance;