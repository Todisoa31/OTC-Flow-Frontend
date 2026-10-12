
import React, { useEffect, useRef } from "react";
import DocUploader, { UploadStatus } from "@/components/inputs/DocUploader";
import Radio from "@/components/inputs/Radio";
import { useRecords } from "@/providers/CreateRecordProvider";
import { RecordFileJobId } from "@/types/recordType";
import OtherFilesUploader from "@/components/inputs/otherFiles/OtherFilesUploader";

type Props = {
  fileUploadingStatus: Record<keyof RecordFileJobId, UploadStatus>;
  handleChangeFile: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof RecordFileJobId
  ) => void;
};

const InputsBARSE109 = (props: Props) => {
  const { fileUploadingStatus, handleChangeFile } = props;
  const { uploadPayload } =  useRecords();
  return (
    <>
      <DocUploader
        label={`Devis signé`}
        state={fileUploadingStatus.file_devis}
        onChange={(e) => handleChangeFile(e, "file_devis")}
        file={uploadPayload.file_devis}
      />
      <DocUploader
        label={`Facture de l'installateur`}
        state={fileUploadingStatus.file_facture}
        onChange={(e) => handleChangeFile(e, "file_facture")}
        file={uploadPayload.file_facture}
      />
      <DocUploader
        label={`Attestation sur l'honneur du bénéficiaire`}
        state={fileUploadingStatus.file_attestation}
        onChange={(e) => handleChangeFile(e, "file_attestation")}
        file={uploadPayload.file_attestation}
      />
      <DocUploader
        label={`Cadre de contribution`}
        state={fileUploadingStatus.file_cadre_contribution}
        onChange={(e) => handleChangeFile(e, "file_cadre_contribution")}
        file={uploadPayload.file_cadre_contribution}
      />
       <DocUploader
        label={`Attestation de désembouage`}
        state={fileUploadingStatus.file_attestation_desembouage}
        onChange={(e) => handleChangeFile(e, "file_attestation_desembouage")}
        file={uploadPayload.file_attestation_desembouage}
      />
      <OtherFilesUploader
        label={`Autres documents`}
      />
    </>
  );
};

export default InputsBARSE109;
