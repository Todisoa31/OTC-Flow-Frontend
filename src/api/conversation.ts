import { ConversationType, ConverstionGetType, SendMessageType, MessageType, MessagesResponseType } from "@/types/conversationType";
import axiosInstance from "@/utils/axiosConfig";

// Get conversation
export async function getConversation(folder_id: number, receiver_id?: number, dossier_conversation_type?: ConverstionGetType): Promise<ConversationType> {
  try {
    const response = await axiosInstance.get(`/chat/list_conversations?folder_id=${folder_id}&receiver_id=${receiver_id}&dossier_conversation_type=${dossier_conversation_type}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Optionally rethrow the error to handle it upstream
  }
};

// Post message
export async function postMessage(data: SendMessageType): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("content", data.content);
    // formData.append("receiver", String(data.receiver));
    formData.append("folder_id", data.folder_id);

    if (data.reply_to) {
      formData.append("reply_to", String(data.reply_to));
    }

    if (data.file) {
      formData.append("file", data.file);
    }

    if (data.dossier_conversation_type) {
      formData.append("dossier_conversation_type", data.dossier_conversation_type);
    }

    const response = await axiosInstance.post("/chat/send_message_team", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    throw error;
  }
}

// Get all messages with a user (messagerie 1-1 sans dossier)
export async function getMessagesWithUser(userId: number): Promise<MessagesResponseType> {
  try {
    const response = await axiosInstance.get(`/chat/list_messages_with_user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getMessagesWithUser:", error);
    throw error;
  }
}

// Post message to user (messagerie 1-1 sans dossier)
export async function postMessageToUser({
  receiver_id,
  content,
}: {
  receiver_id: number;
  content: string;
}): Promise<MessageType> {
  try {
    const response = await axiosInstance.post("/chat/send_message_to_user", {
      receiver_id,
      content,
    });

    return response.data;
  } catch (error) {
    console.error("Erreur postMessageToUser:", error);
    throw error;
  }
}

export const getUserListMessage = async (per_page?: number, search_text?: string) => {
  return await axiosInstance.get(`/chat/users_with_last_messages?per_page=9999`);
}