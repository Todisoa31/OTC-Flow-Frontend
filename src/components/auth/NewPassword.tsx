'use client';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/inputs/Input';
import LockIcon from '@/assets/icons/LockIcon';
import Button from '@/components/inputs/Button';
import { useRouter } from 'next/navigation';
import { LOGIN_ROUTE } from '@/constants/routes';
import React from 'react';

function NewPassword() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(LOGIN_ROUTE);
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="sm:w-[648px] md:w-[600px] w-[380px] sm:h-[571px] h-fit py-[30px] sm:p-[100px] p-[20px] bg-white/10 rounded-[20px] border border-white backdrop-blur-[15px] flex-col justify-center items-start gap-[50px] inline-flex">
                <div className="text-center text-white text-4xl font-bold leading-normal">Nouveau mot de passe</div>
                <div className="self-stretch h-[196px] flex-col justify-start items-start gap-[30px] flex">
                    <Input
                       placeholder='Mot de passe'
                       rightIcon={<LockIcon/>}
                       value='' 
                    />
                    <Input
                       placeholder='Confirmer le mot de passe'
                       rightIcon={<LockIcon/>} 
                       value='' 
                    />
                    <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                        <div className="grow shrink basis-0 text-white text-sm font-normal leading-[18px]">
                            Le mot de passe doit être composé d’au moins 8 caractères, une majuscule et un caractère spécial au minimum
                        </div>
                    </div>
                </div>
                <Button
                    label={"Mettre à jour mon mot de passe"}
                    className='w-full'
                />
            </form>
        </AuthLayout>
    )
}

export default NewPassword