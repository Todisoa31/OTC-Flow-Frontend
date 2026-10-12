"use client";

import React, { useEffect, useRef, useState } from "react";
import { DetailContratProps, FicheOperation } from "@/types/contratType";
import UpdateContratModal from "@/components/modal/UpdateContratModal";
import AddContratModal from "@/components/modal/AddContratFieldsModal";
import { useAvenantSelection } from "@/contexts/Avenant/AvenantSelectionContext";
import { useContratDetailStore } from "@/stores/ContratDetailStore";

import ConfirmDeleteModal from "@/components/modal/DeleteModal";
import { toast } from "react-toastify";
import { deleteFicheOp } from "@/api/contrat";
import RenderModaliteFinanciere from "@/components/contracts/components/details/renderModalite";
import { SectionPerson } from "@/components/contracts/components/details/renderPerson";
import { RenderDate } from "@/components/contracts/components/details/renderDate";
import { RenderVolume } from "@/components/contracts/components/details/renderVolume";
import { RenderFicheOp } from "@/components/contracts/components/details/renderFicheOp";
import RenderSignature from "@/components/contracts/components/details/RenderSignature";



const ContentDetailContrat = ({ details }: { details: DetailContratProps }) => {
  
  const [sectionToEdit, setSectionToEdit] = useState<null | string>(null);
  const [isAdding, setIsAdding] = useState<null | string>(null);
  const [loadingSections, setLoadingSections] = useState<{ [key: string]: boolean }>({});
  
  const [contractDetails, setContractDetails] = useState(details);
  const { selectedAvenantId, setSelectedAvenantId } = useAvenantSelection();
  const triggerRefresh = useContratDetailStore((state) => state.triggerRefresh);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const handleModalClose = (updatedData?: DetailContratProps, updatedSection?: string) => {
    setSectionToEdit(null);
    setIsAdding(null);
    setIsDeleteModalOpen(false)
    
    if (updatedSection) {
      setLoadingSections((prev) => ({ ...prev, [updatedSection]: true }));
    }

    if (updatedData) {
        setContractDetails(updatedData);
    } 

    if (updatedSection) {
      setTimeout(() => {
        setLoadingSections((prev) => ({ ...prev, [updatedSection]: false }));
      }, 1000);
    }
  };

  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (selectedAvenantId === details.id && !hasRefreshed.current) {
      triggerRefresh();
      hasRefreshed.current = true;
    }
  }, [selectedAvenantId, details.id, triggerRefresh]);


  if (!details) {
    return <div className="text-red-500">Aucun détail de contrat disponible.</div>;
  }

  // Messages considérés comme triggers pour utiliser contractDetails
  const ADD_MESSAGE = "Fiche OP enregistrée avec succès";
  const DELETE_MESSAGE = "Valeurs supprimées de la fiche OP avec succès";
  const UPDATE_MESSAGE = "Contract updated successfully";

  const isContractDetailsValid =
    contractDetails &&
    [ADD_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE].includes(contractDetails?.message ?? "");

  // Fusionner les données
  const sourceData = isContractDetailsValid
    ? {
        ...details,
        // Si contractDetails a 'data', on merge avec details
        ...(contractDetails ? contractDetails : {}),
        // Si contractDetails a 'fiche_op', on merge avec details.fiche_op
        ...(contractDetails.fiche_op
          ? { fiche_op: { ...details.fiche_op, ...contractDetails.fiche_op } }
          : {}),
      }
    : details;

    // console.log("Source Data:", sourceData);

  // On récupère fiche_op depuis la bonne source
  const fiches = sourceData?.fiche_op || {};

  // Typage strict pour TypeScript
  const fichesOp: { category: string; data: FicheOperation[] }[] = Object.entries(fiches)
    .map(([category, data]) => {
      if (!Array.isArray(data) || data.length === 0) return null;

      return {
        category: category
          .replace("fiche_op_", "")
          .replace("_cee", "")
          .replaceAll("_", " "),
        data: data as FicheOperation[],
      };
    })
    .filter((item): item is { category: string; data: FicheOperation[] } => item !== null);

  const handleDeleteCodes = async () => {
    try {
      const payload: Record<string, any> = { contrat_fiche_op: {} };
      const categoriesToReload: string[] = [];

      for (const { category, data } of fichesOp) {
        const codesInCategory = (data as FicheOperation[]).map(
          (f) => f as unknown as string
        );

        const selectedInCategory = codesInCategory.filter((code) =>
          selectedCodes.includes(code)
        );

        if (selectedInCategory.length > 0) {
          payload.contrat_fiche_op[
            `fiche_op_${category.replaceAll(" ", "_")}_cee`
          ] = selectedInCategory;

          categoriesToReload.push(category);
        }
      }

      if (Object.keys(payload.contrat_fiche_op).length > 0) {
        const updatedData: DetailContratProps = await deleteFicheOp(Number(details.id), payload);

        // Mettre à jour les fiches affichées
        setContractDetails(updatedData);

        toast.success("Fiche(s) opération supprimée(s) avec succès");
        setSelectedCodes([]);

        // Recharger uniquement les catégories modifiées
        categoriesToReload.forEach((cat) => {
          handleModalClose(updatedData, cat);
        });
      } else {
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur suppression fiche op :", error);
      toast.error("La suppression a échoué");
    }
  };

  return (
      <div className="flex flex-col gap-[40px] w-full px-[30px]">
      {/* ----- Personnes ----- */}
      <div className="flex gap-[30px]">
        <SectionPerson 
          title="Acheteur" 
          data={contractDetails.acheteur} 
          loading={loadingSections["acheteur"]} 
          onEdit={() => setSectionToEdit("acheteur")}
          onAdd={() => setIsAdding("acheteur")} 
        />
        <SectionPerson 
          title="Vendeur" 
          data={contractDetails.vendeur} 
          loading={loadingSections["vendeur"]} 
          onEdit={() => setSectionToEdit("vendeur")}
          onAdd={() => setIsAdding("vendeur")} 
        />
      </div>

      {/* ----- Dates ----- */}
      <RenderDate 
        details={contractDetails}
        loading={loadingSections["Dates"]}
        setSectionToEdit={setSectionToEdit}
        selectedAvenantId={selectedAvenantId}
        setSelectedAvenantId={setSelectedAvenantId}
      />

      {/* ----- Modalité financière ----- */}
      <RenderModaliteFinanciere
        details={contractDetails}
        loading={loadingSections["Modalité financière"]}
        selectedAvenantId={selectedAvenantId}
        setSelectedAvenantId={setSelectedAvenantId}
        onEdit={() => setSectionToEdit("Modalité financière")}
        onAdd={() => setIsAdding("Modalité financière")}
      />

      {/* ----- Volume ----- */}
      <RenderVolume
        details={contractDetails}
        loading={loadingSections["Volume"]}
        setSectionToEdit={setSectionToEdit}
        setIsAdding={setIsAdding}
        selectedAvenantId={selectedAvenantId}
        setSelectedAvenantId={setSelectedAvenantId}
      />

      {/* ----- Fiche OP ----- */}
      <RenderFicheOp
        details={contractDetails}
        fichesOp={fichesOp} 
        selectedCodes={selectedCodes}
        setSelectedCodes={setSelectedCodes}
        loadingSections={loadingSections}
        selectedAvenantId={selectedAvenantId}
        setSelectedAvenantId={setSelectedAvenantId}
        onEdit={() => setSectionToEdit("Fiche opération")}
        onAdd={() => setIsAdding("Fiche opération")}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* ----- Signature ----- */}
      <RenderSignature
        details={contractDetails}
        selectedAvenantId={selectedAvenantId}
        setSelectedAvenantId={setSelectedAvenantId}
      />

      {/* ----- Modales ----- */}
      {sectionToEdit && (
        <UpdateContratModal
          section={sectionToEdit}
          data={contractDetails}
          avenantId={selectedAvenantId}
          onClose={handleModalClose} 
        />
      )}
      {isAdding && (
        <AddContratModal
          section={isAdding}
          data={contractDetails}
          onClose={handleModalClose}  
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          title={selectedCodes.length > 1 ? "Supprimer ces codes ?" : "Supprimer ce code ?"}
          message={
            <>
              <p>Cette action est irréversible.</p>
              <p>{selectedCodes.length > 1 ? `${selectedCodes.length} codes` : "Le code"} sera définitivement supprimé.</p>
            </>
          }
          confirmLabel="Supprimer"
          confirmColor="bg-[#f30404] hover:bg-[#f30404]"
          onClose={handleModalClose}
          onConfirm={handleDeleteCodes}
        />
      )}
    </div>
  );
};

export default ContentDetailContrat;
