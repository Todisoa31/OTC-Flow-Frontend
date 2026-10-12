import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { OTC_ACCESS_TOKEN, OTC_REFRESH_TOKEN, OTC_SESSION_ID } from '@/constants/localStorage';
import { refreshTokenApi } from '@/api/authApi';
import { ADMIN_ROUTE, ANALYSTE_DASHBOARD_ROUTE, ANALYSTE_ROUTE, CONTROL_NON_REGULATORY_ROUTE, CONTROL_ROUTE, DASHBOARD_CONTROLLER_ROUTE, HEAD_ORIGINATION_DASHBOARD_ROUTE, HEAD_ORIGINATION_ROUTE, INSTALLER_ROUTE, LOGIN_ROUTE, PUBLIC_ROUTES, REFERENT_DASHBOARD_ROUTE, REFERENT_ROUTE, SUBMIT_FILE_ROUTE } from '@/constants/routes';
import { useAuth } from '@/providers/AuthProvider';
import { User } from '@/types/authType';
import axiosInstance from './axiosConfig';
import CenterLoader from '@/components/loader/CenterLoader';
import { decodeObject } from './hasher';
import { getCookie } from './cookies';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ROLE_ADMIN, ROLE_ANALYSTE, ROLE_COFRAC, ROLE_CONTROLLER, ROLE_HEAD_ORIGINATION, ROLE_INSTALLER, ROLE_REFRERENT } from '@/constants/userConst';

// Helper function to check if the JWT is expired
const isTokenExpired = (token: string) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp;
};

const getUserInfo = (token: string, setUser: Dispatch<SetStateAction<User | null>>) => {
    try {
        if (!token) return null;
        const base64Payload = token.split('.')[1];
        const base64 = base64Payload
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(base64Payload.length + (4 - base64Payload.length % 4) % 4, '=');

        const decodedToken = JSON.parse(atob(base64));
        const userCookie = getCookie(OTC_SESSION_ID);

        if (!userCookie) return null;
        if (!decodedToken) return null;

        const user = decodeObject(userCookie);

        if (user && (user as { id: string }).id !== decodedToken.user_id) {
            console.error("User ID mismatch between cookie and token");
            return null;
        }

        setUser(user as User);
        return user as User;

    } catch (err) {
        console.error("Erreur lors du décodage du token :", err);
        return null;
    }
}


// Helper function to refresh the token
const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem(OTC_REFRESH_TOKEN);
    if (!refreshToken) return null;

    try {
        const response = await refreshTokenApi(refreshToken);
        const { access, refresh } = response;
        // Save the new JWT and refresh token
        localStorage.setItem(OTC_ACCESS_TOKEN, access);
        localStorage.setItem(OTC_REFRESH_TOKEN, refresh);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        return access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

// centre de redirection pour chaque role user
const redirect = (pathname: string, router: AppRouterInstance, setLoading: Dispatch<SetStateAction<boolean>>, user?: User) => {
    if (user && user?.role === ROLE_INSTALLER && !pathname.startsWith(INSTALLER_ROUTE)) {
        router.push(SUBMIT_FILE_ROUTE);
    }else if (user && user?.role === ROLE_CONTROLLER && !pathname.startsWith(ROLE_CONTROLLER)) {
        router.push(DASHBOARD_CONTROLLER_ROUTE);
    }else if (user && user?.role === ROLE_COFRAC && !pathname.startsWith(CONTROL_ROUTE)) {
        router.push(CONTROL_ROUTE);
    }
    else if (user && user?.role === ROLE_REFRERENT && !pathname.startsWith(REFERENT_ROUTE)) {
        router.push(REFERENT_DASHBOARD_ROUTE);
    } else if(user && user?.role === ROLE_ADMIN && !pathname.startsWith(ADMIN_ROUTE)){
        router.push(ADMIN_ROUTE);
    } else if (user && user?.role === ROLE_HEAD_ORIGINATION && !pathname.startsWith(HEAD_ORIGINATION_ROUTE)) {
        router.push(HEAD_ORIGINATION_DASHBOARD_ROUTE);
    }else if(user && user?.role === ROLE_ANALYSTE && !pathname.startsWith(ANALYSTE_ROUTE)) {
        router.push(ANALYSTE_DASHBOARD_ROUTE);    
    }
    setLoading(false);
}

const withAuth = (Component: any) => {
    return function ProtectedRoute(props: any) {
        const router = useRouter();
        const pathname = usePathname();
        const [loading, setLoading] = useState<boolean>(true); // For handling loading state
        const { setUser } = useAuth();

        useEffect(() => {
            const checkAuth = async () => {
                const authToken = localStorage.getItem(OTC_ACCESS_TOKEN);

                if (!authToken) {
                    // If no token, redirect to login page or public page
                    if (PUBLIC_ROUTES.includes(pathname)) {
                        return redirect(pathname, router, setLoading);
                    }

                    return redirect(LOGIN_ROUTE, router, setLoading);

                } else {
                    if (isTokenExpired(authToken)) {
                        // If the token is expired, try refreshing it
                        const newToken = await refreshAuthToken();

                        if (!newToken) {
                            // If refreshing the token fails, redirect to login
                            return redirect(LOGIN_ROUTE, router, setLoading);
                        } else {
                            const user = getUserInfo(newToken || '', setUser);

                            if (!user) {
                                return redirect(LOGIN_ROUTE, router, setLoading);
                            }

                            if (PUBLIC_ROUTES.includes(pathname)) {
                                return redirect(SUBMIT_FILE_ROUTE, router, setLoading, user);
                            }

                            return redirect(pathname, router, setLoading);
                        }
                    } else {
                        const user = getUserInfo(authToken || '', setUser);
                        if (!user) {
                            return redirect(LOGIN_ROUTE, router, setLoading);
                        }
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
                        // If the token is valid, redirect to non-public page
                        if (PUBLIC_ROUTES.includes(pathname)) {
                            return redirect(SUBMIT_FILE_ROUTE, router, setLoading, user);
                        }

                        return redirect(pathname, router, setLoading, user);
                    }
                }
            };

            checkAuth();
        }, [router]);

        // Show a loading state while the authentication check is happening
        if (loading) return (
            <div className="flex text-lg p-5 m-auto h-screen justify-center items-center">
                <CenterLoader />
            </div>
        )

        // If authenticated, render the protected component
        return <Component {...props} />
    };
};

export default withAuth;
