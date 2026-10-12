import { addFolderCommentApi, getFolderCommentsApi, updateFolderCommentApi } from '@/api/dossier';
import Input from '../inputs/Input';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Comments } from '@/types/recordType';

type Props = {
    id: number
    isSendComment?: boolean | null;
    setLoading?: Dispatch<SetStateAction<boolean>>;
}

function RecordComments(props: Props) {
    const { id, isSendComment, setLoading } = props;
    const [comments, setComments] = useState<Comments[] | null>(null);
    const [comment, setComment] = useState<string>('');

    const handleCommentChange = (value: string) => {
        setComment(value);
    }

    const handlePostOrUpdateComment = async (comment: string) => {
        try {
            if(comment.trim() === '') {
                return;
            }

            setLoading?.(true);
            if (comments && comments.length > 0) {
                const commentId = comments[0].id;
                await updateFolderCommentApi(commentId, comment);
            } else {
                await addFolderCommentApi(id, comment);
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }finally {
            setLoading?.(false);
        }
    }

    const handleGetComments = async () => {
        try {
            const response = await getFolderCommentsApi(id);
            setComments(response)
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    useEffect(() => {
        handleGetComments();
    }, [id]);

    useEffect(() => {
        if (comments && comments.length > 0) {
            setComment(comments[0].comment || '');
        }
    }, [comments]);

    useEffect(() => {
        if (isSendComment && comment.trim() !== '') {
            handlePostOrUpdateComment(comment);
        }
    }, [isSendComment]);

    return (
        <div className="self-stretch flex flex-col justify-start items-start gap-[15px]">
            <div className="justify-start text-[#101828] text-sm font-bold leading-[18px]">Commentaire principal</div>
            <Input
                className="w-full text-xs text-[#646d81] rounded-[20px]"
                placeholder="Ajouter votre correction ..."
                type="text"
                value={comment}
                height="h-auto min-h-[78px]"
                onChange={(value) => handleCommentChange(value)}
                multiline={true}
            />
        </div>
    )
}

export default RecordComments