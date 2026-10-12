import { Role } from "./authType";
import { UserTypeOutput } from "./userType";

export type PlanningPayloadType = {
  page?: number;
  per_page?: number;
  role?: Role | "";
  search_text?: string;
  start_date?: string; //2025-07-02
};

export type AvailabilityType = "Off" | "Disponible";

export type AvailabilityPayload = {
  user_id: number;
  start_datetime: string;
  end_datetime: string;
  availability_type: AvailabilityType;
  description?: string;
};

export type UserPlanning = {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
  photo_profil: string | null;
  planning: string[];
};

export type UserPlannigModal = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  profil: UserTypeOutput | null;
  photo_profil: string | null;
  created_at: string;
  status: string;
  fcm_token: string | null;
  is_connected: boolean;
  last_seen: string | null;
  connected_at: string | null;
  daily_dossier_threshold: number;
  planning: AvailabilityType[];
};

export type AvailabilityPlanningItemType = {
  id: number;
  start_datetime: string;
  end_datetime: string;
  availability_type: AvailabilityType
  description: string;
  user: UserPlannigModal
};


export type PlanningToogleType = "Info" | "Create" | "Update";

export type UpdateSideType = {
  user_id: number;
  date_from: string;
  date_to: string;
  comment: string;
};