"use client";

import { getConversation, postMessage } from '@/api/conversation';
import AttachFileIcon from '@/assets/icons/Chat/AttachFileIcon';
import ChatingIcon from '@/assets/icons/Chat/ChatingIcon';
import EmojiIcon from '@/assets/icons/Chat/EmpjiIcon';
import SendMessageIcon from '@/assets/icons/Chat/SendMessageIcon';
import { useAuth } from '@/providers/AuthProvider';
import { ConversationType, ConverstionGetType, MessageType } from '@/types/conversationType';
import { GetHourMinute } from '@/utils/getHourMinute';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import CloseIconBlack from '@/assets/icons/CloseIconBlack';
import { useChatSocket } from "@/hooks/useChatSocket";
import { useStatusDosserProvider } from '@/providers/StatusDossierProvider';

type Props = {
    hideTitle?: boolean;
    folder_id_props?: number | null;
    custopm_width?: string;
    hideInput?: boolean;
    userId?: number | null;
    conversationT?: ConverstionGetType
    customHeight?: string;
    noSticky?: boolean;
    noPadding?: boolean;
};

function RecordDetailChat({ hideTitle, folder_id_props, custopm_width, hideInput, userId, conversationT, customHeight, noSticky, noPadding }: Props) {
    const { user } = useAuth();
    const { id: folder_id } = useParams();
    // const { selectChat } = UseDetailFolderSideStore();
    const { setFilePdfModal, filePdfModal } = useStatusDosserProvider();

    const [messageText, setMessageText] = useState<string>('');
    const [conversation, setConversation] = useState<ConversationType | null>();
    const [replyTo, setReplyTo] = useState<MessageType | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const modaleEmojiRef = useRef<HTMLDialogElement>(null);

    const currentFolderId = Number(folder_id || folder_id_props);

    useChatSocket({
        dossierId: currentFolderId,
        dossierConversationType: conversationT || "Installateur",
        onMessageReceived: (newMessage) => {
            setConversation((prev) => {
                if (!prev) return prev;
                if (prev.messages.some((m) => m.id === newMessage.id)) return prev;
                return { ...prev, messages: [...prev.messages, newMessage] };
            });
        }
    });

    useEffect(() => {
        if (conversation?.messages.length && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

    const fetchConversation = async (folderId: number) => {
        setLoading(true);
        if (folderId) {
            try {
                const response = await getConversation(folderId, userId ?? undefined, conversationT);
                setConversation(response);
            } catch (error) {
                console.error("No conversation:", error);
                setConversation(null);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        // si userId envoi dans le getconversation

        if (folder_id) {
            fetchConversation(Number(folder_id));
        } else if (folder_id_props) {
            fetchConversation(Number(folder_id_props));
        }
    }, [folder_id, folder_id_props, userId]);

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setFilePreviewUrl(url);

            return () => {
                URL.revokeObjectURL(url);
                setFilePreviewUrl(null);
            };
        } else {
            setFilePreviewUrl(null);
        }
    }, [selectedFile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!messageText.trim() && !fileInputRef.current?.files?.[0]) return;
        if (!conversation || !user) return;

        // const receiver = conversation.participants.find(p => p.id !== user.id);
        // if (!receiver) {
        //     toast.info("Le système ne peut pas déterminer le destinataire du message.")
        //     return
        // };

        const file = fileInputRef.current?.files?.[0];

        try {
            const sentMessage = await postMessage({
                content: messageText,
                // receiver: receiver.id,
                folder_id: String(folder_id ? folder_id : folder_id_props),
                reply_to: replyTo?.id,
                file: file,
                dossier_conversation_type: conversationT
            });

            setConversation({
                ...conversation,
                messages: [...conversation.messages, sentMessage]
            });

            setMessageText('');
            setReplyTo(null);
            setSelectedFile(null);
            setFilePreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
            toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
        }
    };

    const renderFilePreview = (msg: MessageType) => {

        if (!msg.file) return null;
        // Remove trailing slash from API URL if present to avoid double slashes
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
        const fileUrl = msg.file;

        const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileUrl);
        const isPdf = /\.pdf$/i.test(fileUrl);

        return (
            <div className="">
                {isImage ? (
                    <a href={fileUrl} target="_blank">
                        <img src={fileUrl} alt="fichier joint" className="max-w-[200px] rounded-lg border" />
                    </a>
                ) : (
                    <div className="flex items-center gap-2">
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title='Télécharger le fichier joint'
                            className="text-primary-blue/60 text-sm inline-flex items-center gap-2"
                        >
                            <div><AttachFileIcon /></div>
                            <img src="/images/pdf_file.png" alt="fichier joint" className="w-[150px] h-[150px] rounded-lg border" />
                        </a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`${custopm_width ? custopm_width : "xl:w-[350px] lg:w-[350px] md:w-[300px]"} self-stretch ${noPadding ? "": 'pl-[30px]'} pr-0 ${hideTitle && "rounded-[15px]"} sticky top-0 inline-flex flex-col justify-start items-start gap-[30px] ${customHeight ? customHeight : "h-[calc(100vh-204px)]"}`}        >
            {!hideTitle && (
                <div className="self-stretch inline-flex justify-start items-center gap-[15px]">
                    <div className="w-[40px] h-[40px] bg-black-secondary rounded-[10px] flex justify-center items-center gap-2.5">
                        <ChatingIcon />
                    </div>
                    <div className="justify-start text-black-secondary text-2xl font-bold">Conversation</div>
                </div>
            )}

            <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-[30px] pr-[30px] overflow-y-auto">
                {loading ? (
                    <div className="w-full text-center text-gray-500 text-sm italic mt-4">Chargement...</div>
                ) : (
                    conversation && conversation.messages && conversation.messages.map((msg) => {
                        const isMe = msg.sender.id === user?.id;

                        return (
                            <div
                                key={msg.id}
                                className={`group self-stretch flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1 relative`}
                            >
                                <span className='text-[10px]'>{msg.sender.firstname} {msg.sender.lastname}</span>
                                <div
                                    className={`self-stretch p-[15px] ${isMe
                                        ? 'bg-primary-blue text-white rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px]'
                                        : 'bg-white text-[#001c56] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px]'
                                        } shadow-[0px_5px_20px_0px_rgba(0,0,0,0.03)] flex flex-col justify-start items-start gap-[15px]`}
                                >
                                    {msg.reply_to && (
                                        <div className="text-xs italic text-gray-600 border-l-2 border-gray-300 pl-2 mb-2">
                                            ↪ {msg.reply_to.content}
                                        </div>
                                    )}
                                    {msg.content && <div className="self-stretch text-sm font-normal leading-normal">{msg.content}</div>}
                                    {renderFilePreview(msg)}
                                </div>
                                <div className="text-[#7777a1] text-sm font-normal leading-normal">{GetHourMinute(msg.timestamp)}</div>

                                <button
                                    onClick={() => setReplyTo(msg)}
                                    className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto absolute top-2 right-2 transition"
                                    title='Répondre à ce message'
                                >
                                    ↪
                                </button>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {!hideInput && (
                <form onSubmit={handleSubmit} className={`${noSticky?'': 'sticky  bottom-5'} self-stretch flex flex-col !rounded-[30px] shadow-[0px_-10px_30px_0px_rgba(0,0,0,0.05)] justify-start items-center gap-2.5 ${noPadding ? "": 'mr-[30px]'}`}>
                    {replyTo && (
                        <div className='p-2 w-full'>
                            <div className="w-full p-2 bg-gray-100 rounded-lg text-sm relative">
                                <span className="text-gray-500">Réponse à :</span>
                                <div className="text-black">{replyTo.content}</div>
                                <button
                                    type="button"
                                    onClick={() => setReplyTo(null)}
                                    className="absolute top-1 right-2 bg-white hover:text-red-500 px-1 text-[#101828] rounded-xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedFile && filePreviewUrl && (
                        <div className="py-2 px-4 w-full flex items-center gap-4 relative bg-gray-100 rounded-lg">
                            {(() => {
                                const fileName = selectedFile.name.toLowerCase();
                                const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileName);
                                const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName);
                                const isPdf = /\.pdf$/i.test(fileName);

                                if (isImage) {
                                    return <img src={filePreviewUrl} alt="Aperçu image" className="max-w-[200px] rounded-lg border" />;
                                } else if (isVideo) {
                                    return (
                                        <video controls className="max-w-[300px] rounded-lg border">
                                            <source src={filePreviewUrl} type={selectedFile.type} />
                                            Votre navigateur ne supporte pas la lecture vidéo.
                                        </video>
                                    );
                                } else if (isPdf) {
                                    return (
                                        <div className="flex items-center gap-2">
                                            <img src="/images/pdf_file.png" alt="PDF" width={80} />
                                            <span className="text-sm text-gray-700">{selectedFile.name}</span>
                                        </div>
                                    );
                                } else {
                                    return <span className="text-sm text-gray-500">Fichier sélectionné : {selectedFile.name}</span>;
                                }
                            })()}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setFilePreviewUrl(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-1 right-2 bg-white hover:text-red-500 px-1 text-[#101828] rounded-xl"
                                title="Supprimer le fichier"
                            >
                                ✕
                            </button>
                        </div>
                    )}


                    <div className=" bg-white rounded-[20px] p-3 flex gap-2 w-full items-start">
                        <button
                            type="button"
                            onClick={() => { modaleEmojiRef.current?.showModal() }}
                        >
                            <EmojiIcon />
                        </button>
                        <input
                            type="text"
                            placeholder="Tapez un message ..."
                            className=' outline-none w-full text-black'
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()}>
                            <AttachFileIcon />
                        </button>
                        <button type="submit" >
                            <SendMessageIcon />
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSelectedFile(file);
                        }}
                    />
                </form>
            )}

            <dialog id="modal_emoji" className="modal" ref={modaleEmojiRef}>
                <div className="modal-box p-2 flex flex-col gap-2">
                    <div className=' flex justify-end w-full'>
                        <button onClick={() => modaleEmojiRef.current?.close()}><CloseIconBlack /></button>
                    </div>
                    <EmojiPicker
                        onEmojiClick={(emoji) => {
                            setMessageText(prev => prev + emoji.emoji);
                            modaleEmojiRef.current?.close();
                        }}
                    />
                </div>
            </dialog>
        </div>
    );
}

export default RecordDetailChat;
