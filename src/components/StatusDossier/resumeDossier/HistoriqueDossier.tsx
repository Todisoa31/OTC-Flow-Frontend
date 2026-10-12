import CenterSpinner from "@/components/loader/CenterSpinner";
import Image from "next/image";
import { formatTimestamp } from "@/utils/getHourMinute";
import React from "react";
import { ActivityLogType } from "@/types/auditType";
type Props = {
  folderHistory: ActivityLogType[];
  loading: boolean;
};

const HistoriqueDossier = (props: Props) => {
  const { folderHistory, loading } = props;
  return (
    <div className=" flex px-[30px] flex-col h-[calc(100vh-204px)] overflow-y-auto gap-4">
      {loading && ( <div className="text-center"> <CenterSpinner /> </div> )}
      {folderHistory.length === 0 ? (
        <div className=" w-full text-center text-sm text-gray-400">Aucun historique d'activité n'a été trouvé pour ce dossier.</div>
      ) : (
        folderHistory?.map((item) => (
          <div key={item.id} className="self-stretch p-3.5 bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch inline-flex justify-start items-center gap-2.5">
              <div className="flex-1 flex justify-start items-center gap-2.5">
                <Image src="/images/usProfil.jpg" alt="xxx" width={30} height={30} />
                <div className="inline-flex flex-col justify-start items-start gap-1.5">
                  <div className="justify-start text-gray-900 text-xs font-bold leading-none">{`${item.created_by.firstname} ${item.created_by.lastname}`}</div>
                  <div className="justify-start text-slate-600 text-[10px] font-medium">{item.created_by.role}</div>
                </div>
              </div>
              <div className="inline-flex flex-col justify-start items-start gap-[5px]">
                <div className="self-stretch justify-start text-gray-500 text-[10px] font-medium">{formatTimestamp(item.timestamp)}</div>
              </div>
            </div>
            <p className=" text-[#3A5F6E] text-[12px]">{item.description}</p>
          </div>          
        ))
      )}
    </div>
  );
};

export default HistoriqueDossier;
