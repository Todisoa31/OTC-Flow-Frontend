import { Role } from "./authType";

export type MenuSwitchType = {
    id: number;
    title: string;
    code: Role | 'all';
};

type UserType = {
    id: number;
    role: Role
    username: string;
    profilePicture: string;
    isUserConnected: boolean;
};

type FolderType = {
    id: number;
    name: string;
}

export type MessagingConversationType = {
    conversationId: number;
    user: UserType;
    lastMessage: string;
    lastMessageDate: string;
    isRead: boolean;
    folder: FolderType;
};