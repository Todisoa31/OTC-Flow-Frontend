import RecordStatusesButton from "../inputs/RecordStatusesButton";
import { formatDateTime } from "@/utils/date";
import { Dispatch, JSX, useEffect, useState } from "react";
import TitleWithBack from "../TitleWithBack";
import { useTitle } from "@/providers/TitleProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ROLE_CONTROLLER, ROLE_INSTALLER } from "@/constants/userConst";
import Select from "../inputs/Select";
import { STATUSES_OPTIONS } from "@/constants/records";
import Button from "../inputs/Button";
import InfoPopup, { PopupInfoType } from "../popup/InfoPopup";
import DocumentSuccessIcon from "@/assets/icons/DocumentSuccessIcon";
import DocumentWarningIcon from "@/assets/icons/DocumentWarningIcon";
import DocumentErrorIcon from "@/assets/icons/DocumentErrorIcon";
import { updateRecordApi } from "@/api/recordInstallerApi";
import { toast } from "react-toastify";
import { EXPORT_MACHINE_RESUME_ROUTE, RECORD_HISTORY_DETAIL_ROUTE, routeWithParams } from "@/constants/routes";
import { usePathname, useRouter } from "next/navigation";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import { colors } from "@/constants/colors";
import { createExportMachineApi, getExportMachineApi } from "@/api/recordControllerApi";
import { convertToCSV, downloadCSV } from "@/utils/csv";
import { getColorByStatus } from "@/utils/record";
import { Statuses } from "@/types/recordType";

type Props = Readonly<{
    recordDetail: Record<string, any>;
    setIsControlStatus: Dispatch<React.SetStateAction<boolean>>;
    isControlStatus: boolean;
}>;

type PopupContent = {
    title: string;
    text: JSX.Element;
    icon: JSX.Element;
    type: PopupInfoType;
}

function RecordDetailHeader(props: Props) {
    const { recordDetail, setIsControlStatus, isControlStatus } = props;
    const { setTitle } = useTitle();
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bgClass, setBgClass] = useState<string>('');
    const [popupContent, setPopupContent] = useState<PopupContent>({
        title: 'Dossier validé',
        text: <span>Le dossier est validé.<br /> L’installateur en sera informé.</span>,
        icon: <DocumentSuccessIcon />,
        type: 'success-1'
    })

    const isInstaller = user?.role === ROLE_INSTALLER;
    const isController = user?.role === ROLE_CONTROLLER;
    const isHistory = isController && pathname === routeWithParams(RECORD_HISTORY_DETAIL_ROUTE, { id: Number(recordDetail?.id) })

    const { name, type_dossier, created_at, updated_at, volume, volume_precarite } = recordDetail;

    const handleChangeFilter = (value: string) => {
        setStatus(value);
    }

    const handleApplyRecordCheck = async () => {
        setModalIsOpen(true);
        if (status) {
            switch (status) {
                case 'tocorrect':
                    setPopupContent({
                        title: "Dossier à modifier",
                        text: <span>Des corrections ont été demandées. <br /> L’installateur sera notifié pour effectuer les modifications.</span>,
                        icon: <DocumentWarningIcon />,
                        type: 'warning'
                    })
                    break;
                case 'approved':
                    setPopupContent({
                        title: "Dossier validé",
                        text: <span>Le dossier est validé.<br /> L’installateur en sera informé.</span>,
                        icon: <DocumentSuccessIcon />,
                        type: 'success-1'
                    })
                    break;
                case 'refused':
                    setPopupContent({
                        title: "Dossier refusé",
                        text: <span>Le dossier est refusé.<br /> L’installateur en sera informé.</span>,
                        icon: <DocumentErrorIcon />,
                        type: 'error'
                    })
                    break;
                default:
                    break;
            }
        }
    };
// isCofrac
    const handleUpdateNoValidateRecord = async () => {
        try {
            setLoading(true);
            const response = await updateRecordApi(recordDetail?.id, {
                statusCode: status as string,
            });

            if (response) {
                setLoading(false);
                setModalIsOpen(false);
                toast.success("Dossier mis à jour avec succès");
                if (status === 'approved') {
                    handleGoToExportMachineResume();
                }
            }
        } catch (error) {
            console.error("Error updating record status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExportMachine = async () => {
        try {
            setLoading(true);
            const job_id = recordDetail?.files[0]?.job_id;
            const type_formulaire = recordDetail?.type_dossier;

            if (!job_id || !type_formulaire) {
                console.error('Missing job_id or type_formulaire in record detail');
                return;
            }

            const response = await createExportMachineApi(job_id, type_formulaire);

            if (response) {
                setLoading(false);
                setModalIsOpen(false);
                toast.success("Dossier mis à jour avec succès");
                handleGoToExportMachineResume();
            }
        } catch (error) {
            console.error("Error creating export machine:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadDocuments = async () => {
        try {
            setLoading(true);
            const job_id = recordDetail?.files[0]?.job_id;
            const type_formulaire = recordDetail?.type_dossier;

            if (!job_id) {
                console.error('No job_id found in record detail');
                return;
            }
            const response = await getExportMachineApi(job_id, type_formulaire);
            if (response?.data && response?.metadata?.job_id) {
                const csv = convertToCSV(response?.data);
                downloadCSV(csv, `${response.metadata?.job_id}.csv`);
            }
        } catch (error) {
            console.error("Error downloading documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoToExportMachineResume = () => {
        const job_id = recordDetail?.files[0]?.job_id;
        const form_type = recordDetail?.type_dossier;
        const id = Number(recordDetail?.id);

        if (job_id && form_type) {
            router.push(
                routeWithParams(EXPORT_MACHINE_RESUME_ROUTE, { id, job_id, form_type })
            )
        }
    };

    const handleCancelAll = () => {
        setModalIsOpen(false);
    };

    const handleUpdateStatus = (statusCode: Statuses) => {
        const config = getColorByStatus(statusCode);
        setBgClass(config.bgClass);
    }

    useEffect(() => {
        if (recordDetail?.name) {
            setTitle(<TitleWithBack title={isController ? `Dossier: ${recordDetail?.name}` : recordDetail?.name} />);
        }
    }, [recordDetail?.name]);

    useEffect(() => {
        if (recordDetail?.status?.code) {
            setStatus(recordDetail?.status?.code);
        }
    }, [recordDetail?.status?.code]);

    useEffect(() => {
      setIsControlStatus(
        STATUSES_OPTIONS.some(option => option.value === recordDetail?.status?.code) &&
        (recordDetail?.status?.code !== "approved" || recordDetail?.status?.title === "Validé")
      );
    },[])

    useEffect(() => {
        handleUpdateStatus(status as Statuses);
    }, [status]);

    

    return (
        <div className="relative z-10 self-stretch p-[30px] bg-[#fefefe]/40 shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-[15px]">
            <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                <div className="flex-1 justify-start text-grey text-2xl font-bold xl:text-[24px] lg:text-[24px] md:text-[15px]">{name}</div>
                { isInstaller && isControlStatus === false ? 
                
                    <RecordStatusesButton status={recordDetail?.status?.code} statusLabel={recordDetail?.status?.title} className="!h-[30px] ml-auto !xl:text-[12px] !lg:text-[12px] !md:text-[10px] " />:
                    <div className=" flex items-center gap-3">
                        <div>
                          {recordDetail?.status?.code && (
                            <div className={`text-xs rounded-[10px] px-5 py-2 font-bold ${bgClass} text-white`}>
                              {recordDetail?.status?.title || recordDetail?.status?.code}
                            </div>
                          )}  
                        </div>
                      </div>
                  
                  }

                {isController && !isHistory &&
                    <div className="inline-flex justify-start items-start gap-5">
                        <Select
                            multiple={false}
                            search={false}
                            value={status as string}
                            onChange={(value) => handleChangeFilter(value as string)}
                            options={STATUSES_OPTIONS.filter((option) => ['tocorrect', 'approved', 'refused'].includes(option.value))}
                            placeholder="Changer le status"
                        />
                        <Button
                            className="bg-black-secondary"
                            onClick={handleApplyRecordCheck}
                            label="Enregistrer et envoyer"
                            disabled={!status}
                        />
                    </div>
                }

                {
                    isHistory && <Button
                        className="bg-black-secondary"
                        onClick={handleDownloadDocuments}
                        iconLeft={<DownloadIcon fill={colors.white} />}
                        label="Télécharger le document"
                        loading={loading}
                        disabled={!status}
                    />
                }

            </div>

            <div className="grid xl:grid-cols-5 lg:grid-cols-5 xl:gap-5 lg:gap-5 w-full md:grid-cols-2 md:gap-2">
                <div className="flex-1 p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                    <div className="justify-start text-dark-blue xl:text-sm lg:text-[12px] md:text-[11px] font-medium leading-[18px]">
                        Type de travaux :
                    </div>
                    <div className="justify-start text-black-secondary xl:text-sm lg:text-[12px] md:text-[11px] font-bold leading-[18px]">{type_dossier}</div>
                </div>
                <div className="flex-1 p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                    <div className="justify-start text-dark-blue xl:text-sm lg:text-[12px] md:text-[11px] font-medium leading-[18px]">
                        Date de soumission :
                    </div>
                    <div className="justify-start text-black-secondary xl:text-sm lg:text-[12px] md:text-[11px] font-bold leading-[18px]">
                        {formatDateTime(created_at)}
                    </div>
                </div>
                <div className="flex-1 p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                    <div className="justify-start text-dark-blue xl:text-sm lg:text-[12px] md:text-[11px] font-medium leading-[18px]">
                        Dernière mise à jour :
                    </div>
                    <div className="justify-start text-black-secondary xl:text-sm lg:text-[12px] md:text-[11px] font-bold leading-[18px]">
                        {formatDateTime(updated_at)}
                    </div>
                </div>
                <div className="flex-1 p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                    <div className="justify-start text-dark-blue xl:text-sm lg:text-[12px] md:text-[11px] font-medium leading-[18px]">
                        Volume precarité
                    </div>
                    <div className="justify-start text-black-secondary xl:text-sm lg:text-[12px] md:text-[11px] font-bold leading-[18px]">
                        {volume_precarite} Mwhc
                    </div>
                </div>
                <div className="flex-1 p-[15px] bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                    <div className="justify-start text-dark-blue xl:text-sm lg:text-[12px] md:text-[11px] font-medium leading-[18px]">
                        Volume CEE
                    </div>
                    <div className="justify-start text-black-secondary xl:text-sm lg:text-[12px] md:text-[11px] font-bold leading-[18px]">
                        {volume} Mwhc
                    </div>
                </div>
            </div>

            {isController &&
                <InfoPopup
                    isOpen={modalIsOpen}
                    onClose={handleCancelAll}
                    text={<div className="w-full">{popupContent.text}</div>}
                    title={popupContent.title}
                    icon={popupContent.icon}
                    type={popupContent.type}
                    footer={
                        <div className="self-stretch inline-flex justify-center items-start gap-5">
                            <Button
                                label="Annuler"
                                onClick={handleCancelAll}
                                disabled={loading}
                                className='bg-grey shadow-[0px_10px_40px_0px_rgba(100,110,129,0.70)]'
                            />
                            <Button
                                label="Confirmer"
                                onClick={status === 'approved' ? handleCreateExportMachine : handleUpdateNoValidateRecord}
                                loading={loading}
                                className='bg-black-secondary shadow-[0px_10px_40px_0px_rgba(16,24,40,0.50)]'
                                disabled={!status}
                            />
                        </div>
                    }
                />
            }
        </div>
    )
}

export default RecordDetailHeader