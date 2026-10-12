"use client";

import BellIcon from "@/assets/icons/BellIcon";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { onForegroundNotification, requestPermission } from "@/lib/messaging";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import { getNotifications, postNotificationFcmToken } from "@/api/notification";
import { UseNotificationStore } from "@/stores/UseNotificationStore";
import NotificationItem from "./notification/notificationItem";
import { getUserInfo } from "@/api/user";
import { usePathname } from "next/navigation";

type Props = {
    showNotification: boolean;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotificationV2({ showNotification, setShowNotification }: Props) {
    const pathname = usePathname();
    const { notifications, setNotifications, updateNotification } = UseNotificationStore();
    const [page, setPage] = useState<number>(1);

    const getNotification = async () => {
        const notifs = await getNotifications(page);
        if (notifs) {
            setNotifications(notifs);
        };
    };

    useEffect(() => {
        const requestPermissionAsync = async (): Promise<void> => {
            const fcmToken = await requestPermission();
            const user_ = await getUserInfo();
        
            if (!user_ || !fcmToken) return;
            await postNotificationFcmToken(fcmToken);
        };

        requestPermissionAsync();

        const handleForegroundNotification = async () => {
            getNotification()
        };

        onForegroundNotification(handleForegroundNotification);

        getNotification();
    }, [updateNotification, page, pathname]);


    return (
        <div
            className={clsx(
                "fixed inset-0 z-20 flex transition-opacity duration-300",
                showNotification ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            <div
                className="h-full xl:w-[80%] lg:w-[76%]  "
                onClick={() => setShowNotification(false)}
            />

            <div
                className={clsx(
                    "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
                    showNotification
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0"
                )}
            >
                <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#787878]">
                    <div className=" flex gap-2 items-center">
                        <div data-svg-wrapper>
                            <BellIcon />
                        </div>
                        <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">Notifications</div>
                    </div>
                    <button onClick={() => setShowNotification(false)}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="bg-[#787878]">
                    <div
                        className="self-stretch h-[90vh] p-[30px] flex flex-col justify-start items-start gap-5 overflow-auto "
                    >
                        {notifications?.notifications && notifications.notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                data={notification}
                                setShowNotification={setShowNotification}
                            />
                        ))}

                        {notifications?.pagination?.total_entries && notifications.pagination.total_entries > 50 &&
                            <div className="flex items-center justify-between w-full mt-4">
                                <button
                                    className={clsx("text-white", page <= 1 && "opacity-50 cursor-not-allowed")}
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page <= 1}
                                >
                                    Précédent
                                </button>

                                <span className="text-white text-sm">
                                    page {page} / {notifications.pagination.total_pages}
                                </span>

                                <button
                                    className={clsx("text-white", page >= notifications.pagination.total_pages && "opacity-50 cursor-not-allowed")}
                                    onClick={() => setPage((prev) => Math.min(prev + 1, notifications.pagination.total_pages))}
                                    disabled={page >= notifications.pagination.total_pages}
                                >
                                    Suivante
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}