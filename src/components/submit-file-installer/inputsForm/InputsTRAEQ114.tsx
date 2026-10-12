
import React, { useEffect, useRef, useState } from "react";
import DocUploader, { UploadStatus } from "@/components/inputs/DocUploader";
import Radio from "@/components/inputs/Radio";
import { useRecords } from "@/providers/CreateRecordProvider";
import { RecordFileJobId } from "@/types/recordType";
import OtherFilesUploader from "@/components/inputs/otherFiles/OtherFilesUploader";
import AddMultiFile from "./AddMultiFile";
import { convertDateToString } from "@/utils/date";
import { useAuth } from "@/providers/AuthProvider";
import OtherFilesUploaderV2 from "@/components/inputs/otherFiles/OtherFilesUploaderV2";


const InputsTRAEQ114 = () => {
  const [labelsImmatricuation, setLabelsImmatricuation] = useState<string>("Certificat d'immatriculation");
  const { setPayloadTra,  isDevisInsideCertificat, setIsDevisInsideCertificat, isInvoiceInsideCertificat, setIsInvoiceInsideCertificat, payloadMasse} =  useRecords();
  const [stateAttestation, setStateAttestation] = useState<UploadStatus>('initial');
  const [fileAttestation, setFileAttestation] = useState<File | null>(null);
  const { user } = useAuth();


  const isDevisInsideCertificatHandler =  (value: boolean) => {
    setIsDevisInsideCertificat(value);
    if(value === true) {      
     setPayloadTra(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          file_devis: null
        };
      });
    }
  }

   const isInvoiceInsideCertificatHandler =  (value: boolean) => {
    setIsInvoiceInsideCertificat(value);
    if(value === true) {      
     setPayloadTra(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          file_facture: null
        };
      });
    }
  }
  useEffect(() => {
    setPayloadTra(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        job_id: `${user?.id}_TRA_EQ_114_${convertDateToString(new Date())}`,
        contrat_id: payloadMasse.contrat_id,
        type_formulaire: 'TRA_EQ_114',
      };
    })
  },[])

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, key: keyof RecordFileJobId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPayloadTra(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        file_attestation: [file]
      };
    });
    setFileAttestation(file);
    setStateAttestation('success');

  };

  useEffect(() => {
    if (isDevisInsideCertificat && isInvoiceInsideCertificat) {
      setLabelsImmatricuation("Certificat d'immatriculation + Devis + Facture");
    } else if (isDevisInsideCertificat) {
      setLabelsImmatricuation("Certificat d'immatriculation + Devis");
    } else if (isInvoiceInsideCertificat) {
      setLabelsImmatricuation("Certificat d'immatriculation + Facture");
    } else {
      setLabelsImmatricuation("Certificat d'immatriculation");
    }
  }, [isDevisInsideCertificat, isInvoiceInsideCertificat]);

  
  return (
    <>
      {/* {
        (!isDevisInsideCertificat || !isInvoiceInsideCertificat) && (
        <div className="w-full p-[30px]">
          <div className="py-[35px] border bg-white/75 rounded-lg flex flex-col gap-5">
            {!isDevisInsideCertificat &&  <AddMultiFile label={"Devis"} fileType={'file_devis'}/>}

            {!isInvoiceInsideCertificat && <AddMultiFile label="Facture" fileType={'file_facture'}/> }
            </div>
        </div>
      )}
      <AddMultiFile label={labelsImmatricuation} fileType={'file_immatriculation'}/> */}

      {
        (!isDevisInsideCertificat || !isInvoiceInsideCertificat) && (
        <div className="w-full p-[30px]">
          <div className="py-[35px] border bg-white/75 rounded-lg flex flex-col gap-5">
            {!isDevisInsideCertificat &&  <AddMultiFile label={"Devis"} fileType={'file_devis'}/>}

            {!isInvoiceInsideCertificat && <AddMultiFile label="Facture" fileType={'file_facture'}/> }
            </div>
        </div>
      )} 
      <AddMultiFile label={labelsImmatricuation} fileType={'file_immatriculation'}/>
      <div className="flex items-center gap-5 w-full">
        <Radio
          checked={isDevisInsideCertificat}
          onChange={(value) => isDevisInsideCertificatHandler(value)}
          title="Activer si CI + devis ensemble"            
        />
        <Radio
          checked={isInvoiceInsideCertificat}
          onChange={(value) => isInvoiceInsideCertificatHandler(value)}
          title="Activer si CI + facture ensemble"
        />
      </div>
      


      <DocUploader
        label={`Attestation sur l'honneur du bénéficiaire`}
        state={stateAttestation}
        onChange={(e) => handleChangeFile(e, "file_attestation")}
        file={fileAttestation}
      />
      
      {/* <OtherFilesUploader
        label={`Autres documents`}
      /> */}

      <OtherFilesUploaderV2
        label={`Autres documents`}
      />
    </>
  );
};

export default InputsTRAEQ114;
