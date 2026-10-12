import { Pagination } from "./filterType";

export type ParticipantsType = {
    id: number;
    firstname: string;
    lastname: string;
    role: string;
    profilePicture?: string
};

export type ReplyToType = {
    id: number;
    sender: ParticipantsType;
    content: string;
    timestamp: string;
};

type DossierType = {
    id: number;
    name: string;
}

export type MessageType = {
    id: number;
    conversation: number;
    sender: ParticipantsType;
    receiver: ParticipantsType;
    content: string;
    file?: string | null;
    original_file_name?: string | null;
    is_read: boolean;
    read_at: string | null;
    reply_to?: ReplyToType | null;
    timestamp: string
};

export type ConversationType = {
    id: number;
    dossier?: DossierType;
    participants: ParticipantsType[];
    messages: MessageType[];
    created_at: string
};

export type SendMessageType = {
    content: string;
    receiver?: number;
    reply_to?: number;
    file?: File; // ✅ Doit être File ou Blob
    folder_id: string;
    dossier_conversation_type?: ConverstionGetType;
};

export type ConverstionGetType = "Installateur" | "Contrôleur" | ""

export interface MessagesResponseType {
    messages: MessageType[];
    pagination: Pagination;
};

export type UserConversation = {
    id: any;
    conversationId: number;
    user: {
        id: number;
        role: string;
        profilePicture: string;
        isUserConnected: boolean;
        lastname: string;
        firstname: string;
        email: string;
    };
    lastMessage: string;
    lastMessageDate: string; // format ISO: "2025-07-10T10:01:02.031Z"
    isRead: boolean;
    messages: any;
};

export type ContractFilterType = {
    search_text?: string;
    installateur?: string;
    contract_type?: string;
    contract_status?: string;
    per_page?: number;
    page?: number;
}