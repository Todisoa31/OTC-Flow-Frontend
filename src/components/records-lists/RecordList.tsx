'use client';

import RecordListHeader from "./RecordListHeader";
import RecordStatusesButton from "../inputs/RecordStatusesButton";
import EmptyRecord from "../empty/EmptyRecord";
import { formatDateTime } from "@/utils/date";
import {
    FILES_TO_CORRECT_ROUTE,
    FILES_TO_PROCESS_ROUTE,
    FILES_VALIDATED_ROUTE,
    HISTORY_ROUTE,
    RECORD_DETAIL_INSTALLER_ROUTE,
    routeWithParams,
} from "@/constants/routes";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ROLE_CONTROLLER, ROLE_INSTALLER } from "@/constants/userConst";
import CenterSpinner from "../loader/CenterSpinner";
import { Statuses } from "@/types/recordType";

type Props = Readonly<{
    records: Record<string, any>[];
    loading?: boolean;
}>;

function RecordList({ records, loading }: Props) {
    const router = useRouter();
    const { user } = useAuth();
    const pathname = usePathname();

    const isInstaller = user?.role === ROLE_INSTALLER;
    const isController = user?.role === ROLE_CONTROLLER;
    const isHistory = isController && pathname === HISTORY_ROUTE;

    if (!records || !Array.isArray(records) || records.length === 0) {
        return <EmptyRecord />;
    }

    if (loading) {
        return <CenterSpinner />;
    }

    const handleClickListItem = (record: any, status: Statuses) => {
        const recordId = record.id;
        const fileTo = record.files?.find((item: any) => item.type_file === "file_devis")?.id;

        if (isInstaller) {
            router.push(routeWithParams(RECORD_DETAIL_INSTALLER_ROUTE, { id: recordId }));
        } else if (isHistory || status === 'approved' || status === 'refused') {
            router.push(`${FILES_VALIDATED_ROUTE}/${recordId}${fileTo ? `/file-details/${fileTo}` : ''}`);
        } else if (status === 'tocorrect') {
            router.push(`${FILES_TO_CORRECT_ROUTE}/${recordId}${fileTo ? `/file-details/${fileTo}` : ''}`);
        } else {
            router.push(`${FILES_TO_PROCESS_ROUTE}/${recordId}${fileTo ? `/file-details/${fileTo}` : ''}`);
        }
    };

    return (
        <div className="self-stretch pb-5 flex-col justify-start items-start gap-5 flex">
            <RecordListHeader />
            {records.map((record, index) => {
                const { created_at, updated_at, status, name, type_dossier } = record;

                return (
                    <div
                        key={index}
                        onClick={() => handleClickListItem(record, status?.code || '')}
                        className="self-stretch cursor-pointer h-[60px] pt-[15px] pb-[15px] pl-5 pr-[15px] bg-[#fefefe]/40 rounded-[15px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] border border-white/70 backdrop-blur-[20px] justify-center items-center gap-[15px] inline-flex"
                    >
                        <div className="w-[20%] justify-start items-start gap-2.5 flex">
                            <div className="text-dark-blue text-xs font-bold">{formatDateTime(created_at)}</div>
                        </div>
                        <div className="w-[20%] grow shrink h-[9px] justify-start items-start gap-2.5 flex">
                            <div className="text-dark-blue text-xs font-bold truncate overflow-hidden whitespace-nowrap  max-w-[270px]" title={name}><b>{name}</b></div>
                        </div>
                        <div className="w-[20%] grow shrink h-[9px] justify-start items-start gap-2.5 flex">
                            <div className="text-dark-blue text-xs font-bold"><b>{type_dossier}</b></div>
                        </div>
                        <div className="w-[20%] justify-start items-start gap-2.5 flex">
                            <div className="text-dark-blue text-xs font-bold">{formatDateTime(updated_at)}</div>
                        </div>
                        <RecordStatusesButton status={status?.code || "draft"}  statusLabel={status?.title} showIcon/>
                    </div>
                );
            })}
        </div>
    )
}

export default RecordList;