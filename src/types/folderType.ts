// import { file } from 'jszip';
import { Role } from "./authType";
import { ContractType } from "./contratType";
import { AttesationHonorType, FileDetailFile } from "./fileType";
import { FileType, StatusesType } from "./general";
import { InstallerTypeOutput, UserTypeOutput } from "./userType";

export type GlobalParamsType = {
    end_date?: string;
    page?: number;
    per_page?: number;
    search_text?: string;
    start_date?: string;
    status?: string;
    type_dossier?: string;
    installateur?: string | null;
    controlleur?: string;
    controlleur_conformite?: string;
    is_cofrac?: boolean;
    refresh?: boolean;
    userStatus?: string;
    member_search?: string;
    role?: Role | string;
    status_contrat?: string;
    contrat_type?: string;
    [key: string]: string | number | boolean | undefined | null;
};

export type FolderStatus = {
    id: number;
    title: string;
    code: string;
    color_text: string;
    color_background: string;
};

export type FolderFileType = {
    id: number;
    name: string;
    size: number;
    content_type: string;
    file: string;
    type_file: FileType;
    comments: any[];
    status: StatusesType;
    status_display: string;
    job_id: string;
    title_file: string;
    corrections: any[];
};

export type FolderOutputType = {
    id: number;
    name: string;
    description: string | null;
    type_travaux: string | null;
    type_dossier: string;
    date_creation: string | null;
    nom_societe: string;
    adresse: string | null;
    updated_at: string;
    created_at: string;
    code_postal_travaux: string;
    status: FolderStatus;
    files: FolderFileType[];
    installateur: InstallerTypeOutput;
    processed_by: UserTypeOutput | null;
    assigned_by: UserTypeOutput | null;
    photos_travaux?: string[];
    montant: number;
    volume: string;
    job_id: string;
    other_file: FolderFileType[];
    contrat: ContractType | null;
    information_file_reference_facture?: string | null;
    information_file_beneficiaire_telephone?: string | null;
    information_file_prime_cee?: string | null;
    information_file_montant_cee?: string | null;
    information_file_quantite?: string | null;
    information_file_signature_devis?: string | null;
    information_file_date_facture?: string | null;
    date_validation?: string | null;
    information_file_addresse_travaux?: string | null;
    observation_technique: string | null;
    commentaire_principal: string | null;
    is_cofrac?: boolean;
    file_recap?: Record<string, any>;
    volume_precarite: string;
};

export type CountFolderType = {
    inprocess: number;
    approved: number;
    refused: number;
    tocorrect: number;
    tobeprocessed: number;
    corrected: number;
};

export type DocumentInfoType = {
    id: number;
    title: string;
    status: StatusesType;
    status_name: string;
    date: string;
    document_name:string; 
    changed?: boolean;
    file: any;
};


export type FileDataType = {
  file_attestation: AttesationHonorType | null;
  file_devis: FileDetailFile[] | [];
  file_attestation_pose: FileDetailFile[] | [];
  file_facture: FileDetailFile[] | [];
  other_file: FileDetailFile[] | [];
  file_immatriculation: FileDetailFile[] | [];
  file_cadre_contribution: FileDetailFile[] | [];
  status: string;
};



export type SwictherType = 'historique' | 'conversation';
export type ChatSelectType = "Controlleur" | "Installateur";