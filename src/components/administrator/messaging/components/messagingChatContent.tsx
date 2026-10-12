"use client";

import { ConversationType, MessageType } from "@/types/conversationType";
import ConversationFooter from "./conversationFooter";
import ConversationHeader from "./conversationHeader";
import DiscussionContent from "./discussionContent";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import CloseIconBlack from "@/assets/icons/CloseIconBlack";
import { useChatSocket } from "@/hooks/useChatSocket";
import { postMessageToUser, getMessagesWithUser } from "@/api/conversation";
import { User } from "@/types/authType";
import { getUserInfo } from "@/api/user";
import { UseMessagingStore } from "@/stores/messagingStore";
import { useMessaging } from "@/contexts/Messaging/MessagingContext";

export default function MessagingChatContent() {
    const [textMessage, setTextMessage] = useState<string>("");
    const modaleEmojiRef = useRef<HTMLDialogElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [replyTo, setReplyTo] = useState<MessageType | null>(null);
    const [receiverId, setReceiverId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [conversation, setConversation] = useState<ConversationType | null>(null);
    const { selectConversation } = UseMessagingStore();
    const [haveNewMessage, setHaveNewMessage] = useState(false);

    const { refreshConversations } = useMessaging();

    // Récupération user connecté
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserInfo();
                setCurrentUser(user);
            } catch (error) {
                console.error("Erreur récupération user connecté :", error);
            }
        };
        fetchUser();
    }, []);

    // Connexion WS
    useChatSocket({
        receiverId: receiverId ?? undefined,
        onMessageReceived: (message) => {
            setConversation((prev) => {
                if (!prev) return prev;
                const exists = prev.messages.some((msg) => msg.id === message.id);
                if (exists) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, message],
                };
            });

            //Met à jour la liste des conversations pour refléter le dernier message
            refreshConversations();

            setHaveNewMessage(!haveNewMessage)
        },
    });

    // Chargement des messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!receiverId || !currentUser) return;
            try {
                const response = await getMessagesWithUser(receiverId);
                const messages = response.messages;
                if (!Array.isArray(messages)) {
                    console.error("⚠️ Les messages récupérés ne sont pas un tableau :", messages);
                    return;
                }
                const receiverUser: User = {
                    id: receiverId,
                    firstname: `User ${receiverId}`,
                    lastname: "",
                    role: "",
                    photo_profil: "",
                    email: "",
                    password: ""
                };
                setConversation({
                    id: receiverId,
                    created_at: new Date().toISOString(),
                    participants: [currentUser, receiverUser],
                    messages,
                });
            } catch (error) {
                console.error("Erreur chargement messages :", error);
            }
        };
        fetchMessages();
    }, [receiverId, currentUser]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!textMessage.trim() || !receiverId || !currentUser) return;

        try {
            const sentMessage = await postMessageToUser({
                receiver_id: receiverId,
                content: textMessage,
            });

            // Ajout immédiat dans la conversation pour affichage instantané
            setConversation((prev) => {
                if (!prev) return prev;
                const exists = prev.messages.some((msg) => msg.id === sentMessage.id);
                if (exists) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, sentMessage],
                };
            });

        // Met à jour la liste des conversations
        await refreshConversations();
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }

        setTextMessage("");
        setReplyTo(null);
    };

    const handleOpenEmoji = () => {
        modaleEmojiRef.current?.showModal();
    };

    useEffect(() => {
        setReceiverId(
            selectConversation?.user.id !== undefined
                ? parseInt(String(selectConversation.user.id))
                : null
        )
    }, [selectConversation]);

    return (
        <div className="w-full h-full relative flex flex-col">
            {/* Sélecteur ID destinataire */}
            <div className="p-2 hidden items-center gap-2 bg-gray-50 border-b">
                <label className="text-xs font-medium">Envoyer un message à l&apos;utilisateur ID :</label>
                <input
                    type="number"
                    placeholder="ID destinataire"
                    className="input input-bordered input-xs w-24"
                    value={receiverId ?? ""}
                    onChange={(e) => setReceiverId(e.target.value ? parseInt(e.target.value) : null)}
                />
                {receiverId && (
                    <span className="text-xs text-green-600">🟢 Canal actif ➡️ {receiverId}</span>
                )}
            </div>

            <ConversationHeader />

            {conversation ? (
                <DiscussionContent conversationData={conversation} setReplyTo={setReplyTo} haveMsg={haveNewMessage} />
            ) : (
                <div></div>
            )}

            <ConversationFooter
                onSubmit={onSubmit}
                value={textMessage}
                onChange={setTextMessage}
                handleOpenEmoji={handleOpenEmoji}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                fileInputRef={fileInputRef}
            />

            <input
                type="file"
                accept="*"
                ref={fileInputRef}
                className="hidden"
            />

            <dialog id="modal_emoji" className="modal" ref={modaleEmojiRef}>
                <div className="modal-box p-2 flex flex-col gap-2">
                    <div className="flex justify-end w-full">
                        <button onClick={() => modaleEmojiRef.current?.close()}>
                            <CloseIconBlack />
                        </button>
                    </div>
                    <EmojiPicker
                        onEmojiClick={(emoji) => {
                            setTextMessage((prev) => prev + emoji.emoji);
                            modaleEmojiRef.current?.close();
                        }}
                    />
                </div>
            </dialog>
        </div>
    );
}
