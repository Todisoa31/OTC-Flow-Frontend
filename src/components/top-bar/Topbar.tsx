'use client'
import { Dispatch, SetStateAction } from 'react';
import { useTitle } from '@/providers/TitleProvider';
import TopBarAvatar from './TopBarAvatar';
import TopBarNotification from './TopBarNotification';
import { UseNotificationStore } from '@/stores/UseNotificationStore';
import ChatAlertIcon from '@/assets/icons/ChatAletIcon';
import MenuToogleIcon from '@/assets/icons/MenuToogleIcon';
import { UseMenuStore } from '@/stores/MenusStore';

type Props = {
    setShowNotification: Dispatch<SetStateAction<boolean>>
}

function Topbar(props: Props) {
    const { title } = useTitle();
    const { setShowNotification } = props
    const { notifications } = UseNotificationStore();
    const { handleToogleMenu, menuStatus } = UseMenuStore();

    const hasNotification = notifications?.notifications.some((item) => !item.is_read) ?? false;

    return (
        <div className="h-[90px] p-[30px] border-b border-white justify-start items-center gap-[30px] inline-flex w-full">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="text-dark-blue text-sm font-bold flex items-center gap-5">
                    <button className="xl:hidden block" onClick={() => handleToogleMenu(menuStatus)}>
                        <MenuToogleIcon />
                    </button>
                    {title}
                </div>
            </div>
            <div className="justify-start items-start gap-[15px] flex">
                <div>
                    <ChatAlertIcon newMessage={false} />
                </div>
                <TopBarNotification setShowNotification={setShowNotification} hasNotification={hasNotification} />
                <TopBarAvatar />
            </div>
        </div>
    )
}

export default Topbar