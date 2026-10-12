import { Role } from "./authType";

export type StatusesType =
  | "inprocess"
  | "approved"
  | "refused"
  | "tocorrect"
  | "tobeprocessed"
  | "corrected"
  | "tobechecked"

export type FileType =
  | "file_devis"
  | "file_facture"
  | "file_attestation"
  | "file_attestation_pose"
  | "other_file"
  | "images"
  | "file_immatriculation"
  | "file_contribution"
  | "file_attestation_desembouage"
  | "file_cadre_contribution"
  | "file_precarite";

export type MenuSwitcherType = {
  title: string;
  code: FileType;
  file_id?: number;
};

export type SidebarItemType = {
  label: string;
  icon: React.ReactNode;
  pathname: string;
  active: boolean;
};

export type PaginationType = {
  total_pages: number;
  page: number;
  per_page: number;
  total_entries: number;
};

export type CommentType = {
  id?: number;
  comment?: string;
  created_at?: string;
  controlleur?: {
    id?: number;
    email?: string;
    role?: string;
    profil?: {
      id?: number;
      name?: string;
      description?: string;
      code?: string;
    };
    firstname?: string;
    lastname?: string;
    created_at?: string;
    photo_profil?: string;
    status?: string;
    is_connected?: true;
    daily_dossier_threshold?: string;
    is_bonus?: string;
    bonus_dossier?: string;
  };
};

export type PlaningFilterType = {
  status?: string;
  role?: Role | string;
  date_from?: string;
  date_to?: string;
  day_off_type?: string;
};

export type DuplicateFilterType = {
  searchText?: string;
  folder_type?: string;
  date_submission?: string;
};

export type FolderWorklogPayloadType = {
  dossier_id: number;
  user_id: number;
  event_type: "in" | "out";
};

export type ControleKeysType =
  | "storageKey"
  | "lots"
  | "all"
  | "approved"
  | "in_control"
  | "satisfactory"
  | "unsatisfactory"
  | "service_request"
  | "refused_control"
  | "fully_validated";
