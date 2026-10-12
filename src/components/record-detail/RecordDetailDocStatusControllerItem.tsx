import { Comments, Statuses } from "@/types/recordType";
import RecordStatusesButton from "../inputs/RecordStatusesButton";
import CalendarFilledIcon from "@/assets/icons/CalendarFilledIcon";

type Props = Readonly<{
    file_title: string;
    date: string;
    status: Statuses;
    comments: Comments[];
}>

function RecordDetailDocStatusControllerItem(props: Props) {
    const { file_title, date, status, comments } = props

    return (
        <div className="self-stretch p-5 bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-5">
            <div className="self-stretch inline-flex justify-start items-start gap-[15px]">
                <div className="self-stretch flex-1 inline-flex flex-col justify-center items-start gap-2.5">
                    <div className="self-stretch justify-start text-black-secondary text-sm font-bold leading-[18px]">{file_title}</div>

                </div>
                <div className="flex justify-start items-center gap-2.5">
                    <div className="w-[18px] h-[18px] relative rounded-[5px] overflow-hidden">
                        <div data-svg-wrapper className="left-[1.50px] top-[1.31px] absolute">
                            <CalendarFilledIcon />
                        </div>
                    </div>
                    <div className="justify-center text-dark-blue text-xs font-bold leading-[18px]">{date}</div>
                </div>
                <RecordStatusesButton status={status} className="!h-[30px] ml-auto" />
            </div>
            
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-2.5">
                <div className="justify-start text-[#101828] text-xs font-bold leading-[18px]">Commentaire :</div>
                <div className="self-stretch justify-start text-grey text-xs font-medium">
                    {comments?.[0]?.comment || 'Aucun commentaire'}
                </div>
            </div>
        </div>
    )
}

export default RecordDetailDocStatusControllerItem