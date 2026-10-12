export type FileType = {
  id: number;
  name: string;
  size: number;
  content_type: string;
  file: string;
  type_file: string;
  comments: any[]; // tu peux typer les commentaires si tu en as la structure
  status: string;
  status_display: string;
  job_id: string;
  title_file: string;
  corrections: any[]; // idem ici
};

export type StatusType = {
  id: number;
  title: string;
  code: string;
  color_text: string;
  color_background: string;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  profil: {
    id: number;
    name: string;
    description: string;
    code: string;
  };
  firstname: string;
  lastname: string;
  created_at: string; // ISO 8601 date string
  photo_profil: string | null;
  status: string; // ISO 8601 date string
  is_connected: boolean;
};

export type DossierType = {
  id: number;
  name: string;
  nom_dossier: string;
  description: string | null;
  type_travaux: string | null;
  type_dossier: string;
  date_creation: string | null;
  nom_societe: string;
  adresse: string | null;
  updated_at: string;
  created_at: string;
  code_postal_travaux: string;
  status: StatusType;
  files: FileType[];
  other_file: FileType[];
  installateur: UserType;
  processed_by: UserType;
  date_validation: string | null;
  job_id: string;
  checked: boolean;
  volume: number;
  controlleur_conformite: UserType;
  total_classique?: string
  dossier?: {
    controlleur_conformite: UserType;
    files: FileType[];
    last_control_date: string
    processed_by: UserType
    type_dossier?: string
  }
};

export type FolderExportMachineType = {
  jobId: string;
  installateur: string;
  controlleur: string;
  nameDossier: string;
  files: FileType[];
  other_file: FileType[];
}

export type FolderExportFinal = {
  typeFormulaire: string;
  listFolder: FolderExportMachineType[];
}