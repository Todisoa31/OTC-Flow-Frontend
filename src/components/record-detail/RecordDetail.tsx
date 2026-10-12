'use client';;
import RecordDetailHeader from "./RecordDetailHeader";
import { useEffect, useState } from "react";
import RecordDetailRequiredDocuments from "./RecordDetailRequiredDocuments";
import { getDataRecap, getRecordByIdApi, updateInformationV1FileApi, uploadRecordFilev2Api } from "@/api/recordInstallerApi";
import { useParams, usePathname } from "next/navigation";
import Button from "../inputs/Button";
import CaretRightIcon from "@/assets/icons/CaretRightIcon";
import { useRecords } from "@/providers/CreateRecordProvider";
import { extractDataItems } from "@/utils/common";
import CenterSpinner from "../loader/CenterSpinner";
import { FileUploadingStatus } from "../submit-file-installer/stepComponent/SubmitFileStepTwo";
import { DEFAULT_UPLOAD_STATUS, requiredFilePatterns } from "@/constants/records";
import { useRouter } from "next/navigation";
import { PROGRESS_TRACKING, RECORD_HISTORY_DETAIL_ROUTE, routeWithParams } from "@/constants/routes";
import { useAuth } from "@/providers/AuthProvider";
import { ROLE_CONTROLLER, ROLE_INSTALLER } from "@/constants/userConst";
import InfoPopup from "../popup/InfoPopup";
import DocumentIcon2 from "@/assets/icons/DocumentIcon2";
import CalendarBlackIcon from "@/assets/icons/CalendarBlackIcon";
import FolderValidatedIcon from "@/assets/icons/FolderValidatedIcon";
import { formatDateTime } from "@/utils/date";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import { handleDownloads } from "@/utils/fileUtils";
import { FolderOutputType } from "@/types/folderType";
import RecordOtherFiles from "./RecordOtherFiles";
import ContratDossier from "../StatusDossier/resumeDossier/ContratDossier";
import { UploadStatus } from "../inputs/DocUploader";
import { RecordFileJobId } from "@/types/recordType";
import AddHonorAttestation from "./AddHonorAttestation";
import { UseInstallerStore } from "@/stores/InstallerStore";
import ControleConformite from "./ControleConformite";
import { formatCSVFile } from "@/utils/fileUtils";
import { convertAllJobsToSingleCsv } from "@/utils/csv";
import RecapitulationInstaller from "./RecapitulationInstaller";


function RecordDetail() {
    const { id } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const [recordDetail, setRecordDetail] = useState<Record<string, any>>({});
    const [folder, setFolder] = useState<FolderOutputType | null>(null);
    const [isControlStatus, setIsControlStatus] = useState<boolean>(false);
    const [csvString, setCsvString] = useState<string>('');
    

    const [fileUploadingStatus, setFileUploadingStatus] = useState<FileUploadingStatus>(DEFAULT_UPLOAD_STATUS);
    const { extractedData } = useRecords();
    const [fetching, setFetching] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingUpalod, setLoadingUpload] = useState<boolean>(false);
    const [isRecapCsvGenerated, setIsRecapCsvGenerated] = useState<boolean>(false);

    const { user } = useAuth();
    const isInstaller = user?.role === ROLE_INSTALLER;
    const isController = user?.role === ROLE_CONTROLLER;
    const isHistory = isController && pathname === routeWithParams(RECORD_HISTORY_DETAIL_ROUTE, { id: Number(recordDetail?.id) })
    const { setPayload, uploadPayload, setUploadPayload, setExtractedData } = useRecords();
    const { setEventStart, eventStart } = UseInstallerStore();

    const handleUpdateFileStatus = (key: keyof RecordFileJobId, status: UploadStatus) => {
        setFileUploadingStatus(prevState => ({
            ...prevState,
            [key]: status
        }));
    }

    const handleUploadFile = async (file: File, key: keyof RecordFileJobId) => {
        try {
            handleUpdateFileStatus(key, 'extracting');
            setLoadingUpload(true);
            const response = await uploadRecordFilev2Api(key, file, recordDetail.type_dossier, recordDetail.job_id, recordDetail.id);
            await updateInformationV1FileApi(recordDetail.job_id, recordDetail.type_dossier, response.data);
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
        } finally {
            setLoadingUpload(false);
        }
    }

    const handleUploadFileHandler = (file: File, key: keyof RecordFileJobId) => {
        if (file) {
            setLoadingUpload(true);
            handleUploadFile(file, key);
        }
    }
    const handleGetRecordDetail = async (id: number) => {
        try {
            setError(null);
            setFetching(true);
            const record = await getRecordByIdApi(id);
            setRecordDetail(record);
            setFolder(record);
        } catch (error) {
            console.error('Error fetching record detail:', error);
        } finally {
            setFetching(false);
        }
    }

    const isAttestationSurHonneurUploaded = (files: { name: string }[]): boolean => {
        const patterns = requiredFilePatterns["Attestation sur l'honneur"];

        return files?.some(file =>
            patterns.some(pattern => pattern.test(file.name))
        );
    };

    const shouldShowAttestation = !isAttestationSurHonneurUploaded(recordDetail.files);

    const handleApplieCorrection = async () => {
        try {
            setError(null);
            setSubmitting(true);
            const items = extractDataItems(extractedData);

            if (items.length === 0) {
                console.error('No items to update');
                return;
            }

            const job_id = recordDetail?.files[0]?.job_id;
            const type_formulaire = recordDetail?.type_dossier;

            if (!job_id) {
                console.error('No job_id found in record detail');
                return;
            }

            await updateInformationV1FileApi(job_id, type_formulaire, items);
            setOpen(true);
        } catch (error) {
            setError('Une erreur s\'est produite lors de l\'application de la correction. Veuillez réessayer.');
            console.error('Error applying correction:', error);
        } finally {
            setSubmitting(false);
            setEventStart(false);
        }
    }
    
            

    useEffect(() => {
        handleGetRecordDetail(Number(id));
    }, [id])
    
    useEffect(() => {
      console.log('RecordDetail ', recordDetail);
    },[recordDetail]);


    if (fetching) {
        return (
            <CenterSpinner />
        )
    }

    const disableSubmitButton = () => {
        return Object.values(fileUploadingStatus).some(status => status === 'extracting' || status === 'uploading')
            || extractDataItems(extractedData).length === 0
    }
    

    return (
        <div className="mb-5 w-full flex flex-col">
            <RecordDetailHeader recordDetail={recordDetail} setIsControlStatus={setIsControlStatus} isControlStatus={isControlStatus}/>

            {folder?.contrat && <ContratDossier contrat={folder?.contrat} />}

            {(folder && !isControlStatus) &&  <ControleConformite recordDetail={recordDetail} folder={folder} isCoffrac={recordDetail.is_cofrac}/> }
            
            
            <div className="px-[30px] mb-5">
                {folder &&
                    <Button
                        label="Télécharger les documents"
                        className="bg-black px-[20px] py-[8px]  flex items-center gap-2 text-white rounded-[10px] shadow-xl"
                        iconLeft={<DownloadIcon fill="#fff" />}
                        onClick={() => handleDownloads(folder, setLoading)}
                        width="w-auto"
                        loading={loading}
                    />}
            </div>
            
            {['TRA_EQ_117','TRA_EQ_114'].includes(recordDetail?.type_dossier) && <RecapitulationInstaller jobId={recordDetail?.job_id} statusValue={recordDetail?.file_recap?.status}/>}

            <RecordDetailRequiredDocuments
                recordDetail={recordDetail}
                fileUploadingStatus={fileUploadingStatus}
                setFileUploadingStatus={setFileUploadingStatus}
            />
            {shouldShowAttestation && (
                <div className="px-[30px] w-full mb-5 mt-0">
                    <div className="self-stretch p-5 bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-5">
                        <AddHonorAttestation
                            label="Attestation sur honneur"
                            onSend={handleUploadFileHandler}
                            loading={loadingUpalod}
                        />
                    </div>
                </div>
            )}
            {
                (folder?.other_file && folder.other_file.length > 0) &&
                <RecordOtherFiles
                    otherFiles={folder.other_file}
                />
            }

            {isInstaller && recordDetail?.status?.code === 'tocorrect' && (
                <>
                    <div
                        className={`sticky bottom-0 grow self-stretch px-[30px] py-5 ${eventStart ? 'bg-[#65BFAA]' : 'bg-white'} shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] inline-flex justify-end items-center gap-5`}>
                        <div className="text-red text-sm self-center ">{error}</div>
                        <Button
                            onClick={handleApplieCorrection}
                            label="Soumettre"
                            className={`${disableSubmitButton() ? 'bg-gray-500' : 'bg-black-secondary'}`}
                            iconRight={<CaretRightIcon />}
                            loading={submitting}
                            disabled={disableSubmitButton()}
                        />
                    </div>

                    <InfoPopup
                        isOpen={open}
                        onClose={() => {
                            setOpen(false);
                            router.push(PROGRESS_TRACKING);
                        }}
                        text={<span>Votre correction a été soumis avec succès !</span>}
                        title={"Dossier soumis avec succès !"}
                        icon={<DocumentIcon2 />}
                        type='success'
                    />
                </>
            )}

            {isHistory &&
                <div className="grow self-stretch mt-auto p-[30px] max-h-[100px] bg-white/40 shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex justify-between items-start">
                    <div className="w-[361px] flex justify-start items-center gap-2.5">
                        <div className="w-[40px] h-[40px]  bg-gray-900 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div data-svg-wrapper className="relative">
                                <CalendarBlackIcon />
                            </div>
                        </div>
                        <div className="inline-flex flex-col justify-center items-start gap-2.5">
                            <div className="justify-start text-gray-500 text-xs font-medium">Date de clôture du dossier</div>
                            <div className="justify-center text-gray-900 text-xs font-bold leading-[18px]">
                                {formatDateTime(recordDetail?.updated_at)}
                            </div>
                        </div>
                    </div>
                    <div className="h-[40px] px-2.5 bg-primary-green rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] backdrop-blur-[10px] flex justify-start items-center gap-2.5">
                        <div className="w-6 h-6 bg-white rounded-[5px] flex justify-center items-center gap-2.5">
                            <div data-svg-wrapper className="relative">
                                <FolderValidatedIcon />
                            </div>
                        </div>
                        <div className="justify-start text-white text-sm font-bold leading-[18px]">Validé</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default RecordDetail