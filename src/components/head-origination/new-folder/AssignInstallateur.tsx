import { UserType } from "@/types/repartitionChargeType";
import { getFile } from "@/utils/getFile";
import React, { useEffect } from "react";

type Props ={
  installateur: UserType
}

const AssignInstallateur = (props: Props) => {
  const { installateur } = props;

   if (installateur===null){
    return(
      <div className="w-48 flex justify-start items-center gap-2.5 text-gray-500">
        -
      </div>
    )
  }
  return (
    <div className="flex-1 flex justify-start items-center gap-2.5">
      <img className="w-8 h-8 rounded-[5px]" src={installateur.photo_profil? getFile(installateur.photo_profil): '/images/usProfil.jpg'} />
      <div className="justify-start text-slate-600 text-xs font-bold">
        {installateur.firstname} {installateur.lastname} 
      </div>
    </div>
  );
};

export default AssignInstallateur;
