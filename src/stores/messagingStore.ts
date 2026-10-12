import { UserConversation } from '@/types/conversationType';
import { MessagingConversationType } from '@/types/messagingType';
import { create } from 'zustand';

type Store = {
    selectConversation: UserConversation | null;
    setselectConversation: (user: UserConversation) => void;
};

export const UseMessagingStore = create<Store>()((set) => ({
    selectConversation: null,
    setselectConversation: (selectConversation: UserConversation) => set({ selectConversation: selectConversation }),
}))