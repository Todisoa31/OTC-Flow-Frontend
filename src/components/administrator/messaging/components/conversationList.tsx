"use client";

import { useEffect } from "react";
import ConversationCard from "./conversationCard";
import { useMessaging } from "@/contexts/Messaging/MessagingContext";

type Props = {
  searchValue?: string;
};


export default function ConversationList({ searchValue }: Props) {
  const { userList, refreshConversations, selectConversation, setSelectConversation } = useMessaging();

  useEffect(() => {
    const init = async () => {
      await refreshConversations();
      if (userList.length > 0 && !selectConversation) {
        setSelectConversation(userList[0]);
      }
    };
    init();
  }, [refreshConversations, selectConversation, setSelectConversation, userList]);

  
  const filteredList = searchValue
    ? userList.filter((conv) =>
        `${conv.user.firstname} ${conv.user.lastname}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    : userList;

    // const filteredList = searchValue
    // ? userList.filter((conv) =>
    //     // Cherche dans le nom
    //     `${conv.user.firstname} ${conv.user.lastname}`
    //         .toLowerCase()
    //         .includes(searchValue.toLowerCase())
    //     ||
    //     // Cherche dans tous les messages
    //     conv.messages?.some((msg) =>
    //         msg.content.toLowerCase().includes(searchValue.toLowerCase())
    //     )
    //     )
    // : userList;

  return (
    <div className="px-[20px] py-[10px] w-full">
      <div className="h-[70vh] overflow-y-auto custom-scroll pr-2">
        <div className="flex flex-col gap-2">
          {filteredList?.map((conversation) => (
            <ConversationCard
              key={conversation.user.id}
              conversation={conversation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}