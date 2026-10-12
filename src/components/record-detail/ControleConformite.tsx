import React from 'react';
import RecordDetailChat from './RecordDetailChat';
import { FolderOutputType } from '@/types/folderType';
type Props = {
    recordDetail: Record<string, any>;
    folder: FolderOutputType;
    isCoffrac?: boolean;
}
const ControleConformite = (props: Props) => {
  const {recordDetail, folder, isCoffrac} = props;
  return (
    <div className="px-[30px] pb-[30px] w-full">
      <div className="self-stretch w-full p-5 py-[30px] bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-3.5">
        <div className="self-stretch inline-flex justify-start items-center gap-5">
          <div className="flex-1 flex justify-start items-center gap-5">
            <div className="flex-1 justify-start text-zinc-700 text-sm font-bold leading-none">Contrôle de conformité</div>
          </div>
          {
            isCoffrac ? <div className="text-xs text-gray-500">Coffrac</div> : 
            <div className="h-7 px-3.5 bg-primary-blue/40 rounded-[5px] inline-flex flex-col justify-center items-start gap-2.5">
              <div className="justify-start text-[#65A5BF] text-sm font-bold leading-none">Contrôle non réglementaire</div>
            </div>
          }
        </div>
        <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-3.5">
          <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-3.5">        
              {
                (recordDetail?.commentaire_principal && recordDetail?.commentaire_principal !== "") &&
                <div className="self-stretch p-3.5 bg-white/40 rounded-[5px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-3.5">
                  <div className="justify-start text-gray-900 text-xs font-bold">Commentaire principal</div>
                  <div className="self-stretch justify-start text-gray-500 text-xs font-normal leading-none">{recordDetail?.commentaire_principal}</div>
                </div>
              }
              {
                (recordDetail?.observation_technique && recordDetail?.observation_technique !== "") &&
                <div className="self-stretch p-3.5 bg-white/40 rounded-[5px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-3.5">
                  <div className="justify-start text-gray-900 text-xs font-bold">Observations techniques</div>
                  <div className="self-stretch justify-start text-gray-500 text-xs font-normal leading-none">{recordDetail?.observation_technique}</div>
                </div>
              }
          </div>
          <RecordDetailChat
                hideTitle
                folder_id_props={folder.id}
                custopm_width="w-full"
                customHeight="auto"
                userId={folder?.installateur?.id}
                conversationT={'Contrôleur'}//Contrôleur
                noSticky
                noPadding={true}
            />
        </div>
      </div>
    </div>
  );
}

export default ControleConformite;
