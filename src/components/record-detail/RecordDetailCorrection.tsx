'use client';
import { getRecordByIdApi } from "@/api/recordInstallerApi";
import { useTitle } from "@/providers/TitleProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TitleWithBack from "../TitleWithBack";
import RecordDetailCorrectionItem from "./RecordDetailCorrectionItem";
import CenterSpinner from "../loader/CenterSpinner";
import { UseCommentStore } from "@/stores/commentStore";

function RecordDetailCorrection() {
    const { id } = useParams();
    const { setTitle } = useTitle();
    const [recordDetail, setRecordDetail] = useState<Record<string, any>>({});
    const [fetching, setFetching] = useState(false);
    const { setShow, show } = UseCommentStore();

    useEffect(() => {
        setShow(true);
    },[])

    const handleGetRecordDetail = async (id: number) => {
        try {
            setFetching(true);
            const record = await getRecordByIdApi(id);
            setRecordDetail(record);
        } catch (error) {
            console.error('Error fetching record detail:', error);
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        handleGetRecordDetail(Number(id));
    }, [id])

    useEffect(() => {
        if (recordDetail?.name) {
            setTitle(<TitleWithBack title={`${recordDetail?.name} - Corrections du contrôleur`} />);
        } else {
            setTitle(<TitleWithBack title={`Corrections du contrôleur`} />);
        }
    }, [recordDetail?.name]);

    if (fetching) {
        return <CenterSpinner />
    }

    return (
        <>
            <div className=" px-[30px] py-4 flex items-center justify-end w-full">
                <button
                    onClick={() => setShow(!show)}
                    className=" bg-[#65A5BF] py-2 px-4 text-white w-fit flex items-center gap-2 rounded-[10px] text-[12px]"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.9054 17.8229L11.3571 17.0597C11.7075 16.4677 11.8827 16.1717 12.1641 16.008C12.4456 15.8444 12.7999 15.8383 13.5085 15.826C14.5546 15.808 15.2108 15.7439 15.761 15.516C16.782 15.0931 17.5931 14.282 18.016 13.261C18.3332 12.4953 18.3332 11.5246 18.3332 9.58317V8.74984C18.3332 6.02198 18.3332 4.65805 17.7192 3.65609C17.3756 3.09545 16.9042 2.62407 16.3436 2.2805C15.3416 1.6665 13.9777 1.6665 11.2498 1.6665H8.74984C6.02198 1.6665 4.65805 1.6665 3.65609 2.2805C3.09545 2.62407 2.62407 3.09545 2.2805 3.65609C1.6665 4.65805 1.6665 6.02198 1.6665 8.74984V9.58317C1.6665 11.5246 1.6665 12.4953 1.98367 13.261C2.40656 14.282 3.21771 15.0931 4.23866 15.516C4.78891 15.7439 5.44502 15.808 6.49115 15.826C7.19977 15.8383 7.55408 15.8444 7.8355 16.008C8.11691 16.1717 8.29211 16.4677 8.64251 17.0597L9.09426 17.8229C9.4969 18.5032 10.5027 18.5032 10.9054 17.8229ZM13.3332 9.99984C13.7934 9.99984 14.1665 9.62674 14.1665 9.1665C14.1665 8.70627 13.7934 8.33317 13.3332 8.33317C12.8729 8.33317 12.4998 8.70627 12.4998 9.1665C12.4998 9.62674 12.8729 9.99984 13.3332 9.99984ZM10.8332 9.1665C10.8332 9.62674 10.4601 9.99984 9.99984 9.99984C9.5396 9.99984 9.1665 9.62674 9.1665 9.1665C9.1665 8.70627 9.5396 8.33317 9.99984 8.33317C10.4601 8.33317 10.8332 8.70627 10.8332 9.1665ZM6.6665 9.99984C7.12674 9.99984 7.49984 9.62674 7.49984 9.1665C7.49984 8.70627 7.12674 8.33317 6.6665 8.33317C6.20627 8.33317 5.83317 8.70627 5.83317 9.1665C5.83317 9.62674 6.20627 9.99984 6.6665 9.99984Z" fill="white" />
                    </svg>
                    {show ? "Conversation" : "Voir les commentaires"}
                </button>
            </div>
            {recordDetail?.files?.map((item: any) => (
                <RecordDetailCorrectionItem
                    key={item.id}
                    file_title={item.title_file}
                    extractedDateItems={item.corrections}
                />
            ))}
        </>
    )
}

export default RecordDetailCorrection