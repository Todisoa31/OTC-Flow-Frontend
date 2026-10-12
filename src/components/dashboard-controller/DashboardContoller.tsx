'use client';
import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import ProcessTrackingMetric from "../process-tracking-installer/ProcessTrackingMetric";
import RecordList from "../records-lists/RecordList";
import { useFilter } from "@/providers/FilterProvider";
import { RecordResponse } from "@/types/recordType";
import { getRecordApi } from "@/api/recordControllerApi";

function DashboardContoller() {
    const { setTitle } = useTitle();
    const { setData, data } = useFilter();
    const [loading, setLoading] = useState(false);

    const handleGetRecords = async () => {
        try {
            setLoading(true);
            const response = await getRecordApi({ page: 1, per_page: 5 });
            setData(response.data as RecordResponse[]);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        handleGetRecords();
    }, [])

    useEffect(() => {
        setTitle('Tableau de bord');
    }, [])

    return (
        <div className="self-stretch flex p-[30px] flex-col justify-start items-start gap-[30px] grow">
            <ProcessTrackingMetric />
            <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-black-secondary text-2xl font-bold ">
                    Liste des dernières actions
                </div>
            </div>
            <RecordList records={data} loading={loading} />
        </div>
    )
}

export default DashboardContoller