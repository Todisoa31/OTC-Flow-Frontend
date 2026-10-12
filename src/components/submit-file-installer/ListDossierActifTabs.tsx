import React, { useEffect } from 'react';
import ListDossierActifHeader from './ListDossierHeader';
import { useRecords } from "@/providers/CreateRecordProvider";


const ListDossierActifTabs = () => {
  const { payloadMasse } = useRecords();    
  return (
    <div className="self-stretch pb-5 flex-col justify-start items-start gap-5 flex">
      <ListDossierActifHeader />
      {
        Object.entries(payloadMasse.items)?.map(([key, item], index) =>{
          const randomReference = Math.floor(10000000 + Math.random() * 90000000); // 8 chiffres
          const randomAmount = Math.floor(100 + Math.random() * 900); // entre 100 et 999 €
          return(
            <div
                key={index}
                className="self-stretch cursor-pointer h-[60px] pt-[15px] pb-[15px] pl-5 pr-[15px] bg-[#fefefe]/40 rounded-[15px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] border border-white/70 backdrop-blur-[20px] justify-center items-center gap-[15px] inline-flex">
                <div className="w-[20%] justify-start items-start gap-2.5 flex">
                    <div className="text-dark-blue text-xs font-medium "><b>{key}</b></div>
                </div>
                <div className="w-[20%] grow shrink justify-start items-start gap-2.5 flex">
                    <div className="text-dark-blue text-xs font-medium "><b>{payloadMasse.form_type}</b></div>
                </div>
                <div className="w-[20%] grow shrink justify-start items-start gap-2.5 flex">
                    <div className="text-dark-blue text-xs font-medium "><b>{randomReference}</b></div>
                </div>
                <div className="w-[20%] justify-start items-start gap-2.5 flex">
                    <div className="text-dark-blue text-xs font-medium "><b>{randomAmount} €</b></div>
                </div>
            </div>
          )
        }) 
      }
    </div>
  );
}

export default ListDossierActifTabs;
