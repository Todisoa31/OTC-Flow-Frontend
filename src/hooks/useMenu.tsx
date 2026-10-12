"use client";

import { logoutApi } from "@/api/authApi";
import ListFile from "@/assets/icons/ListFile";
import ContractIcon from "@/assets/icons/SideMenu/ContractIcon";
import ExportMachineMenuIcon from "@/assets/icons/SideMenu/ExportMachineMenuIcon";
import FileMonitoringIcon from "@/assets/icons/SideMenu/FileMonitoringIcon";
import HistoryMenuIcon from "@/assets/icons/SideMenu/HistoryMenuIcon";
import ListIcon from "@/assets/icons/SideMenu/ListIcon";
import LoadDistributionIcon from "@/assets/icons/SideMenu/LoadDistributionIcon";
import MagnifingGlass from "@/assets/icons/SideMenu/MagnifingGlass";
import MessagingIcon from "@/assets/icons/SideMenu/MessagingIcon";
import PlaningIcon from "@/assets/icons/SideMenu/PlaningIcon";
import TracingPaper from "@/assets/icons/SideMenu/TracingPaper";
import SidFileToCorrectIcon from "@/assets/icons/SidFileToCorrectIcon";
import SidFileValidatedIcon from "@/assets/icons/SidFileValidatedIcon";
import UsersGroupIcon from "@/assets/icons/UsersGroupIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import StatuseSidebar from "@/components/StatuseSidebar";
import { OTC_ACCESS_TOKEN, OTC_REFRESH_TOKEN, OTC_SESSION_ID } from "@/constants/localStorage";
import {
  ACCESS_RIGHT_CONFIGURATION_ROUTE,
  ADMIN_CONTRACT_ROUTE,
  ADMIN_FILE_MONITORING_ROUTE,
  ADMIN_HISTORY_AND_ACTIVITY_LOG,
  ADMIN_INSTALLATER_ROUTE,
  ADMIN_MESSAGING_ROUTE,
  ADMIN_ROUTE,
  ADMIN_SCHCEDURE_MANSGEMENT_ROUTE,
  ANALYSTE_ALERT_ANOMALIE,
  ANALYSTE_DASHBOARD_ROUTE,
  ANALYSTE_RAPPORT,
  CONTOLLEUR_MESSAGING_ROUTE,
  CONTROL_COFRAC_MESSAGING_ROUTE,
  CONTROL_COFRAC_ROUTE,
  CONTROL_NON_REGULATORY_ROUTE,
  CONTROL_ROUTE,
  DASHBOARD_CONTROLLER_ROUTE,
  DASHBOARD_INSTALLER_ROUTE,
  FILES_TO_CORRECT_ROUTE,
  FILES_TO_PROCESS_ROUTE,
  FILES_VALIDATED_ROUTE,
  HEAD_ORIGINATION_CONTRACT_ROUTE,
  HEAD_ORIGINATION_DASHBOARD_ROUTE,
  HEAD_ORIGINATION_EXPORT_MACHINE_ROUTE,
  HEAD_ORIGINATION_FILE_TRACKIN_ROUTE,
  HEAD_ORIGINATION_MESSAGERIE_ROUTE,
  HEAD_ORIGINATION_NEW_FOLDER_ROUTE,
  INSTALLER_CONTRACT_ROUTE,
  INSTALLER_MESSAGING_ROUTE,
  LOGIN_ROUTE,
  PROGRESS_TRACKING,
  REFERENT_DASHBOARD_ROUTE,
  REFERENT_FILE_MONITORING_ROUTE,
  REFERENT_MESSAGING_ROUTE,
  SUBMIT_FILE_ROUTE,
  USER_MANAGEMENT_ROUTE
} from "@/constants/routes";
import {
  ROLE_ADMIN,
  ROLE_ANALYSTE,
  ROLE_COFRAC,
  ROLE_CONTROLLER,
  ROLE_HEAD_ORIGINATION,
  ROLE_INSTALLER,
  ROLE_REFRERENT
} from "@/constants/userConst";
import { useAuth } from "@/providers/AuthProvider";
import { UseMenuStore } from "@/stores/MenusStore";
import { SidebarItemType } from "@/types/general";
import axiosInstance from "@/utils/axiosConfig";
import { removeCookie } from "@/utils/cookies";
import { usePathname, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import AddFolderIcon from "../assets/icons/AddFolderIcon";
import Folder2Icon from "../assets/icons/Folder2Icon";
import HomeIcon from "../assets/icons/HomeIcon";
import MoveToFolderIcon from "../assets/icons/MoveToFolderIcon";
import ShieldupIcon from "../assets/icons/ShieldupIcon";

function useMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { setMenuItem, menuItem } = UseMenuStore();
  const [navigation, setNavigation] = useState<JSX.Element | null>(null);

  const installerItems: SidebarItemType[] = [
    {
      label: "Tableau de bord",
      icon: <HomeIcon active={pathname === DASHBOARD_INSTALLER_ROUTE} />,
      pathname: DASHBOARD_INSTALLER_ROUTE,
      active: pathname === DASHBOARD_INSTALLER_ROUTE
    },
    {
      label: "Soumettre un dossier",
      icon: <AddFolderIcon active={pathname === SUBMIT_FILE_ROUTE} />,
      pathname: SUBMIT_FILE_ROUTE,
      active: pathname === SUBMIT_FILE_ROUTE
    },
    {
      label: "Suivi des dossiers",
      icon: (
        <MoveToFolderIcon
          active={pathname === PROGRESS_TRACKING || pathname.startsWith("/record_detail")}
        />
      ),
      active: pathname === PROGRESS_TRACKING || pathname.startsWith("/record_detail"),
      pathname: PROGRESS_TRACKING
    },
    {
      label: "Contrats",
      icon: <ContractIcon active={pathname === INSTALLER_CONTRACT_ROUTE} />,
      active: pathname === INSTALLER_CONTRACT_ROUTE,
      pathname: INSTALLER_CONTRACT_ROUTE
    },
    // {
    //   label: "Messagerie",
    //   icon: <MessagingIcon active={pathname === INSTALLER_MESSAGING_ROUTE} />,
    //   pathname: INSTALLER_MESSAGING_ROUTE,
    //   active: pathname === INSTALLER_MESSAGING_ROUTE
    // }
  ];

  const controllerItems: SidebarItemType[] = [
    {
      label: "Tableau de bord",
      icon: <HomeIcon active={pathname === DASHBOARD_CONTROLLER_ROUTE} />,
      pathname: DASHBOARD_CONTROLLER_ROUTE,
      active: pathname === DASHBOARD_CONTROLLER_ROUTE
    },
    {
      label: "Dossiers à traiter",
      icon: <Folder2Icon active={pathname === FILES_TO_PROCESS_ROUTE} />,
      pathname: FILES_TO_PROCESS_ROUTE,
      active: pathname === FILES_TO_PROCESS_ROUTE
    },
    {
      label: "Dossiers à corriger",
      icon: <SidFileToCorrectIcon active={pathname === FILES_TO_CORRECT_ROUTE} />,
      pathname: FILES_TO_CORRECT_ROUTE,
      active: pathname === FILES_TO_CORRECT_ROUTE
    },
    {
      label: "Dossiers traités",
      icon: <SidFileValidatedIcon active={pathname === FILES_VALIDATED_ROUTE} />,
      pathname: FILES_VALIDATED_ROUTE,
      active: pathname === FILES_VALIDATED_ROUTE
    },

    // {
    //   label: "Messagerie",
    //   icon: <MessagingIcon active={pathname === CONTOLLEUR_MESSAGING_ROUTE} />,
    //   pathname: CONTOLLEUR_MESSAGING_ROUTE,
    //   active: pathname === CONTOLLEUR_MESSAGING_ROUTE
    // }
    // {
    //     label: 'Historique',
    //     icon: <SearchIcon active={pathname === HISTORY_ROUTE} />,
    //     active: pathname === HISTORY_ROUTE,
    //     pathname: HISTORY_ROUTE

    // }
  ];

  const adminItems: SidebarItemType[] = [
    {
      label: "Tableau de bord",
      icon: <HomeIcon active={pathname === ADMIN_ROUTE} />,
      pathname: ADMIN_ROUTE,
      active: pathname === ADMIN_ROUTE
    },
    {
      label: "Gestion des utilisateurs",
      icon: <UsersGroupIcon active={pathname.startsWith(USER_MANAGEMENT_ROUTE)} />,
      active: pathname.startsWith(USER_MANAGEMENT_ROUTE),
      pathname: USER_MANAGEMENT_ROUTE
    },
    {
      label: "Configuration des droits d'accès",
      icon: <ShieldupIcon active={pathname === ACCESS_RIGHT_CONFIGURATION_ROUTE} />,
      pathname: ACCESS_RIGHT_CONFIGURATION_ROUTE,
      active: pathname === ACCESS_RIGHT_CONFIGURATION_ROUTE
    },
    {
      label: "Suivi des Dossiers",
      icon: <FileMonitoringIcon active={pathname === ADMIN_FILE_MONITORING_ROUTE} />,
      pathname: ADMIN_FILE_MONITORING_ROUTE,
      active: pathname === ADMIN_FILE_MONITORING_ROUTE
    },
    {
      label: "Installateurs",
      icon: <ListIcon active={pathname === ADMIN_INSTALLATER_ROUTE} />,
      pathname: ADMIN_INSTALLATER_ROUTE,
      active: pathname === ADMIN_INSTALLATER_ROUTE
    },
    {
      label: "Historique et Journal d'activité",
      icon: <HistoryMenuIcon active={pathname === ADMIN_HISTORY_AND_ACTIVITY_LOG} />,
      pathname: ADMIN_HISTORY_AND_ACTIVITY_LOG,
      active: pathname === ADMIN_HISTORY_AND_ACTIVITY_LOG
    },

    // {
    //     label: 'Dossier Doublons',
    //     icon: <DuplicateFolderIcon active={pathname === ADMIN_DUPLICATE_FOLDERS_ROUTE} />,
    //     pathname: ADMIN_DUPLICATE_FOLDERS_ROUTE,
    //     active: pathname === ADMIN_DUPLICATE_FOLDERS_ROUTE
    // },
    {
      label: "Gestion de planning",
      icon: <PlaningIcon active={pathname === ADMIN_SCHCEDURE_MANSGEMENT_ROUTE} />,
      pathname: ADMIN_SCHCEDURE_MANSGEMENT_ROUTE,
      active: pathname === ADMIN_SCHCEDURE_MANSGEMENT_ROUTE
    },
    // {
    //   label: "Messagerie",
    //   icon: <MessagingIcon active={pathname === ADMIN_MESSAGING_ROUTE} />,
    //   pathname: ADMIN_MESSAGING_ROUTE,
    //   active: pathname === ADMIN_MESSAGING_ROUTE
    // },
    {
      label: "Contrats",
      icon: <ContractIcon active={pathname === ADMIN_CONTRACT_ROUTE} />,
      active: pathname === ADMIN_CONTRACT_ROUTE,
      pathname: ADMIN_CONTRACT_ROUTE
    }
  ];

  const referentItems: SidebarItemType[] = [
    {
      label: "Tableau de bord",
      icon: <HomeIcon active={pathname === REFERENT_DASHBOARD_ROUTE} />,
      pathname: REFERENT_DASHBOARD_ROUTE,
      active: pathname === REFERENT_DASHBOARD_ROUTE
    },
    {
      label: "Suivi des Dossiers",
      icon: <FileMonitoringIcon active={pathname === REFERENT_FILE_MONITORING_ROUTE} />,
      pathname: REFERENT_FILE_MONITORING_ROUTE,
      active: pathname === REFERENT_FILE_MONITORING_ROUTE
    },
    // {
    //     label: 'Nouveau dossiers',
    //     icon: <LoadDistributionIcon active={pathname === REFERENT_NEW_FOLDER_ROUTE} />,
    //     active: pathname === REFERENT_NEW_FOLDER_ROUTE,
    //     pathname: REFERENT_NEW_FOLDER_ROUTE

    // },
    // {
    //   label: "Messagerie",
    //   icon: <MessagingIcon active={pathname === REFERENT_MESSAGING_ROUTE} />,
    //   active: pathname === REFERENT_MESSAGING_ROUTE,
    //   pathname: REFERENT_MESSAGING_ROUTE
    // }
  ];

  const headOriginationMenuItems: SidebarItemType[] = [
    {
      label: "Tableau de bord",
      icon: <HomeIcon active={pathname === HEAD_ORIGINATION_DASHBOARD_ROUTE} />,
      pathname: HEAD_ORIGINATION_DASHBOARD_ROUTE,
      active: pathname === HEAD_ORIGINATION_DASHBOARD_ROUTE
    },
    {
      label: "Assignations",
      icon: <LoadDistributionIcon active={pathname === HEAD_ORIGINATION_NEW_FOLDER_ROUTE} />,
      active: pathname === HEAD_ORIGINATION_NEW_FOLDER_ROUTE,
      pathname: HEAD_ORIGINATION_NEW_FOLDER_ROUTE
    },
    {
      label: "Suivi des Dossiers",
      icon: <FileMonitoringIcon active={pathname === HEAD_ORIGINATION_FILE_TRACKIN_ROUTE} />,
      pathname: HEAD_ORIGINATION_FILE_TRACKIN_ROUTE,
      active: pathname === HEAD_ORIGINATION_FILE_TRACKIN_ROUTE
    },
    {
      label: "Export Machine",
      icon: <ExportMachineMenuIcon active={pathname === HEAD_ORIGINATION_EXPORT_MACHINE_ROUTE} />,
      pathname: HEAD_ORIGINATION_EXPORT_MACHINE_ROUTE,
      active: pathname === HEAD_ORIGINATION_EXPORT_MACHINE_ROUTE
    },
    // {
    //   label: "Messagerie",
    //   icon: <MessagingIcon active={pathname === HEAD_ORIGINATION_MESSAGERIE_ROUTE} />,
    //   active: pathname === HEAD_ORIGINATION_MESSAGERIE_ROUTE,
    //   pathname: HEAD_ORIGINATION_MESSAGERIE_ROUTE
    // },
    {
      label: "Contrats",
      icon: <ContractIcon active={pathname === HEAD_ORIGINATION_CONTRACT_ROUTE} />,
      active: pathname === HEAD_ORIGINATION_CONTRACT_ROUTE,
      pathname: HEAD_ORIGINATION_CONTRACT_ROUTE
    }
  ];

  const analysteMenuItems: SidebarItemType[] = [
    {
      label: "Tableau de bord",
      icon: <HomeIcon active={pathname === ANALYSTE_DASHBOARD_ROUTE} />,
      pathname: ANALYSTE_DASHBOARD_ROUTE,
      active: pathname === ANALYSTE_DASHBOARD_ROUTE
    },
    {
      label: "Rapports",
      icon: <ListFile fill={pathname === ANALYSTE_RAPPORT ? "#fff" : "#3A5F6E"} />,
      pathname: ANALYSTE_RAPPORT,
      active: pathname === ANALYSTE_RAPPORT
    },
    {
      label: "Alertes & Anomalies",
      icon: <WarningIcon fill={pathname === ANALYSTE_ALERT_ANOMALIE ? "#fff" : "#3A5F6E"} />,
      pathname: ANALYSTE_ALERT_ANOMALIE,
      active: pathname === ANALYSTE_ALERT_ANOMALIE
    }
  ];

  const cofracMenuItems: SidebarItemType[] = [
    {
      label: "Tableau de bord",
      icon: <HomeIcon active={pathname === CONTROL_ROUTE} />,
      pathname: CONTROL_ROUTE,
      active: pathname === CONTROL_ROUTE
    },
    {
      label: "Contrôle non réglementaire",
      icon: <MagnifingGlass active={pathname.startsWith(CONTROL_NON_REGULATORY_ROUTE)} />,
      pathname: CONTROL_NON_REGULATORY_ROUTE,
      active: pathname.startsWith(CONTROL_NON_REGULATORY_ROUTE)
    },
    // {
    //   label: "Contrôle Cofrac",
    //   icon: <TracingPaper active={pathname === CONTROL_COFRAC_ROUTE} />,
    //   pathname: CONTROL_COFRAC_ROUTE,
    //   active: pathname === CONTROL_COFRAC_ROUTE
    // },
    // {
    //   label: "Messagerie",
    //   icon: <MessagingIcon active={pathname === CONTROL_COFRAC_MESSAGING_ROUTE} />,
    //   pathname: CONTROL_COFRAC_MESSAGING_ROUTE,
    //   active: pathname === CONTROL_COFRAC_MESSAGING_ROUTE
    // }
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickLogout = async () => {
    await logoutApi();
    localStorage.removeItem(OTC_ACCESS_TOKEN);
    localStorage.removeItem(OTC_REFRESH_TOKEN);
    removeCookie(OTC_SESSION_ID);
    delete axiosInstance.defaults.headers.common["Authorization"];
    router.push(LOGIN_ROUTE);
  };

  useEffect(() => {
    switch (user?.role) {
      case ROLE_INSTALLER:
        setMenuItem(installerItems);
        break;
      case ROLE_CONTROLLER:
        setMenuItem(controllerItems);
        break;
      case ROLE_REFRERENT:
        setMenuItem(referentItems);
        break;
      case ROLE_ADMIN:
        setMenuItem(adminItems);
        break;
      case ROLE_HEAD_ORIGINATION:
        setMenuItem(headOriginationMenuItems);
        break;
      case ROLE_ANALYSTE:
        setMenuItem(analysteMenuItems);
        break;
      case ROLE_COFRAC:
        setMenuItem(cofracMenuItems);
        break;
      default:
        setMenuItem([]);
    }
  }, [user?.role, pathname]);

  useEffect(() => {
    if ([CONTROL_NON_REGULATORY_ROUTE, CONTROL_COFRAC_ROUTE].includes(pathname)) {
      setNavigation(
        <StatuseSidebar
          activePathname={
            pathname === CONTROL_COFRAC_ROUTE ? CONTROL_COFRAC_ROUTE : CONTROL_NON_REGULATORY_ROUTE
          }
          controlType={pathname === CONTROL_COFRAC_ROUTE ? "cofrac" : "non_reglementaire"}
        />
      );
    } else {
      setNavigation(null);
    }
  }, [pathname]);

  return {
    menuItems: menuItem,
    navigation
  };
}

export default useMenu;
