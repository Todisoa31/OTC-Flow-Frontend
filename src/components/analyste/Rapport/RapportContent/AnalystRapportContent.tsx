import React from 'react';
import FilterRapport from './FilterRapport';

const AnalystRapportContent = () => {
  return (
      <div className="self-stretch p-7 inline-flex flex-col justify-start items-start gap-7 w-full">
        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
          <div className="flex-1 justify-start text-gray-900 text-2xl font-bold ">
            Liste des dossiers validés
          </div>
        </div>
        <FilterRapport />              
    </div>
  );
}

export default AnalystRapportContent;
