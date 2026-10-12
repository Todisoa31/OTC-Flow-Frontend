"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { UserConversation } from "@/types/conversationType";
import { getUserListMessage } from "@/api/conversation";

type MessagingContextType = {
  userList: UserConversation[];
  refreshConversations: () => Promise<void>;
  selectConversation: UserConversation | null;
  setSelectConversation: (conv: UserConversation | null) => void;
};

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider = ({ children }: { children: React.ReactNode }) => {
  const [userList, setUserList] = useState<UserConversation[]>([]);
  const [selectConversation, setSelectConversation] = useState<UserConversation | null>(null);

  const refreshConversations = useCallback(async () => {
    try {
      const res = await getUserListMessage(9999);
      setUserList(res?.data?.data || []);
    } catch (error) {
      console.error("Erreur refresh conversations:", error);
    }
  }, []);

  return (
    <MessagingContext.Provider
      value={{ userList, refreshConversations, selectConversation, setSelectConversation }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const ctx = useContext(MessagingContext);
  if (!ctx) {
    throw new Error("useMessaging doit être utilisé dans un MessagingProvider");
  }
  return ctx;
};
