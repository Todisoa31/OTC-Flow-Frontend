"use client";

import { useTitle } from "@/providers/TitleProvider";
import { useEffect } from "react";
import ProfileContent from "./components/content";
import ContractSide from "./components/contract";

export default function ProfilePage() {

    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Mon compte")
    }, [])

    return (
        <div className=" flex w-full">
            <div className=" w-[70%]">
                <ProfileContent />
            </div>
            <div className=" w-[30%]">
                <ContractSide />
            </div>
        </div>
    )
}