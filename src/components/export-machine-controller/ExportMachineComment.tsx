'use client';;
import CaretRightIcon from "@/assets/icons/CaretRightIcon";
import Button from "../inputs/Button";
import Input from "../inputs/Input";
import { useEffect, useState } from "react";
import CaretLeft2Icon from "@/assets/icons/CaretLeft2Icon";
import { useParams, useRouter } from "next/navigation";
import { FILE_TYPES } from "@/constants/records";
import { EXPORT_MACHINE_ROUTE, RECORD_DETAIL_CONTROLLER_ROUTE, routeWithParams } from "@/constants/routes";
import { useRecord } from "@/providers/RecordProvider";
import { getCommentByFileIdApi, postCommentApi } from "@/api/recordControllerApi";
import { Comments } from "@/types/recordType";

function ExportMachineComment() {
    const [comment, setComment] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [postCommentLoading, setPostCommentLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const { selectedFile } = useRecord();

    const file_type = params.file_type as keyof typeof FILE_TYPES;
    const recordId = params.id as string;

    const handleNextAndSave = () => {
        const fileTypesArray = Object.keys(FILE_TYPES);
        const currentIndex = fileTypesArray.indexOf(file_type);
        const next_file_type = fileTypesArray[(currentIndex + 1) % fileTypesArray.length];
        if (currentIndex === fileTypesArray.length - 1) {
            router.push(routeWithParams(RECORD_DETAIL_CONTROLLER_ROUTE, { id: recordId }));
        } else {
            router.push(routeWithParams(EXPORT_MACHINE_ROUTE, { id: recordId, file_type: next_file_type }));
        }
    }

    const handlePostComment = async () => {
        try {
            setPostCommentLoading(true);
            setComment('');
            if (selectedFile && comment) {
                const { id: file_id } = selectedFile;
                await postCommentApi(file_id, comment);
            }
            handleNextAndSave();
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setPostCommentLoading(false);
        }
    }

    const handleGetComment = async () => {
        try {
            setLoading(true);
            if (!selectedFile?.id) return;
            const response: Comments[] = await getCommentByFileIdApi(selectedFile?.id);
            if(response && response.length > 0) {
                const { comment } = response[0];
                setComment(comment);
            }
        } catch (error) {
            console.error('Error fetching comment:', error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        setComment('')
        if(selectedFile && selectedFile?.type_file === file_type){
            handleGetComment();
        }
    }, [selectedFile, file_type]);

    if (!params) {
        return null;
    }

    return (
        <div className="sticky rounded-br-[33px] bottom-0 mt-auto self-stretch p-[30px] bg-black/60 shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70  inline-flex flex-col justify-start items-end gap-5">
            <div className="self-stretch flex flex-col justify-start items-start gap-5">
                <div className="self-stretch justify-start text-white text-sm font-bold leading-[18px]">Ajouter un commentaire</div>
            </div>
            <div className="self-stretch inline-flex justify-between items-end">
                <div className="w-[500px] min-h-[78px] h-auto p-[15px] bg-white rounded-[10px] flex justify-start items-start gap-2.5">
                    {/* <div className="justify-center text-[#101828]/30 text-xs font-medium">
                    Ajouter votre commentaire ...
                    </div> */}
                    <Input
                        className="w-full h-full text-xs"
                        placeholder="Ajouter votre commentaire ..."
                        type="text"
                        value={comment}
                        height="h-auto"
                        onChange={(value) => setComment(value)}
                        multiline
                    />
                </div>
                <div className="inline-flex justify-start items-start gap-5">
                    {
                        file_type !== 'file_attestation' &&
                        <Button
                            label="Précédent"
                            className="h-[40px] pl-5 pr-2.5 bg-black-secondary rounded-[10px] flex justify-start items-center gap-2.5"
                            onClick={() => router.back()}
                            iconLeft={<CaretLeft2Icon />}
                        />
                    }
                    <Button
                        label="Enregistrer et continuer"
                        className="h-[40px] pl-5 pr-2.5 bg-primary-blue rounded-[10px] flex justify-start items-center gap-2.5"
                        onClick={handlePostComment}
                        loading={postCommentLoading}
                        iconRight={<CaretRightIcon />}
                    />
                </div>
            </div>
        </div>
    )
}

export default ExportMachineComment