"use client";

import TitleWithBack from "@/components/TitleWithBack";
import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import ContractHeader from "./components/header";
import ContractContent from "./components/body";
import { getContractDetail } from "@/api/contrat";
import { useParams } from "next/navigation";
import { ContractTypeDetail } from "@/types/contratType";
import CenterSpinner from "@/components/loader/CenterSpinner";
import SideAvenant from "@/components/avenant/SideAvenant";
import { UseAvenantStore } from "@/stores/AvenantStore";

export default function ContractDetailPage() {
    const { setTitle } = useTitle();
    const { contract_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState<ContractTypeDetail | null>(null);
    const { updateByAvenant } = UseAvenantStore();

    const getContractD = async () => {
        setLoading(true);

        try {
            const res = await getContractDetail(Number(contract_id));
            setContract(res);

        } catch {
            console.error("Une erreur est survenur");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTitle(<TitleWithBack title="Contrat" />);
        getContractD();
    }, [updateByAvenant]);

    return (
        <div className=" flex w-full">
            <div className=" w-[80%] ">
                {loading ? <CenterSpinner center /> :
                    <div className=" flex flex-col gap-4 w-full h-[88vh] overflow-y-auto">
                        <ContractHeader contract={contract} />
                        <ContractContent contract={contract} />
                    </div>
                }
            </div>
            <div className=" w-[20%]">
                <SideAvenant />
            </div>
        </div>
    )
}