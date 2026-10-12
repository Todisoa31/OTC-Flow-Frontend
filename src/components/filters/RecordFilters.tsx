'use client';;
import { useEffect, useState } from "react";
import Input from "../inputs/Input";
import Select from "../inputs/Select";
import DateRangePicker from "../inputs/DateRangePicker";
import {  FOLDER_TYPES, MERGED_STATUSES_OPTIONS } from "@/constants/records";
import { useFilter } from "@/providers/FilterProvider";
import { SelectValue } from "@/types/inputType";
import { useDebounce } from "@/hooks/useDebounce";
import { formatToDDMMYYYY } from "@/utils/date";
import { usePathname } from "next/navigation";
import { FILES_TO_PROCESS_ROUTE, HISTORY_ROUTE } from "@/constants/routes";

function RecordFilters() {
    const { filters, setFilters } = useFilter();
    const [searchText, setSearchText] = useState<string>('');
    const pathname = usePathname();
    
    const debouncedValue = useDebounce(searchText as string, 1000);

    const FOLDER_TYPES_OPTIONS = FOLDER_TYPES.map((folderType) => ({
        label: folderType.label,
        value: folderType.code
    }));

    const handleDateChange = (newDates: { start_date: string; end_date: string }) => {
    
        setFilters(prev => ({
            ...prev,
            page: 1,
            start_date: formatToDDMMYYYY(newDates.start_date),
            end_date: formatToDDMMYYYY(newDates.end_date),
        }));
    };

    const handleChangeFilters = (key: string, value: SelectValue) => {
        if(typeof value === 'string') {
            setFilters(prev=> ({
                ...prev,
                page: 1,
                [key]: value
            }))
        }
    };

    const handleChangeSearchText = (value: string) => {
        setSearchText(value);
    }

    let statuseOptions = MERGED_STATUSES_OPTIONS;

    if(pathname == HISTORY_ROUTE) {
        statuseOptions = MERGED_STATUSES_OPTIONS.filter((option) => option.value === 'approved' || option.value === 'refused')
    }

    if(pathname == FILES_TO_PROCESS_ROUTE){
        statuseOptions = MERGED_STATUSES_OPTIONS.filter((option) => option.value !== 'approved' && option.value !== 'refused')
    }

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            page: 1,
            search_text: debouncedValue
        }));
    }, [debouncedValue]);

    return (
        <div className="self-stretch flex-col justify-start items-start gap-[30px] flex">
            <div className="self-stretch justify-start items-center gap-5 inline-flex flew-wrap">
                <div className="grow shrink basis-0 justify-end items-center gap-5 inline-flex">
                    <DateRangePicker onChange={handleDateChange} />

                    <Select
                        multiple={false}
                        search={false}
                        value={filters.type_dossier as SelectValue}
                        onChange={(value) => handleChangeFilters('type_dossier',value)}
                        options={FOLDER_TYPES_OPTIONS}
                        placeholder="Tous les types de dossier"
                    />

                    <Select
                        multiple={false}
                        search={false}
                        value={filters.status as SelectValue}
                        onChange={(value) => handleChangeFilters('status',value)}
                        options={ statuseOptions }
                        placeholder="Tous les status"
                    />

                    <Input
                        placeholder="Rechercher un dossier"
                        width="grow"
                        height="h-[40px]"
                        value={searchText}
                        onChange={(value) => handleChangeSearchText(value)}
                        className="text-xs text-black font-medium grow"
                        rightIcon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z" fill="#101828" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </div>

    )
}

export default RecordFilters