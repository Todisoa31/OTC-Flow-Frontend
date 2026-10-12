import { UploadStatus } from "@/components/inputs/DocUploader";
import { RecordFileJobId } from "@/types/recordType";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRecords } from "@/providers/CreateRecordProvider";
import SingleDossier from "../SingleDossier";
import MultipleDossier from "../MultipleDossier";
import MultipleDossierTRA from "../MultipleDossierTRA";

export type FileUploadingStatus = Record<keyof RecordFileJobId, UploadStatus>;
export type FileUploadingTimes = Record<keyof RecordFileJobId, number>;

type Props = Readonly<{
  fileUploadingStatus: FileUploadingStatus;
  setUploadingFileStatus: Dispatch<SetStateAction<FileUploadingStatus>>;
  typeDossier: string;
}>;

function SubmitFileStepTwo(props: Props) {  
  const { fileUploadingStatus, setUploadingFileStatus, typeDossier } = props;
  const { payloadMasse } = useRecords();
  useEffect(() => {
    // console.log("payloadMasse in SubmitFileStepTwo:", payloadMasse);
  }, [payloadMasse]);

  if (typeDossier === 'multi_folder' && ['TRA_EQ_117','TRA_EQ_114'].includes(payloadMasse.form_type)) {
    return <MultipleDossierTRA />
  }
  if (typeDossier === "multi_folder") {
    return <MultipleDossier />;
  }
  return (
    <SingleDossier
      fileUploadingStatus={fileUploadingStatus}
      setUploadingFileStatus={setUploadingFileStatus}
    />
  );
}

export default SubmitFileStepTwo;
