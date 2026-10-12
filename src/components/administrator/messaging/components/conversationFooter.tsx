"use client";

import AttachFileIcon from "@/assets/icons/Chat/AttachFileIcon";
import EmojiIcon from "@/assets/icons/Chat/EmpjiIcon";
import SendMessageIcon from "@/assets/icons/Chat/SendMessageIcon";
import { MessageType } from "@/types/conversationType";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    handleOpenEmoji?: () => void;
    replyTo: MessageType | null;
    setReplyTo: Dispatch<SetStateAction<MessageType | null>>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function ConversationFooter({ value = "", onChange, onSubmit, handleOpenEmoji, replyTo, setReplyTo, fileInputRef }: Props) {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

    return (
        <div className=" w-full flex flex-col absolute bottom-0 left-0">

            {replyTo && (
                <div className='p-2 w-full'>
                    <div className="w-full p-2 bg-gray-100 rounded-lg text-sm relative">
                        <span className="text-gray-500">Réponse à :</span>
                        <div className="text-black">{replyTo?.content}</div>
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

            <form onSubmit={onSubmit} className="  w-full flex items-center h-[100px] border-t border-white px-[30px] gap-2">
                <input
                    type="text"
                    className=" outline-none border-none w-full bg-transparent text-black"
                    placeholder="Taper un message ..."
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                />
                <div className=" flex items-center gap-3">
                    <button type="button" onClick={handleOpenEmoji}>
                        <EmojiIcon />
                    </button>
                    <button type="button" onClick={() => fileInputRef?.current?.click()}>
                        <AttachFileIcon size="24" />
                    </button>
                    <button
                        className=" rounded-[10px] px-[20px] py-[15px] flex items-center gap-2 bg-primary-blue text-white"
                    >
                        Envoyer
                        <SendMessageIcon color="#fff" />
                    </button>
                </div>

            </form>
        </div>
    )
};