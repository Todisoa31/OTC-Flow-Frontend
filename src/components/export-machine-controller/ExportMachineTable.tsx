'use client';;
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExtractedDataItem, FileKeys, FileResponse } from "@/types/recordType";
import { getExportMachineDataApi } from "@/api/recordControllerApi";
import CenterSpinner from "../loader/CenterSpinner";
import ScoreButton from "../inputs/ScoreButton";
import { useRecord } from "@/providers/RecordProvider";
import EmptyData from "../empty/EmptyData";
import ExportMachineCorrectionPopup from "./ExportMachineScorePopup";
import { tableClassName, theadRowClassName } from "@/constants/table";

const TableHeaders = {
    infos: {
        label: "Info",
        className: "w-[300px] px-5 text-left",
    },
    variables: {
        label: "Variables",
        className: "px-5 text-left hidden",
    },

    devis: {
        label: "Devis",
        className: "px-5 text-left",
    },
    facture: {
        label: "Facture",
        className: "px-5 text-left",
    },

    attestation: {
        label: "Attestation sur l'honneur",
        className: "px-5 text-left",
    },
    attestation_pose: {
        label: "Attestation de Pose",
        className: "px-5 text-left",
    },
    proposition: {
        label: "Proposition",
        className: "px-5 text-left",
    },
    score: {
        label: "Score",
        className: "w-[50px] px-5 text-center",
    },
    correction: {
        label: "Correction",
        className: "px-5 text-left",
    },
}

// type FileLocalType = {
//     id: number | null;
//     status: Statuses;
// }

function ExportMachineTable() {
    const [openCorrectionPopup, setOpenCorrectionPopup] = useState(false);
    const [fetching, setFetching] = useState(false);
    const { selectedRecord, setSelectedFile, setSelectedExtractedData } = useRecord();
    const [exportMachineData, setExportMachineData] = useState<Record<string, any>[] | Record<string, any>>();
    const [refresh, setRefresh] = useState(false);
    const { file_type } = useParams();
    // const [thisFile, setThisFile] = useState<FileLocalType | undefined>({
    //     id: null,
    //     status: "tobeprocessed"
    // });

    const handleCloseCorrectionPopup = () => {
        setOpenCorrectionPopup(false);
    }

    const handleOpenCorrectionPopup = (data: ExtractedDataItem) => {
        setOpenCorrectionPopup(true);
        setSelectedExtractedData(data);
    }

    const handleGetExportMachineDataApi = async (file_id: number, file_type: FileKeys) => {
        try {
            setFetching(true);
            const response = await getExportMachineDataApi(file_id);
            const currentExportedData = response?.[file_type];
            setExportMachineData(currentExportedData);
        } catch (error) {
            console.error('Error fetching export machine data:', error);
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        if (file_type && selectedRecord?.files) {
            const file = selectedRecord.files.find((item: FileResponse) => item.type_file === file_type);

            // if (file !== undefined) {
            //     setThisFile({
            //         id: file.id,
            //         status: file?.status
            //     });
            // } else {
            //     setThisFile(undefined);
            // };

            if (file) {
                const file_id = file.id;
                setSelectedFile(file);
                handleGetExportMachineDataApi(Number(file_id), file_type as FileKeys);
            }
        }
    }, [file_type, selectedRecord, refresh]);

    const generateHeaders = () => {
        return (
            <thead>
                <tr className={theadRowClassName}>
                    {Object.entries(TableHeaders).map(([key, value], index) => (
                        <th key={index} className={value.className}>
                            {value.label}
                        </th>
                    ))}
                </tr>
            </thead>
        )
    };


    const generateBodies = (currentExportedData: ExtractedDataItem[], file_type: FileKeys) => {
        if (file_type && currentExportedData) {
            return currentExportedData.map((item: ExtractedDataItem, index: number) => {
                const correction: string | number = item.controller_corrections?.[0]?.correction_value || '';
                return (
                    <tr
                        onClick={() => handleOpenCorrectionPopup(item)}
                        key={index}
                        className="cursor-pointer h-[70px] bg-[#fefefe]/40 outline outline-1 outline-[#eaf0f2] text-dark-blue text-xs font-medium">
                        <td className="w-[300px] break-all px-5 text-[#101828] hidden" >{item?.variables}</td>
                        <td className="px-5 break-all">{item?.infos}</td>
                        <td className="px-5 break-all">{item?.devis}</td>
                        <td className="px-5 break-all">{item?.facture}</td>
                        <td className="px-5 break-all">{item?.attestation}</td>
                        <td className="px-5 break-all">{item?.attestation_pose}</td>
                        <td className="px-5 break-all">{item?.proposition}</td>
                        <td className="w-[50px] px-5 text-center">
                            <ScoreButton
                                corrected={correction.toString().trim() !== ''}
                                score={item.score || 0}
                            />
                        </td>
                        <td className="px-5 break-all">{correction}</td>
                    </tr>
                )
            })
        }
    }

    const generateTable = (exportMachineData: any, file_type: FileKeys) => {
        if (file_type === 'file_attestation' && exportMachineData && !Array.isArray(exportMachineData)) {
            const parsedExportMachineData = Object.entries(exportMachineData);
            return parsedExportMachineData.map(([key, value], index) => (
                <div key={key} className="self-stretch flex flex-col justify-start items-start gap-[15px]">
                    <div className="flex-1 justify-start text-black-secondary text-md font-bold">
                        {key}
                    </div>
                    <table key={index} className={tableClassName}>
                        {generateHeaders()}
                        <tbody>
                            {generateBodies(value as ExtractedDataItem[], file_type)}
                        </tbody>
                    </table>
                </div>
            ))
        } else {
            return (
                <table className="self-stretch rounded-[15px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.07)] overflow-hidden">
                    {generateHeaders()}
                    <tbody>
                        {generateBodies(exportMachineData, file_type)}
                    </tbody>
                </table>
            )
        }
    }

    if (fetching) {
        return <CenterSpinner />
    }

    if (!exportMachineData) {
        return <EmptyData />
    }

    return (
        <div className="self-stretch flex flex-col justify-start items-start gap-[30px]">
            {generateTable(exportMachineData, file_type as FileKeys)}

            <ExportMachineCorrectionPopup
                isOpen={openCorrectionPopup}
                onClose={handleCloseCorrectionPopup}
                title="Correction du contrôleur"
                setRefresh={setRefresh}
            />
        </div >
    )
}

export default ExportMachineTable