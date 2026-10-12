'use client';

import { ExtractedDataItem } from "@/types/recordType";

type Props = {
    file_title: string;
    extractedDateItems: ExtractedDataItem[] | null
}
function RecordDetailCorrectionItem(props: Props) {
    const { file_title, extractedDateItems } = props;

    if(!extractedDateItems || extractedDateItems.length === 0) {
        return null;
    }
    
    return (
        <div className="self-stretch px-[30px]  inline-flex flex-col justify-start items-start gap-[30px]">
            <div className="w-[873px] h-[17px] justify-start text-black-secondary text-2xl font-bold">{file_title}</div>
            <div className="self-stretch rounded-[15px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.07)] flex flex-col justify-start items-start overflow-hidden">
                <Headers file_title={file_title} />
                <Rows extractedDateItems={extractedDateItems} />
            </div>
        </div>
    )
}

function Headers(props: { file_title: string }) {
    const { file_title } = props;
    return (
        <div className="self-stretch h-[40px] px-5 bg-primary-blue inline-flex justify-start items-center gap-5">
            <div className="flex-1 flex justify-start items-center gap-2.5">
                <div className="flex-1 self-stretch justify-center items-center text-white text-xs font-medium">{file_title}</div>
            </div>
            <div className="flex-1 self-stretch flex justify-start items-center gap-2.5">
                <div className="justify-center text-white text-xs font-medium">Correction du contrôleur</div>
            </div>
        </div>
    )
}

function Rows(props: { extractedDateItems: ExtractedDataItem[] | null }) {
    const { extractedDateItems } = props;

    return (
        <>
            {extractedDateItems?.map((item: any, index) => (
                <div key={item.id} className="self-stretch h-[70px] px-5 bg-[#fefefe]/40 outline outline-1 outline-[#eaf0f2] inline-flex justify-start items-center gap-5 overflow-hidden">
                    <div className="flex-1 self-stretch flex justify-start items-center gap-2.5">
                        <div className="flex self-stretch justify-center items-center text-black-secondary text-xs font-medium">
                            {item.infos}
                        </div>
                    </div>
                    <div className="flex-1 self-stretch flex justify-start items-center gap-2.5">
                        <div className="flex self-stretch justify-center items-center text-dark-blue text-xs font-medium">
                            {item?.controller_corrections?.[0]?.correction_value}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default RecordDetailCorrectionItem