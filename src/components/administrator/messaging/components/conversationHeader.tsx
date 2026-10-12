"use client";

import SearchIcon2 from "@/assets/icons/SearchIcon2";
import { UseMessagingStore } from "@/stores/messagingStore";

export default function ConversationHeader() {
    const { selectConversation } = UseMessagingStore();

    return (
        <div className=" flex items-center justify-between h-[100px]  px-[30px] border-b border-white">
            <div className=" flex items-center gap-3">
                <div className=" relative">
                    <img src="/images/usProfil.jpg" alt="avatar" width={38} height={38} />
                    <span className={`w-3 h-3 border-2 border-white ${selectConversation?.user.isUserConnected ? "bg-primary-green" : "bg-grey"} absolute bottom-0 right-0 rounded-full`}></span>
                </div>
                <div className=" flex flex-col justify-between">
                    <span className=" text-black text-[12px] font-[700]">{selectConversation?.user.firstname} {selectConversation?.user.lastname}</span>
                    <span className="font-bold text-grey text-xs">{selectConversation?.user.role}</span>
                </div>
            </div>

            <div className=" hidden">
                <button
                    className=" rounded-[10px] bg-white p-[10px]"
                >
                    <SearchIcon2 />
                </button>
            </div>
        </div>
    )
}