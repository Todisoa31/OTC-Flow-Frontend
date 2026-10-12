import { getDetailControllerRetrieved } from '@/api/user';
import ProgressCircle from '@/components/inputs/ProgressCircle';
import { useTeamMember } from '@/providers/TeamProvider';
import { TeamMemberRetrieveFormated } from '@/types/teamType';
import { getFile } from '@/utils/getFile';
import React from 'react';

type Props = {
  controller: TeamMemberRetrieveFormated;
  setControllerDetail: React.Dispatch<React.SetStateAction<Boolean>>;
}
const TeamControlleurItem = (props: Props) => {
  const { controller, setControllerDetail } = props;
  const { setDetailControllerRetrieved } = useTeamMember()

  const handleDetailController = async (id: number) => {
    try{
      const response = await getDetailControllerRetrieved(id);
      if(response!=undefined && response!=null){
        setDetailControllerRetrieved({
          user: controller as TeamMemberRetrieveFormated,
          ...response
        });
      }
      if(!response) return;
    }catch(error){
      console.error("Error handling controller detail:", error);
    }finally{
      setControllerDetail(true);
    }
    
  }


  return (
    <div onClick={()=>{handleDetailController(controller.id)}} className="cursor-pointer self-stretch p-3.5 bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 flex justify-start items-center gap-2.5">
          <div className="relative">
            <img
              className="w-8 h-8 rounded-[5px]"
              src={controller.photo_profil ? getFile(controller.photo_profil) : "/images/usProfil.jpg" }
            />
            <div className="w-[15px] h-[15px] rounded-[5px] bg-white flex justify-center items-center absolute bottom-[-5px] right-[-5px]">
                <div className={`w-[12px] h-[12px] rounded-[25px] absolute top-[2px] ${controller.is_connected? "bg-[#65BFAA]" : "bg-[#96A8B8]"}`}>{controller.is_connected}</div>
            </div>
          </div>
          <div className="inline-flex flex-col justify-start items-start gap-1.5">
            <div className="justify-start text-gray-900 text-xs font-bold leading-none">
              {controller.firstname} {controller.lastname}
            </div>
            <div className="justify-start  flex gap-1">
              <span className="text-gray-900 text-[10px] font-medium">
               Traités aujourd'hui :
              </span>
              <span className="text-slate-600 text-[10px] font-bold">
                {controller.trated_dossier}
              </span>
            </div>
          </div>
        </div>
        <div className="inline-flex flex-col justify-start items-end gap-1.5">
         <ProgressCircle value={controller.assinged_dossier_count} total={controller.daily_dossier_threshold} size={50} strokeWidth={8}/>
        </div>
      </div>
    </div>
  );
}

export default TeamControlleurItem;
