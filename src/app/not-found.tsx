"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#65A5BF66] text-[#152C2A] px-4">
            <h1 className="text-5xl font-bold mb-4">404 - Page introuvable</h1>
            <p className="text-lg text-center mb-6">
                Oups ! La page que vous recherchez n’existe pas ou a été déplacée.
            </p>
            <button 
                className="bg-[#57CFC8] hover:bg-[#55b3ae] transition-all border-0 text-white px-4 py-2 rounded"
                onClick={() => router.push("/controller/dashboard")}
            >
                Retour dans dashboard
            </button>
        </div>
    )
};