import React, { Dispatch } from "react";
import { UserTypeMember } from "@/types/teamType";
import { useTeamMember } from "@/providers/TeamProvider";
import { getFile } from "@/utils/getFile";

type Props = {
  user: UserTypeMember[];
  setShowAffectControllerToTeam: Dispatch<React.SetStateAction<boolean>>;
  setControlleurId: React.Dispatch<React.SetStateAction<number | null>>;
}
const UnasignedControlleur = (props: Props) => {
  const { user, setShowAffectControllerToTeam, setControlleurId } = props;
  const handleAffectController = (controllerId: number) => {
    setControlleurId(controllerId)
    setShowAffectControllerToTeam(true);
  };
  
  return (
    <div className="flex-1 self-stretch p-5 bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg inline-flex flex-col justify-start items-start gap-5">
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 justify-start text-gray-900 text-sm font-bold ">
          Contrôleurs non assignés
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
        {user.map((item, index) => (
            <div key={index} className="self-stretch px-2.5 py-2 bg-white/50 rounded-[10px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg inline-flex justify-start items-center gap-2.5">
              <img
                className="w-6 h-6 rounded-[5px]"
                src={item.photo_profil ? getFile(item.photo_profil) : '/images/usProfil.jpg'}
              />
              <div className="flex-1 justify-start font-bold text-xs text-[#3A5F6E] ">
               {item.firstname} {item.lastname}
              </div>
              <div className="h-7 px-2.5 bg-gray-900 rounded-[5px] flex justify-center items-center gap-2.5">
                <button  onClick={()=>{handleAffectController(item.id)}}  className="justify-start text-white text-xs font-bold">
                  Affecter
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UnasignedControlleur;
