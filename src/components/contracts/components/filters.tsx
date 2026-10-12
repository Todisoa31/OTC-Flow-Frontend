"use client";

import { GetContratType } from "@/api/contrat";
import SearchIcon2 from "@/assets/icons/SearchIcon2";
import UserSelect from "@/components/inputs/UserSelect";
import Select from "@/components/inputs/Select";
import { CONTRACT_STATUS_OPTION } from "@/constants/records";
import { ContractFor, ContractListPayload } from "@/types/contratType";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ROLE_INSTALLER } from "@/constants/userConst";

type Props = {
    filter: ContractListPayload;
    setFilter: Dispatch<SetStateAction<ContractListPayload>>;
    contractFor: ContractFor
};

export default function Filters({ filter, setFilter, contractFor }: Props) {
    const [text, setText] = useState<string>("");
    const [installers, setInstallers] = useState<{ value: string; label: string }[]>([]);

    const [selectedInstaller, setSelectedInstaller] = useState<number[]>([])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFilter({ ...filter, search_text: text });
    };

    useEffect(() => {
        if (text === "") {
            setFilter({ ...filter, search_text: "" });
        }
    }, [text]);

    const getContratType = async () => {
        try {
            const res = await GetContratType();
            const data = res?.data;
            if (Array.isArray(data)) {
                const options = data.map((item: { id: string; name: string }) => ({
                    label: item.name,
                    value: item.name,
                }));
                setInstallers(options);
            };

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getContratType();
    }, []);

    useEffect(() => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            installateur: selectedInstaller.join(",")
        }));
    }, [selectedInstaller]);

    return (
        <div className=" flex flex-col gap-4">
            <h5 className=" text-[24px] font-bold text-[#101828]">Liste des contrats</h5>
            <div className=" flex items-center gap-4">
                <form onSubmit={handleSubmit} className=" h-[45px] bg-white p-[10px] flex w-[300px] rounded-[10px] xl:w-[400px] lg:w-[300px] md:w-[300px]">
                    <input
                        type="search"
                        placeholder="Rechercher un contrat / installateur"
                        className=" w-full h-full text-[12px] outline-none "
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button><SearchIcon2 /></button>
                </form>

                <Select
                    options={installers}
                    onChange={(value) => setFilter({ ...filter, contrat_type: String(value) })}
                    value={filter.contrat_type ?? ""}
                    multiple={false}
                    search={false}
                    placeholder="Type de contrat"
                />

                <Select
                    options={CONTRACT_STATUS_OPTION}
                    onChange={(value) => setFilter({ ...filter, status_contrat: String(value) })}
                    value={filter.status_contrat ?? ""}
                    multiple={false}
                    search={false}
                    placeholder="Status du contrat"
                />

                {
                    contractFor !== 'installer' &&
                    <UserSelect
                        value={selectedInstaller}
                        setUser={setSelectedInstaller}
                        role={ROLE_INSTALLER}
                        label="Installateur"
                    />
                }

            </div>
        </div>
    )
}