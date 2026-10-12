import { getConversation } from "@/api/conversation";
import { useAuth } from "@/providers/AuthProvider";
import { UseMessagingStore } from "@/stores/messagingStore";
import { ConversationType, MessageType } from "@/types/conversationType";
import { getFile } from "@/utils/getFile";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Props = {
    conversationData: ConversationType;
    setReplyTo: Dispatch<SetStateAction<MessageType | null>>;
    haveMsg?: boolean;
}

export default function DiscussionContent({ conversationData, setReplyTo, haveMsg }: Props) {
    const { user } = useAuth();
    const { selectConversation } = UseMessagingStore();

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [conversation, setConversation] = useState<ConversationType | null>();

    const fetchConversation = async (folderId: number) => {
        if (folderId) {
            try {
                // const response = await getConversation(folderId);
                setConversation(conversationData);
            } catch (error) {
                console.error("No conversation:", error);
                setConversation(null);
            }
        }
    };

    useEffect(() => {
        fetchConversation(Number(104));
    }, [selectConversation]);

    useEffect(() => {
        fetchConversation(Number(104));
    }, [conversationData])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [haveMsg])

    return (
        <div className="p-8 overflow-y-auto h-[60vh] space-y-2">
            {conversation?.messages.map((msg, index, messages) => {
                const isMe = msg.sender.id === user?.id;

                const currentTime = new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                const prevMsg = messages[index - 1];
                const nextMsg = messages[index + 1];

                const prevSenderId = prevMsg?.sender.id;
                const prevTime = prevMsg
                    ? new Date(prevMsg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : null;

                const nextSenderId = nextMsg?.sender.id;
                const nextTime = nextMsg
                    ? new Date(nextMsg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : null;

                const isFirstOfGroup =
                    msg.sender.id !== prevSenderId || currentTime !== prevTime;

                const isLastOfGroup =
                    msg.sender.id !== nextSenderId || currentTime !== nextTime;

                const isNotFirstOfGroup = !isFirstOfGroup;

                return (
                    <div
                        key={msg.id}
                        className={`group relative flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                        {!isMe && isFirstOfGroup && (
                            <div className="mr-2">
                                <img
                                    src={msg.sender.profilePicture ? getFile(msg.sender.profilePicture ?? "") : "/images/usProfil.jpg"}
                                    alt={msg.sender.firstname + " " + msg.sender.lastname}
                                    className="w-8 h-8 rounded-full self-end"
                                />
                            </div>
                        )}

                        <div className="flex flex-col items-start space-y-1 max-w-[70%] relative">
                            <div
                                className={`px-4 py-2 rounded-xl text-sm ${isMe
                                    ? `bg-[#63a1b8] text-white self-end ${isNotFirstOfGroup ? "mr-10" : ""}`
                                    : `bg-white text-gray-800 ${isNotFirstOfGroup ? "ml-10" : ""}`
                                    }`}
                            >
                                {msg.reply_to && (
                                    <div className="text-xs italic text-gray-600 border-l-2 border-gray-300 pl-2 mb-2">
                                        ↪ {msg.reply_to.content}
                                    </div>
                                )}
                                {msg.content}
                            </div>

                            {isLastOfGroup && (
                                <div
                                    className={`text-xs text-gray-500 pl-1 ${isMe ? `self-end ${isNotFirstOfGroup ? "mr-10" : ""}` : ""} ${isNotFirstOfGroup ? "ml-10" : ""}`}
                                >
                                    {currentTime}
                                </div>
                            )}

                            {/* Bouton Répondre visible au survol */}
                            <button
                                onClick={() => setReplyTo(msg)}
                                className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto absolute -top-2 right-2 transition text-gray-500 hover:text-blue-600"
                                title="Répondre à ce message"
                            >
                                ↪
                            </button>
                        </div>

                        {isMe && isFirstOfGroup && (
                            <div className="ml-2">
                                <img
                                    src={msg.sender.profilePicture ? getFile(msg.sender.profilePicture ?? "") : "/images/usProfil.jpg"}
                                    alt={msg.sender.firstname + " " + msg.sender.lastname}
                                    className="w-8 h-8 rounded-full self-end"
                                />
                            </div>
                        )}
                    </div>

                );
            })}

            <div ref={messagesEndRef} />
        </div>
    );
};