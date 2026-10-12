'use client'
import withAuth from '@/utils/withAuth'
import React from 'react'

type AuthLayoutProps = {
    readonly children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="bg-[url('/images/auth-bg.webp')] bg-cover bg-center">
            <div className="AuthLayout m-auto flex h-screen w-screen max-w-[1920px] justify-center items-center relative flex-col xl:flex-row">
                <div className='grow z-10 items-center justify-center flex flex-col sm:px-[0px] px-[25px]'>
                    <div className="h-[147px] flex-col justify-center items-start gap-10 inline-flex">
                        <div className="text-white sm:text-5xl text-[30px] font-bold">Bienvenue sur <br />OCR Flow Processing 🚀</div>
                        <div className="text-white sm:text-2xl text-[20px] font-normal">Gagnez du temps et facilitez vos démarches !</div>
                    </div>
                </div>

                <div className="grow items-center justify-center flex flex-col z-10">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default withAuth(AuthLayout)