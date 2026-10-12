"use client"; // Required for state management in Next.js 15

import { ExtractedDataItem, RecordFileResponse } from "@/types/recordType";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";

interface RecordContextType {
    selectedRecord: Record<string, any>;
    setSelectedRecord: React.Dispatch<React.SetStateAction<Record<string, any>>>;

    selectedFile: RecordFileResponse | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<RecordFileResponse | null>>;

    selectedExtractedData: ExtractedDataItem | null;
    setSelectedExtractedData: React.Dispatch<React.SetStateAction<ExtractedDataItem | null>>;
}

const RecordContext = createContext<RecordContextType | undefined>(undefined);

export const RecordProvider = ({ children }: { children: ReactNode }) => {
    const [selectedRecord, setSelectedRecord] = useState<Record<string, any>>({});
    const [selectedFile, setSelectedFile] = useState<RecordFileResponse | null>(null);
    const [selectedExtractedData, setSelectedExtractedData] = useState<ExtractedDataItem | null>(null);

    const value = useMemo(() => ({
        selectedRecord, setSelectedRecord,
        selectedFile, setSelectedFile,
        selectedExtractedData, setSelectedExtractedData
    }), [
        selectedRecord, setSelectedRecord,
        selectedFile, setSelectedFile,
        selectedExtractedData, setSelectedExtractedData
    ]);

    return (
        <RecordContext.Provider value={value}>
            {children}
        </RecordContext.Provider>
    );
};

export const useRecord = () => {
    const context = useContext(RecordContext);
    if (!context) {
        throw new Error("useRecord must be used within a RecordProvider");
    }
    return context;
};
