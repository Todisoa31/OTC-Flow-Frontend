"use client"; // Required for state management in Next.js 15

import { DEFAULT_CONTROL_FOLDER_STATS, DETAIL_TEAM } from "@/constants/records";
import { fileDataType, FilePdfModalType } from "@/types/dossierType";
import { MenuSwitcherType } from "@/types/general";

import { createContext, useState, useContext, ReactNode, useMemo } from "react";

interface StatusDossierContextType {
    menuSwitcher: MenuSwitcherType[];
    setMenuSwitcher: React.Dispatch<React.SetStateAction<MenuSwitcherType[]>>;
    fileData: fileDataType;
    setFileData: React.Dispatch<React.SetStateAction<fileDataType>>;
    filePdfModal: FilePdfModalType;
    setFilePdfModal: React.Dispatch<React.SetStateAction<FilePdfModalType>>;
    commentFileId: number | null;
    setCommentFileId: React.Dispatch<React.SetStateAction<number | null>>;
}
const StatusDossierContext: StatusDossierContextType =  {
    menuSwitcher: [],
    setMenuSwitcher: () => {},
    commentFileId: null,
    setCommentFileId: () => {},
    
    fileData: {
      file_attestation: null,
      file_devis: [],
      file_attestation_pose: [],
      file_immatriculation: [],
      file_cadre_contribution: [],
      file_attestation_desembouage: [],
      file_facture: [],
      other_file: [],
      file_precarite: [],
      status: "",
    },
    setFileData: () => {},

    filePdfModal:{showPdfViewer: false, file: null},
    setFilePdfModal: () => {},
}


const CreateStatusDossierContext = createContext<StatusDossierContextType>(StatusDossierContext);

export const StatusDossierProvider = ({ children }: { children: ReactNode }) => {
    const [menuSwitcher, setMenuSwitcher] = useState<MenuSwitcherType[]>([]);
    const [commentFileId, setCommentFileId] = useState<number | null>(null);
    const [fileData, setFileData] = useState<fileDataType>({
        file_attestation: null,
        file_devis: [],
        file_attestation_pose: [],
        file_immatriculation: [],
        file_cadre_contribution: [],
        file_attestation_desembouage: [],
        file_facture: [],
        other_file: [],
        status: "",
        file_precarite: [],
    });
    const [filePdfModal, setFilePdfModal] = useState<FilePdfModalType>({
        showPdfViewer: false,
        file: null,
    });

    const value = useMemo(() => ({
        menuSwitcher,
        setMenuSwitcher,

        fileData,
        setFileData,
        
        filePdfModal,
        setFilePdfModal,

        commentFileId,
        setCommentFileId
        
    }), [
        menuSwitcher, setMenuSwitcher,
        fileData, setFileData,
        filePdfModal, setFilePdfModal,
        commentFileId, setCommentFileId
    ]);

    return (
        <CreateStatusDossierContext.Provider value={value}>
            {children}
        </CreateStatusDossierContext.Provider>
    );
};




export const useStatusDosserProvider = () => {
    const context = useContext(CreateStatusDossierContext);
    if (!context) {
        throw new Error("useStatusDosserProvider must be used within a AuthProvider");
    }
    return context;
};

