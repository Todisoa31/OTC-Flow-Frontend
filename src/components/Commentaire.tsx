"use client";

import { getCommentByFileIdApi, postCommentApi } from "@/api/recordControllerApi";
import SendMessageIcon from "@/assets/icons/Chat/SendMessageIcon";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import { UseCommentStore } from "@/stores/commentStore";
import { CommentType } from "@/types/general";
import { formatTimestamp } from "@/utils/getHourMinute";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CenterSpinner from "./loader/CenterSpinner";
import { toast } from "react-toastify";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";

type Props = {
  file_id_props?: number | null
}

export default function CommentSidebar(props: Props) {
    const { file_id_props } = props;
    const { show, setShow } = UseCommentStore();
    const { file_id, id } = useParams();
    const [loading, setLoagin] = useState(false);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [texte, setTexte] = useState<string>("");
    const { setCommentFileId, commentFileId } = useStatusDosserProvider();

    const paramId = (file_id_props && file_id_props !== null) ? file_id_props : (file_id || id);

    const getComment = async () => {
        const parsedId = Number(paramId);

        if (!paramId || isNaN(parsedId) || parsedId <= 0) {
            console.warn("ID de fichier invalide :", paramId);
            return;
        }

        setLoagin(true);

        try {
            const res = await getCommentByFileIdApi(parsedId);
            setComments(res);
        } catch (error) {
            console.error("Erreur lors de la récupération des commentaires :", error);
        } finally {
            setLoagin(false);
        }
    };

    const closeComments = () => {
        (commentFileId && commentFileId!==null) && setCommentFileId(null);
        setShow(false);
    }


    const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!texte.trim()) return;

        try {
            await postCommentApi(Number(paramId), texte);

            let latestComment: CommentType = {
                id: comments.length + 1,
                created_at: new Date().toISOString(),
                comment: texte
            };

            setComments([...comments, latestComment]);

            setTexte("");
            getComment();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'envoi du commentaire");
        }
    };

    useEffect(() => {
        getComment();
    }, [file_id, show])


    return (
        <div
            className={clsx(
                "fixed inset-0 z-20 flex transition-opacity duration-300",
                show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            <div
                className="h-screen xl:w-[80%] lg:w-[76%]  "
                onClick={closeComments}
            />

            <div
                className={clsx(
                    "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
                    show
                        ? "translate-x-0 opacity-100"
                        : "translate-x-full opacity-0"
                )}
            >
                <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#edf3f8]">
                    <div className=" flex gap-2 items-center">
                        <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">Commentaires</div>
                    </div>
                    <button onClick={closeComments}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="bg-white">
                    <div
                        className="self-stretch h-[calc(100vh-280px)] p-[30px] flex flex-col justify-start items-start gap-5 overflow-auto "
                    >
                        {loading ? <CenterSpinner /> :
                            comments?.map((item) => (
                                <div key={item.id} className=" bg-[#edf3f8] rounded-[15px] p-[20px] text-grey flex flex-col gap-2 relative min-w-[200px]">
                                    <b className=" text-black ">{item.controlleur?.firstname} {item.controlleur?.lastname}</b>
                                    <span className=" text-[12px]">{formatTimestamp(item.created_at ?? "")}</span>
                                    <p className=" text-[12px]">{item.comment}</p>
                                    <span className=" absolute top-2 right-2 text-[8px] font-bold rounded-sm px-1 bg-grey text-white">{item.controlleur?.role}</span>
                                </div>
                            ))
                        }
                    </div>
                    <form onSubmit={handleSubmitComment} className=" h-[20vh] p-[30px] border-t-2 gap-2 flex flex-col justify-between ">
                        <textarea
                            className=" w-full border rounded-[10px] p-[15px] outline-none text-[12px] text-grey"
                            placeholder="Ajouter votre correction ..."
                            value={texte}
                            onChange={(e) => setTexte(e.target.value)}
                        />
                        <button className=" flex items-center w-full justify-center gap-2 bg-[#65A5BF] text-white font-bold py-2 rounded-[10px]" >
                            <SendMessageIcon color="#fff" />
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};