import { Statuses } from "@/types/recordType";
import { getColorByStatus } from "@/utils/record";
import RecordStatusesButton from "../inputs/RecordStatusesButton";
import { useParams, useRouter } from "next/navigation";

type Props = {
    label: string;
    status: Statuses;
}

function RecordDetailImageStatusItem(props: Props) {
    const {label, status} = props
    const { borderClass } = getColorByStatus(status)
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const ATTESTION_ROUTE = `/record_detail/${id}/attestation`

    const handleClickRecord = () => {
        if(status === "tocorrect"){
            router.push(ATTESTION_ROUTE)
        }
    }

    return (
        <div className="self-stretch px-[30px] flex flex-col justify-center items-start gap-[15px]">
                <div className="justify-start text-dark-blue text-sm font-medium leading-[18px]">{label} :</div>
                <div className={`${borderClass} self-stretch h-[50px] px-2.5 bg-white rounded-[10px] outline outline-2 outline-offset-[-2px] inline-flex justify-start items-center gap-2.5`}>
                    <div className="flex-1 flex justify-start items-center gap-2.5">
                        <img className="w-[38px] h-[30px] rounded-[5px]" src="https://placehold.co/38x30" />
                        <img className="w-[38px] h-[30px] rounded-[5px]" src="https://placehold.co/38x30" />
                        <img className="w-[38px] h-[30px] rounded-[5px]" src="https://placehold.co/38x30" />
                    </div>
                    <RecordStatusesButton onClick={handleClickRecord} status={status} />
                </div>
            </div>
    )
}

export default RecordDetailImageStatusItem