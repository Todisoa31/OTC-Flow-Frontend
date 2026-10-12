import { useEffect, useState } from "react";
import Input from "@/components/inputs/Input";
import Modal from "@/components/popup/Modal";
import React from "react";
import { getControllersRetrieved } from "@/api/user";
import isEqual from "lodash.isequal";
import RadioSelectController from "./CheckboxController";
import { ControlAssignType, ControllerTypeFolder, TeamMemberRetrieveType } from "@/types/teamType";
import { affectFolderApi, affectFolderConformiteApi } from "@/api/dossier";
import { useTeamMember } from "@/providers/TeamProvider";
import { parseErrorMessage } from "@/utils/commonUtils";
import { ROLE_COFRAC, ROLE_CONTROLLER } from "@/constants/userConst";

type Props = {
  showModalAffectation: boolean;
  dossier_id: number[];
  setShowModalAffectation: React.Dispatch<React.SetStateAction<boolean>>;
  control?: string;
};
const AffectationModal = (props: Props) => {
  const { showModalAffectation, setShowModalAffectation, dossier_id, control } = props;
  const [searchControlleur, setSearchControlleur] = useState("");
  const [affectError, setAffectError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listControlleurs, setListControlleurs] =
    useState<ControllerTypeFolder[]>();
  const { setControlAssign, controlAssign, setAffectAssign, setListDossier } = useTeamMember();

  const filteredControllers = (listControlleurs ?? []).filter((controller) => {
    const search = (searchControlleur ?? "").toLowerCase();
    const fullName = `${controller.name}`.toLowerCase();
    return fullName.includes(search);
  });

  const handleAffectController = async (controlleur_id: number) => {
    setAffectError(null); // Reset erreur précédente

    if (!controlAssign?.controller_id) return;

    try {
      setControlAssign((prev) => {
        const newValue: ControlAssignType = {
          controller_id: Number(controlleur_id),
          dossier_id: dossier_id,
        };
        return isEqual(prev, newValue) ? prev : newValue;
      });
      const apiCall = control === 'controlleur' ? affectFolderApi : affectFolderConformiteApi;
      const response = await apiCall(controlAssign as ControlAssignType);

      if (!response) {
        throw new Error("Aucune réponse du serveur.");
      }

      setAffectAssign(true);
    } catch (error) {
      const message = parseErrorMessage(error, "Erreur lors de l'affectation du contrôleur");
      setAffectError(message);
      console.error("Erreur affectation contrôleur :", message);
      return; // ⚠️ Arrête ici si erreur
    }

    // ✅ Mise à jour uniquement si pas d’erreur
    setShowModalAffectation(false);
    setListDossier((prev) => {
      return prev.map((dossier) => {
        if (controlleur_id === controlAssign?.controller_id && dossier_id.includes(dossier.id)) {
          return {
            ...dossier,
            controller: {
              id: controlleur_id,
              name: controlleur_id.toString(),
            },
          };
        }
        return dossier;
      });
    });
  };


  const getAllControllers = async (page: number, per_page: number) => {
    try {
      console.log("Fetching controllers...", control);
      setLoading(true);
      const response = await getControllersRetrieved({ page, per_page, role: control === 'controlleur' ? ROLE_CONTROLLER : ROLE_COFRAC });
      const user = response.users;
      const controllers = user.map((item: TeamMemberRetrieveType) => ({
        id: item.id,
        name: `${item.firstname} ${item.lastname}`,
        photo: item.photo_profil || "",
        nbFolder: item.charges_dossier.assigned_dossier_count || 0,
      }));

      setListControlleurs((prev) => {
        // Comparer rapidement la longueur et les IDs (ou stringify si petit)
        const same = isEqual(prev, controllers);

        if (!same) {
          return controllers;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllControllers(1, 80);
  }, [listControlleurs]);

  return (
    <Modal
      title="Affectation du dossier"
      isOpen={showModalAffectation}
      onClose={() => setShowModalAffectation(false)}
      className="w-[920px] h-[600px]"
      titleClassName="text-lg font-bold text-slate-700"
      footerClassName="bg-transparent justify-end"
      footer={
        <div className="h-10 px-5 bg-primary-blue rounded-[10px] shadow-[0px_10px_40px_0px_rgba(97,161,191,0.70)] inline-flex justify-end items-center gap-2.5">
          <button
            onClick={() => {
              if (controlAssign?.controller_id) {
                handleAffectController(controlAssign?.controller_id);
              }
            }}
            className="justify-end text-white text-xs font-bold leading-none"
          >
            Valider
          </button>
        </div>
      }
    >
      <div className="w-[900px] p-7 rounded-[10px] inline-flex flex-col justify-start items-start gap-5">
        <div className="self-stretch h-10 rounded-[10px] inline-flex justify-start items-center gap-2.5">
          <Input
            placeholder="Rechercher par nom, email, rôle"
            width=""
            background="bg-gray-100"
            height="h-[40px]"
            value={searchControlleur}
            onChange={(value: string) => setSearchControlleur(value)}
            className="text-xs text-black font-medium grow"
            rightIcon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z"
                  fill="#101828"
                />
              </svg>
            }
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="justify-start text-gray-500 text-xs font-medium">
            Assigner {dossier_id.length} nouveaux dossiers
          </div>
          {affectError && (
            <div className="py-2 px-3 bg-red rounded-xl">
              <p className="text-white text-xs font-bold">Erreur assignation: {affectError}</p>
            </div>
          )}
        </div>
        
        <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
          <RadioSelectController
            loading={loading}
            controllers={filteredControllers || []}
            selectedId={String(controlAssign?.controller_id)}
            onChange={(id) => {
              setControlAssign((prev) => {
                return {
                   ...prev, // attention : prev peut être null
                  controller_id: Number(id),
                  dossier_id: prev?.dossier_id || [], // fallback si prev est null
                };
              });
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AffectationModal;
