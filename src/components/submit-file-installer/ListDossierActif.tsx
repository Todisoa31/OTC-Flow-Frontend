import React from 'react';

import ListDossierActifTabs from './ListDossierActifTabs';

const ListDossierActif = () => { 
  return (
    <div className="h-[489px] grow self-stretch px-[30px] flex-col justify-start items-start gap-[30px] inline-flex">
        <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
            <div className="grow shrink basis-0 text-black-secondary text-2xl font-bold ">Mes dossiers validés</div>
        </div>
        <ListDossierActifTabs />
    </div>
  );
}

export default ListDossierActif;
