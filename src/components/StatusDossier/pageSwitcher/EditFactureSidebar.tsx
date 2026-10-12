"use client";

import { updateTraApi } from "@/api/fileTraUpdate";

import SendMessageIcon from "@/assets/icons/Chat/SendMessageIcon";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import Button from "@/components/inputs/Button";
import Select from "@/components/inputs/Select";
import { YES_NO } from "@/constants/records";
import { FactureTraType } from "@/types/fileType";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  data: Record<string, any> | null;
  setEditFacture: Dispatch<
    SetStateAction<{ show: boolean; item: Record<string, any> | null }>
  >;
  editFacture: { show: boolean; item: Record<string, any> | null };
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Option {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    image?: string;
}

export default function EditFactureSidebar(props: Props) {
  const { data, setEditFacture, editFacture, setIsUpdated } = props;

  const [numeroDevis, setNumeroDevis] = useState("");
  const [referenceFacture, setReferenceFacture] = useState("");
  const [adresseTravaux, setAdresseTravaux] = useState("");
  const [marque, setMarque] = useState("");
  const [referenciel, setReferenciel] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const [dateFacture, setDateFacture] = useState("");
  const [objectFacture, setObjectFacture] = useState("");
  const [montantCce, setMontantCce] = useState("");
  const [beneficiaireRaisonSociale, setBeneficiaireRaisonSociale] =
    useState("");
  const [sousTraitantSiren, setSousTraitantSiren] = useState("");
  const [sousTraitantEntreprise, setSousTraitantEntreprise] = useState("");
  const [presenceSousTraitant, setPresenceSousTraitant] = useState("");

  const dataFactureFields = [
    { label: "Numéro devis", value: numeroDevis || "" , type: "text"},
    { label: "Référence facture", value: referenceFacture || "", type: "text" },
    { label: "Adresse travaux", value: adresseTravaux || "", type: "text" },
    { label: "Marque", value: marque || "", type: "text" },
    { label: "Référenciel", value: referenciel || "", type: "text" },
    { label: "Quantité", value: quantite || "", type: "text" },
    { label: "Prix unitaire", value: prixUnitaire || "", type: "text" },
    { label: "Date facture", value: dateFacture || "", type: "date" },
    { label: "Objet facture", value: objectFacture || "", type: "text" },
    { label: "Montant CCE", value: montantCce || "", type: "text" },
    {
      label: "Raison sociale bénéficiaire",
      value: beneficiaireRaisonSociale || "", type: "text"
    },
    { label: "SIREN sous-traitant", value: sousTraitantSiren || "", type: "text" },
    { label: "Entreprise sous-traitante", value: sousTraitantEntreprise || "", type: "text" },
    { label: "Présence sous-traitant", value: presenceSousTraitant || "", type: "select", options: YES_NO },
  ];

  const handleChange = (label: string, value: string) => {
    switch (label) {
      case "Numéro devis":
        setNumeroDevis(value);
        break;
      case "Référence facture":
        setReferenceFacture(value);
        break;
      case "Adresse travaux":
        setAdresseTravaux(value);
        break;
      case "Marque":
        setMarque(value);
        break;
      case "Référenciel":
        setReferenciel(value);
        break;
      case "Quantité":
        setQuantite(value);
        break;
      case "Prix unitaire":
        setPrixUnitaire(value);
        break;
      case "Date facture":
        setDateFacture(value);
        break;
      case "Objet facture":
        setObjectFacture(value);
        break;
      case "Montant CCE":
        setMontantCce(value);
        break;
      case "Raison sociale bénéficiaire":
        setBeneficiaireRaisonSociale(value);
        break;
      case "SIREN sous-traitant":
        setSousTraitantSiren(value);
        break;
      case "Entreprise sous-traitante":
        setSousTraitantEntreprise(value);
        break;
      case "Présence sous-traitant":
        setPresenceSousTraitant(value);
        break;
      default:
        break;  
    }
  };

  const closeEdit = () => {
    setEditFacture({ show: false, item: null });
  };

  const handleSubmitComment = async () => {
      try {
        const response = await updateTraApi(
          editFacture.item?.file_id,
          {
            numero_devis: numeroDevis,
            reference_facture: referenceFacture,
            adresse_travaux: adresseTravaux,
            marque: marque,
            referenciel: referenciel,
            quantite: quantite,
            prix_unitaire: prixUnitaire,
            date_facture: dateFacture,
            object_facture: objectFacture,
            montant_cce: montantCce,
            beneficiaire_raison_sociale: beneficiaireRaisonSociale,
            sous_traitant_siren: sousTraitantSiren,
            sous_traitant_entreprise: sousTraitantEntreprise,
            presence_sous_traitant: presenceSousTraitant,
          } as FactureTraType
        );        
        if (!response) return;
        toast.success("Facture modifiée avec succès !");
        closeEdit();
      } catch (error) {
        console.error(error);
        toast.error("Une erreur s'est produite !");
      }finally{
        setIsUpdated(true);
      }
  
    };

  useEffect(() => {
    if (data) {
      setNumeroDevis(data.numero_devis || "");
      setReferenceFacture(data.reference_facture || "");
      setAdresseTravaux(data.adresse_travaux || "");
      setMarque(data.marque || "");
      setReferenciel(data.referenciel || "");
      setQuantite(data.quantite || "");
      setPrixUnitaire(data.prix_unitaire || "");
      setDateFacture(data.date_facture || "");
      setObjectFacture(data.object_facture || "");
      setMontantCce(data.montant_cce || "");
      setBeneficiaireRaisonSociale(data.beneficiaire_raison_sociale || "");
      setSousTraitantSiren(data.sous_traitant_siren || "");
      setSousTraitantEntreprise(data.sous_traitant_entreprise || "");
      setPresenceSousTraitant(data.presence_sous_traitant || "");
    }
  }, [data]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-20 flex transition-opacity duration-300",
        editFacture.show === true
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div className="h-screen xl:w-[80%] lg:w-[76%]  " onClick={closeEdit} />

      <div
        className={clsx(
          "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
          editFacture.show === true
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        )}
      >
        <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#edf3f8]">
          <div className=" flex gap-2 items-center">
            <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">
              Editer Facture
            </div>
          </div>
          <button onClick={closeEdit}>
            <CloseIcon />
          </button>
        </div>
        <div className="bg-white">
          <div className="self-stretch h-[calc(100vh-195px)] p-[30px] flex flex-col justify-start items-start gap-5 overflow-auto">
            {data ? (
              dataFactureFields.map((field, index) => (
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
          <div className=" h-[20vh] p-[30px] border-t-2 gap-2 flex flex-col justify-between">
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
