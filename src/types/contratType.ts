export function formatPrixLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\bht\b/i, 'HT')
    .replace(/\bmwhc\b/i, 'MWhc')
    .replace(/\bpar\b/i, 'par')
    .replace(/\bglobal\b/i, 'globale')
    .replace(/\bsomme\b/i, 'somme');
}

export function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export type FicheCEEData = {
  [key: string]: string[];
};

// --- Types utilitaires
export type StringMap = number | string | null | undefined;
export type MixedValueMap = number;

// --- Contrat principal
export interface DetailContratProps {
  message: string;
  acheteur_nom_societe: string | undefined;
  vendeur_nom_societe: string | undefined;
  beneficiaire_nom_societe: string | undefined;
  mandataire_nom_societe: string | undefined;
  signature_nom_societe: string | undefined;
  apporteur_nom_societe: string | undefined;
  id: number;
  contratID: string;
  idContrat: string;

  acheteur: Acheteur | null;
  vendeur: Vendeur | null;
  mandataire: Mandataire | null;
  beneficiaire: Beneficiaire | null;
  apporteur: ApporteurAffaire | null;
  // tarification_structure: string;
  tarification_structure: TarificationStructure | null;

  mf_somme_globale_ht_par_mwhc: number | null;

  file: { id: number; name: string; file: string } | null;

  mf_volume_total_gwhc: number | null;
  mf_volume_par_mois_gwhc: number | null;

  fiche_op: FicheOperation | null;

  contrat_type: string;
  contrat_nature: string;
  contrat_name: string;
  prix_total_ht_par_mwhc: number;
  duree_contrat_en_mois: number;
  date_creation: string;
  date_livraison: string;
  mf_dispositif_cee: string;
  status: string;

  contrat_acheteur: Acheteur;
  contrat_vendeur: Vendeur;
  contrat_beneficiaire: Beneficiaire;
  contrat_mandataire: Mandataire;
  contrat_signature: SignatureFields;
  contrat_apporteur: ApporteurAffaire;
  contrat_fiche_op: FicheOperation;
  contrat_rai_op: RAI_OP;

  total_classique_gwhc: number | null;
  volume_livre_mois: number | null;
  volume_livre_ce_mois_ci: string | null;
  percentage_delivery: number | null;

  signature: SignatureFields;
  rai_op: RAI_OP;
  volume_livre: number;
  compte_oblige_nom_societe: string;
  compte_oblige_type_societe: string;
  compte_oblige_capital: string;
  compte_oblige_adresse: string;
  compte_oblige_ville: string;
  compte_oblige_numero_rcs: string;
  compte_oblige_prenom_nom: string;
  compte_oblige_fonction: string;

  avenants: DetailAvenantProps[];
}

// --- Payload version
export interface ContractPayload {
  contratID?: string;
  contrat_type?: string;
  contrat_nature?: string;
  contrat_name?: string;
  mf_somme_globale_ht_par_mwhc?: number | null;
  mf_volume_total_gwhc?: number | null;
  mf_volume_par_mois_gwhc?: number | null;
  prix_total_ht_par_mwhc?: number;
  date_livraison?: string;
  duree_contrat_en_mois?: number;
  status?: string;
  date_creation?: string;
  mf_dispositif_cee?: string;
  tarification_structure?: {
    type: 'seuil' | 'cee' | 'simple';
    unit: string;
    seuil?: number;
    seuil_display?: string;
    prix_inferieurs?: number;
    prix_superieurs?: number;
    cee_classique?: number;
    cee_precarite?: number;
    value?: number;
  }[];

  // Mettre à jour pour permettre null
  contrat_acheteur?: Acheteur | null;
  contrat_vendeur?: Vendeur | null;
  contrat_beneficiaire?: Beneficiaire | null;
  contrat_mandataire?: Mandataire | null;
  contrat_signature?: SignatureFields;
  contrat_apporteur?: ApporteurAffaire | null;
  contrat_fiche_op?: FicheOperation | null;
  contrat_rai_op?: RAI_OP;

  percentage_delivery?: number | null;

  // Champs optionnels pour les noms de société dans le contrat
  contrat_acheteur_nom_societe?: string;
  contrat_vendeur_nom_societe?: string;
  contrat_beneficiaire_nom_societe?: string;
  contrat_mandataire_nom_societe?: string;
  contrat_signature_nom_societe?: string;
  contrat_apporteur_nom_societe?: string;

  avenants?: DetailAvenantProps[];
}

export type ContratAndAvenantsProps = {
  avenants: DetailAvenantProps[];
  contrat_principale: DetailContratProps | null;
};

// --- Avenant principal
export type DetailAvenantProps = {
  id: number;
  contratID: string | number | null;
  contrat_name: string;
  contrat_nature: string;
  contrat_type: string;
  date_application: string | null;
  date_creation: string;
  date_livraison: string;
  fiche_op: FicheOperation | null;
  duree_contrat_en_mois: number;

  file: { id: number; name: string; file: string } | null;

  installateur?: {
    id: number;
    email: string;
    role: string;
    status: string;
    is_connected: boolean;
    firstname: string;
    lastname: string;
    photo_profil: string;
    bonus_dossier: any;
    daily_dossier_threshold: any;
    is_bonus: any;
    created_at: string;
    profil: { id: number; name: string; description: string; code: string };
  };

  // Peut être number ou objet { MWhc: number }
  mf_somme_globale_ht_par_mwhc: number | null;

  mf_volume_par_mois_gwhc: number | null;
  mf_volume_total_gwhc: number | null;
  prix_total_ht_par_mwhc: number;

  signature: SignatureFields;

  status: string | null;

  compte_oblige_nom_societe: string | null;
  compte_oblige_type_societe: string | null;
  compte_oblige_numero_rcs: string | null;
  compte_oblige_capital: string | null;
  compte_oblige_adresse: string | null;
  compte_oblige_ville: string | null;
  compte_oblige_prenom_nom: string | null;
  compte_oblige_fonction: string | null;

  tarification_structure: { type: string; unit: string; value: number } | null;
  modification_avenant: {
    avenant: number;
    modification: Record<
      string,
      { ancienne_valeur: any; nouvelle_valeur: any }
    >;
  }[];
};

// --- Sous-types
export interface Acheteur {
  acheteur_prenom_nom: string;
  acheteur_nom_societe: string;
  acheteur_capital: string;
  acheteur_ville: string;
  acheteur_nom_complet?: string;
  acheteur_type_societe: string;
  acheteur_adresse: string;
  acheteur_rcs?: string;
  acheteur_fonction: string;
  acheteur_signature_ville?: string;
  acheteur_signature_date?: string;
  acheteur_signature_nom_societe?: string;
  acheteur_signature_prenom_nom?: string;
  acheteur_signature_fonction?: string;
  acheteur_numero_rcs: string;
}

export interface Vendeur {
  vendeur_numero_rcs: string;
  vendeur_prenom_nom: string;
  vendeur_nom_societe: string;
  vendeur_capital: string;
  vendeur_ville: string;
  vendeur_nom_complet?: string;
  vendeur_type_societe: string;
  vendeur_adresse: string;
  vendeur_rcs?: string;
  vendeur_fonction: string;
}

export interface Mandataire {
  mandataire_numero_rcs: string;
  mandataire_nom_societe: string;
  mandataire_prenom_nom: string;
  mandataire_capital: string;
  mandataire_ville: string;
  mandataire_type_societe: string;
  mandataire_adresse: string;
  mandataire_rcs?: string;
  mandataire_fonction: string;
}

export interface Beneficiaire {
  beneficiaire_numero_rcs: string;
  beneficiaire_nom_societe: string;
  beneficiaire_prenom_nom: string;
  beneficiaire_capital: string;
  beneficiaire_ville: string;
  beneficiaire_type_societe: string;
  beneficiaire_adresse: string;
  beneficiaire_rcs?: string;
  beneficiaire_fonction: string;
}

export interface ApporteurAffaire {
  apporteur_affaire_nom_societe: string;
  apporteur_affaire_type_societe: string;
  apporteur_affaire_capital: string;
  apporteur_affaire_adresse: string;
  apporteur_affaire_ville: string;
  apporteur_affaire_numero_rcs: string;
  apporteur_affaire_prenom_nom: string;
  apporteur_affaire_fonction: string;
}

// --- Fiches d'opération
export interface FicheOperation {
  id: number;
  contrat: number;
  fiche_op_residentiel_applicable: string;
  fiche_op_residentiel_cee: string[];
  fiche_op_tertiaire_applicable: string;
  fiche_op_tertiaire_cee: string[];
  fiche_op_industrie_applicable: string;
  fiche_op_industrie_cee: string[];
  fiche_op_agriculture_applicable: string;
  fiche_op_agriculture_cee: string[];
  fiche_op_reseaux_applicable: string;
  fiche_op_reseaux_cee: string[];
  fiche_op_transport_applicable: string;
  fiche_op_transport_cee: string[];
}

export interface SignatureFields {
  signature_ville: string;
  signature_date: string;
  signature_vendeur_nom_societe: string;
  signature_vendeur_prenom_nom: string;
  signature_vendeur_fonction: string;
  signature_acheteur_nom_societe: string;
  signature_acheteur_prenom_nom: string;
  signature_acheteur_fonction: string;
  signature_acheteur_signature_ville: string;
  signature_acheteur_signature_date: string;
  signature_acheteur_signature_nom_societe: string;
  signature_acheteur_signature_prenom_nom: string;
  signature_acheteur_signature_fonction: string;
  signature_beneficiaire_nom_societe?: string;
  signature_beneficiaire_prenom_nom?: string;
  signature_beneficiaire_fonction?: string;
  signature_mandataire_nom_societe?: string;
  signature_mandataire_prenom_nom?: string;
  signature_mandataire_fonction?: string;
  signature_apporteur_affaire_nom_societe?: string;
  signature_apporteur_affaire_prenom_nom?: string;
  signature_apporteur_affaire_fonction?: string;
}

// --- RAI OP
export interface RAI_OP {
  rai_op_residentiel_applicable: string;
  rai_op_residentiel_cee: string;
  rai_op_tertiaire_applicable: string;
  rai_op_tertiaire_cee: string;
  rai_op_industrie_applicable: string;
  rai_op_industrie_cee: string;
  rai_op_agriculture_applicable: string;
  rai_op_agriculture_cee: string;
  rai_op_reseaux_applicable: string;
  rai_op_reseaux_cee: string;
  rai_op_transport_applicable: string;
  rai_op_transport_cee: string;
  rai_op_eco_energie_date: string;
  rai_op_eco_energie_ref: string;
  rai_op_eco_energie_adresse: string;
  rai_installateur_nom: string;
  rai_installateur_coordonnees: string;
  rai_installateur_email: string;
  rai_nom_legal_oblige: string;
  rai_details_oee: string;
  rai_type_cee: string;
  rai_quantite_cee: number;
  rai_montant_prime: number;
  rai_date_achevement_oee: string;
  rai_documents_requis: string;
}

export type SignatureType = {
  id: number;
  signature_ville: string;
  signature_date: string;
  signature_acheteur_nom_societe: string | null;
  signature_acheteur_prenom_nom: string | null;
  signature_acheteur_fonction: string | null;
  signature_vendeur_nom_societe: string | null;
  signature_vendeur_prenom_nom: string | null;
  signature_vendeur_fonction: string | null;
  signature_beneficiaire_nom_societe: string;
  signature_beneficiaire_prenom_nom: string;
  signature_beneficiaire_fonction: string;
  signature_mandataire_nom_societe: string;
  signature_mandataire_prenom_nom: string;
  signature_mandataire_fonction: string;
  signature_apporteur_affaire_nom_societe: string | null;
  signature_apporteur_affaire_prenom_nom: string | null;
  signature_apporteur_affaire_fonction: string | null;
};

export type TarificationStructure = {
  type: 'simple' | 'cee' | 'seuil';
  unit: string;
  value?: number;
  seuil?: number;
  seuil_display?: string;
  prix_inferieurs?: number;
  prix_superieurs?: number;
  cee_classique?: number;
  cee_precarite?: number;
}

export type ContratListType = {
  id: number;
  date_creation: string;
  contrat_type: string;
  contrat_nature: string;
  date_livraison: string;
  mf_volume_total_gwhc: number | null;
  mf_volume_par_mois_gwhc: number | null;
  status: string;
  contratID: string;
  signature: SignatureType;
  prix_total_ht_par_mwhc: number | null;
  contrat_name: string;
  mf_somme_globale_ht_par_mwhc: {
    [key: string]: number | null
  }
  file: {
    file: string;
    id: number;
    name: string;
  };
  fiche_op: {
    id: number;
    fiche_op_residentiel_applicable: string;
    fiche_op_residentiel_cee: string[];
    fiche_op_tertiaire_applicable: string;
    fiche_op_tertiaire_cee: string[];
    fiche_op_industrie_applicable: string;
    fiche_op_industrie_cee: string[];
    fiche_op_agriculture_applicable: string;
    fiche_op_agriculture_cee: string[];
    fiche_op_reseaux_applicable: string;
    fiche_op_reseaux_cee: string[];
    fiche_op_transport_applicable: string;
    fiche_op_transport_cee: string[];
    contrat: number;
  };
  installateur: {
    id: number;
    email: string;
    role: string;
    profil: {
      id: number;
      name: string;
      description: string;
      code: string
    };
    firstname: string;
    lastname: string;
    created_at: string;
    photo_profil: string;
    status: string;
    is_connected: boolean;
    daily_dossier_threshold: any;
    is_bonus: any;
    bonus_dossier: any;
  };
  volume_livre: number;
  compte_oblige_nom_societe: string;
  compte_oblige_type_societe: string;
  compte_oblige_capital: string;
  compte_oblige_adresse: string;
  compte_oblige_ville: string;
  compte_oblige_numero_rcs: string;
  compte_oblige_prenom_nom: string;
  compte_oblige_fonction: string;
  tarification_structure: TarificationStructure[];
};


export type ContractTypeDetail = {
  id: number;
  date_creation: string;
  contrat_type: string;
  contrat_nature: string;
  contrat_name: string;
  date_livraison: string;
  duree_contrat_en_mois: number;
  mf_volume_total_gwhc: string | null;
  mf_volume_par_mois_gwhc: string | null;
  mf_dispositif_cee: string;
  volume_livre_mois: string;
  contratID: string;
  mf_somme_globale_ht_par_mwhc: {
    [key: string]: number | null
  } | null;
  mandataire: {
    id: number;
    mandataire_nom_societe: string;
    mandataire_type_societe: string;
    mandataire_capital: string;
    mandataire_adresse: string;
    mandataire_ville: string;
    mandataire_numero_rcs: string;
    mandataire_prenom_nom: string;
    mandataire_fonction: string;
  } | null;

  beneficiaire: {
    id: number;
    beneficiaire_nom_societe: string;
    beneficiaire_type_societe: string;
    beneficiaire_capital: string;
    beneficiaire_adresse: string;
    beneficiaire_ville: string;
    beneficiaire_numero_rcs: string;
    beneficiaire_prenom_nom: string;
    beneficiaire_fonction: string;
  } | null;

  signature: {
    id: number;
    signature_ville: string;
    signature_date: string;
    signature_acheteur_nom_societe: string | null;
    signature_acheteur_prenom_nom: string | null;
    signature_acheteur_fonction: string | null;
    signature_vendeur_nom_societe: string | null;
    signature_vendeur_prenom_nom: string | null;
    signature_vendeur_fonction: string | null;
    signature_beneficiaire_nom_societe: string | null;
    signature_beneficiaire_prenom_nom: string | null;
    signature_beneficiaire_fonction: string | null;
    signature_mandataire_nom_societe: string | null;
    signature_mandataire_prenom_nom: string | null;
    signature_mandataire_fonction: string | null;
    signature_apporteur_affaire_nom_societe: string | null;
    signature_apporteur_affaire_prenom_nom: string | null;
    signature_apporteur_affaire_fonction: string | null;
  };

  acheteur: {
    id: number;
    acheteur_nom_societe: string;
    acheteur_type_societe: string;
    acheteur_capital: string;
    acheteur_adresse: string;
    acheteur_ville: string;
    acheteur_numero_rcs: string;
    acheteur_prenom_nom: string;
    acheteur_fonction: string;
    contrat: number;
  } | null;

  vendeur: {
    id: number;
    vendeur_nom_societe: string;
    vendeur_type_societe: string;
    vendeur_capital: string;
    vendeur_adresse: string;
    vendeur_ville: string;
    vendeur_numero_rcs: string;
    vendeur_prenom_nom: string;
    vendeur_fonction: string;
    contrat: number;
  } | null;

  apporteur: any | null;

  fiche_op: {
    id: number;
    fiche_op_residentiel_applicable: string;
    fiche_op_residentiel_cee: string[];
    fiche_op_tertiaire_applicable: string;
    fiche_op_tertiaire_cee: string[];
    fiche_op_industrie_applicable: string;
    fiche_op_industrie_cee: string[];
    fiche_op_agriculture_applicable: string;
    fiche_op_agriculture_cee: string[];
    fiche_op_reseaux_applicable: string;
    fiche_op_reseaux_cee: string[];
    fiche_op_transport_applicable: string;
    fiche_op_transport_cee: string[];
    contrat: number;
  } | null;

  rai_op: {
    id: number;
    rai_op_eco_energie_date: string | null;
    rai_op_eco_energie_ref: string | null;
    rai_op_eco_energie_adresse: string | null;
    rai_installateur_nom: string | null;
    rai_installateur_coordonnees: string | null;
    rai_installateur_email: string | null;
    rai_nom_legal_oblige: string;
    rai_details_oee: string | null;
    rai_type_cee: string | null;
    rai_quantite_cee: number | null;
    rai_montant_prime: number | null;
    rai_date_achevement_oee: string | null;
    rai_documents_requis: string | null;
    contrat: number;
  } | null;

  volume_total_gwhc: number | null;
  total_classique_gwhc: number | null;
  percentage_delivery: number | null;
  prix_total_ht_par_mwhc: number | null;

  file: {
    file: string;
    id: number;
    name: string;
  };
  compte_oblige_nom_societe: string;
  compte_oblige_type_societe: string;
  compte_oblige_capital: string;
  compte_oblige_adresse: string;
  compte_oblige_ville: string;
  compte_oblige_numero_rcs: string;
  compte_oblige_prenom_nom: string;
  compte_oblige_fonction: string;
};


type SignatureType2 = {
  id: number;
  signature_ville: string;
  signature_date: string;
  signature_acheteur_nom_societe: string;
  signature_acheteur_prenom_nom: string;
  signature_acheteur_fonction: string;
  signature_vendeur_nom_societe: string;
  signature_vendeur_prenom_nom: string;
  signature_vendeur_fonction: string;
  signature_beneficiaire_nom_societe: string | null;
  signature_beneficiaire_prenom_nom: string | null;
  signature_beneficiaire_fonction: string | null;
  signature_mandataire_nom_societe: string | null;
  signature_mandataire_prenom_nom: string | null;
  signature_mandataire_fonction: string | null;
  signature_apporteur_affaire_nom_societe: string | null;
  signature_apporteur_affaire_prenom_nom: string | null;
  signature_apporteur_affaire_fonction: string | null;
};

export type ContractType = {
  id: number;
  compte_oblige_nom_societe: string;
  date_creation: string; // ISO date string
  contrat_type: string;
  contrat_nature: string;
  date_livraison: string; // YYYY-MM-DD
  mf_volume_total_gwhc: string;
  mf_volume_par_mois_gwhc: string;
  status: string;
  signature: SignatureType2;
  contratID: string;
  fiche_op: FicheCEEData;
  contrat_name: string;
  file: any;
  mf_somme_globale_ht_par_mwhc: { [key: string]: number | null };
  prix_total_ht_par_mwhc: number;

};


export type UpdateContractType = {
  contratID?: string;
  contrat_type?: string;
  contrat_nature?: string;
  contrat_name?: string;
  mf_somme_globale_ht_par_mwhc?: string;
  tarification_structure?: string;
  mf_volume_total_gwhc?: string;
  mf_volume_par_mois_gwhc?: string;
  prix_total_ht_par_mwhc?: number;
  date_livraison?: string;
  duree_contrat_en_mois?: number;
  status?: string;
  contrat_acheteur?: {
    acheteur_nom_societe?: string;
    acheteur_type_societe?: string;
    acheteur_capital?: string;
    acheteur_adresse?: string;
    acheteur_ville?: string;
    acheteur_numero_rcs?: string;
    acheteur_prenom_nom?: string;
    acheteur_fonction?: string;
  };
  contrat_vendeur?: {
    vendeur_nom_societe?: string;
    vendeur_type_societe?: string;
    vendeur_capital?: string;
    vendeur_adresse?: string;
    vendeur_ville?: string;
    vendeur_numero_rcs?: string;
    vendeur_prenom_nom?: string;
    vendeur_fonction?: string;
  };
  contrat_beneficiaire?: {
    beneficiaire_nom_societe?: string;
    beneficiaire_type_societe?: string;
    beneficiaire_capital?: string;
    beneficiaire_adresse?: string;
    beneficiaire_ville?: string;
    beneficiaire_numero_rcs?: string;
    beneficiaire_prenom_nom?: string;
    beneficiaire_fonction?: string;
  };
  contrat_mandataire?: {
    mandataire_nom_societe?: string;
    mandataire_type_societe?: string;
    mandataire_capital?: string;
    mandataire_adresse?: string;
    mandataire_ville?: string;
    mandataire_numero_rcs?: string;
    mandataire_prenom_nom?: string;
    mandataire_fonction?: string;
  };
  contrat_signature?: {
    signature_ville?: string;
    signature_date?: string;
    signature_acheteur_nom_societe?: string;
    signature_acheteur_prenom_nom?: string;
    signature_acheteur_fonction?: string;
    signature_vendeur_nom_societe?: string;
    signature_vendeur_prenom_nom?: string;
    signature_vendeur_fonction?: string;
    signature_beneficiaire_nom_societe?: string;
    signature_beneficiaire_prenom_nom?: string;
    signature_beneficiaire_fonction?: string;
    signature_mandataire_nom_societe?: string;
    signature_mandataire_prenom_nom?: string;
    signature_mandataire_fonction?: string;
    signature_apporteur_affaire_nom_societe?: string;
    signature_apporteur_affaire_prenom_nom?: string;
    signature_apporteur_affaire_fonction?: string;
  };
  contrat_apporteur?: {
    apporteur_affaire_nom_societe?: string;
    apporteur_affaire_type_societe?: string;
    apporteur_affaire_capital?: string;
    apporteur_affaire_adresse?: string;
    apporteur_affaire_ville?: string;
    apporteur_affaire_numero_rcs?: string;
    apporteur_affaire_prenom_nom?: string;
    apporteur_affaire_fonction?: string;
  };
  contrat_fiche_op?: {
    fiche_op_residentiel_applicable?: string;
    fiche_op_residentiel_cee?: string;
    fiche_op_tertiaire_applicable?: string;
    fiche_op_tertiaire_cee?: string;
    fiche_op_industrie_applicable?: string;
    fiche_op_industrie_cee?: string;
    fiche_op_agriculture_applicable?: string;
    fiche_op_agriculture_cee?: string;
    fiche_op_reseaux_applicable?: string;
    fiche_op_reseaux_cee?: string;
    fiche_op_transport_applicable?: string;
    fiche_op_transport_cee?: string;
  };
  contrat_rai_op?: {
    rai_op_eco_energie_date?: string;
    rai_op_eco_energie_ref?: string;
    rai_op_eco_energie_adresse?: string;
    rai_installateur_nom?: string;
    rai_installateur_coordonnees?: string;
    rai_installateur_email?: string;
    rai_nom_legal_oblige?: string;
    rai_details_oee?: string;
    rai_type_cee?: string;
    rai_quantite_cee?: string;
    rai_montant_prime?: string;
    rai_date_achevement_oee?: string;
    rai_documents_requis?: string;
  };
};


export type ContractListPayload = {
  user_id?: number | null;
  contrat_type?: string;
  status_contrat?: string;
  search_text?: string;
  page: number;
  per_page: number;
};

export type ContractFor = "admin" | "head" | "installer";

export type OverviewType = {
  total_contracts: number;
  total_volume_livre: number;
  total_volume: number;
  total_amount: number;
};