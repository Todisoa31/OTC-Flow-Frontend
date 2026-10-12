export type FileDetailFile = {
    id: number;
    name: string;
    size: number;
    file: string;
    content_type: string;
    type_file?: string;
    status?: string;
    status_display?: string;
    job_id?: string;
    title_file?: string | null;
    comments?: any[];
    corrections?: any[];
    variables: string;
    infos: string;
    devis: string;
    facture: string;
    attestation: string;
    attestation_pose: string;
    score: number;
    proposition: string | null;
    controller_corrections: any[];
    cadre_contribution?: string;
    attestation_desembouage?: string;
    immatriculation?: string;
    precarite?: string;
};

export type TableType = {
  label: string;
  width: string;
}

export type FileExportData = {
  file_attestation?: {
    cadreA: FileDetailFile[];
    cadreB: FileDetailFile[];
    cadreC: FileDetailFile[];
  };
  file_devis?: FileDetailFile[];
  file_facture?: FileDetailFile[];
  file_attestation_pose?: FileDetailFile[];
  images?: any[];
}

export type AttesationHonorType = {
    cadreA: FileDetailFile[];
    cadreB: FileDetailFile[];
    cadreC: FileDetailFile[];
};


export type ImmatriculationTraType = {
  categorie_vehicule: string;           
  date_engagement_operation: string;    
  date_immatriculation_operation: string
  date_premiere_immatriculation: string;
  date_preuve: string;                  
  location: "OUI" | "NON";              
  numero_imatriculation: string;        
  parc_automobile_collectivite: string; 
  parc_total_automobile: string;        
  raison_sociale_beneficiaire: string;  
  raison_sociale_professionnel: string;
  reference: string;                   
  siren_beneficiaire: string;         
  siret_professionnel: string;        
  status: "tobechecked" | "checked" | "rejected"; 
  id_file:number;
};

export type FactureTraType = {
  numero_devis: string;
  reference_facture: string;
  adresse_travaux: string;
  marque: string;
  referenciel: string;
  quantite: string;
  prix_unitaire: string;
  date_facture: string;
  object_facture: string;
  montant_cce: string;
  beneficiaire_raison_sociale: string;
  sous_traitant_siren: string;
  sous_traitant_entreprise: string;
  presence_sous_traitant: string;
  id_file:number;
}

export type DevisTraType = {
  bon_pour_accord: string;
  date_signature: string;
  date_devis: string;
  numero_devis: string;
  signature_beneficiaire: string;
  marque: string;
  referenciel: string;
  quantité: string;
  prix_unitaire: string;
  montant_ht: string;
  tva: string;
  montant_ttc: string;
  montant_cce: string;
  sous_traitant_siren: string;
  sous_traitant_entreprise: string;
  presence_sous_traitant: string;
}