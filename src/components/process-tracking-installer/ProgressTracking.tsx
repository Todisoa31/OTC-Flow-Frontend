'use client';;
import RecordList from "../records-lists/RecordList";
import ProcessTrackingMetric from "./ProcessTrackingMetric";
import RecordFilters from "../filters/RecordFilters";
import Pagination from "../Pagination_V2";
import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import { getRecordApi } from "@/api/recordInstallerApi";
import { RecordResponse } from "@/types/recordType";
import { useFilter } from "@/providers/FilterProvider";

function ProgressTracking() {
    const { setTitle } = useTitle();
    const { setData, data, filters } = useFilter();
    const [totalPages, setTotalPages] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTitle('Suivi des dossiers');
    }, [])

    const handleGetRecords = async () => {
        try {
            setLoading(true);
            const _filters = { ...filters };
            const { page, per_page, ...filteredFilters } = _filters;
            const response = await getRecordApi({ page, per_page, ...filteredFilters });
            setTotalPages(response.pagination.total_pages);
            setTotalEntries(response.pagination.total_entries);
            setData(response.data as RecordResponse[]);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetRecords();
    }, [filters])
    
    return (
        <div className="self-stretch flex p-[30px] flex-col justify-between items-start gap-[30px] grow">
            <ProcessTrackingMetric />
            <div className="grow self-stretch flex-col justify-start items-start gap-[30px] flex">
                <div className="self-stretch justify-start items-center flex-col">
                    <div className="grow mb-5 shrink basis-0 text-black-secondary text-2xl font-bold ">Mes dossiers ({totalEntries})</div>
                    <RecordFilters />
                </div>
                <RecordList records={data} loading={loading} />
            </div>
            <Pagination totalPages={totalPages} />
        </div>
    )
}

export default ProgressTracking