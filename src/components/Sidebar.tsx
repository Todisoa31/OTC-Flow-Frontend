"use client";

import { logoutApi } from "@/api/authApi";
import ResizeIcon from "@/assets/icons/resizeIcon";
import logo from "@/assets/images/logo-otc.png";
import { OTC_ACCESS_TOKEN, OTC_REFRESH_TOKEN, OTC_SESSION_ID } from "@/constants/localStorage";
import { CONTROL_COFRAC_ROUTE, CONTROL_NON_REGULATORY_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import useMenu from "@/hooks/useMenu";
import { UseSidebarMenuStore } from "@/stores/sidebarStore";
import { SidebarItemType } from "@/types/general";
import axiosInstance from "@/utils/axiosConfig";
import { removeCookie } from "@/utils/cookies";
import { cn } from "@/utils/tailwind";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutIcon from "../assets/icons/LogoutIcon";

function SidebarItem(sidebarItems: SidebarItemType) {
  const { sideMenuOpen } = UseSidebarMenuStore();
  const router = useRouter();
  const { label, icon, active, pathname } = sidebarItems;
  const [showLabel, setShowLabel] = useState(sideMenuOpen);

  const handleClick = () => {
    if (pathname === CONTROL_COFRAC_ROUTE) {
      router.push(`${pathname}?status=lots&refresh=true`);
    } else if (pathname === CONTROL_NON_REGULATORY_ROUTE) {
      router.push(`${pathname}?status=approved&refresh=true`);
    } else {
      router.push(pathname);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (sideMenuOpen) {
      timer = setTimeout(() => {
        setShowLabel(true);
      }, 200); // 1 seconde
    } else {
      setShowLabel(false); // cacher immédiatement quand le menu se ferme
    }

    return () => clearTimeout(timer);
  }, [sideMenuOpen]);

  return (
    <div className="self-stretch h-12.5 flex-col justify-start items-start gap-1 flex">
      <button
        title={label}
        className={cn(
          "self-stretch h-12.5 hover:bg-[#FFFFFF66] px-3.6 rounded-15 justify-start items-center gap-2.5 inline-flex hover:cursor-pointer",
          active ? "bg-primary-blue text-white" : ""
        )}
        onClick={handleClick}
      >
        <span data-svg-wrapper className="relative">
          {icon}
        </span>
        {showLabel && (
          <span
            className={cn(
              "grow shrink basis-0 text-sm/4.5 text-left",
              active ? "text-white font-bold" : "text-dark-blue font-medium"
            )}
          >
            {label}
          </span>
        )}
      </button>
    </div>
  );
}

function Sidebar() {
  const router = useRouter();
  const { menuItems, navigation } = useMenu();
  const { sideMenuOpen, toogleSideMenu } = UseSidebarMenuStore();

  const handleClickLogout = async () => {
    await logoutApi();
    localStorage.removeItem(OTC_ACCESS_TOKEN);
    localStorage.removeItem(OTC_REFRESH_TOKEN);
    removeCookie(OTC_SESSION_ID);
    delete axiosInstance.defaults.headers.common["Authorization"];
    router.push(LOGIN_ROUTE);
  };

  return (
    <div
      className={cn(
        "max-h-screen relative z-20 overflow-x-hidden overflow-y-auto gap-14 xl:flex h-full py-[34px] bg-gradient-to-t from-white to-primary-blue border-r border-white flex-col justify-start items-start transition-all duration-300 ease-in-out",
        sideMenuOpen ? "max-w-80 min-w-[260px]" : "max-w-[115px] min-w-[115px]"
      )}
      style={{
        background:
          "linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0%, rgba(101, 165, 191, 0.40) 100%)"
      }}
    >
      {sideMenuOpen ? (
        <div className="self-stretch h-[24.49px] flex-col justify-start items-center gap-2.5 flex">
          <Image
            className="w-[193.32px] h-[24.49px]"
            src={logo}
            width={193.32}
            height={24.49}
            alt="Logo"
            priority
          />
        </div>
      ) : (
        <div className=" w-full flex justify-center">
          <button onClick={toogleSideMenu}>
            <ResizeIcon />
          </button>
        </div>
      )}

      <div className="self-stretch px-7.5 flex flex-col justify-start relative items-start py-5">
        {sideMenuOpen && (
          <button className="absolute -right-7.5 top-5" onClick={toogleSideMenu}>
            <ResizeIcon />
          </button>
        )}
        {menuItems.map((item, index) => (
          <SidebarItem key={item.label + index} {...item} />
        ))}
      </div>

      {navigation}

      <div className="self-stretch w-full mt-auto h-12.5 px-7.5 flex-col justify-start items-start gap-2.5 flex">
        <div
          className="cursor-pointer px-3.6 self-stretch w-full h-12.5 rounded-15 justify-start items-center gap-2.5 inline-flex"
          onClick={handleClickLogout}
        >
          <div data-svg-wrapper className="relative">
            <LogoutIcon />
          </div>
          {sideMenuOpen && (
            <div className="grow shrink basis-0 text-dark-blue text-sm/4.5 font-medium">
              Déconnexion
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
