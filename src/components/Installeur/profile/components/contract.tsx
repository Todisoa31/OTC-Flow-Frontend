"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

import { getContratInfoForAnUser } from "@/api/contrat";
import AddIcon from "@/assets/icons/AddIcon";
import ContractIcon from "@/assets/icons/ContractIcon";
import AddContratModal from "@/components/modal/addContratModal";
import CenterSpinner from "@/components/loader/CenterSpinner";
import { INSTALLER_ROUTE } from "@/constants/routes";
import { useAuth } from "@/providers/AuthProvider";
import { UseContractStore } from "@/stores/ContratStore";
import { ContratListType } from "@/types/contratType";
import ContractRow from "./ContractRow";


type PropsContract = {
  redirection?: string;
};

export default function ContractSide({ redirection }: PropsContract) {
  const { user } = useAuth();
  const { updateContract } = UseContractStore();
  const { id } = useParams();
  const path = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [contratList, setContratList] = useState<ContratListType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContracts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const user_id = id ? Number(id) : user.id;
      const res = await getContratInfoForAnUser(user_id);
      setContratList(res?.contrats);
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchContracts();
  }, [updateContract]);

  return (
    <>
      <div className="p-[30px] bg-[#FFFFFF66] flex flex-col gap-4">
        <div className="h-[75vh] overflow-y-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex gap-2 items-center text-[24px] text-[#101828] font-bold">
            <ContractIcon />
            Contrats
          </div>

          {/* Contract list */}
          <div className="flex flex-col gap-8">
            {loading ? (
              <CenterSpinner />
            ) : (
              contratList.map((data) => (
                <ContractRow
                  key={data.id}
                  data={data}
                  redirection={redirection}
                />
              ))
            )}
          </div>
        </div>

        {/* Add button */}
        {!path.includes(INSTALLER_ROUTE) && (
          <button
            className="bg-[#101828] text-white p-[10px] rounded-[10px] flex items-center justify-center gap-2 font-bold"
            onClick={() => setShowModal(true)}
          >
            <AddIcon color="#fff" />
            Ajouter un contrat
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddContratModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          installateurId={id ? Number(id) : Number(user?.id)}
        />
      )}
    </>
  );
}
