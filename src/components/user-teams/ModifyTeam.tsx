"use client";
import { useEffect, useState } from "react";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import clsx from "clsx";
import Input from "../inputs/Input";
import Select from "../inputs/Select";
import CloseSquareBlackIcon from "@/assets/icons/CloseSquareBlackIcon";
import { useTeamMember } from "@/providers/TeamProvider";
import { SelectValue } from "@/types/inputType";
import { CreateTeamPayload, TeamType, UserTypeMember } from "@/types/teamType";
import { getTeamDetail, getUsersProfil, updateTeam } from "@/api/user";
import SaveIcon from "@/assets/icons/SaveIcon";
import isEqual from "lodash.isequal";
import { getFile } from "@/utils/getFile";
import { ROLE_CONTROLLER } from "@/constants/userConst";



type Props = {
  showModifyTeam: boolean;
  setShowModifyTeam: (showModify: boolean) => void;  
  teamId: any
};
export default function ModifyTeam(props: Props) {
    
  const { showModifyTeam, setShowModifyTeam, teamId } = props;
  const [listControllerTeams, setListControllerTeams] = useState<{value: number; label: string; image:string}[]>([]);
  const [referentOptions, setReferentOptions] = useState<UserTypeMember[]>([]);
  const [controlleurOptions, setControlleurOptions] = useState<UserTypeMember[]>([]);
  

    const {
      unasignedTeamReferent,
      unasignedControlleur,
      teamCreate, 
      setTeamCreate,
      setTeamDetail,
      teamDetail
    } = useTeamMember();


    const getModifyTeam = async (teamId: number) => {
      if(teamId == null) return;

      try {
        const response = await getTeamDetail(teamId);
        const teams = response as TeamType;
        setTeamDetail(prev => {
          const isSame = isEqual(prev, teams);     
          return isSame ? prev : teams;
        });
      }catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    const handleGetTeamReferent = async () => {
      try {
        const response = await getUsersProfil({role: 'Référent'});
        const newData = response.data as UserTypeMember[]; 
        const combined = mergeUsers(newData, unasignedTeamReferent);         
        setReferentOptions(prev => {
          // Comparer rapidement la longueur et les IDs (ou stringify si petit)
          const same = isEqual(prev, combined);
          if (!same) {
            return combined;
          }
          return prev;
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const mergeUsers = (
      a: UserTypeMember[],
      b: UserTypeMember[]
    ): UserTypeMember[] => {
      const map = new Map<number, UserTypeMember>();

      [...a, ...b].forEach(user => {
        map.set(user.id, user); // si même id, le second écrase le premier
      });

      return Array.from(map.values());
    };


    const handleGetTeamControlleur = async () => {
        try {
          const response = await getUsersProfil({role: ROLE_CONTROLLER});
          const newData = response.data as UserTypeMember[];    
          
          const combined = mergeUsers(newData, unasignedControlleur);
          setControlleurOptions(prev => {
            // Comparer rapidement la longueur et les IDs (ou stringify si petit)
            const same = isEqual(prev, combined);
            if (!same) {
              return combined;
            }
            return prev;
          });
          
        } catch (error) {
          console.error("Error fetching data:", error);
        } 
    };

    useEffect(() => {
      handleGetTeamControlleur();      
    },[controlleurOptions]);

    useEffect(() => {
      getModifyTeam(teamId);
    },[teamId]);

    useEffect(() => {
      handleGetTeamReferent()
    },[referentOptions]);

    const mergeUniqueControllers= (a: UserTypeMember[], b: UserTypeMember[]) => {
      const map = new Map();
      [...a, ...b].forEach(user => {
        map.set(user.id, user); // remplace les doublons automatiquement
      });
      return Array.from(map.values());
    }

 const getListControllerTeams = ( controllerIds: number[], allControllers: UserTypeMember[] ): {value: number; label: string; image:string}[] => {
  return allControllers.filter(controller => controllerIds.includes(controller.id)).map(ctrl => ({
      value: ctrl.id,
      label: `${ctrl.firstname} ${ctrl.lastname}`,
      image: ctrl.photo_profil ? getFile(ctrl.photo_profil) : '/images/usProfil.jpg',
  }));
};


  const getSelectOptions = (role: string ): { value: number; label: string; image: string }[] => {
    const select = role === "Référent" ? referentOptions : controlleurOptions;
    const unasignedTeam = role === "Référent" ? unasignedTeamReferent : unasignedControlleur;

    const formattedOption = select.map((controller) => ({
      value: controller.id,
      label: `${controller.firstname} ${controller.lastname}`,
      image: controller.photo_profil
        ? getFile(controller.photo_profil)
        : "/images/usProfil.jpg",
    }));

    const formattedUnassigned = unasignedTeam.map((controller) => ({
      value: controller.id,
      label: `${controller.firstname} ${controller.lastname}`,
      image: controller.photo_profil
        ? getFile(controller.photo_profil)
        : "/images/usProfil.jpg",
    }));

    return [...formattedOption, ...formattedUnassigned];
  };



  const formatTeamForApi = (teamDetail: TeamType) => {
    return {
      name: teamDetail.name,
      referent_id: teamDetail.referent?.map(referent => referent.id) ?? null,
      controllers: teamDetail.controllers.map(controller => controller.id)
    };
  };

  const updateTeamHandler = async () => {
    
      if (teamDetail.name.trim() === '') {
        alert("Le nom de l'équipe est requis.");
        return;
      }
      if(teamDetail.referent.length === 0) {
        alert("Au moins un référent est requis.");
        return;
      }
      if (teamDetail.controllers.length === 0) {
        alert("Au moins un contrôleur est requis.");
        return;
      }
    try{
      const payload: CreateTeamPayload = formatTeamForApi(teamDetail);
      const response = await updateTeam(teamId, payload);
      if(!response){
        return;
      }
    }catch(error) {
      console.error("Erreur lors de la création de l'équipe :", error);
    }finally {
      setShowModifyTeam(false);
      setTeamCreate({name: '', referent_id: [], controllers: []})
    }
  };

  useEffect(() => {
    setListControllerTeams(getListControllerTeams(teamCreate.controllers, [...controlleurOptions, ...unasignedControlleur]));
    
  },[teamCreate, controlleurOptions])


  useEffect(() =>{
  },[teamDetail])
  return (
    <div
      className={clsx(
        "fixed inset-0 z-20 flex transition-opacity duration-300",
        showModifyTeam
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="h-screen xl:w-[80%] lg:w-[76%]  "
        onClick={() => setShowModifyTeam(false)}
      />

      <div
        className={clsx(
          "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
          showModifyTeam
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        )}
      >
        <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#edf3f8]">
          <div className=" flex gap-2 items-center">
            <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">
              Modifier une équipe
            </div>
          </div>
          <button onClick={() => setShowModifyTeam(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="bg-white">
          <div className="self-stretch h-[75vh] py-[30px] flex flex-col justify-start items-start gap-5 overflow-auto ">
            <div className="self-stretch self-stretch px-7 inline-flex flex-col justify-start items-start gap-5">
              <div className="self-stretch flex flex-col justify-center items-start gap-3.5">
                <div className="justify-start text-xs font-bold text-[#3A5F6E] leading-none">
                  Nom de l’équipe :
                </div>
                <div className="self-stretch h-10 p-1.2 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-900/20 inline-flex justify-start items-start gap-2.5">
                  <Input                    
                    isRequired
                    onChange={(value) => {setTeamDetail((prev) => ({...prev, name: value}))}}
                    value={teamDetail.name}
                    placeholder="Nom de l’équipe ..."
                  />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-3.5">
                <div className="justify-start text-xs font-bold text-[#3A5F6E] leading-none">
                  Sélectionner un référent :
                </div>
                <div className="self-stretch h-10  bg-white rounded-[10px]  inline-flex justify-start items-center gap-2.5">
                  <Select
                    options={getSelectOptions('Référent')}
                    value={teamDetail.referent.map((ref) => ref.id)}
                    onChange={(value: SelectValue) => {
                      if (Array.isArray(value)) {
                        const selectedIds = value.map((v) => Number(v));                       
                        const selectedIdsNum = selectedIds.map(id => Number(id));

                        const selectedReferent = mergeUniqueControllers(referentOptions, unasignedTeamReferent)
                          .filter(referent => selectedIdsNum.includes(referent.id));

                        setTeamDetail(prev => ({
                          ...prev,
                          referent: selectedReferent.map(referent => ({
                            id: referent.id,
                            name: `${referent.firstname ?? ''} ${referent.lastname ?? ''}`.trim(),
                            image: referent.photo_profil ?? ''
                          }))
                        }));                        
                      }
                    }}
                    multiple={true}
                    hideSelected={true}
                    search={false}
                    className="outline outline-1 outline-offset-[-1px] outline-gray-900/20 w-full"
                    placeholder="Sélectionner les référéents :"
                  />
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                  
                    {
                      teamDetail.referent.map((referent, index) => (
                        <div key={referent.id} className="self-stretch px-2.5 py-2 bg-gray-900/5 rounded-[10px] inline-flex justify-start items-center gap-2.5">
                          <img
                            className="w-6 h-6 rounded-[5px]"
                            src={referent.image? getFile(referent.image) : '/images/usProfil.jpg'}
                          />
                          <div className="flex-1 justify-start text-slate-600 text-xs font-medium">
                            {referent.name}
                          </div>
                          <button onClick={() => {
                            setTeamDetail((prev) => ({
                              ...prev,
                              referent: prev.referent.filter(c => c.id !== referent.id)
                            }));
                          }}>
                            <CloseSquareBlackIcon />
                          </button>
                        </div>
                      ))
                    }

              </div>


                
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-3.5">
                <div className="justify-start text-xs font-bold text-[#3A5F6E] leading-none">
                  Sélectionner les contrôleurs :
                </div>
                <div className="self-stretch h-10  bg-white rounded-[10px]  inline-flex justify-start items-center gap-2.5">
                  <Select
                    options={getSelectOptions('Controlleur')}
                    value={teamDetail.controllers.map((controller) => controller.id)}
                    onChange={(value: SelectValue) => {
                      if (Array.isArray(value)) {
                        const controllerIds = value.map((v) => Number(v)); // s'assure que chaque valeur est bien un number
                        const selectedControllers = [...controlleurOptions, ...unasignedControlleur].filter(controller =>
                          controllerIds.includes(controller.id)
                        );
                        setTeamDetail((prev) => ({
                          ...prev,
                          controllers: selectedControllers.map(controller => ({
                            id: controller.id,
                            name: `${controller.firstname} ${controller.lastname}`,
                            image: controller.photo_profil? controller.photo_profil: ''
                          }))
                        }));
                      }
                    }}
                    multiple={true}
                    hideSelected={true}
                    search={false}
                    className="outline outline-1 outline-offset-[-1px] outline-gray-900/20 w-full"
                    placeholder="Sélectionner les contrôleurs :"
                  />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                  
                    {
                      teamDetail.controllers.map((controller, index) => (
                        <div key={controller.id} className="self-stretch px-2.5 py-2 bg-gray-900/5 rounded-[10px] inline-flex justify-start items-center gap-2.5">
                          <img
                            className="w-6 h-6 rounded-[5px]"
                            src={controller.image ? getFile(controller.image) : '/images/usProfil.jpg'}
                          />
                          <div className="flex-1 justify-start text-slate-600 text-xs font-medium">
                            {controller.name}
                          </div>
                          <button onClick={() => {
                            setTeamDetail((prev) => ({
                              ...prev,
                              controllers: prev.controllers.filter(c => c.id !== controller.id)
                            }));
                          }}>
                            <CloseSquareBlackIcon />
                          </button>
                        </div>
                      ))
                    }

              </div>
            </div>
          </div>
          <div className=" h-[20vh] p-[30px] gap-2 flex flex-col justify-between ">
            
            <button onClick={updateTeamHandler} className=" flex items-center w-full justify-center gap-2 bg-[#65A5BF] text-white font-bold py-2 rounded-[10px]">
              <SaveIcon active={true}/>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
