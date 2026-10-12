"use client";

import SendMessageIcon from "@/assets/icons/Chat/SendMessageIcon";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ImmatriculationTraType } from "@/types/fileType";
import { updateTraApi } from "@/api/fileTraUpdate";
import Select from "@/components/inputs/Select";
import { YES_NO } from "@/constants/records";
import Button from "@/components/inputs/Button";

type Props = {
  data: Record<string, any> | null;
  setEditImmatriculation: Dispatch<
    SetStateAction<{ show: boolean; item: Record<string, any> | null }>
  >;
  editImmatriculation: { show: boolean; item: Record<string, any> | null };
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdated: boolean;
};

interface Option {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    image?: string;
}

export default function EditImmatriculationSidebar(props: Props) {
  const [raisonSocialePro, setRaisonSocialePro] = useState("");
  const [siretPro, setSiretPro] = useState("");
  const [raisonSocialeBenef, setRaisonSocialeBenef] = useState("");
  const [sirenBenef, setSirenBenef] = useState("");
  const [dateEngagementOp, setDateEngagementOp] = useState("");
  const [referencePreuveRealisation, setReferencePreuveRealisation] =
    useState("");
  const [location, setLocation] = useState("");
  const [datePreuveRealisation, setDatePreuveRealisation] = useState("");
  const [categorieVehicule, setCategorieVehicule] = useState("");
  const [parcTotalAuto, setParcTotalAuto] = useState("");
  const [parcAutoCollectivite, setParcAutoCollectivite] = useState("");
  const [datePremiereImmatriculation, setDatePremiereImmatriculation] =
    useState("");
  const [dateImmatriculationOp, setDateImmatriculationOp] = useState("");
  const [numeroImmatriculationVehicule, setNumeroImmatriculationVehicule] =
    useState("");

  const { data, setEditImmatriculation, editImmatriculation, setIsUpdated, isUpdated } = props;

  const closeEdit = () => {
    setEditImmatriculation({ show: false, item: null });
  };
  useEffect(() => {
    console.log("isUpdated changed:", isUpdated);
  },[isUpdated])

  const dataImmatriculationFields = [
    { label: "Raison sociale professionnel", value: raisonSocialePro || "" , type: "text"},
    { label: "SIRET professionnel", value: siretPro || "", type: "text" },
    { label: "Raison sociale bénéficiaire", value: raisonSocialeBenef || "", type: "text" },
    { label: "SIREN bénéficiaire", value: sirenBenef || "", type: "text" },
    { label: "Date engagement de l'opération", value: dateEngagementOp || "", type: "date" },
    {
      label: "Référence preuve de réalisation",
      value: referencePreuveRealisation || "", type: "text"
    },
    { label: "Location", value: location || "", type: "select", options: YES_NO },
    { label: "Date preuve de réalisation", value: datePreuveRealisation || "", type: "date" },
    { label: "Catégorie du véhicule", value: categorieVehicule || "", type: "text" },
    { label: "Parc total automobile", value: parcTotalAuto || "", type: "text" },
    {
      label: "Parc automobile collectivité",
      value: parcAutoCollectivite || "", type: "text"
    },
    {
      label: "Date première immatriculation",
      value: datePremiereImmatriculation || "", type: "date"
    },
    {
      label: "Date immatriculation opération",
      value: dateImmatriculationOp || "", type: "date"
    },
    {
      label: "Numéro immatriculation du véhicule",
      value: numeroImmatriculationVehicule || "", type: "text"
    },
  ];

  const handleChange = (label: string, value: string) => {
    switch (label) {
      case "Raison sociale professionnel":
        setRaisonSocialePro(value);
        break;
      case "SIRET professionnel":
        setSiretPro(value);
        break;
      case "Raison sociale bénéficiaire":
        setRaisonSocialeBenef(value);
        break;
      case "SIREN bénéficiaire":
        setSirenBenef(value);
        break;
      case "Date engagement de l'opération":
        setDateEngagementOp(value);
        break;
      case "Référence preuve de réalisation":
        setReferencePreuveRealisation(value);
        break;
      case "Location":
        setLocation(value);
        break;
      case "Date preuve de réalisation":
        setDatePreuveRealisation(value);
        break;
      case "Catégorie du véhicule":
        setCategorieVehicule(value);
        break;
      case "Parc total automobile":
        setParcTotalAuto(value);
        break;
      case "Parc automobile collectivité":
        setParcAutoCollectivite(value);
        break;
      case "Date première immatriculation":
        setDatePremiereImmatriculation(value);
        break;
      case "Date immatriculation opération":
        setDateImmatriculationOp(value);
        break;
      case "Numéro immatriculation du véhicule":
        setNumeroImmatriculationVehicule(value);
        break;
      default:
        break;
    }
  };


  const handleSubmitComment = async () => {
    try {
      setIsUpdated(true);
      const response = await updateTraApi(
        editImmatriculation.item?.file_id,
        {
          raison_sociale_professionnel: raisonSocialePro,
          siret_professionnel: siretPro,
          raison_sociale_beneficiaire: raisonSocialeBenef,
          siren_beneficiaire: sirenBenef,
          date_engagement_operation: dateEngagementOp,
          reference: referencePreuveRealisation,
          location: location,
          date_preuve: datePreuveRealisation,
          categorie_vehicule: categorieVehicule,
          parc_total_automobile: parcTotalAuto,
          parc_automobile_collectivite: parcAutoCollectivite,
          date_premiere_immatriculation: datePremiereImmatriculation,
          date_immatriculation_operation: dateImmatriculationOp,
          numero_imatriculation: numeroImmatriculationVehicule,
        } as ImmatriculationTraType
      );
      console.log("Response from updateImmatriculationTraApi:", response);
      if (!response) return;
      toast.success("Immatriculation modifiée avec succès !");
      setIsUpdated(false);          
      // closeEdit();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite !");
    }finally{
    }

  };

  useEffect(() => {
    if (data) {
      setRaisonSocialePro(data.raison_sociale_professionnel || "");
      setSiretPro(data.siret_professionnel || "");
      setRaisonSocialeBenef(data.raison_sociale_beneficiaire || "");
      setSirenBenef(data.siren_beneficiaire || "");
      setDateEngagementOp(data.date_engagement_operation || "");
      setReferencePreuveRealisation(data.reference || "");
      setLocation(data.location || "");
      setDatePreuveRealisation(data.date_preuve || "");
      setCategorieVehicule(data.categorie_vehicule || "");
      setParcTotalAuto(data.parc_total_automobile || "");
      setParcAutoCollectivite(data.parc_automobile_collectivite || "");
      setDatePremiereImmatriculation(data.date_premiere_immatriculation || "");
      setDateImmatriculationOp(data.date_immatriculation_operation || "");
      setNumeroImmatriculationVehicule(data.numero_imatriculation || "");
    }
  }, [data]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-20 flex transition-opacity duration-300",
        editImmatriculation.show === true
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div className="h-screen xl:w-[80%] lg:w-[76%]  " onClick={closeEdit} />

      <div
        className={clsx(
          "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
          editImmatriculation.show === true
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        )}
      >
        <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#edf3f8]">
          <div className=" flex gap-2 items-center">
            <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">
              Editer Immatriculation
            </div>
          </div>
          <button onClick={closeEdit}>
            <CloseIcon />
          </button>
        </div>
        <div className="bg-white">
          <div className="self-stretch h-[calc(100vh-195px)] p-[30px] flex flex-col justify-start items-start gap-5 overflow-auto">
            {data ? (
              dataImmatriculationFields.map((field, index) => (
                <div key={index} className="w-full flex flex-col">
                  <label className="text-xs font-bold text-gray-600 mb-1">
                    {field.label}
                  </label>
                  {field.type === "date" ? (
                    <input
                      type="date"
                      className="w-full border border-grayLight rounded-[10px] p-[10px] text-sm outline-none"
                      value={field.value}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                  ) : field.type === "select" ? (
                     field.options && 
                    <Select
                        options={field.options as Option[]}
                        onChange={(value) => {handleChange(field.label, String(value))}}
                        value={field.value ?? ''}
                        multiple={false}
                        search={false}
                        width="w-full"
                        className="w-full border border-grayLight rounded-[10px] p-[10px] text-sm outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full border border-grayLight rounded-[10px] p-[10px] text-sm outline-none"
                      value={field.value}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>Aucune donnée disponible.</p>
            )}
          </div>
          <div className="h-[20vh] p-[30px] border-t-2 gap-2 flex flex-col justify-between">
            <Button
              label="Enregistrer les Modifications"
              iconLeft={<SendMessageIcon color="#fff" />}
              onClick={handleSubmitComment}
              width="w-auto"
            />            
          </div>
        </div>
      </div>
    </div>
  );
}
