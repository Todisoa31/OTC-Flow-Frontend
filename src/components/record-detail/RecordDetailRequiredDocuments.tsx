import { Dispatch, SetStateAction } from "react";
import { RecordFileResponse } from "@/types/recordType";
import { FileUploadingStatus } from "../submit-file-installer/stepComponent/SubmitFileStepTwo";
import { formatDateTime } from "@/utils/date";
import { ROLE_CONTROLLER, ROLE_INSTALLER } from "@/constants/userConst";
import { useAuth } from "@/providers/AuthProvider";
import { RECORD_HISTORY_DETAIL_ROUTE, routeWithParams } from "@/constants/routes";
import { useParams, usePathname } from "next/navigation";
import RecordDetailDocStatusInstallerItem from "./RecordDetailDocStatusInstallerItem";
import RecordDetailDocStatusHistoryItem from "./RecordDetailDocStatusHistoryItem";
import RecordDetailDocStatusControllerItem from "./RecordDetailDocStatusControllerItem";

type Props = Readonly<{
    recordDetail: Record<string, any>;
    fileUploadingStatus: FileUploadingStatus;
    setFileUploadingStatus: Dispatch<SetStateAction<FileUploadingStatus>>
}>

function RecordDetailRequiredDocuments(props: Props) {
    const { recordDetail, fileUploadingStatus, setFileUploadingStatus } = props;
    const { user } = useAuth();
    const params = useParams();
    const pathname = usePathname();
    const { id: recordId } = params;
    const isInstaller = user?.role === ROLE_INSTALLER;
    const isController = user?.role === ROLE_CONTROLLER;
    const isHistory = isController && pathname === routeWithParams(RECORD_HISTORY_DETAIL_ROUTE, { id: Number(recordId) })

    const className = "self-stretch grow px-[30px] inline-flex flex-col justify-start items-start gap-5";
    const classNameHistory = "px-[30px] inline-flex flex-row justify-between items-start gap-5 flex-wrap";

    return (
        <div className={`${isHistory ? classNameHistory : className}`}> 
            {recordDetail?.files?.map((item: RecordFileResponse) => {
                if(isInstaller){
                    return (
                        <RecordDetailDocStatusInstallerItem
                            key={item.id}
                            file_title={item.title_file}
                            file_name={item.name}
                            job_id={item.job_id}
                            file_id={item.id}
                            form_type={recordDetail.type_dossier}
                            date={formatDateTime(recordDetail.created_at)}
                            status={item.status}
                            comments={item.comments}
                            file_type={item.type_file }
                            fileUploadingStatus={fileUploadingStatus}
                            setFileUploadingStatus={setFileUploadingStatus}
                        />
                    )
                }else if(isHistory){
                    return (
                        <RecordDetailDocStatusHistoryItem
                            key={item.id}
                            file_title={item.title_file}
                            file_name={item.name}
                            file_path={item.file}
                            date={formatDateTime(recordDetail.created_at)}
                        />
                    )
                }else if(isController){
                    return (
                        <RecordDetailDocStatusControllerItem
                            key={item.id}
                            file_title={item.title_file}
                            date={formatDateTime(recordDetail.created_at)}
                            status={item.status}
                            comments={item.comments}
                        />
                    )
                }
            })}
        </div>
    )
}

export default RecordDetailRequiredDocuments