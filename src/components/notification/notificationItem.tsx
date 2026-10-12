"use client"

import { Notification } from "@/types/notificationType";
import NotificationStatus from "./notificationStatus";
import { getElapsedTime } from "@/utils/getElapsedTime";
import NewFolderIcon from "@/assets/icons/NotificationIcons/NewFolderIcon";
import FolderInUpdateIcon from "@/assets/icons/NotificationIcons/FolderInUpdateIcon";
import CorrectionWaintingIcon from "@/assets/icons/NotificationIcons/CorrectionWaintingIcon";
import FolderCorrection from "@/assets/icons/NotificationIcons/FolderCorrection";
import FolderValidatedIcon from "@/assets/icons/NotificationIcons/FolderValidatedIcon";
import { ReadNotification } from "@/api/notification";
import { UseNotificationStore } from "@/stores/UseNotificationStore";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_ROUTE, CONTROLLER_ROUTE, EXPORT_MACHINE_ROUTE, HEAD_ORIGINATION_ROUTE, INSTALLER_ROUTE, RECORD_DETAIL_INSTALLER_ROUTE, REFERENT_ROUTE, routeWithParams } from "@/constants/routes";

type Props = {
    data: Notification;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotificationItem({ data, setShowNotification }: Props) {
    const { setUpdateNotification } = UseNotificationStore();
    const router = useRouter();
    const pathname = usePathname();

    const GetIcon = () => {
        switch (data.notification_type.code) {
            case 'file_submitted': // Nouveau dossier soumis
                return <NewFolderIcon />
            case "updating_file": // Mise a jour du dossier
                return <FolderInUpdateIcon />
            case "file_inprocess": // En cours de traitement
                return <CorrectionWaintingIcon />
            case "file_wait_correction": // En  attente de correction
                return <CorrectionWaintingIcon />
            case "file_validated": // Dossier valider
                return <FolderValidatedIcon />
            case "file_correction": // Corrections
                return <FolderCorrection />
            default:
                break;
        }
    };

    // fonction utilitaire Redirect
    const getRedirectPath = () => {
        if (!pathname) return "/"; // fallback

        let baseUrl = "";

        if (pathname.includes(INSTALLER_ROUTE)) baseUrl = `${INSTALLER_ROUTE}/progress_tracking`;
        else if (pathname.includes(HEAD_ORIGINATION_ROUTE)) baseUrl = `${HEAD_ORIGINATION_ROUTE}/file-traking`;
        else if (pathname.includes(CONTROLLER_ROUTE)) baseUrl = `${CONTROLLER_ROUTE}/files-to-process`;
        else if (pathname.includes(REFERENT_ROUTE)) baseUrl = `${REFERENT_ROUTE}/file-monitoring`;
        else if (pathname.includes(ADMIN_ROUTE)) baseUrl = `${ADMIN_ROUTE}/file-monitoring`;

        if (data?.dossier?.id) {
            switch (data.notification_for) {
                case "Contrôleur":
                    return routeWithParams(EXPORT_MACHINE_ROUTE, {
                        id: data.dossier.id,
                        file_type: "file_attestation"
                    });
                case "Installateur":
                    return routeWithParams(RECORD_DETAIL_INSTALLER_ROUTE, {
                        id: data.dossier.id
                    });
                case "Head Origination":
                    return `${HEAD_ORIGINATION_ROUTE}/file-traking/${data.dossier.id}`;
                case "Référent":
                    return `${REFERENT_ROUTE}/file-monitoring/${data.dossier.id}`;
                case "Admin":
                    return `${ADMIN_ROUTE}/file-monitoring/${data.dossier.id}`;
                default:
                    return `${baseUrl}/${data.dossier.id}`; // fallback
            }
        }

        return baseUrl; // dossier null
    };

    const handleReadNotification = async () => {
        if (!data.is_read) {
            await ReadNotification(data.id);
            setUpdateNotification();
        }

        const redirectUrl = getRedirectPath();
        if (redirectUrl) router.push(redirectUrl);

        setShowNotification(false);
    };

    return (
        <div
            onClick={handleReadNotification}
            className="self-stretch h-auto p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                <div data-svg-wrapper className="relative">
                    {GetIcon()}
                </div>
                <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">{data.title}</div>
                <div className="relative justify-end text-[#7777a1] text-xs font-normal leading-none">{getElapsedTime(data.updated_at)}</div>
            </div>
            <NotificationStatus status={!data.is_read ? "unread" : "read"} />
            <div className="relative justify-start">
                <span className="text-[#7777a1] text-xs font-normal  leading-none">{data.content}</span>
                {/* <span className="text-black-secondary text-xs font-bold  leading-none">validé avec succès</span>
                <span className="text-[#7777a1] text-xs font-normal  leading-none">.</span> */}
            </div>
        </div>
    )
}