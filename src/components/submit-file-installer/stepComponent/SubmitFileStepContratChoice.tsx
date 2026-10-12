import { getContratApi } from "@/api/contrat";
import { getUserInfo } from "@/api/user";
import { useEffect, useState } from "react";
import ContractChoice from "../contrat/ContractChoice";
import { ContractType } from "@/types/contratType";
import { useRecords } from "@/providers/CreateRecordProvider";

const SubmitFileStepContratChoice = () => {
  const [contrats, setContrats] = useState<ContractType[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const {
    contratId,
    setPayload,
    setPayloadMasse
  } = useRecords();

  const getContracts = async () => {
    try {
      setLoading(true);
      const idUser = await getUserInfo();
      const response = await getContratApi(idUser?.id);
      setContrats((response.contrats  as ContractType[]).filter(c => c.status === 'actif') || null);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getContracts();
  }, []);


  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      contrat_id: contratId.code,
    }));

    setPayloadMasse((prev) => ({
      ...prev,
      contrat_id: contratId.code,
    }));
  }, [contratId]);
  return (
    <div className="self-stretch p-5 relative flex flex-col gap-7">
      <div className="justify-start text-slate-600 text-sm font-bold leading-none">
        Veuillez choisir votre contrat avant d'envoyer les dossiers
      </div>
      {contrats && (
        <ContractChoice contrats={contrats} loading={loading} />
      )}
    </div>
  )
};

export default SubmitFileStepContratChoice;
