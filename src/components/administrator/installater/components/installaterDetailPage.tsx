"use client";

import Contrats from "./installaterDetails/contrats";
import OverViewInheader from "./installaterDetails/header";
import ContentOfTheDetail from "./installaterDetails/contentOfTheDetail";
// import ContractSide from "@/components/Installeur/profile/components/contract";
// import { useParams } from "next/navigation";

export default function InstallaterDetailsPages() {
    // const { id } = useParams();

    return (
        <div className=" flex w-full ">
            <div className=" w-[70%] h-[calc(100vh-95px)] overflow-y-auto px-8 py-8 ">
                <OverViewInheader />
                <ContentOfTheDetail />
            </div>
            <div className=" w-[30%] border h-[calc(100vh-95px)] overflow-y-auto">
                <Contrats />
            </div>
        </div>
    )
};