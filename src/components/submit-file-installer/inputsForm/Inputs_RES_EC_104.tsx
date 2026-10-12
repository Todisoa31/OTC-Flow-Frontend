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

const InputsRESEC104 = (props: Props) => {
  const { fileUploadingStatus, handleChangeFile } = props;
  const { uploadPayload, isAttInsideAttPose, setIsAttInsideAttPose } =
    useRecords();
  const attestationPoseInputRef = useRef<HTMLInputElement>(null);
  const [labelsAttestation, setLabelsAttestation] = React.useState<string>(
    "Attestation sur l'honneur du bénéficiaire"
  );

  useEffect(() => {
    if (isAttInsideAttPose) {
      setLabelsAttestation(
        "Attestation sur l'honneur du bénéficiaire + Attestation de pose"
      );
    } else {
      setLabelsAttestation("Attestation sur l'honneur du bénéficiaire");
    }
  }, [isAttInsideAttPose]);
  
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
        label={labelsAttestation}
        state={fileUploadingStatus.file_attestation}
        onChange={(e) => handleChangeFile(e, "file_attestation")}
        file={uploadPayload.file_attestation}
      />
      <Radio
        checked={isAttInsideAttPose}
        onChange={(value) => setIsAttInsideAttPose(value)}
        title="Activer si les attestations sur l'honneur et de pose sont regroupées dans un seul document"
      />
      {!isAttInsideAttPose && attestationPoseInputRef != null && (
        <DocUploader
          label={`Attestation de pose`}
          state={fileUploadingStatus.file_attestation_pose}
          onChange={(e) => handleChangeFile(e, "file_attestation_pose")}
          file={uploadPayload.file_attestation_pose}
          inputRef={attestationPoseInputRef}
        />
      )}
      <OtherFilesUploader
        label={`Autres documents (Cadre de contribution, Photos ect ...)`}
      />
    </>
  );
};

export default InputsRESEC104;
