"use client"; // Required for state management in Next.js 15

import { GetParams } from "@/types/filterType";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";
type FilterValue = number | string | boolean;

interface FilterContextType {
    data: Record<string, unknown>[];
    setData: React.Dispatch<React.SetStateAction<Record<string, unknown>[]>>;

    filters: Record<string | keyof GetParams, FilterValue >;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, FilterValue>>>;

    processingFilter: boolean;
    setProcessingFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [filters, setFilters] = useState<Record<string, FilterValue>>({page: 1, per_page: 10});
    const [processingFilter, setProcessingFilter] = useState<boolean>(false);

    const value = useMemo(() => ({
        data, setData,
        filters, setFilters,
        processingFilter,
        setProcessingFilter
    }), [
        data, setData,
        filters, setFilters,
        processingFilter,setProcessingFilter
    ]);

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
};
