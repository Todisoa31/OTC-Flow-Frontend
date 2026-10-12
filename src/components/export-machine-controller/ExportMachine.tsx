'use client';
import { getRecordByIdApi, updateRecordApi } from "@/api/recordInstallerApi";
import ExportMachineComment from "./ExportMachineComment";
import ExportMachinetTab from "./ExportMachineTab";
import ExportMachineTable from "./ExportMachineTable";
import { useRecord } from "@/providers/RecordProvider";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTitle } from "@/providers/TitleProvider";
import TitleWithBack from "../TitleWithBack";
import ExportMachineFilters from "./ExportMachineFilters";
import CenterSpinner from "../loader/CenterSpinner";
import { CONTROLLER_EXPORT_MACHINE_ROUTE } from "@/constants/routes";

function ExportMachine() {
    const { selectedRecord, setSelectedRecord } = useRecord();
    const [loading, setLoading] = useState(false);
    const { id: recordId } = useParams();
    const { setTitle } = useTitle();
    const pathName = usePathname()

    const handleGetRecordDetail = async (id: number) => {
        try {
            setLoading(true);
            const record = await getRecordByIdApi(id);
            if (record?.status?.code === "tobeprocessed" && pathName.startsWith(CONTROLLER_EXPORT_MACHINE_ROUTE)) {
                try {
                    await updateRecordApi(id, {
                        statusCode: "inprocess"
                    });
                    
                } catch (error) {
                    console.error(error)
                }
            }
            
            setSelectedRecord(record);
        } catch (error) {
            console.error('Error fetching record detail:', error);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setTitle(<TitleWithBack title={selectedRecord?.name ? `Dossier: ${selectedRecord?.name}` : ''} />);
        if (Number(recordId) !== selectedRecord?.id) {
            handleGetRecordDetail(Number(recordId));
        }
    }, [recordId, selectedRecord]);

    if(loading){
        return <CenterSpinner />
    }

    return (
        <div className="grow self-stretch pt-[30px] inline-flex flex-col justify-start items-start gap-[30px]">
            <ExportMachinetTab />
            <div className="grow self-stretch px-[30px] relative flex flex-col justify-start items-start gap-5">
                <ExportMachineFilters />
                <ExportMachineTable />
            </div>
            {/* <ExportMachineComment /> */}
        </div>
    )
}

export default ExportMachine