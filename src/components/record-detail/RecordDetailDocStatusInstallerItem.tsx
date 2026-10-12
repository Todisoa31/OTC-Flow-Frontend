import { useParams, useRouter } from "next/navigation";
import { Comments, RecordFileItems, RecordFileJobId, Statuses } from "@/types/recordType";
import RecordStatusesButton from "../inputs/RecordStatusesButton";
import CalendarFilledIcon from "@/assets/icons/CalendarFilledIcon";
import DocUploader, { UploadStatus } from "../inputs/DocUploader";
import { FileUploadingStatus } from "../submit-file-installer/stepComponent/SubmitFileStepTwo";
import { Dispatch, SetStateAction } from "react";
import { useRecords } from "@/providers/CreateRecordProvider";
import Button from "../inputs/Button";
import { updateUploadRecordFilev2Api } from "@/api/recordInstallerApi";
import { RECORD_DETAIL_CORRECTION, routeWithParams } from "@/constants/routes";

type Props = Readonly<{
    job_id: string;
    file_id: number;
    file_title: string;
    file_name: string;
    file_type: keyof RecordFileItems
    date: string;
    status: Statuses;
    form_type: string;
    comments: Comments[];
    fileUploadingStatus: FileUploadingStatus;
    setFileUploadingStatus: Dispatch<SetStateAction<FileUploadingStatus>>
}>

function RecordDetailDocStatusInstallerItem(props: Props) {
    const { form_type, job_id, file_id, file_title, file_name, file_type, date, status, comments, fileUploadingStatus, setFileUploadingStatus } = props
    const { setPayload, uploadPayload, setUploadPayload, setExtractedData } = useRecords();

    const router = useRouter();
    const params = useParams();

    const { id } = params;


    const handleSeeCorrection = () => {
        if (!id) return;
        // const correctionRoute = routeWithParams(RECORD_DETAIL_CORRECTION, { id });
        // router.push(correctionRoute)
        router.push(`/installer/record_detail/${id}/correction/${file_id}`);
    }

    const handleUpdateFileStatus = (key: keyof RecordFileJobId, status: UploadStatus) => {
        setFileUploadingStatus(prevState => ({
            ...prevState,
            [key]: status
        }));
    }

    const handleUploadFile = async (file: File, key: keyof RecordFileJobId) => {
        try {
            handleUpdateFileStatus(key, 'extracting');
            const response = await updateUploadRecordFilev2Api(key, file, form_type, job_id, file_id);

            if (response.data) {
                setPayload(prev => ({
                    ...prev,
                    items: {
                        ...prev.items,
                        [key]: response.data
                    }
                }));

                setExtractedData(prev => ({
                    ...prev,
                    [key]: response.data
                }));
            }
            handleUpdateFileStatus(key, 'success');
            return true
        } catch (error) {
            console.error(key, 'Error uploading files:', error);
            handleUpdateFileStatus(key, 'error');
            return false
        }
    }

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, key: keyof RecordFileJobId) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadPayload(prev => ({
                ...prev,
                [key]: file
            }));
            handleUploadFile(file, key);
        }
    }

    return (
        <div className="self-stretch p-5 bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-5">
            <div className="self-stretch inline-flex justify-start items-start gap-[15px]">
                <div className="self-stretch flex-1 inline-flex flex-col justify-center items-start gap-2.5">
                    <div className="self-stretch justify-start text-black-secondary text-sm font-bold leading-[18px]">{file_title}</div>
                    <div className="justify-center text-dark-blue text-xs font-bold leading-[18px]">{file_name}</div>
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

            {
                // Upload file if the user is an installer and the status is "tocorrect"
                status === "tocorrect" ?
                    (
                        <>
                            <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                                <div className="justify-start text-black-secondary text-xs font-bold leading-[18px]">Commentaire du contrôleur :</div>
                                <div className="self-stretch justify-start text-grey text-xs font-medium">
                                    {comments?.[0]?.comment || 'Aucun commentaire'}
                                </div>
                            </div>

                            <div className="flex self-stretch justify-start items-center gap-5">
                                <DocUploader
                                    label={''}
                                    state={fileUploadingStatus[file_type]}
                                    onChange={(e) => handleChangeFile(e, file_type)}
                                    file={uploadPayload[file_type]}
                                    noPadding
                                />

                                <Button
                                    onClick={handleSeeCorrection}
                                    label="Voir les corrections"
                                    className="!h-[50px] bg-black-secondary text-white text-xs font-medium"
                                />
                            </div>
                        </>
                    ) :
                    (
                        <>
                            <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                                <div className="justify-start text-black-secondary text-xs font-bold leading-[18px]">Commentaire du contrôleur :</div>
                                <div className="self-stretch justify-start text-grey text-xs font-medium">
                                    {comments?.[0]?.comment || 'Aucun commentaire'}
                                </div>
                            </div>

                            <div className="flex self-stretch justify-end items-center gap-5">

                                <Button
                                    onClick={handleSeeCorrection}
                                    label="Voir les commentaires"
                                    className="bg-black"
                                />
                            </div>
                        </>
                    )
            }
        </div>
    )
}

export default RecordDetailDocStatusInstallerItem