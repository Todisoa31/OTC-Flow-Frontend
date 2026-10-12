import Input from '../inputs/Input';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getRecordByIdApi } from '@/api/recordInstallerApi';

type Props = {
    id: number
    setComment: Dispatch<SetStateAction<string>>;
    comment: string;
}

function RecordComment(props: Props) {
    const { id, setComment, comment } = props;

    const handleCommentChange = (value: string) => {
        setComment(value);
    }

    const handleGetComments = async () => {
        try {
            if(!id) return
            const response = await getRecordByIdApi(id);
            setComment(response.commentaire_principal)
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    useEffect(() => {
        handleGetComments();
    }, [id]);

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

export default RecordComment