import { removeTeamMember } from "@/api/user";
import Edit3Icon from "@/assets/icons/Edit3Icon";
import TrashIcon2 from "@/assets/icons/TrashIcon2";
import { useTeamMember } from "@/providers/TeamProvider";
import { OptionType, TeamType } from "@/types/teamType";
import React, { Dispatch } from "react";
import Modal from "../popup/Modal";
import { getFile } from "@/utils/getFile";

type TeamMemberProps = {
  team: TeamType;
  setShowCreateMember: (showCreateMember: boolean) => void;
  setReferent: Dispatch<React.SetStateAction<OptionType[]>>;
  setControlleur: Dispatch<React.SetStateAction<OptionType[]>>;
  setShowModifyTeam: Dispatch<React.SetStateAction<boolean>>;
  setTeamId: Dispatch<React.SetStateAction<number | null | undefined>>;
};
const TeamMember = (props: TeamMemberProps) => {
  const { team, setShowModifyTeam, setTeamId , setReferent, setControlleur } = props;
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);
  const { unasignedTeamReferent, unasignedControlleur, setListTeams } = useTeamMember();

  const removeTeam = async ({ teamId }: { teamId: number }) => {
    setShowRemoveModal(true);
      try {
      await removeTeamMember({teamId: teamId});
      setListTeams((prevTeams) => prevTeams.filter((t) => t.id !== teamId));
      setShowRemoveModal(false)
    }catch (error) {
      console.error("Error removing team member:", error);
    }
  };

  const getReferentOptions = () : {value: number; label: string; image:string} [] => {
    return unasignedTeamReferent.map((referent) => ({
      value: referent.id,
      label: `${referent.firstname} ${referent.lastname}`,
      image: referent.photo_profil ? getFile(referent.photo_profil) : '/images/usProfil.jpg',
    }));
  }

  const getControllerOptions = () : {value: number; label: string; image:string} [] => {
    const cont =  unasignedControlleur.map((controller) => ({
      value: controller.id,
      label: `${controller.firstname} ${controller.lastname}`,
      image: controller.photo_profil ? getFile(controller.photo_profil) : '/images/usProfil.jpg',
    }));
    return cont;
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };
  
  const editTeamHandler = (id: number, referent: OptionType[], controllers: OptionType[]) => {
    setReferent([...getReferentOptions(), ...referent]); /// mbola mila gettena any amn list users ny sary
    setControlleur([...getControllerOptions(), ...controllers]);
    setTeamId(id)
    setShowModifyTeam(true);
  };

  return (
    <div className="p-5 bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg inline-flex flex-col justify-start items-start gap-5">
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 self-stretch justify-start text-gray-900 text-sm font-bold">
          {team?.name}
        </div>
        <div className="w-100 px-2.5 py-[5px] bg-white/50 rounded-[5px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg flex justify-start items-center gap-2.5">
          <div className="justify-start text-gray-700 text-xs font-medium">
            {team.controllers.length} membre
            {team.controllers.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>
      <div className="self-stretch border-b border-white flex flex-col justify-start items-start gap-2.5">
        <div className="justify-start text-sm font-bold text-[#3A5F6E]">
          Référent :
        </div>
          {team.referent.map((ref, index) => (
            <div
              key={index}
              className="self-stretch px-2.5 py-2 bg-white/50 rounded-[10px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg inline-flex justify-start items-center gap-2.5"
            >
              <img
                className="w-6 h-6 rounded-[5px]"
                src={ref.image ? getFile(ref.image) : '/images/usProfil.jpg'} // mbola mila gettena any amn list users ny sary 
              />
              <div className="flex-1 justify-start text-xs font-bold text-[#3A5F6E]">
                {ref.name}
              </div>
            </div>
          ))}          
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
        <div className="justify-start text-sm font-bold text-[#3A5F6E]">
          Contrôleurs :
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-3.5 h-[25vh] overflow-y-auto">
          {team.controllers.map((controller, index) => (
            <div
              key={index}
              className="self-stretch px-2.5 py-2 bg-white/50 rounded-[10px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg inline-flex justify-start items-center gap-2.5"
            >
              <img
                className="w-6 h-6 rounded-[5px]"
                src={controller.image ? getFile(controller.image) : '/images/usProfil.jpg'} // mbola mila gettena any amn list users ny sary 
              />
              <div className="flex-1 justify-start text-xs font-bold text-[#3A5F6E]">
                {controller.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 justify-start">
          <span className="text-xs font-bold text-[#3A5F6E]">
            Dernière mise à jour :<br />
          </span>
          <span className="text-gray-900 text-xs font-bold">{formatDate(team.last_updated)}</span>
        </div>
        <button
          onClick={() => {
            const controlUserOptions = team.controllers.map((ctrl) => ({
              value: ctrl.id,
              label: `${ctrl.name}`,
              image: ctrl.image ? getFile(ctrl.image) : '/images/usProfil.jpg', 
            }));
             const referentUserOptions = team.referent.map((ref) => ({
              value: ref.id,
              label: `${ref.name}`,
              image: ref.image ? getFile(ref.image) : '/images/usProfil.jpg', 
            }));
            editTeamHandler(team.id, referentUserOptions, controlUserOptions);
          }}
          className="w-7 h-7 bg-gray-900 rounded-[5px] flex justify-center items-center gap-2.5"
        >
          <Edit3Icon />
        </button>
        <button
          onClick={() => {
            setShowRemoveModal(true)
          }}
        
        className="w-7 h-7 bg-pink-500 rounded-[5px] flex justify-center items-center gap-2.5">
          <TrashIcon2 />
        </button>
      </div>

      <Modal
        isOpen={showRemoveModal}
        onClose={() => { setShowRemoveModal(false); }}
        title={`Équipe : ${team.name}`}
        titleClassName="text-gray-900 text-lg font-bold"
        className="w-[500px] h-[400px] bg-white rounded"
        footer={
          <div className="self-stretch flex flex-col justify-start items-end gap-2.5 ml-auto">
            <button
              onClick={() => { removeTeam({ teamId: team.id }) }}
              className="bg-primary-blue text-white px-4 py-2 rounded font-bold text-sm"
            >
             Supprimer l'equipe
            </button>
          </div>
        }
      >
        <div className="text-sm font-bold text-gray-900 self-stretch p-5 flex flex-row justify-start items-start gap-x-1">
          Etes vous sûre de vouloir supprimer cette équipe  ?
        </div>
      </Modal>


    </div>
  );
};

export default TeamMember;
