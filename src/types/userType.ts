import { Role } from "./authType";

export type UserStatus = "Actif" | "Suspendu" | "Inactif" | ""

export type GetUsersParamsType = {
  page?: number;
  per_page?: number;
  role?: Role | string;
  search_text?: string;
  status?: UserStatus;
};

export type ProfilType = {
  id: number;
  name: string;
  description: string;
  code: string;
};

export type UserTypeOutput = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  profil: ProfilType;
  photo_profil: string | null;
  created_at: string;
  status: UserStatus;
  fcm_token: string | null;
  is_connected: boolean;
  last_seen: string | null;
  connected_at: string | null;
  daily_dossier_threshold?: number;
  daily_dossier_threshold_updated_at?: string | null;
};

export type InstallerTypeOutput = UserTypeOutput & {
    installer_info?: SubcontractorType
};

export type UserCtrlType = {
  name: string;
  firstname: string;
  photo_profil: string;
  seuil: number;
  folder_per_status: {
    inprocess: number;
    approved: number;
    refused: number;
    tocorrect: number;
    tobeprocessed: number;
    corrected: number;
  }
  is_connected: boolean;
}


export type SubcontractorType = {
  id: number;
  company_name: string;
  siren: string;
  legal_representative: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
  installer: number;
};

export type InstallerType = {
  id: number;
  company_name: string;
  siren: string;
  legal_representative: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  user: number;
  subcontractors: SubcontractorType[];
};

export type UserType = {
  id: number;
  email: string;
  role: string;
  profil: ProfilType | null;
  firstname: string;
  lastname: string;
  created_at: string;
  photo_profil: string;
  status: string;
  is_connected: boolean;
  daily_dossier_threshold: number | null;
};

export type UserInstallateurType = {
  user: UserType;
  installer: InstallerType;
};


export type SubcontractorInputType = {
  id?: number;
  email?: string;
  phone?: string;
  company_name?: string;
  siren?: string;
  legal_representative?: string;
  address?: string;
};


export type UserInstallerUpdateType = {
  photo_profil?: File | string | null;
  company_name?: string;
  siren?: string;
  legal_representative?: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface InstallerUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
  status?: "active" | "inactive" | "suspended";
}
