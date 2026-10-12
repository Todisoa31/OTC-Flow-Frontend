"use client";
import { useEffect, useState } from "react";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import clsx from "clsx";
import Input from "../inputs/Input";
import Select from "../inputs/Select";
import CloseSquareBlackIcon from "@/assets/icons/CloseSquareBlackIcon";
import { useTeamMember } from "@/providers/TeamProvider";
import { SelectValue } from "@/types/inputType";
import { UserTypeMember } from "@/types/teamType";
import { createNewTeam, getUserById, getUsersProfil } from "@/api/user";
import SaveIcon from "@/assets/icons/SaveIcon";
import { getFile } from "@/utils/getFile";
import isEqual from "lodash.isequal";
import { ROLE_CONTROLLER } from "@/constants/userConst";

type Props = {
  showCreateMemberByReferent: boolean;
  setShowCreateMemberByReferent: (showCreateMember: boolean) => void;
  referentId: number | null;
};
export default function CreateTeamByReferent(props: Props) {
  const { showCreateMemberByReferent, setShowCreateMemberByReferent, referentId } = props;
  const [listControllerTeams, setListControllerTeams] = useState<{ value: number; label: string; image: string }[]>([]);
  const [controlleurOptions, setControlleurOptions] = useState< UserTypeMember[]>([]);
  const [referentUser, setReferentUser] = useState<UserTypeMember | null>(null);

  const {
    unasignedControlleur,
    teamCreate,
    setTeamCreate,
  } = useTeamMember();

  const handleGetTeamControlleur = async () => {
    try {
      const response = await getUsersProfil({ role: ROLE_CONTROLLER });
      const newData = response.data as UserTypeMember[];
      setControlleurOptions((prev) => {
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


   const getListControllerTeams = ( controllerIds: number[], allControllers: UserTypeMember[] ): {value: number; label: string; image:string}[] => {
    return allControllers.filter(controller => controllerIds.includes(controller.id)).map(ctrl => ({
        value: ctrl.id,
        label: `${ctrl.firstname} ${ctrl.lastname}`,
        image: ctrl.photo_profil ? getFile(ctrl.photo_profil) : '/images/usProfil.jpg',
    }));
  };
  

  const handleGetUserById = async (id: number) => {
    try {
      const response = await getUserById(id);
      const userData = response as UserTypeMember;
      setTeamCreate((prev) => ({...prev, referent_id: [id]}));
      setReferentUser(prev => {
        if(prev?.id !== userData.id) {
          return userData;
        }
        return prev;
      })
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  useEffect(() => {
    handleGetTeamControlleur();
  }, [controlleurOptions]);


  useEffect(() => {
    setListControllerTeams(getListControllerTeams(teamCreate.controllers, [...controlleurOptions, ...unasignedControlleur]));
  },[teamCreate, controlleurOptions, unasignedControlleur])


  useEffect(() =>{
    
    referentId && handleGetUserById(referentId);
  }, [referentId])

  const getControllerOptions = (): {
    value: number;
    label: string;
    image: string;
  }[] => {
     const formattedControllers = controlleurOptions.map((controller) => ({
      value: controller.id,
      label: `${controller.firstname} ${controller.lastname}`,
      image: controller.photo_profil ? getFile(controller.photo_profil) : '/images/usProfil.jpg'
    }));

    const formattedUnassigned = unasignedControlleur.map((controller) => ({
      value: controller.id,
      label: `${controller.firstname} ${controller.lastname}`,
      image: controller.photo_profil ? getFile(controller.photo_profil) : '/images/usProfil.jpg'
    }));

    // fusionner les deux tableaux
    return [...formattedControllers, ...formattedUnassigned];
  };

  const createTeamHandler = async () => {
    if (teamCreate.name.trim() === "") {
      alert("Le nom de l'équipe est requis.");
      return;
    }
    if (teamCreate.controllers.length === 0) {
      alert("Au moins un contrôleur est requis.");
      return;
    }
    try {
      const response = await createNewTeam(teamCreate);
      if (!response) {
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe :", error);
    } finally {
      setShowCreateMemberByReferent(false);
      setTeamCreate({ name: "", referent_id: [], controllers: [] });
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-20 flex transition-opacity duration-300",
        showCreateMemberByReferent
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="h-screen xl:w-[80%] lg:w-[76%]  "
        onClick={() => setShowCreateMemberByReferent(false)}
      />

      <div
        className={clsx(
          "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
          showCreateMemberByReferent
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        )}
      >
        <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#edf3f8]">
          <div className=" flex gap-2 items-center">
            <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">
              Créer une équipe pour un référent
            </div>
          </div>
          <button onClick={() => setShowCreateMemberByReferent(false)}>
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
                    onChange={(value) => {
                      setTeamCreate((prev) => ({ ...prev, name: value }));
                    }}
                    value={teamCreate.name}
                    placeholder="Nom de l’équipe ..."
                  />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-3.5">
                <div className="justify-start text-xs font-bold text-[#3A5F6E] leading-none">
                  Référent :
                </div>
                <div className="self-stretch h-10 p-1.2 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-900/20 inline-flex justify-start items-start gap-2.5">
                
                  <Input
                    isRequired
                    disabled={true}
                    value={referentUser ? `${referentUser.firstname} ${referentUser.lastname}` : ""}
                    className="cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-3.5">
                <div className="justify-start text-xs font-bold text-[#3A5F6E] leading-none">
                  Sélectionner les contrôleurs :
                </div>
                <div className="self-stretch h-10  bg-white rounded-[10px]  inline-flex justify-start items-center gap-2.5">
                  <Select
                    options={getControllerOptions()}
                    value={teamCreate.controllers}
                    onChange={(value: SelectValue) => {
                      if (Array.isArray(value)) {
                        const controllerIds = value.map((v) => Number(v)); // s'assure que chaque valeur est bien un number
                        setTeamCreate((prev) => ({
                          ...prev,
                          controllers: controllerIds,
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
                {listControllerTeams.map((controller, index) => (
                  <div
                    key={controller.value}
                    className="self-stretch px-2.5 py-2 bg-gray-900/5 rounded-[10px] inline-flex justify-start items-center gap-2.5"
                  >
                    <img
                      className="w-6 h-6 rounded-[5px]"
                      src={controller.image}
                    />
                    <div className="flex-1 justify-start text-slate-600 text-xs font-medium">
                      {controller.label}
                    </div>
                    <button
                      onClick={() => {
                        setTeamCreate((prev) => ({
                          ...prev,
                          controllers: prev.controllers.filter(
                            (id) => id !== controller.value
                          ),
                        }));
                      }}
                    >
                      <CloseSquareBlackIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className=" h-[20vh] p-[30px] gap-2 flex flex-col justify-between ">
            <button
              onClick={createTeamHandler}
              className=" flex items-center w-full justify-center gap-2 bg-[#65A5BF] text-white font-bold py-2 rounded-[10px]"
            >
              <SaveIcon active={true} />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
