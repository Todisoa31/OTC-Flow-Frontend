"use client"; // Required for state management in Next.js 15

import {
  DEFAULT_EXTRACTED_DATA,
  DEFAULT_RECORD_IMPORT_FILE_PAYLOAD,
  DEFAULT_RECORD_PAYLOAD,
} from "@/constants/records";
import { ContractType } from "@/types/contratType";
import { DossierDetailsType } from "@/types/dossierType";
import {
  ExtractedData,
  ExtractedResult,
  FolderTypes,
  RecordImportFilePayload,
  RecordPayload,
  TraFicheType,
  Uploadedfile,
} from "@/types/recordType";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

export type GroupedFiles = {
  [folder: string]: Uploadedfile[];
};

export type FileMutlipleType = {
  form_type: string;
  items: GroupedFiles;
  job_id?: string;
  contrat_id?: number | null | undefined; // optional field for contract ID
};

type unavailableContractsType = {
  index: number | null;
  available: boolean;
  code: number | null
}

interface CreateRecordContextType {
  payload: RecordPayload;
  setPayload: Dispatch<SetStateAction<RecordPayload>>;

  errorFileMass: Boolean;
  setErrorFileMass: Dispatch<SetStateAction<Boolean>>;

  statusFolder: Record<string, any>;
  setStatusFolder: Dispatch<SetStateAction<Record<string, any>>>;

  payloadMasse: FileMutlipleType;
  setPayloadMasse: Dispatch<SetStateAction<FileMutlipleType>>;

  uploadedFiles: Uploadedfile[];
  setUploadedFiles: Dispatch<SetStateAction<Uploadedfile[]>>;

  uploadPayload: RecordImportFilePayload;
  setUploadPayload: Dispatch<SetStateAction<RecordImportFilePayload>>;

  extractedData: ExtractedData;
  setExtractedData: Dispatch<SetStateAction<ExtractedData>>;

  showModalMasseConfirmation: boolean;
  setShowModalMasseConfirmation: Dispatch<SetStateAction<boolean>>;

  extractedMass: ExtractedResult;
  setExtractedMass: Dispatch<SetStateAction<ExtractedResult>>;

  detailDossier: DossierDetailsType | null;
  setDetailDossier: Dispatch<SetStateAction<DossierDetailsType | null>>;

  otherFiles: File[];
  setOtherFiles: Dispatch<SetStateAction<File[]>>;

  contratId: unavailableContractsType; // optional field for contract ID
  setContratId: Dispatch<SetStateAction<unavailableContractsType>>;

  contrats: ContractType[] | null;
  setContrats: Dispatch<SetStateAction<ContractType[] | null>>;

  folderTypeDynamics: FolderTypes[];
  setFolderTypeDynamics: Dispatch<SetStateAction<FolderTypes[]>>;

  isAttInsideAttPose: boolean;
  setIsAttInsideAttPose: Dispatch<SetStateAction<boolean>>;
  
  detailContrat: ContractType | null;
  setDetailContrat: Dispatch<SetStateAction<ContractType | null>>;

  beneficiary: boolean; 
  setBeneficiary: Dispatch<SetStateAction<boolean>>;

  payloadTra: TraFicheType | null;
  setPayloadTra: Dispatch<SetStateAction<TraFicheType>>;

  isDevisInsideCertificat: boolean;
  setIsDevisInsideCertificat: Dispatch<SetStateAction<boolean>>;

  isInvoiceInsideCertificat: boolean;
  setIsInvoiceInsideCertificat: Dispatch<SetStateAction<boolean>>;

  loadingFiche: boolean;
  setLoadingFiche: Dispatch<SetStateAction<boolean>>;

}

const recordContext: CreateRecordContextType = {
  payload: DEFAULT_RECORD_PAYLOAD,
  setPayload: () => {},

  errorFileMass: false,
  setErrorFileMass: () => {},

  statusFolder: {},
  setStatusFolder: () => {},

  payloadMasse: { form_type: "", items: {} },
  setPayloadMasse: () => {},

  uploadedFiles: [],
  setUploadedFiles: () => {},

  uploadPayload: DEFAULT_RECORD_IMPORT_FILE_PAYLOAD,
  setUploadPayload: () => {},

  extractedData: DEFAULT_EXTRACTED_DATA,
  setExtractedData: () => {},

  showModalMasseConfirmation: false,
  setShowModalMasseConfirmation: () => {},

  extractedMass: {},
  setExtractedMass: () => {},

  detailDossier: null,
  setDetailDossier: () => {},

  otherFiles: [],
  setOtherFiles: () => {},

  contratId: {index: null, available: false, code: null},
  setContratId: (() => {}) as Dispatch<SetStateAction<unavailableContractsType>>,

  contrats: null,
  setContrats: () => {},

  folderTypeDynamics: [],
  setFolderTypeDynamics: () => {},

  isAttInsideAttPose: false,
  setIsAttInsideAttPose: () => {},
  
  detailContrat: null, 
  setDetailContrat:() => {},

  beneficiary: false,
  setBeneficiary: () => {},
  
  payloadTra: null,
  setPayloadTra: () => {},

  isDevisInsideCertificat: false,
  setIsDevisInsideCertificat: () => {},
    
  isInvoiceInsideCertificat: false,
  setIsInvoiceInsideCertificat: () => {},

  loadingFiche: false,
  setLoadingFiche: () => {}

};

const CreateRecordContext =
  createContext<CreateRecordContextType>(recordContext);

export const CreateRecordProvider = ({ children }: { children: ReactNode }) => {
  const [payload, setPayload] = useState<RecordPayload>(DEFAULT_RECORD_PAYLOAD);
  const [uploadPayload, setUploadPayload] = useState<RecordImportFilePayload>(
    DEFAULT_RECORD_IMPORT_FILE_PAYLOAD
  );
  const [extractedData, setExtractedData] = useState<ExtractedData>(
    DEFAULT_EXTRACTED_DATA
  );
  const [uploadedFiles, setUploadedFiles] = useState<Uploadedfile[]>([]);
  const [showModalMasseConfirmation, setShowModalMasseConfirmation] =
    useState<boolean>(false);
  const [payloadMasse, setPayloadMasse] = useState<FileMutlipleType>({
    form_type: "",
    items: {},
  });
  const [extractedMass, setExtractedMass] = useState<ExtractedResult>({});
  const [statusFolder, setStatusFolder] = useState<Record<string, any>>({});
  const [errorFileMass, setErrorFileMass] = useState<Boolean>(false);
  const [detailDossier, setDetailDossier] = useState<DossierDetailsType | null>(null);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  const [contratId, setContratId] = useState<unavailableContractsType>({index: null, available: false, code: null});
  const [contrats, setContrats] = useState<ContractType[] | null>(null);
  const [folderTypeDynamics, setFolderTypeDynamics] = useState<FolderTypes[]>([]);
  const [isAttInsideAttPose, setIsAttInsideAttPose] = useState<boolean>(false);
  const [detailContrat, setDetailContrat] = useState<ContractType | null>(null);
  const [beneficiary, setBeneficiary] = useState<boolean>(false);
  const [payloadTra, setPayloadTra] = useState<TraFicheType>({
    job_id: "",
    file_devis: null,
    file_facture: null,
    file_attestation: null,
    file_immatriculation: null,
    type_formulaire: "",
    contrat_id: null,
  });
  const [isDevisInsideCertificat, setIsDevisInsideCertificat] = useState<boolean>(false);
  const [isInvoiceInsideCertificat, setIsInvoiceInsideCertificat] = useState<boolean>(false);
  const [loadingFiche, setLoadingFiche] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({
      payload,
      setPayload,

      errorFileMass,
      setErrorFileMass,

      statusFolder,
      setStatusFolder,

      uploadedFiles,
      setUploadedFiles,

      payloadMasse,
      setPayloadMasse,

      uploadPayload,
      setUploadPayload,

      extractedData,
      setExtractedData,

      showModalMasseConfirmation,
      setShowModalMasseConfirmation,

      extractedMass,
      setExtractedMass,

      detailDossier,
      setDetailDossier,

      otherFiles,
      setOtherFiles,

      contratId,
      setContratId,

      contrats,
      setContrats,

      folderTypeDynamics,
      setFolderTypeDynamics,

      isAttInsideAttPose,
      setIsAttInsideAttPose,
      
      detailContrat,
      setDetailContrat,

      beneficiary,
      setBeneficiary,

      payloadTra,
      setPayloadTra,

      isDevisInsideCertificat,
      setIsDevisInsideCertificat,

      isInvoiceInsideCertificat,
      setIsInvoiceInsideCertificat, 

      loadingFiche, 
      setLoadingFiche
    }),
    [
      payload, setPayload,
      uploadPayload, setUploadPayload,
      extractedData, setExtractedData,
      uploadedFiles, setUploadedFiles,
      payloadMasse, setPayloadMasse,
      extractedMass, setExtractedMass,
      statusFolder, setStatusFolder,
      errorFileMass, setErrorFileMass,
      detailDossier, setDetailDossier,
      showModalMasseConfirmation, setShowModalMasseConfirmation,
      otherFiles, setOtherFiles,
      contratId, setContratId,
      contrats, setContrats,
      folderTypeDynamics, setFolderTypeDynamics,
      isAttInsideAttPose, setIsAttInsideAttPose,
      detailContrat, setDetailContrat,
      beneficiary, setBeneficiary,
      payloadTra, setPayloadTra,
      isDevisInsideCertificat, setIsDevisInsideCertificat,
      isInvoiceInsideCertificat, setIsInvoiceInsideCertificat,
      loadingFiche, setLoadingFiche
    ]
  );

  return (
    <CreateRecordContext.Provider value={contextValue}>
      {children}
    </CreateRecordContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(CreateRecordContext);
  if (!context) {
    throw new Error("useRecords must be used within a CreateRecordProvider");
  }
  return context;
};
