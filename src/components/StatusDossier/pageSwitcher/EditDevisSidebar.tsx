"use client";

import { updateTraApi } from "@/api/fileTraUpdate";
import SendMessageIcon from "@/assets/icons/Chat/SendMessageIcon";
import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import Button from "@/components/inputs/Button";
import Select from "@/components/inputs/Select";
import { YES_NO } from "@/constants/records";
import { DevisTraType } from "@/types/fileType";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  data: Record<string, any> | null;
  setEditDevis: Dispatch<
    SetStateAction<{ show: boolean; item: Record<string, any> | null }>
  >;
  editDevis: { show: boolean; item: Record<string, any> | null };
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Option {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    image?: string;
}

export default function EditDevisSidebar(props: Props) {
  const { data, setEditDevis, editDevis, setIsUpdated } = props;

  // States
  const [bonPourAccord, setBonPourAccord] = useState("");
  const [dateSignature, setDateSignature] = useState("");
  const [dateDevis, setDateDevis] = useState("");
  const [numeroDevis2, setNumeroDevis2] = useState("");
  const [signatureBeneficiaire, setSignatureBeneficiaire] = useState("");
  const [marqueDevis, setMarqueDevis] = useState("");
  const [referencielDevis, setReferencielDevis] = useState("");
  const [quantiteDevis, setQuantiteDevis] = useState("");
  const [prixUnitaireDevis, setPrixUnitaireDevis] = useState("");
  const [montantHt, setMontantHt] = useState("");
  const [tva, setTva] = useState("");
  const [montantTtc, setMontantTtc] = useState("");
  const [montantCceDevis, setMontantCceDevis] = useState("");
  const [sousTraitantSirenDevis, setSousTraitantSirenDevis] = useState("");
  const [sousTraitantEntrepriseDevis, setSousTraitantEntrepriseDevis] =
    useState("");
  const [presenceSousTraitantDevis, setPresenceSousTraitantDevis] =
    useState("");

  // Définition des champs
  const dataDevisFields = [
    { label: "Bon pour accord", value: bonPourAccord || '', type: "select", options: YES_NO },
    { label: "Date signature", value: dateSignature, type: "date" },
    { label: "Date devis", value: dateDevis, type: "date" },
    { label: "Numéro devis", value: numeroDevis2, type: "text" },
    { label: "Signature bénéficiaire", value: signatureBeneficiaire || '', type: "select", options: YES_NO },
    { label: "Marque", value: marqueDevis, type: "text" },
    { label: "Référenciel", value: referencielDevis, type: "text" },
    { label: "Quantité", value: quantiteDevis, type: "text" },
    { label: "Prix unitaire", value: prixUnitaireDevis, type: "text" },
    { label: "Montant HT", value: montantHt, type: "text" },
    { label: "TVA", value: tva, type: "text" },
    { label: "Montant TTC", value: montantTtc, type: "text" },
    { label: "Montant CCE", value: montantCceDevis, type: "text" },
    { label: "SIREN sous-traitant", value: sousTraitantSirenDevis, type: "text" },
    { label: "Entreprise sous-traitante", value: sousTraitantEntrepriseDevis, type: "text" },
    { label: "Présence sous-traitant", value: presenceSousTraitantDevis || '', type: "select", options: YES_NO },
  ];

  const formatDateForInput:(dateStr: string) => string = (dateStr) =>{ //2025-09-15
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };
  // Centralisation du onChange
  const handleChange = (label: string, value: string) => {
    switch (label) {
      case "Bon pour accord":
        setBonPourAccord(value);
        break;
      case "Date signature":
        setDateSignature(value);
        break;
      case "Date devis":
        setDateDevis(value);
        break;
      case "Numéro devis":
        setNumeroDevis2(value);
        break;
      case "Signature bénéficiaire":
        setSignatureBeneficiaire(value);
        break;
      case "Marque":
        setMarqueDevis(value);
        break;
      case "Référenciel":
        setReferencielDevis(value);
        break;
      case "Quantité":
        setQuantiteDevis(value);
        break;
      case "Prix unitaire":
        setPrixUnitaireDevis(value);
        break;
      case "Montant HT":
        setMontantHt(value);
        break;
      case "TVA":
        setTva(value);
        break;
      case "Montant TTC":
        setMontantTtc(value);
        break;
      case "Montant CCE":
        setMontantCceDevis(value);
        break;
      case "SIREN sous-traitant":
        setSousTraitantSirenDevis(value);
        break;
      case "Entreprise sous-traitante":
        setSousTraitantEntrepriseDevis(value);
        break;
      case "Présence sous-traitant":
        setPresenceSousTraitantDevis(value);
        break;
      default:
        break;
    }
  };

  const closeEdit = () => {
    setEditDevis({ show: false, item: null });
  };

  const handleSubmitComment = async () => {
    try {
      const response = await updateTraApi(
        editDevis.item?.file_id,
        {
          bon_pour_accord: bonPourAccord,
          date_signature: dateSignature,
          date_devis: dateDevis,
          numero_devis: numeroDevis2,
          signature_beneficiaire: signatureBeneficiaire,
          marque: marqueDevis,
          referenciel: referencielDevis,
          quantité: quantiteDevis,
          prix_unitaire: prixUnitaireDevis,
          montant_ht: montantHt,
          tva: tva,
          montant_ttc: montantTtc,
          montant_cce: montantCceDevis,
          sous_traitant_siren: sousTraitantSirenDevis,
          sous_traitant_entreprise: sousTraitantEntrepriseDevis,
          presence_sous_traitant: presenceSousTraitantDevis,
        } as DevisTraType
      );
      if (!response) return;
      toast.success("Devis modifiée avec succès !");
      closeEdit();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite !");
    } finally {
      setIsUpdated(true);
    }
  };

  // Pré-remplissage
  useEffect(() => {
    if (data) {
      setBonPourAccord(data.bon_pour_accord || "");
      setDateSignature(data.date_signature || "");
      setDateDevis(data.date_devis || "");
      setNumeroDevis2(data.numero_devis || "");
      setSignatureBeneficiaire(data.signature_beneficiaire || "");
      setMarqueDevis(data.marque || "");
      setReferencielDevis(data.referenciel || "");
      setQuantiteDevis(data.quantité || "");
      setPrixUnitaireDevis(data.prix_unitaire || "");
      setMontantHt(data.montant_ht || "");
      setTva(data.tva || "");
      setMontantTtc(data.montant_ttc || "");
      setMontantCceDevis(data.montant_cce || "");
      setSousTraitantSirenDevis(data.sous_traitant_siren || "");
      setSousTraitantEntrepriseDevis(data.sous_traitant_entreprise || "");
      setPresenceSousTraitantDevis(data.presence_sous_traitant || "");
    }
  }, [data]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-20 flex transition-opacity duration-300",
        editDevis.show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="h-screen xl:w-[80%] lg:w-[76%]" onClick={closeEdit} />

      <div
        className={clsx(
          "xl:w-[20%] lg:w-[24%] h-screen bg-white2 font-ballou2 border-l border-grayLight transition-all duration-500 ease-in-out",
          editDevis.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        {/* Header */}
        <div className="self-stretch h-[90px] w-full p-[30px] border border-white flex items-center justify-between bg-[#edf3f8]">
          <div className="flex gap-2 items-center">
            <div className="text-[#001c56] text-sm font-bold leading-7">
              Editer Devis
            </div>
          </div>
          <button onClick={closeEdit}>
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <div className="bg-white">
          <div className="h-[calc(100vh-195px)] p-[30px] flex flex-col gap-5 overflow-auto">
            {data ? (
              dataDevisFields.map((field, index) => (
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
                  ) : field.type === "select" ? 

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
                    : (
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

          {/* Footer */}
          <div className="h-[20vh] p-[30px] border-t-2 flex flex-col justify-between">
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
