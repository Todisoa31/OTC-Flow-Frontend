
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

const InputsBATTH146 = (props: Props) => {
  const { fileUploadingStatus, handleChangeFile } = props;
  const { uploadPayload } =  useRecords();
  useEffect(() => {
    console.log('uploadPyaload ====> ', uploadPayload)
  },[uploadPayload])
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
      <OtherFilesUploader
        label={`Autres documents`}
      />
    </>
  );
};

export default InputsBATTH146;
