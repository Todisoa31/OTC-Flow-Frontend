import { ApiRow, FolderTypes, RecordFileItems, RecordFileJobId, RecordImportFilePayload, RecordPayload, Steppers } from "@/types/recordType";
import FolderIcon from "@/assets/icons/FolderIcon";
import InfoSquareIcon from "@/assets/icons/InfoSquareIcon";
import UploadIcon from "@/assets/icons/UploadIcon";
import HandFolderIcon from "@/assets/icons/HandFolderIcon";
import CursorIcon from "@/assets/icons/CursorIcon";
import { FileUploadingStatus } from "@/components/submit-file-installer/stepComponent/SubmitFileStepTwo";
import { RoleUser, StatusUser, ItemPage } from "@/components/filters/UserFilters";
import { ControllerDossierStatsType, TeamMemberRetrieveFormated, TeamType } from "@/types/teamType";
import { AuthorInstallation } from "@/components/submit-file-installer/stepComponent/SubmitFileStepOne";

export const DEFAULT_TIMELINE_STEPS: Steppers[] = [
    {
        id: 1,
        name: 'Choix du contrat',
        description: 'Choisissez le type de contrat qui vous est attribué',
        icon: HandFolderIcon,
        completed: true
    },
    {
        id: 2,
        name: 'Nombre de dossiers',
        description: 'Choisissez de soumettre un ou plusieurs dossiers en une seule fois.',
        icon: HandFolderIcon,
        completed: false
    },
    {
        id: 3,
        name: 'Type de Dossier',
        description: 'Sélectionnez la fiche CEE correspondant aux travaux réalisés.',
        icon: FolderIcon,
        completed: false
    },
    {
        id: 4,
        name: 'Ajout des Dossiers',
        description: 'Importez vos dossiers. Les documents doivent être classés par dossier.',
        icon: UploadIcon,
        completed: false
    },
    {
        id: 5,
        name: 'Informations',
        description: 'Vérifiez et complétez les informations extraites automatiquement par l\'OCR.',
        icon: InfoSquareIcon,
        completed: false
    },
    {
        id: 6,
        name: 'Résumé du Dossier',
        description: 'Assurez-vous que toutes les informations sont correctes et que les documents requis sont bien fournis.',
        icon: CursorIcon,
        completed: false
    }
]

export const DEFAULT_TIMELINE_TRA_STEPS: Steppers[] = [
    {
        id: 1,
        name: 'Choix du contrat',
        description: 'Choisissez le type de contrat qui vous est attribué',
        icon: HandFolderIcon,
        completed: true
    },
    {
        id: 2,
        name: 'Nombre de dossiers',
        description: 'Choisissez de soumettre un ou plusieurs dossiers en une seule fois.',
        icon: HandFolderIcon,
        completed: false
    },
    {
        id: 3,
        name: 'Type de Dossier',
        description: 'Sélectionnez la fiche CEE correspondant aux travaux réalisés.',
        icon: FolderIcon,
        completed: false
    },
    {
        id: 4,
        name: 'Ajout des Dossiers',
        description: 'Importez vos dossiers. Les documents doivent être classés par dossier.',
        icon: UploadIcon,
        completed: false
    }
]

export const TYPE_DOSSIER = [
    { value: 'RES_EC_104', label: 'RES-EC-104' },
    { value: 'BAT_TH_146', label: 'BAT-TH-146' },
    { value: 'BAR_TH_160', label: 'BAR-TH-160' },
    { value: 'BAR_SE_109', label: 'BAR-SE-109' },
    { value: 'BAR_SE_108', label: 'BAR-SE-108' },
    // { value: 'TRA_EQ_114', label: 'TRA-EQ-114' },
    // { value: 'TRA_EQ_117', label: 'TRA-EQ-117' },
];

export const TIMELINE_STEPS_MASS: Steppers[] = [

    {
        id: 1,
        name: 'Choix du contrat',
        description: 'Choisissez le type de contrat qui vous est attribué',
        icon: HandFolderIcon,
        completed: true
    },
    {
        id: 2,
        name: 'Nombre de dossiers',
        description: 'Choisissez de soumettre un ou plusieurs dossiers en une seule fois.',
        icon: HandFolderIcon,
        completed: false
    },
    {
        id: 3,
        name: 'Type de Dossier',
        description: 'Sélectionnez la fiche CEE correspondant aux travaux réalisés.',
        icon: FolderIcon,
        completed: false
    },
    {
        id: 4,
        name: 'Import, contrôle et envoie des dossiers',
        description: 'Importez vos dossiers. Le système vérifie validité et doublons automatiquement.',
        icon: UploadIcon,
        completed: false
    },
];


export const DETAIL_TEAM: TeamType = {
  id: 0,
  name: '',
  referent: [{
    id: 0,
    name: '',
    image:''
  }],
  controllers: [],
  is_active: true,
  created_by: {
    id: 0,
    name: ''
  },
  last_updated: '',
}




export const requiredFilePatterns: Record<string, RegExp[]> = {
  "Devis": [
    /devis/i,
    /\bdev\b/i,
    /devis signé/i,
    /proposition/i,
    /offre/i,
  ],
  "Facture": [
    /facture/i,
    /\bfact\b/i,
    /\bfac\b/i,
    /invoice/i,
    /paiement/i,
  ],
  "Attestation sur l'honneur": [
    /\bah\b/i,
    /(^|[^a-zA-Z0-9])ah([^a-zA-Z0-9]|$)/i,
    /attestation sur l'honneur/i,
    /attestation sur l honneur/i,
    /attestation sur lhonneur/i,
    /attestation honneur/i,
    /Attestation sur l_honneur/i,
    /attestation sur honneur/i,
  ],
  "Attestation de pose": [
    /\batt\b/i,
    /attestation de pose/i,
    /att pose/i,
    /attestation pose/i,
  ],
  "Cadre de contribution": [
    /cadre de contribution/i,
    /cadre contribution/i,
    /contribution/i,
    /CC/i,
    /cadre_contribution/i,
  ],
  "Attestation de désembouage": [
    /attestation de désembouage/i,
    /attestation de desembouage/i,
    /attestation désembouage/i,
    /attestation desembouage/i,
    /désembouage/i,
    /desembouage/i,
    /rapport/i,
    /pose/i,
    /att pose/i,
    /attestation de pose/i,
    /attestation de pose desembouage/i,
    /att désembouage/i,
    /att desembouage/i
  ],
  "Certificat(s) d\'immatriculation": [
    /immatriculation/i,
    /certificat_immatriculation/i,
  ],
  'Avis d\'imposition': [
    /avis/i,
    /imposition/i,
    /impos/i,
    /Avis Impôt/i,
  ]    
};



export const STATUSES_OPTIONS = [
    { value: 'corrected', label: 'Corrigé' },
    { value: 'inprocess', label: 'En cours de traitement' },
    { value: 'approved', label: 'Validé conforme' },
    { value: 'tocorrect', label: 'À corriger' },
    { value: 'refused', label: 'Refusé' },
    { value: 'tobeprocessed', label: 'Dossier déposé' },
]

export const YES_NO = [
   { value: 'NON', label: 'Non' },
   { value: 'OUI', label: 'Oui' },
]

export const CONTROL_STATUSES_OPTIONS = [
    { label: 'Validé conforme', value: 'approved'},
    { label: 'En cours de contrôle', value: 'in_control'},
    { label: 'Satisfaisant', value: 'satisfactory'},
    { label: 'Non satisfaisant', value: 'unsatisfactory'},
    { label: 'Demande SAV', value: 'service_request'},
    { label: 'Refusé après contrôle', value: 'refused_control'},
    { label: 'Validé complet', value: 'fully_validated'},
]

export const STATUS_CHOICES = [
  {value: 'corrected', label: 'Corriger'},
  {value:'approved', label: 'Validé'},
  {value:'tovalidate',label: 'À valider'} 
]

export const ALL_STATUSES_OPTIONS = [... STATUSES_OPTIONS, ...CONTROL_STATUSES_OPTIONS];

export const MERGED_STATUSES_OPTIONS = [
  ...STATUSES_OPTIONS.filter(item => !(item.value === 'approved' && item.label === 'Validé')),
  ...CONTROL_STATUSES_OPTIONS
];

export const SCORE_OPTIONS = [
    { value: 90, label: 'Validé' },
    { value: 60, label: 'À corriger' },
    { value: 0, label: 'Réfusé' },
]

export const FILE_TYPES = {
    file_attestation: 'Attestation sur l\'honneur',
    file_devis: 'Devis',
    file_facture: 'Facture',
    //file_photos: 'Photos avant/après'
    file_attestation_pose: 'Attestation de pose',
    file_photos: 'Photos avant/après',
    file_certificat: 'Certificats de Conformité',
    file_immatriculation:'Certificat(s) d\'immatriculation',
    file_cadre_contribution: 'Cadre de contribution',
    file_attestation_desembouage: 'Attestation de désembouage',
    file_precarite: "Avis d'imposition",
    other_file: 'Autres documents',

    //conformity_certificate: 'Certificats de Conformité'
};

const { file_facture, file_devis, file_attestation, file_attestation_pose, file_immatriculation, other_file, file_attestation_desembouage, file_cadre_contribution, file_precarite  } = FILE_TYPES;

export const FOLDER_TYPES: FolderTypes[] = [
    {
        label: 'RES-EC-104',
        code: 'RES_EC_104',
        active: true,
        requiredDocuments: [file_devis, file_facture, file_attestation, file_attestation_pose],
        optionalDocuments: [other_file] // optional field for facultative files
    },
    {
        label: 'BAT-TH-146',
        code: 'BAT_TH_146',
        active: false,
        requiredDocuments: [file_devis, file_facture],
        optionalDocuments: [file_attestation, other_file] // optional field for facultative files
    },
    {
        label: 'BAR-TH-160',
        code: 'BAR_TH_160',
        active: false,
        requiredDocuments: [file_devis, file_facture],
        optionalDocuments: [file_attestation, other_file] // optional field for facultative files
    },
    // {
    //   label: 'TRA-EQ-114',//TRA-EQ-114
    //   code: 'TRA_EQ_114',
    //   active: false,
    //   requiredDocuments: [file_attestation, file_immatriculation, file_devis, file_facture],
    //   optionalDocuments: [other_file] // optional field for facultative files
    // },
    // {
    //   label: 'TRA-EQ-117',//TRA-EQ-117
    //   code: 'TRA_EQ_117',
    //   active: false,
    //   requiredDocuments: [file_attestation, file_immatriculation, file_precarite, file_devis, file_facture, file_cadre_contribution],
    //   optionalDocuments: [other_file], // optional field for facultative files
    // },
    {
      label: 'BAR-SE-109',//TRA-EQ-117
      code: 'BAR_SE_109',
      active: false,
      requiredDocuments: [file_devis, file_facture, file_attestation],
      optionalDocuments: [other_file, file_attestation_desembouage, file_cadre_contribution], // optional field for facultative files
    },
    {
      label: 'BAR-SE-108',//TRA-EQ-117
      code: 'BAR_SE_108',
      active: false,
      requiredDocuments: [file_devis, file_facture, file_attestation],
      optionalDocuments: [other_file, file_attestation_desembouage, file_cadre_contribution], // optional field for facultative files
    },

]

export const installed_by: AuthorInstallation[] = [
    { label: 'Professionnel', code: 'installateur' },
    { label: 'Bénéficiaire final', code: 'beneificier-final' },
    { label: 'Sous-traitant', code: 'sous-traitant' }
]

export const NUMBER_OF_FOLDER = [
    { code: 'one_folder', label: 'Soummettre un seul dossier' },
    { code: 'multi_folder', label: 'Soumettre Plusieurs dossiers' },
]

export const ROLE_USER: RoleUser[] = [
    { value: 'Admin', label: 'Administrateur' },
    { value: 'Installateur', label: 'Installateur' },
    { value: 'Contrôleur', label: 'Contrôleur' },
    { value: 'Référent', label: 'Référent' },
    { value: 'Head Origination', label: 'Head Origination' },
    { value: 'Analyste', label: 'Analyste' },
]

export const NUMBER_ITEMS_PAGE: ItemPage[] = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 60, label: '60' },
    { value: 70, label: '70' },
    { value: 80, label: '80' },
    { value: 90, label: '90' },
    { value: 100, label: '100' },
]

export const STATUS_USER: StatusUser[] = [
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' }
]

export const DEFAULT_RECORD_JOB_ID: RecordFileJobId = {
    file_facture: '',
    file_devis: '',
    file_attestation: '',
    file_attestation_pose: '',
    file_certificat: '',
    file_immatriculation: '',
    file_cadre_contribution: '',
    other_file: '',
    images: '',
    file_attestation_desembouage: '',
    file_precarite: '',
}

export const DEFAULT_RECORD_FILE_ITEMS: RecordFileItems = {
    file_facture: null,
    file_devis: null,
    file_attestation: null,
    file_attestation_pose: null,
    file_certificat: null,
    file_immatriculation: null,
    file_cadre_contribution: null,
    other_file: null,
    images: null,
    file_attestation_desembouage: null,
    file_precarite: null,
}

export const DEFAULT_RECORD_PAYLOAD: RecordPayload = {
    name: '',
    form_type: '',
    company_name: '',
    siret: '',
    work_address: '',
    work_postal_code: '',
    work_city: '',
    address: '',
    postal_code: '',
    city: '',
    quantity_length: 0,
    brand: '',
    reference: '',
    date_of_quote_signature: '',
    date_of_invoice_issue: '',
    date_of_honor_statement_signature: '',
    items: DEFAULT_RECORD_FILE_ITEMS,
    job_id: '',
    installed_by:'',
}

const USER_RETRIEVED: TeamMemberRetrieveFormated = {
  id: 0,
  firstname: "",
  lastname: "",
  photo_profil: null,
  is_connected: false,
  trated_dossier: 0,
  daily_dossier_threshold: 0,
  assinged_dossier_count: 0,
}

export const DEFAULT_CONTROL_FOLDER_STATS: ControllerDossierStatsType = {
  user: USER_RETRIEVED,
  treated_dossier: 0,
  assigned_dossier: 0,
  this_week_dossier: 0,
  last_10_days_dossier: 0,
  this_month_dossier: 0,
  latest_dossiers: [
    {
      id: 0,
      name: '',
      status: {
        title: '',
        color_background: '',
        color_text: '',
      }
    }
  ]
}


export const DEFAULT_RECORD_MASS_PAYLOAD: RecordPayload[] = [
  {
    name: '',
    form_type: '',
    company_name: '',
    siret: '',
    work_address: '',
    work_postal_code: '',
    work_city: '',
    address: '',
    postal_code: '',
    city: '',
    quantity_length: 0,
    brand: '',
    reference: '',
    date_of_quote_signature: '',
    date_of_invoice_issue: '',
    date_of_honor_statement_signature: '',
    items: DEFAULT_RECORD_FILE_ITEMS,
    job_id: '',
    installed_by:''
  }
]

export const DEFAULT_RECORD_IMPORT_FILE_PAYLOAD: RecordImportFilePayload = {
    file_facture: null,
    file_devis: null,
    file_attestation: null,
    file_attestation_pose: null,
    file_certificat: null,
    type_formulaire: '',
    file_immatriculation: null,
    file_cadre_contribution: null,
    other_file: null,
    images: null,
    file_attestation_desembouage: null,
    file_precarite: null,
}

export const DEFAULT_EXTRACTED_DATA = {
    file_facture: null,
    file_devis: null,
    file_attestation: null,
    file_attestation_pose: null,
    file_photos: null,
    file_certificat: null,
    file_immatriculation: null,
    file_cadre_contribution: null,
    file_attestation_desembouage: null,
    other_file: null,
    images: null,
    file_precarite: null,
}

export const DEFAULT_UPLOAD_STATUS: FileUploadingStatus = {
    file_devis: 'initial',
    file_facture: 'initial',
    file_attestation: 'initial',
    file_attestation_pose: 'initial',
    file_certificat: 'initial',
    file_immatriculation: 'initial',
    file_cadre_contribution: 'initial',
    other_file: 'initial',
    images: 'initial',
    file_attestation_desembouage: 'initial',
    file_precarite: 'initial',
}


export const CONTRACT_STATUS_OPTION = [
  { value: 'actif', label: 'Actif' },
  { value: 'expire', label: 'Expiré' },
]


export const keyToField: Record<string, keyof ApiRow> = {
  "Raison sociale du professionnel": "raison_sociale_professionnel",
  "SIRET du professionnel": "siret_professionnel",
  "Raison sociale du bénéficiaire": "raison_sociale_beneficiaire",
  "SIREN du bénéficiaire": "siren_beneficiaire",
  "Date d'engagement de l'opération (jj/mm/aaaa)": "date_engagement_operation",
  "Référence de la preuve de réalisation (ex. facture contrat de location)": "reference",
  "Location (oui/non)": "location",
  "Date de la preuve de réalisation (jj/mm/aaaa)": "date_preuve",
  "Catégorie du véhicule": "categorie_vehicule",
  "Parc total automobile (oui/non/sans objet)": "parc_total_automobile",
  "Parc automobile collectivité (oui/non/sans objet)": "parc_automobile_collectivite",
  "Date de la première immatriculation (jj/mm/aaaa)": "date_premiere_immatriculation",
  "Date de l'immatriculation opération (jj/mm/aaaa)": "date_immatriculation_operation",
  "Numéro d’immatriculation du véhicule": "numero_imatriculation",
  "job_id": "job_id",
  "Attestation": "attestation"
};


