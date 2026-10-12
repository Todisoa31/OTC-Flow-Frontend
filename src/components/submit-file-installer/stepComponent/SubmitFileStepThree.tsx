import DocumentIcon2 from '@/assets/icons/DocumentIcon2';

import { PROGRESS_TRACKING, SUBMIT_FILE_ROUTE } from '@/constants/routes';
import { useRouter } from "next/navigation";

import { Dispatch, SetStateAction, useState } from 'react';
import { useRecords } from '@/providers/CreateRecordProvider';
import InfoPopup from '@/components/popup/InfoPopup';
import InformationFormulaire from '../InformationFormulaire';
import AddFolderIcon from '@/assets/icons/AddFolderIcon';
import MoveToFolderIcon from '@/assets/icons/MoveToFolderIcon';
import Button from '@/components/inputs/Button';
import { DEFAULT_RECORD_PAYLOAD, DEFAULT_RECORD_IMPORT_FILE_PAYLOAD, DEFAULT_UPLOAD_STATUS } from '@/constants/records';
import { Steppers } from '@/types/recordType';
import { FileUploadingStatus } from '../SingleDossier';

type Props = Readonly<{ 
  typeDossier: string;
}>;

function SubmitFileStepThree(props: Props) {
    const {typeDossier} = props;
    const [open, setOpen] = useState<boolean>(true);
    const [downloading, setDownloading] = useState(false);
    const { statusFolder } = useRecords();
    
     const router = useRouter();
    if(typeDossier === 'one_folder'){
      return(
        <InformationFormulaire />
      )
    }
    // return(
    //   <InfoPopup
    //       isOpen={open}
    //       onClose={() => {
    //           setOpen(false);
    //           router.push(PROGRESS_TRACKING);
    //       }}
    //       text={<span
    //               dangerouslySetInnerHTML={{
    //                 __html: statusFolder?.message ?? ""
    //               }}
    //             />}
    //       title={statusFolder?.title}
    //       icon={<DocumentIcon2 />}
    //       type= {statusFolder?.status}
    //       footer = {
    //         <div className="flex gap-2">
    //           <Button
    //             label="Soumettre un dossier"
    //             iconLeft={<AddFolderIcon active={true} />}
    //             onClick={() => {
    //               router.push(SUBMIT_FILE_ROUTE);
    //             }}
    //             width="w-auto"
    //           />
    //           <Button
    //             label="Suivre mes dossiers"
    //             iconLeft={<MoveToFolderIcon active={true} />}
    //             onClick={() => {
    //               router.push(PROGRESS_TRACKING);
    //             }}
    //             bg="bg-black"
    //             width="w-auto p-[10px]"
    //           />
    //         </div>
    //       }
    //   />
    // )
}

export default SubmitFileStepThree;