'use client';

import { useState, useRef, useEffect } from 'react';
import CaretDownIcon from "@/assets/icons/CaretDownIcon";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import userAvatar from "@/assets/images/user-avatar.webp";
import { usePathname, useRouter } from "next/navigation";
import { OTC_ACCESS_TOKEN, OTC_REFRESH_TOKEN, OTC_SESSION_ID } from '@/constants/localStorage';
import axiosInstance from '@/utils/axiosConfig';
import { INSTALLER_PROFILE_ROUTE, CONTROLLER_ROUTE, INSTALLER_ROUTE, LOGIN_ROUTE } from '@/constants/routes';
import { removeCookie } from '@/utils/cookies';
import { logoutApi } from '@/api/authApi';

function TopBarAvatar() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname()
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickLogout = async () => {
        await logoutApi();
        setOpen(false);
        localStorage.removeItem(OTC_ACCESS_TOKEN);
        localStorage.removeItem(OTC_REFRESH_TOKEN);
        removeCookie(OTC_SESSION_ID);
        delete axiosInstance.defaults.headers.common['Authorization'];
        router.push(LOGIN_ROUTE);
    }

    const handleGoProfile = () => {
        router.push(INSTALLER_PROFILE_ROUTE);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="rounded-[10px] justify-start items-center gap-2.5 flex cursor-pointer" onClick={() => setOpen(!open)}>
                <img
                    className="w-[30px] h-[30px] rounded-[10px] bg-white"
                    src={user?.photo_profil ?? "/images/usProfil.jpg"}
                    alt="user avatar"
                    width={30}
                    height={30}
                />
                <div className="justify-center items-center gap-2.5 flex">
                    <div className="text-dark-blue text-sm font-medium leading-[18px]">{user?.firstname} {user?.lastname}</div>
                    <div data-svg-wrapper className="relative">
                        <CaretDownIcon />
                    </div>
                </div>
            </div>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg z-50">
                    {
                        pathname.startsWith(INSTALLER_ROUTE) && 
                        <button
                            onClick={handleGoProfile}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 rounded-sm hover:bg-gray-100 text-[#3A5F6E]"
                        >
                            Mon profil
                        </button>}
                    <button
                        onClick={() => handleClickLogout()}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 rounded-sm hover:bg-gray-100 text-[#3A5F6E]"
                    >
                        Déconnexion
                    </button>
                </div>
            )}
        </div>
    );
}

export default TopBarAvatar;
