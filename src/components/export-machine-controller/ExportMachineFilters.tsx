'use client';
import { FILE_TYPES, STATUSES_OPTIONS } from "@/constants/records";
import Select from "../inputs/Select";
import { SelectValue } from "@/types/inputType";
import { useParams } from "next/navigation";
import { updateFileStatusApi } from "@/api/recordInstallerApi";
import { Statuses } from "@/types/recordType";
import { toast } from "react-toastify";
import { useRecord } from "@/providers/RecordProvider";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import Button from "../inputs/Button";
import { colors } from "@/constants/colors";
import { UseCommentStore } from "@/stores/commentStore";

function ExportMachineFilters() {
    const { selectedFile, setSelectedFile, setSelectedRecord } = useRecord();
    const { setShow } = UseCommentStore();

    const params = useParams();

    if (!params) return null
    const file_type = params.file_type as keyof typeof FILE_TYPES;


    const handleChangeFileStatus = async (value: SelectValue) => {
        try {
            if (!selectedFile?.id) return;

            const response = await updateFileStatusApi(selectedFile?.id, value as Statuses);
            if (response) {
                toast.success('Statut mis à jour avec succès');

                setSelectedFile(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        status: value as Statuses
                    }
                });

                setSelectedRecord(prev => {
                    if (!prev) return prev;
                    const files = prev.files.map((file: any) => {
                        if (file.id === selectedFile?.id) {
                            return {
                                ...file,
                                status: value as Statuses
                            }
                        }
                        return file;
                    });
                    return {
                        ...prev,
                        files
                    }

                })

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleDownloadDocument = async () => {
        try {
            if (!selectedFile?.file) {
                toast.error("URL de téléchargement introuvable");
                return;
            }

            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + selectedFile.file);
            if (!response.ok) {
                throw new Error("Erreur lors du téléchargement du fichier");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${selectedFile.name || "document"}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Téléchargement réussi");
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            toast.error("Erreur lors du téléchargement du fichier");
        }
    }

    return (
        <div className="self-stretch inline-flex justify-start items-center gap-5">
            <div className="flex-1 justify-start text-black-secondary text-2xl font-bold gap-5 flex">
                <span>{FILE_TYPES[file_type]}</span>
                <Button
                    className="bg-black-secondary !h-[30px] flex justify-center items-center gap-2.5"
                    onClick={handleDownloadDocument}
                    iconLeft={<DownloadIcon fill={colors.white} />}
                    label="PDF"
                />
            </div>
            <div className="flex justify-start items-center gap-2.5">
                <button
                    onClick={() => setShow(true)}
                    className=" bg-[#65A5BF] py-2 px-4 text-white w-fit flex items-center gap-2 rounded-[10px] text-[12px]"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.9054 17.8229L11.3571 17.0597C11.7075 16.4677 11.8827 16.1717 12.1641 16.008C12.4456 15.8444 12.7999 15.8383 13.5085 15.826C14.5546 15.808 15.2108 15.7439 15.761 15.516C16.782 15.0931 17.5931 14.282 18.016 13.261C18.3332 12.4953 18.3332 11.5246 18.3332 9.58317V8.74984C18.3332 6.02198 18.3332 4.65805 17.7192 3.65609C17.3756 3.09545 16.9042 2.62407 16.3436 2.2805C15.3416 1.6665 13.9777 1.6665 11.2498 1.6665H8.74984C6.02198 1.6665 4.65805 1.6665 3.65609 2.2805C3.09545 2.62407 2.62407 3.09545 2.2805 3.65609C1.6665 4.65805 1.6665 6.02198 1.6665 8.74984V9.58317C1.6665 11.5246 1.6665 12.4953 1.98367 13.261C2.40656 14.282 3.21771 15.0931 4.23866 15.516C4.78891 15.7439 5.44502 15.808 6.49115 15.826C7.19977 15.8383 7.55408 15.8444 7.8355 16.008C8.11691 16.1717 8.29211 16.4677 8.64251 17.0597L9.09426 17.8229C9.4969 18.5032 10.5027 18.5032 10.9054 17.8229ZM13.3332 9.99984C13.7934 9.99984 14.1665 9.62674 14.1665 9.1665C14.1665 8.70627 13.7934 8.33317 13.3332 8.33317C12.8729 8.33317 12.4998 8.70627 12.4998 9.1665C12.4998 9.62674 12.8729 9.99984 13.3332 9.99984ZM10.8332 9.1665C10.8332 9.62674 10.4601 9.99984 9.99984 9.99984C9.5396 9.99984 9.1665 9.62674 9.1665 9.1665C9.1665 8.70627 9.5396 8.33317 9.99984 8.33317C10.4601 8.33317 10.8332 8.70627 10.8332 9.1665ZM6.6665 9.99984C7.12674 9.99984 7.49984 9.62674 7.49984 9.1665C7.49984 8.70627 7.12674 8.33317 6.6665 8.33317C6.20627 8.33317 5.83317 8.70627 5.83317 9.1665C5.83317 9.62674 6.20627 9.99984 6.6665 9.99984Z" fill="white" />
                    </svg>
                    Commentaires
                </button>
                <div className="h-[44px] p-2.5 rounded-[10px] flex justify-start items-center gap-2.5">
                    <Select
                        multiple={false}
                        search={false}
                        value={selectedFile?.status as SelectValue}
                        onChange={(value) => handleChangeFileStatus(value)}
                        options={STATUSES_OPTIONS}
                    // placeholder="Changer le statut"
                    />

                    {/* <div className="w-6 h-6 bg-primary-orange rounded-[5px] flex justify-center items-center gap-2.5">
                        <div data-svg-wrapper className="relative">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.95927 11.2439C6.14487 11.0991 6.31323 10.9308 6.6499 10.5941L10.9641 6.27985C10.377 6.03546 9.68152 5.63403 9.0238 4.97631C8.36598 4.31849 7.96452 3.62292 7.72015 3.03569L3.40582 7.35002L3.40578 7.35006C3.06914 7.68671 2.90079 7.85505 2.75603 8.04065C2.58525 8.2596 2.43883 8.49651 2.31937 8.74718C2.2181 8.95968 2.14281 9.18552 1.99225 9.63723L1.19827 12.0192C1.12417 12.2415 1.18202 12.4865 1.34771 12.6522C1.51339 12.8179 1.75846 12.8757 1.98074 12.8017L4.36269 12.0077C4.81439 11.8571 5.04024 11.7818 5.25274 11.6805C5.50341 11.5611 5.74031 11.4147 5.95927 11.2439Z" fill="white" />
                                <path d="M12.1613 5.0827C13.0571 4.18687 13.0571 2.73445 12.1613 1.83862C11.2655 0.942791 9.81305 0.942791 8.91722 1.83862L8.39978 2.35606C8.40687 2.37745 8.41422 2.39915 8.42184 2.42112C8.6115 2.96779 8.96935 3.68442 9.64252 4.35759C10.3157 5.03077 11.0323 5.38861 11.579 5.57827C11.6009 5.58586 11.6225 5.59318 11.6438 5.60023L12.1613 5.0827Z" fill="white" />
                            </svg>
                        </div>
                    </div>
                    <div className="justify-start text-[#646d81] text-xs font-medium">A corriger</div>
                    <div data-svg-wrapper className="relative">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M14.6771 6.38394C14.8792 6.61981 14.8519 6.97492 14.6161 7.17709L9.36606 11.6771C9.15541 11.8576 8.84457 11.8576 8.63392 11.6771L3.38392 7.17709C3.14805 6.97492 3.12073 6.61981 3.32291 6.38394C3.52508 6.14807 3.88019 6.12075 4.11606 6.32293L8.99999 10.5092L13.8839 6.32293C14.1198 6.12075 14.4749 6.14807 14.6771 6.38394Z" fill="#101828" />
                        </svg>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ExportMachineFilters