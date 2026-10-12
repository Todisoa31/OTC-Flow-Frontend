import React from "react";
import { GetParams } from "./filterType";

export type Statuses =
  | "draft"
  | "inprocess"
  | "approved"
  | "refused"
  | "tocorrect"
  | "tobeprocessed"
  | "corrected"
  | "in_control"
  | "satisfactory"
  | "unsatisfactory"
  | "service_request"
  | "refused_control"
  | "fully_validated";

export type StatusesLabel =
  | "Brouillon"
  | "En cours de traitement"
  | "Validé"
  | "Refusé"
  | "A corriger"
  | "Validé conforme"
  | "En cours de contrôle"
  | "Satisfaisant"
  | "Non satisfaisant"
  | "Demande SAV"
  | "Refusé après contrôle"
  | "Validé complet";

export type FileKeys =
  | "file_facture"
  | "file_devis"
  | "file_attestation"
  | "file_attestation_pose"
  | "file_certificat"
  | "file_immatriculation"
  | "other_file"
  | "images"
  | "file_cadre_contribution"
  | "file_attestation_desembouage"
  | 'file_precarite';

export type loadingMassType = {
  uploading: boolean;
  submiting: boolean;
};

export type Steppers = {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ active: boolean }> | React.JSX.Element;
  completed: boolean;
};

export type Dossier = {
  folder_name: string;
  fichiers: string[]; // liste des noms de fichiers
  other_files: string[];
};

export type FileMasse = {
  dossiers: Dossier[];
  restrictedFiles: File[];
  otherFiles: File[];
  type_formulaire: string;
  contrat_id?: number | null | undefined; // optional field for contract ID
};

export type Records = {
  id: number;
  date: string;
  name: string;
  type: string;
  lastUpdate: string;
  status: string;
  statusCode: string;
};

export type UploadedItems = {
  bucket_name: string;
  original_file_path: string;
  installateur_id: string;
  type_fichier: string;
  extension: string;
  file_size: number;
  is_need_conversation: boolean;
  temp_file_path: string[];
  update_date: string;
  type_formulaire: string;
};

export type ExtractedDataItem = {
  variables: string;
  infos: string;
  devis?: string | number | null;
  facture?: string | number | null;
  attestation?: string | number | null;
  attestation_pose?: string | number | null;
  controller_corrections?: Correction[] | null;
  proposition?: string | number | null;
  score?: number | null;
};

export type Uploadedfile = {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
};

export type RecordPayload = {
  //ETAPE 1
  form_type: string; //type de dossier

  //ETAPE 2
  name: string; //nom dossier
  company_name: string; //sociéte
  siret: string; //siret
  work_address: string; //adresse_travaux
  work_postal_code: string; //code_postal_travaux
  work_city: string; //commune_travaux
  address: string; //adresse
  postal_code: string; //code_postal
  city: string; //commune
  quantity_length: number; //quantite_longueur
  brand: string; //marque
  reference: string; //reference
  date_of_quote_signature: string; //date_signature_devis
  date_of_invoice_issue: string; //date_emission_facture
  date_of_honor_statement_signature: string; //date_signature_de_l_attestation_sur_l_honneur
  items: RecordFileItems | ExtractedDataItem[];
  statusCode?: string; //code statut dossier
  job_id: string;
  installed_by?: string; //installateur
  contrat_id?: number | null | undefined; // optional field for contract ID
};

export type ExtractedResult = {
  [folderName: string]: VerificationExtractionResult[];
};

export type VerificationExtractionResult = {
  jobId: string;
  type: "attestation" | "attestation_pose" | "devis" | "facture";
  verification_results: any[] | null;
  extraction_data: Record<string, any> | null;
};

export type RecordImportFilePayload = Record<FileKeys, File | null> & {
  type_formulaire: string; //type de dossier
};

export type RecordFileJobId = Record<FileKeys, string>;

export type RecordFileItems = Record<FileKeys, UploadedItems | undefined | null>;

export type ExtractedData = Record<FileKeys, ExtractedDataItem[] | null>;

export type GetRecordParams = GetParams & {
  status?: Statuses;
  type_dossier?: string;
};

export type GetUserParams = GetParams & {
  status?: Statuses;
  type_dossier?: string;
};

export type FileResponse = {
  id: number;
  name: null;
  size: number | null;
  content_type: string | null;
  file: string | null;
  type_file: FileKeys;
  original_path: string | null;
  temporaire_path: string[] | null;
  bucket_name: string | null;
  extension: string | null;
  is_need_conversation: boolean | null;
};

export type Comments = {
  id: number;
  comment: string;
  created_ad?: string;
};

export type Observations = {
  id: number;
  comment: string;
  created_ad?: string;
};

export type StatusResponse = {
  id: number;
  title: string;
  code: string;
};

export type RecordResponse = {
  id: number;
  name: null;
  description: null;
  type_travaux: null;
  date_creation: null;
  status: StatusResponse | null;
  files: FileResponse[] | null;
};

export type RecordMetricResponse = {
  status_id: number;
  status_code: string;
  status_title: string;
  count: number;
  color_background: string;
  color_text: string;
};

export type Correction = {
  id: number;
  correction_value: number | string;
  created_at: string;
};

export type RecordFileResponse = {
  id: number;
  name: string;
  size: number;
  content_type: string; // e.g., "application/pdf"
  file: string; // e.g., "/uploads/RENOVABAT-EHPAD_MARIE_BERNARD-_DEVIS_SIGNE_D2QMaXW.pdf", file path
  type_file: FileKeys;
  comments: Comments[];
  status: Statuses;
  status_display: string; // value of STATUSES_OPTIONS
  job_id: string; // e.g., "1_BAR_TH_160_28_03_2025_15_53_00"
  title_file: string; // e.g., "Devis"
  created_at?: string; // e.g., "2023-10-02T14:53:00.000Z"
  corrections: {
    id: number;
    variable: string;
    infos: string;
    created_at: string;
    controller_corrections: Correction[];
  }[];
};

export type AnalystDossierType = {
  type_dossier: string;
  count: number;
  background_color: string;
  percentage: string;
};

export type RecordAnalyticsMetricResponse = {
  total_dossier: number;
  nombre_dossier_par_type: AnalystDossierType[];
};

export type OtherFilesType = {
  job_id: string;
  other_files: File[];
};

export type FolderTypes = {
  label: string;
  code: string;
  active: boolean;
  requiredDocuments: string[];
  optionalDocuments: string[]; // optional field for facultative files
  getRequiredDocuments?: (marketType: "BtoB" | "BtoC") => string[];
};

export type TraFicheType = {
  job_id: string;
  file_devis?: File[] | null;
  file_facture?: File[] | null;
  file_attestation?: File[] | null;
  file_immatriculation?: File[] | null;
  file_cadre_contribution?: File[] | null;
  contrat_id?: number | null; 
  type_formulaire?: string | null;
  file_precarite?: File[] | null; 
}

export interface ApiRow {
  id: number;
  raison_sociale_professionnel: string;
  siret_professionnel: string;
  raison_sociale_beneficiaire: string;
  siren_beneficiaire: string;
  date_engagement_operation: string;
  reference: string;
  location: string;
  date_preuve: string;
  categorie_vehicule: string;
  parc_total_automobile: string;
  parc_automobile_collectivite: string;
  date_premiere_immatriculation: string;
  date_immatriculation_operation: string;
  numero_imatriculation: string;
  job_id: string;
  attestation: boolean;
}

export interface ApiResponse {
  data: ApiRow[];
}
