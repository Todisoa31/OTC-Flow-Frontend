"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchIcon2 from "@/assets/icons/SearchIcon2";
import Select from "@/components/inputs/Select";
import { GlobalParamsType } from "@/types/folderType";
import { TYPE_DOSSIER } from "@/constants/records";
import UserSelect from "@/components/inputs/UserSelect";
import { ROLE_INSTALLER } from "@/constants/userConst";

type Props = {
    setText: Dispatch<SetStateAction<string>>;
    params: GlobalParamsType;
    setParams: Dispatch<SetStateAction<GlobalParamsType>>
}

export default function HeaderFileMonitoring({ setText, params, setParams }: Props) {
    const [searchText, setSearchText] = useState<string>("");
    const [selectedInstaller, setSelectedInstaller] = useState<number[]>([])

    const handleSearchtext = (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        setText(searchText);
    }

    useEffect(() => {
        if (searchText.trim() === "") {
            setText("");
        }
    }, [searchText, setText]);

    useEffect(() => {
        setParams({
            ...params,
            installateur: selectedInstaller.join(",")
        });
    }, [selectedInstaller]);

    return (
        <div className="flex items-center gap-2 w-full">
            {/* Champ recherche */}
            <form onSubmit={handleSearchtext} className="bg-white rounded-[10px] flex items-center justify-between h-[45px] w-[30%] px-2">
                <input
                    type="search"
                    className="outline-none border-none bg-transparent w-full text-grey text-[12px]"
                    placeholder="Rechercher un dossier"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
                <button onClick={handleSearchtext}>
                    <SearchIcon2 />
                </button>
            </form>

            {/* Type de dossier */}
            <Select
                options={TYPE_DOSSIER}
                onChange={(value) => setParams({ ...params, type_dossier: String(value) })}
                value={params.type_dossier ?? ""}
                multiple={false}
                search={false}
                placeholder="Tous les types de dossier"
            />

            {/* Date */}
            <div className="bg-white rounded-[10px] flex gap-2 px-2 h-[45px] items-center justify-evenly text-[12px] text-[#3A5F6E]">
                <input
                    type="date"
                    name="start_date"
                    id="start_date"
                    onChange={(e) => {
                        const [year, month, day] = e.target.value.split("-");
                        const formattedDate = `${day}/${month}/${year}`;
                        setParams({ ...params, start_date: formattedDate });
                    }}
                />
                <span>|</span>
                <input
                    type="date"
                    name="end_date"
                    id="end_date"
                    onChange={(e) => {
                        const [year, month, day] = e.target.value.split("-");
                        const formattedDate = `${day}/${month}/${year}`;
                        setParams({ ...params, end_date: formattedDate });
                    }}
                />
            </div>

            <UserSelect
                value={selectedInstaller}
                setUser={setSelectedInstaller}
                role={ROLE_INSTALLER}
                label="Installateur"
            />
        </div>
    );
}