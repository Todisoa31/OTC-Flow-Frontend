'use client';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/inputs/Input';
import EnvelopIcon from '@/assets/icons/EnvelopIcon';
import Button from '@/components/inputs/Button';
import { useRouter } from 'next/navigation';
import { NEW_PASSWORD_ROUTE } from '@/constants/routes';

function ResetPassword() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(NEW_PASSWORD_ROUTE)
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="sm:w-[648px] md:w-[600px] w-[380px] sm:h-[571px] h-fit py-[30px] sm:p-[100px] p-[20px] bg-white/10 rounded-[20px] border border-white backdrop-blur-[15px] flex-col justify-center items-start gap-[50px] inline-flex">
                <div className="text-center text-white text-4xl font-bold leading-normal">
                    Mot de passe oublié
                </div>
                <div className="self-stretch h-[116px] flex-col justify-start items-start gap-[30px] flex">
                    <Input
                        placeholder='Email'
                        rightIcon={<EnvelopIcon/>}
                        value=''
                    />
                    <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                        <div className="grow shrink basis-0 text-white text-sm font-normal leading-[18px]">
                            Entrez votre adresse e-mail et nous vous enverrons des instructions pour réinitialiser votre mot de passe.
                        </div>
                    </div>
                </div>
                <Button
                    label={"Envoyer les instructions par email"}
                    className='w-full'
                />
            </form>
        </AuthLayout>
    )
}

export default ResetPassword