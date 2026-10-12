import { UserTypeOutput } from "./userType";

export type AditHistoryOutputType = {
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  role?: string | null;
  user_id?: number | null;
  folder_id?: number | null;
  tablename?: string;
};



export type ActivityLogType = {
  id: number;
  created_by: UserTypeOutput;
  action_type: string;
  model_name: string;
  model_id: number;
  timestamp: string;
  description: string;
  logout_type: string | null;
  session_duration: string | null;
};