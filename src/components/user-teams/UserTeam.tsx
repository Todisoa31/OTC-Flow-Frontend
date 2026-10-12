'use client';
import { useEffect, useState } from "react";
import TeamMember from "./TeamMember";
import UnasignedReferent from "./UnasignedReferent";
import UnasignedControlleur from "./UnasignedControlleur";
import AddIcon from "@/assets/icons/AddIcon";
import { useTeamMember } from "@/providers/TeamProvider";
import { getTeamListApi, getUsersUnasigned } from "@/api/user";
import { UserTypeMember, OptionType } from "@/types/teamType";
import CreateTeamSidebar from "./CreateTeamSidebar";
import CreateTeamByReferent from "./CreateTeamByReferent";
import AffectControllerOnTeam from "./AffectControllerOnTeam";
import ModifyTeam from "./ModifyTeam";
import isEqual from "lodash.isequal";
import { getFile } from "@/utils/getFile";
import { ROLE_CONTROLLER } from "@/constants/userConst";



const UserTeam = () => {
  const [showCreateMember, setShowCreateMember] = useState(false);
  const [showCreateMemberByReferent, setShowCreateMemberByReferent] = useState(false);
  const [referent, setReferent] = useState<OptionType[]>([]);
  const [controlleur, setControlleur] = useState<OptionType[]>([]);
  const [referentId, setReferentId] = useState<number | null>(null);
  const [controlleurId, setControlleurId] = useState<number | null>(null);
  const [showAffectControllerToTeam, setShowAffectControllerToTeam] = useState(false);
  const [showModifyTeam, setShowModifyTeam] = useState(false);
  const [teamId, setTeamId] = useState<number | null | undefined>(null);

  const {
    unasignedTeamReferent,
    unasignedControlleur,
    setUnasignedControlleur,
    setUnasignedTeamReferent,
    listTeams,
    setListTeams,
    affectController,
    teamCreate,
  } = useTeamMember();

  const getReferentOptions = () : {value: number; label: string; image:string} [] => {
    return unasignedTeamReferent.map((referent) => ({
      value: referent.id,
      label: `${referent.firstname} ${referent.lastname}`,
      image: referent.photo_profil ? getFile(referent.photo_profil) : '/images/usProfil.jpg',
    }));
  }


  const getControllerOptions = () : {value: number; label: string; image:string} [] => {
    return unasignedControlleur.map((controller) => ({
      value: controller.id,
      label: `${controller.firstname} ${controller.lastname}`,
      image: controller.photo_profil ? getFile(controller.photo_profil) : '/images/usProfil.jpg',
    }));
  }


  const handleGetTeamControlleur = async () => {
    try {
      const response = await getUsersUnasigned({role: ROLE_CONTROLLER});
       const newData = response.data as UserTypeMember[];

      setUnasignedControlleur(prev => {
        // Comparer rapidement la longueur et les IDs (ou stringify si petit)
        const same = isEqual(prev, newData);
        if (!same) {
          return newData;
        }
        return prev;
      });
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  };

  const handleGetTeamReferent = async () => {
    try {
      const response = await getUsersUnasigned({role: 'Référent'});
      const newData = response.data as UserTypeMember[];

      setUnasignedTeamReferent(prev => {
        // Comparer rapidement la longueur et les IDs (ou stringify si petit)
        const same = isEqual(prev, newData);          

          if (!same) {
            return newData;
          }

        // Sinon, ne rien faire
        return prev;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  };

  const getListTeams = async () => {
    try{
      const response = await getTeamListApi();
      setListTeams(prev => {
        const newData = response;
        const same = isEqual(prev, newData);          
        return same ? prev : newData;
      });
    }catch(error) {
      console.error("Error fetching data:", error);
    }
  }
  const creationTeamHandler = () => {
    setReferent(getReferentOptions());
    setControlleur(getControllerOptions());
    setShowCreateMember(true);
  }

  useEffect(() => {
    handleGetTeamControlleur();    
  },[unasignedControlleur, listTeams]);

  useEffect(() => {
    handleGetTeamReferent();    
  },[unasignedTeamReferent, listTeams]);

  useEffect(() => {
    getListTeams();
  }, [listTeams, teamCreate, affectController]);

  return (
    <div className="self-stretch p-7 inline-flex flex-col justify-start items-start gap-7 w-full">
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 justify-start text-gray-900 text-2xl font-bold">
          Gestion des équipes
        </div>
        <div className="h-10 px-5 bg-gray-900 rounded-[10px] shadow-[0px_10px_40px_0px_rgba(0,0,0,0.40)] flex justify-start items-center gap-2.5">
          <AddIcon active={true} />
          <button onClick={() => {creationTeamHandler()}} className="justify-start text-white text-xs font-bold leading-none">
            Créer une équipe
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 w-full">
        {
          listTeams.map((team, index) => (
            <TeamMember key={index} team={team} setShowCreateMember={setShowCreateMember} setReferent={setReferent} setControlleur={setControlleur} setShowModifyTeam={setShowModifyTeam} setTeamId={setTeamId}/>
          ))
        }
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 justify-start text-gray-900 text-2xl font-bold">
          Utilisateurs disponibles
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-start gap-7">
        <UnasignedReferent user={unasignedTeamReferent} setShowCreateMemberByReferent={setShowCreateMemberByReferent} setReferentId={setReferentId}/>
        <UnasignedControlleur user={unasignedControlleur} setShowAffectControllerToTeam={setShowAffectControllerToTeam} setControlleurId={setControlleurId}/>
      </div>

      <CreateTeamSidebar showCreateMember={showCreateMember} setShowCreateMember={setShowCreateMember} referent={referent} controlleur={controlleur}/>
      <CreateTeamByReferent showCreateMemberByReferent={showCreateMemberByReferent} setShowCreateMemberByReferent={setShowCreateMemberByReferent} referentId={referentId}/>
      <AffectControllerOnTeam showAffectControllerToTeam={showAffectControllerToTeam} setShowAffectControllerToTeam={setShowAffectControllerToTeam} controllerId={controlleurId} />
      <ModifyTeam showModifyTeam={showModifyTeam} setShowModifyTeam={setShowModifyTeam} teamId={teamId} />
    </div>
  );
};

export default UserTeam;
