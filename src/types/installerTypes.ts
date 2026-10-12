export type InstallerpayloadType = {
    search_text?: string;
    userStatus?: string;
    status?: string;
    page?: number;
    per_page?: number;
      
    type_dossier?: string,
    installateur?: string | null,
};

export type InstallateurOutputType = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  photo_profil: string;
  siren: string;
  status: string;
  nb_dossiers: number;
  created_at: string; // ou `Date` si tu veux le parser en objet Date
};
