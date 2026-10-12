"use client";
import React, { useEffect, useState } from "react";
import SendMessageIcon from "@/assets/icons/Chat/SendMessageIcon";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import clsx from "clsx";
import Input from "../inputs/Input";
import Select from "../inputs/Select";
import CloseSquareBlackIcon from "@/assets/icons/CloseSquareBlackIcon";
import { useTeamMember } from "@/providers/TeamProvider";
import { SelectValue } from "@/types/inputType";
import { OptionType, TeamType, UserTypeMember } from "@/types/teamType";
import {
  affectControlleur,
  getTeamListApi,
  getUserById,
  getUsersProfil,
} from "@/api/user";
import SaveIcon from "@/assets/icons/SaveIcon";

type Props = {
  showAffectControllerToTeam: boolean;
  setShowAffectControllerToTeam: (showAffectController: boolean) => void;
  controllerId: number | null;
};

type listTeamsAffectedType = {
  value: number;
  label: string;
};
export default function CreateTeamByReferent(props: Props) {
  const {
    showAffectControllerToTeam,
    setShowAffectControllerToTeam,
    controllerId,
  } = props;
  const [listTeamsOption, setListTeamsIOption] = useState<OptionType[]>([]);
  const [listTeamsAffected, setListTeamsAffected] = useState<
    listTeamsAffectedType[]
  >([]);
  const [controlleurUser, setControlleurUser] = useState<UserTypeMember | null>(
    null
  );
  const { listTeams, setAffectController, affectController } = useTeamMember();

  

  const getTeamsOptions = async () => {
    try {
      const response = await getTeamListApi();
      const teams = response.map((team: TeamType) => ({
        value: team.id,
        label: team.name,
      }));
      setListTeamsIOption(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };
  const handleGetUserById = async (id: number) => {
    if(id===null) return;
    
    try {
      const response = await getUserById(id);
      const userData = response as UserTypeMember;
      setAffectController((prev) => {
        if (!prev) return { controller_id: id, team_ids: [] };
        return { ...prev, controller_id: id };
      });
      setControlleurUser((prev) => {
        if (prev?.id !== userData.id) {
          return userData;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  const getListTeamsAffected = (
    teamIds: number[],
    allTeams: TeamType[]
  ): listTeamsAffectedType[] => {
    return allTeams
      .filter((team) => teamIds?.includes(team.id))
      .map((t) => ({
        value: t.id,
        label: `${t.name} (${t.controllers.length})`,
      }));
  };


  const createTeamHandler = async () => {
    if (
      affectController?.team_ids == null ||
      affectController?.team_ids.length === 0
    ) {
      alert("Au moins une équipe est requise.");
      return;
    }
    if (affectController.controller_id === 0) {
      alert("Le controlleur est requis.");
      return;
    }
    try {
      const response = await affectControlleur(affectController);
      
      if (!response) {
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe :", error);
    } finally {
      setAffectController({ controller_id: 0, team_ids: [] });
      setShowAffectControllerToTeam(false);
      
    }
  };

  useEffect(() => {
    getTeamsOptions();
  }, [showAffectControllerToTeam]);

  useEffect(() => {
    controllerId!=null && handleGetUserById(controllerId);
  }, [controllerId]);

  useEffect(() => {
    setListTeamsAffected(getListTeamsAffected(affectController?.team_ids ?? [], listTeams));
  }, [affectController?.team_ids, listTeams]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-20 flex transition-opacity duration-300",
        showAffectControllerToTeam
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="h-screen xl:w-[80%] lg:w-[76%]  "
        onClick={() => setShowAffectControllerToTeam(false)}
      />

      <div
        className={clsx(
          "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
          showAffectControllerToTeam
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        )}
      >
        <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#edf3f8]">
          <div className=" flex gap-2 items-center">
            <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">
              Affecter un controlleur
            </div>
          </div>
          <button onClick={() => setShowAffectControllerToTeam(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="bg-white">
          <div className="self-stretch h-[75vh] py-[30px] flex flex-col justify-start items-start gap-5 overflow-auto ">
            <div className="self-stretch self-stretch px-7 inline-flex flex-col justify-start items-start gap-5">
              <div className="self-stretch flex flex-col justify-center items-start gap-3.5">
                <div className="justify-start text-xs font-bold text-[#3A5F6E] leading-none">
                  Controlleur :
                </div>
                <div className="self-stretch h-10 p-1.2 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-900/20 inline-flex justify-start items-start gap-2.5">
                  <Input
                    isRequired
                    disabled={true}
                    value={
                      controlleurUser
                        ? `${controlleurUser.firstname} ${controlleurUser.lastname}`
                        : ""
                    }
                    className="cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-center items-start gap-3.5">
                <div className="justify-start text-xs font-bold text-[#3A5F6E] leading-none">
                  Affecter aux équipes :
                </div>
                <div className="self-stretch h-10  bg-white rounded-[10px]  inline-flex justify-start items-center gap-2.5">
                  <Select
                    options={listTeamsOption}
                    value={affectController?.team_ids??[]}
                    onChange={(value: SelectValue) => {
                      if (Array.isArray(value)) {
                        const teamsIds = value.map((v) => Number(v)); // s'assure que chaque valeur est bien un number
                        setAffectController((prev) =>
                          prev ? { ...prev, team_ids: teamsIds } : { controller_id: 0, team_ids: teamsIds } // sécurité
                        );
                      }
                    }}
                    multiple={true}
                    hideSelected={true}
                    search={false}
                    className="outline outline-1 outline-offset-[-1px] outline-gray-900/20 w-full"
                    placeholder="Sélectionner les équipes :"
                  />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                {listTeamsAffected.map((team, index) => (
                  <div
                    key={team.value}
                    className="self-stretch px-2.5 py-2 bg-gray-900/5 rounded-[10px] inline-flex justify-start items-center gap-2.5"
                  >
                    <div className="flex-1 justify-start text-slate-600 text-xs font-medium">
                      {team.label}
                    </div>
                    <button
                      onClick={() => {
                        setAffectController((prev) => {
                          if (!prev) return prev; // ou return null
                          return {
                            ...prev,
                            team_ids: prev.team_ids.filter((id) => id !== team.value),
                          };
                        });
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
              Affecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
