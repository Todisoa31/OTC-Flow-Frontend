

import React from 'react';
import ContratDossier from './ContratDossier';
import HeaderDetailFileMonitoring from './HeaderDetailFileMonitoring';
import { FolderOutputType } from '@/types/folderType';
import DocumentsContent from './DocumentsContent';
import Historique from './Historique';
import ControleConformite from '@/components/record-detail/ControleConformite';
import RecapitulationTRA from './RecapitulationTRA';

type Props = {
  folder: FolderOutputType; // Replace 'any' with the actual type of folder if available
};

const DetailDossier = (props: Props) => {
  const { folder } = props;
  const [isControlStatus, setIsControlStatus] = React.useState<boolean>(false);

  return (
    <div className=" flex w-full ">
      <div className=" w-[75%] h-[calc(100vh-95px)] overflow-y-auto ">
          <HeaderDetailFileMonitoring folder={folder ?? null} setIsControlStatus={setIsControlStatus} isControlStatus={isControlStatus}/>   
          {folder?.contrat && <ContratDossier contrat={folder?.contrat} />}
          {(folder && !isControlStatus) && <ControleConformite recordDetail={folder} folder={folder} isCoffrac={folder.is_cofrac}/> }
          {['TRA_EQ_117','TRA_EQ_114'].includes(folder?.type_dossier) && <RecapitulationTRA jobId={folder?.job_id} status={folder?.file_recap?.status}/>}
          <DocumentsContent folder={folder ?? null}/>             
      </div>
      <div className=" w-[25%] h-[calc(100vh-95px)] overflow-y-auto">
          {folder && <Historique folder={folder} />}
      </div>
    </div>
  );
}

export default DetailDossier;
