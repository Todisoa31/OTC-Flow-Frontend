"use client";

import { useEffect } from "react";
import MessagingChatContent from "./components/messagingChatContent";
import { useTitle } from "@/providers/TitleProvider";
// import FolderMessaging from "./components/folderMessaging";
import DiscussionList from "./components/discussionList";

export default function MessagingPage() {
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Messagerie");
    }, [])


    return (
        <div className="w-full h-full flex">
            <div className=" w-[30%] ">
                <DiscussionList />
            </div>
            <div className=" w-[70%] border-l border-white">
                <MessagingChatContent />
            </div>
            {/* <div className=" w-[25%] border-l border-white">
                <FolderMessaging />
            </div> */}
        </div>
    )
};