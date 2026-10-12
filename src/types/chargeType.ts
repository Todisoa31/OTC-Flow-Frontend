interface Profil {
  id: number;
  name: string;
  description: string;
  code: string;
}

interface UserCharge {
  id: number;
  email: string;
  role: string;
  profil: Profil;
  firstname: string;
  lastname: string;
  created_at: string;
  photo_profil: string | null;
  status: string;
  is_connected: boolean;
  daily_dossier_threshold: number;
}

export interface ChargeDetails {
  user: UserCharge;
  treated_dossier: number;
  assigned_dossier: number;
  this_week_dossier: number;
  last_10_days_dossier: number;
  this_month_dossier: number;
}