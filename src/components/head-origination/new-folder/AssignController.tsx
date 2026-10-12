import { UserType } from '@/types/repartitionChargeType';
import { getFile } from '@/utils/getFile';
import React from 'react';

type AssignControllerProps = {
  controlleur: UserType | null;
}

const AssignController = (props: AssignControllerProps) => {
  const { controlleur } = props;

  if (!controlleur) {
    return(
      <div className="w-48 flex justify-start items-center gap-2.5 text-gray-500">
        -
      </div>
    )
  }

  return (
    <div className="w-48 flex justify-start items-center gap-2.5">
      <img
        className="w-8 h-8 rounded-[5px]"
        src={controlleur.photo_profil? getFile(controlleur.photo_profil): '/images/usProfil.jpg'}
      />
      <div className="justify-start text-slate-600 text-xs font-bold">
         {controlleur.firstname} {controlleur.lastname}
      </div>
    </div>
  );
}

export default AssignController;
