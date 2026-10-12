import { Statuses } from "@/types/recordType";
import Button from "./Button";
import { cn } from "@/utils/tailwind";
import { getColorByStatus } from "@/utils/record";
import ArrowRightIcon2 from "@/assets/icons/ArrowRightIcon2";
import Select from "./Select";
import { CONTROL_STATUSES_OPTIONS, STATUSES_OPTIONS } from "@/constants/records";
import { useEffect, useState } from "react";
import { updateFolderStatusApi } from "@/api/dossier";

type DashboardRecordsStatusesProps = {
    readonly status: Statuses,
    readonly onClick?: () => void
    readonly className?: string,
    readonly showIcon?: boolean,
    isCofrac?: boolean,
    editable?: boolean,
    id?: number,
    statusLabel?: string
}

function RecordStatusesButton(props: DashboardRecordsStatusesProps) {
    const { status, id, className, showIcon, onClick, isCofrac, editable, statusLabel } = props
    const [bgClass, setBgClass] = useState<string>('');
    const [colorClass, setColorClass] = useState<string>('');
    const [iconColor, setIconColor] = useState<string>('');
    const [label, setLabel] = useState<string>('');

    const [selectedStatus, setSelectedStatus] = useState<Statuses>(status);
    const [loading, setLoading] = useState(false);

    const handleChangeStatus = async (statusCode: Statuses) => {
        if(!id) return;
        try {
            setLoading(true);
            await updateFolderStatusApi(id, statusCode);
            setSelectedStatus(statusCode);
        }catch (error) {
            console.error("Error updating status:", error);
        }finally {
            setLoading(false);
        }
    }

    const handleUpdateStatus = (statusCode: Statuses) => {
        const config = getColorByStatus(statusCode, isCofrac);
        setBgClass(config.bgClass);
        setColorClass(config.colorClass);
        setLabel(config.label);
        setIconColor(config.iconColor);
    }

    useEffect(() => {
        handleUpdateStatus(status);
        setSelectedStatus(status);
    }, [status]);

    useEffect(() => {
        handleUpdateStatus(selectedStatus);
    }, [selectedStatus]);

    return (
        <div data-svg-wrapper className=" min-w-[20%] flex flex-row items-center justify-between gap-2.5">
            {editable
                ?
                <Select
                    options={isCofrac ? CONTROL_STATUSES_OPTIONS : STATUSES_OPTIONS}
                    onChange={(value) => handleChangeStatus(value as Statuses)}
                    value={selectedStatus as string}
                    multiple={false}
                    search={false}
                    labelClassName={cn([colorClass, 'font-bold'])}
                    className={cn(["!h-[30px] rounded-[5px] px-[1px]", bgClass, colorClass, className])}
                    loading={loading}
                    iconColor={iconColor}
                />
                :
                <Button
                    label={statusLabel || label}
                    onClick={onClick}
                    className={cn(["!h-[30px] rounded-[5px] px-[1px]", colorClass, className])
                    }
                    bg={bgClass}
                    loading={loading}
                    labelClassName={colorClass}
                />
            }

            {showIcon && <ArrowRightIcon2 />}
        </div>
    )
}

export default RecordStatusesButton