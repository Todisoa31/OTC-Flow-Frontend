'use client';
import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import RecordFilters from "../filters/RecordFilters";
import RecordList from "../records-lists/RecordList";
import Pagination from "../Pagination_V2";
import { useFilter } from "@/providers/FilterProvider";
import { getRecordApi } from "@/api/recordControllerApi";
import { RecordResponse } from "@/types/recordType";
import { useCallback } from "react";

function FileToProcess() {
    const { setTitle } = useTitle();
    const { setData, data, filters } = useFilter();
    const [totalPages, setTotalPages] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [loading, setLoading] = useState(false);

   

    const handleGetRecords = useCallback(async () => {
        setLoading(true);
        try {
            const _filters = { ...filters };

            if(!_filters.status){
                _filters.status = 'corrected,tocorrect,inprocess,tobeprocessed';
            }
       
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
    }, [filters, setData]);

    useEffect(() => {
        setTitle('Dossiers à traiter');
    }, [setTitle]);

    useEffect(() => {
        handleGetRecords();
    }, [filters, handleGetRecords]);

    return (
        <div className="self-stretch flex p-[30px] flex-col justify-between items-start gap-[30px] grow">
            <div className="grow self-stretch flex-col justify-start items-start gap-[30px] flex">
                <div className="self-stretch justify-start items-center flex-col">
                    <div className="grow mb-5 shrink basis-0 text-black-secondary text-2xl font-bold ">
                        Dossiers à traiter ({totalEntries})
                    </div>
                    <RecordFilters />
                </div>
                <RecordList records={data} loading={loading} />
            </div>
            <Pagination totalPages={totalPages} />
        </div>
    )
}

export default FileToProcess