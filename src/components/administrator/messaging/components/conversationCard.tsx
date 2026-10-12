"use client";

// import { INSTALLER_ROUTE } from "@/constants/routes";
// import { useAuth } from "@/providers/AuthProvider";
import { UseMessagingStore } from "@/stores/messagingStore";
import { UserConversation } from "@/types/conversationType";
import { getElapsedTime } from "@/utils/getElapsedTime";
// import { usePathname } from "next/navigation";

type Props = {
    conversation: UserConversation;
};

export default function ConversationCard({ conversation }: Props) {
    // const pathname = usePathname();
    // const userConnected = useAuth();
    const { setselectConversation, selectConversation } = UseMessagingStore();
    const selected = conversation.user.id === selectConversation?.user.id;

    // Filtre si on est sur INSTALLER_ROUTE,  l'utilisateur connecter ne doit pas voir les messages des autres installateurs
    // if (pathname.includes(INSTALLER_ROUTE) && userConnected.user?.role === "Installateur" && conversation.user.role === "Installateur") {
    //     return null;
    // }

    return (
        <div
            onClick={() => setselectConversation(conversation)}
            className={`flex items-center gap-3 p-[15px] rounded-[10px] ${selected ? "bg-[#65A5BF]" : "bg-[#f0f8fa]"} border-2 border-white relative h-[60px] cursor-pointer`}
        >
            <div className="relative">
                <img src="/images/usProfil.jpg" alt="avatar" width={38} height={38} />
                <span className={`w-3 h-3 rounded-full border-2 border-white ${conversation.user.isUserConnected ? "bg-primary-green" : "bg-[#ACB6C9]"} absolute bottom-0 right-0`}></span>
            </div>
            <div className="flex flex-col justify-between">
                <span className={`text-[12px] ${selected ? "text-white" : "text-[#101828]"} ${!conversation.isRead && 'font-[800]'}`}>
                    {conversation.user.firstname} {conversation.user.lastname}
                </span>
                <p className={`text-[12px] max-w-[180px] truncate ${selected ? "text-white" : "text-[#646E81]"} ${!conversation.isRead && 'font-[800]'}`}>
                    {conversation.lastMessage}
                </p>
            </div>
            <span className={`absolute top-2 right-2 text-[11px] ${selected ? 'text-white' : 'text-[#646E81]'}`}>
                {getElapsedTime(conversation.lastMessageDate)}
            </span>
        </div>
    )
};