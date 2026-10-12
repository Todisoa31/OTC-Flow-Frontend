
import { Dispatch, SetStateAction, useState } from 'react';
import { FOLDER_TYPES, installed_by } from '@/constants/records';
import { useRecords } from "@/providers/CreateRecordProvider";
import SubmitFileRequiredDocument from '../SubmitFileRequiredDocument';
import SubmitFolderType from '../SubmitFolderType';
import { FolderTypes, Steppers } from '@/types/recordType';



export type AuthorInstallation = {
    label: string;
    code: string;
}

type Props = Readonly<{
  typeDossier: string;
  setSteppers: Dispatch<SetStateAction<Steppers[]>>;
}>;

function SubmitFileStepOne(props: Props) {
    const { typeDossier, setSteppers } = props;
    const [selectedFolderType, setSelectedFolderType] = useState<FolderTypes | null>(null);

    return (
        <div className="self-stretch grow px-[30px] flex-col justify-start items-start gap-[30px] flex">
            <SubmitFolderType typeDossier={typeDossier} folderTypes={FOLDER_TYPES}  setSelectedFolderType={setSelectedFolderType} setSteppers={setSteppers}/>
            <SubmitFileRequiredDocument folderTypes={selectedFolderType} />
        </div>
    )
}
export default SubmitFileStepOne