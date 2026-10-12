'use client';
import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useRouter } from 'next/navigation';
import Button from '@/components/inputs/Button';
import EnvelopIcon from '@/assets/icons/EnvelopIcon';
import LockIcon from '@/assets/icons/LockIcon';
import CheckBox from '@/components/inputs/CheckBox';
import Input from '@/components/inputs/Input';
import { LoginResponse } from '@/types/authType';
import axiosInstance from '@/utils/axiosConfig';
import { OTC_ACCESS_TOKEN, OTC_REFRESH_TOKEN, OTC_SESSION_ID } from '@/constants/localStorage';
import { loginApi } from '@/api/authApi';
import { DASHBOARD_INSTALLER_ROUTE, FORGOT_PASSWORD_ROUTE } from '@/constants/routes';
import { AxiosError } from 'axios';
import { setCookie } from '@/utils/cookies';
import { encodeObject } from '@/utils/hasher';

const LoginError = ({error}:{error: string}) => {
    return (<div className="p-5 bg-[#c70042] absolute bottom-[92%]  transform -translate-x-1/2 w-[70%] left-[50%] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-start gap-2.5">
        <div className="w-6 h-6 relative overflow-hidden">
            <div data-svg-wrapper className="left-[2px] top-[3px] absolute">
                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.31171 7.76149C6.23007 2.58716 7.68925 0 10 0C12.3107 0 13.7699 2.58716 16.6883 7.76149L17.0519 8.40626C19.4771 12.7061 20.6897 14.856 19.5937 16.428C18.4978 18 15.7864 18 10.3637 18H9.63634C4.21356 18 1.50217 18 0.406257 16.428C-0.689658 14.856 0.522912 12.7061 2.94805 8.40627L3.31171 7.76149ZM10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V10C10.75 10.4142 10.4142 10.75 10 10.75C9.58579 10.75 9.25 10.4142 9.25 10V5C9.25 4.58579 9.58579 4.25 10 4.25ZM10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44771 12 9 12.4477 9 13C9 13.5523 9.44771 14 10 14Z" fill="white" />
                </svg>
            </div>
        </div>
        <div className="justify-start">
            <span className="text-white text-2xl font-bold">Échec de connexion. <br /></span>
            <span className="text-white text-sm font-medium leading-[18px]">
                {error}
            </span>
        </div>
    </div>)
}

function LoginPage() {
    const router = useRouter();
    const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string>('');

    const handleClickLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void> = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            const data: LoginResponse = await loginApi(email, password);
            if (data?.access && data?.user) {
                await new Promise((resolve) => {
                    localStorage.setItem(OTC_ACCESS_TOKEN, data.access);
                    localStorage.setItem(OTC_REFRESH_TOKEN, data.refresh);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
                    setCookie(OTC_SESSION_ID, encodeObject(data.user), 30);
                    
                    resolve(true);
                });
                router.push(DASHBOARD_INSTALLER_ROUTE);
            }
        } catch (error: any) {
            if(error instanceof AxiosError && error?.response?.data?.error){
                setError(error?.response?.data?.error);
                
            }
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <form onSubmit={handleClickLogin} className="sm:w-[648px] md:w-[600px] w-[380px] sm:h-[571px] h-fit py-[30px] sm:p-[100px] p-[20px] bg-white/10 rounded-[20px] border border-white backdrop-blur-[15px] flex-col justify-center items-start gap-[50px] inline-flex">
                {error && <LoginError error={error}/>}

                <div className="text-center text-white text-4xl font-bold leading-normal">Connectez-vous</div>
                <div className="h-[185px] w-full flex-col justify-start items-start gap-[30px] inline-flex">
                    <Input
                        placeholder='Email'
                        rightIcon={<EnvelopIcon />}
                        value={email}
                        onChange={(email) => setEmail(email)}
                    />
                    <Input
                        placeholder='Mot de passe'
                        type='password'
                        value={password}
                        onChange={(password) => setPassword(password)}
                        rightIcon={<LockIcon />}
                    />
                    <div className="h-[25px] justify-between items-center gap-2.5 inline-flex w-full">
                        <CheckBox
                            id='rememberMe'
                            onChange={() => setIsRememberMe(prev => !prev)}
                            checked={isRememberMe}
                            label="Se souvenir de moi"
                        />
                        <div className="h-[18px] justify-end items-start gap-2.5 inline-flex">
                            <div className="text-center text-white text-sm font-bold leading-[18px] cursor-pointer" onClick={() => { router.push(FORGOT_PASSWORD_ROUTE) }}>
                                Mot de passe oublié ?
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    label={"Se connecter"}
                    className='w-full !py-[20px]'
                    loading={loading}
                />
            </form>
        </AuthLayout>
    )
}

export default LoginPage