'use client';
import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import RecordFilters from "../filters/RecordFilters";
import RecordList from "../records-lists/RecordList";
import Pagination from "../Pagination_V2";
import { useFilter } from "@/providers/FilterProvider";
import { getRecordApi } from "@/api/recordControllerApi";
import { RecordResponse } from "@/types/recordType";

function History() {
    const { setTitle } = useTitle();
    const { setData, data, filters } = useFilter();
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTitle('Historique');
    }, []);

    const handleGetRecords = async () => {
        try {
            setLoading(true);
            const _filters = { ...filters };

            if(!_filters.status){
                _filters.status = 'approved,refused';
            }
            const { page, per_page, ...filteredFilters } = _filters;
            const response = await getRecordApi({ page, per_page, ...filteredFilters });
            setTotalPages(response.pagination.total_pages);
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
    }, [filters])

    return (
        <div className="self-stretch flex p-[30px] flex-col justify-between items-start gap-[30px] grow">
            <div className="grow self-stretch flex-col justify-start items-start gap-[30px] flex">
                <div className="self-stretch justify-start items-center flex-col">
                    <div className="grow mb-5 shrink basis-0 text-black-secondary text-2xl font-bold ">
                        Historique des dossiers traités
                    </div>
                    <RecordFilters />
                </div>
                <RecordList records={data} loading={loading} />
            </div>
            <Pagination totalPages={totalPages} />
        </div>
    )
}

export default History