"use client";

import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import { UseMenuStore } from "@/stores/MenusStore";
import { SidebarItemType } from "@/types/general";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function MenuSidebar() {
    const { menuStatus, handleToogleMenu, menuItem } = UseMenuStore();

    return (
        <div
            className={clsx(
                "fixed inset-0 z-20 flex transition-opacity duration-300",
                menuStatus ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            <div
                className={clsx(
                    "w-[30%] h-screen bg-[url('/images/gradient-color.png')] bg-cover font-ballou2 border-r border-grayLight transition-all duration-500 ease-in-out bg-white",
                    "absolute left-0 top-0",
                    menuStatus
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-full opacity-0"
                )}
            >
                <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">
                            <img src="/images/logo.png" alt="" width={100} />
                        </div>
                    </div>
                    <button onClick={() => handleToogleMenu(menuStatus)}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex flex-col gap-5 px-3 mt-4">
                    {menuItem.map((item, index) => (
                        <SidebarItem key={item.label + index} {...item} />
                    ))}
                </div>
            </div>

            {/* Overlay qui ferme le menu si on clique en dehors */}
            <div
                className="flex-1 h-screen"
                onClick={() => handleToogleMenu(menuStatus)}
            />
        </div>
    );
}

function SidebarItem(sidebarItems: SidebarItemType) {
    const router = useRouter();
    const { menuStatus, handleToogleMenu } = UseMenuStore();
    const { label, icon, active, pathname } = sidebarItems;

    const handleClick = () => {
        router.push(pathname);
        handleToogleMenu(menuStatus);
    }

    return (
        <div className="self-stretch h-[50px] flex-col justify-start items-start gap-2.5 flex">
            <button
                className={`self-stretch h-[50px] px-[15px] rounded-[15px] justify-start items-center gap-2.5 inline-flex hover:cursor-pointer ${active ? 'bg-primary-blue text-white' : ''}`}
                onClick={handleClick}
            >
                <span data-svg-wrapper className="relative">
                    {icon}
                </span>
                <span className={`${active ? 'text-white font-bold' : 'text-dark-blue font-medium'} grow shrink basis-0 text-sm text-left leading-[18px]`}>
                    {label}
                </span>
            </button>
        </div>
    )
}
