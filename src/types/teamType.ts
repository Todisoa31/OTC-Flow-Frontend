export type UserTypeMember = {
  id: number;
  email: string;
  role: "Contrôleur" | "Referent";
  profil: Profil;
  firstname: string;
  lastname: string;
  created_at: string; // ISO 8601 date string
  photo_profil: string | null;
  status: "Actif" | "Inactif";
  is_connected: boolean
};

export type Profil = {
  id: number;
  name: string;
  description: string;
  code: string;
};

export type UnasignedParams = {
  role: string;
}

export type CreateTeamPayload = {
  name: string;
  referent_id: number[];
  controllers: number[];
};

export type ControlAssignType = {
  controller_id?: number;
  dossier_id: number[];
}
export type ExportMachineType = {
  job_id: string;
  type_formulaire: string;  
};

export type TeamType = {
  id: number;
  name: string;
  referent: {
    id: number;
    name: string;
    image: string;
  }[];
  controllers: {
    id: number;
    name: string;
    image: string;
  }[];
  is_active: boolean;
  created_by: {
    id: number;
    name: string;
  };
  last_updated: string;
};


export type OptionType= {
 value: number;
 label: string;
 image?: string;
}

export type TeamAssignment = {
  controller_id: number | null;
  team_ids: number[];
};

export type ControllerTypeFolder = {
  id: string;
  name: string;
  nbFolder?: number;
  photo?: string;
};

export type TeamMemberRetrieveType = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  profil: string;
  photo_profil: string | null;
  created_at: string;
  status: string;
  fcm_token: string | null;
  is_connected: boolean;
  last_seen: string;
  connected_at: string;
  daily_dossier_threshold: number;
  charges_dossier: ChargeDossierType;
}

export type TeamMemberRetrieveFormated = {
  id: number;
  firstname: string;
  lastname: string;
  photo_profil: string | null;
  is_connected: boolean;
  trated_dossier: number;
  daily_dossier_threshold: number;
  assinged_dossier_count: number;
}

export type ChargeDossierType = {  
    treated_dossier: number,
    assigned_dossier_count: number  
}


export type ControllerDossierStatsType = {
  user: TeamMemberRetrieveFormated;  // User information
  treated_dossier: number;           // Dossiers traités
  assigned_dossier: number;          // Dossiers en cours
  this_week_dossier: number;         // Dossiers traités cette semaine
  last_10_days_dossier: number;      // Dossiers sur les 10 derniers jours
  this_month_dossier: number;        // Dossiers du mois en cours
  latest_dossiers: {
    id: number;
    name: string;
    status:{
      title: string;
      color_background: string;
      color_text: string;
    }
  }[];
  worktime?: string
};