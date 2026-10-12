'use client';;
import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useRouter } from 'next/navigation';
import Button from '@/components/inputs/Button';
import EnvelopIcon from '@/assets/icons/EnvelopIcon';
import LockIcon from '@/assets/icons/LockIcon';
import Input from '@/components/inputs/Input';
import { RegisterPayload } from '@/types/authType';
import { registerApi } from '@/api/authApi';
import { LOGIN_ROUTE } from '@/constants/routes';
import { ROLE_INSTALLER } from '@/constants/userConst';


function Register() {
    const router = useRouter();
    const [payload, setPayload] = useState<RegisterPayload>({
        email: "",
        password: "",
        role: ROLE_INSTALLER,
        firstname: "",
        lastname: "",
        //photo_profil: ""
    })
    const { email, password, firstname, lastname } = payload;

    const handleClickRegister = async() => {
        try{
            const data = await registerApi(payload);
            if(data.email){
                router.push(LOGIN_ROUTE)
            }
        }catch(error){
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    return (
        <AuthLayout>
            <div className="w-[648px] h-[571px] py-[10px] pt-[20px] p-[100px] bg-white/10 rounded-[20px] border border-white backdrop-blur-[15px] flex-col justify-center items-start gap-[50px] inline-flex">
                <div className="text-center text-white text-4xl font-bold leading-normal">Créer un compte</div>
                <div className="h-auto w-full flex-col justify-start items-start gap-[30px] inline-flex">
                    <Input
                        placeholder='Nom'
                        value={firstname}
                        onChange={(firstname) => setPayload({...payload, firstname})}
                    />
                    <Input
                        placeholder='Prénoms'
                        value={lastname}
                        onChange={(lastname) => setPayload({...payload, lastname})}
                    />
                    <Input
                        placeholder='Email'
                        rightIcon={<EnvelopIcon/>}
                        value={email}
                        onChange={(email) => setPayload({...payload, email})}
                    />
                    <Input
                        placeholder='Mot de passe'
                        type='password'
                        value={password}
                        onChange={(password) => setPayload({...payload, password})}
                        rightIcon={<LockIcon/>} 
                    />
                </div>
                <Button
                    label={"Créer un compte"}
                    onClick={handleClickRegister}
                    className='w-full'
                />
            </div>
        </AuthLayout>
    )
}

export default Register