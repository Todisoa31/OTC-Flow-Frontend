import { FolderFileType } from "./folderType";
import { ExtractedDataItem } from "./recordType";

export type FileType = {
  id: number;
  type_file: string;
  file: string;
  title_file: string;
  name: string;
};

export type UserMiniType = {
  id: number;
  firstname: string;
  lastname: string;
  photo_profil: string | null;
  is_connected: boolean;
  status: string;
};

export type DossierDetailsType = {
  id: number;
  name: string;
  type_dossier: string;
  created_at: string;
  installateur: UserMiniType;
  processed_by: UserMiniType;
  files: FileType[];
  status?: Record<string, any>;
  controlleur_conformite: UserMiniType;
};

export type ExtractedData = {
  file_facture: ExtractedDataItem[] | null;
  file_devis: ExtractedDataItem[] | null;
  file_attestation: ExtractedDataItem[] | null;
  file_attestation_pose: ExtractedDataItem[] | null;
  file_photos: ExtractedDataItem[] | null;
  file_certificat: ExtractedDataItem[] | null;
};

export type fileDataType = {
  file_attestation: null,
  file_devis: [],
  file_attestation_pose: [],
  file_facture: [],
  other_file: [],
  status: "",
  file_immatriculation: [],
  file_cadre_contribution: [],
  file_attestation_desembouage: [],
  file_precarite: [],
}

export type FilePdfModalType = {
  showPdfViewer: boolean,
  file: FolderFileType | null
}