"use client";

import SearchIcon2 from "@/assets/icons/SearchIcon2";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
    value?: string;
    setSearchValue: Dispatch<SetStateAction<string>>
};

export default function SearchDiscussion({ value, setSearchValue }: Props) {
    const [text, setText] = useState('');

    const onSearch = () => {
        setSearchValue(text);
    };

    useEffect(() => {
        if (text.trim() === '') {
            setSearchValue('');
        }
    },[setSearchValue, text])

    return (
        <div className=" flex items-center bg-white rounded-[10px] p-[12px] w-full shadow-sm">
            <input
                type="search"
                className="flex-1 outline-none border-none text-sm text-black-secondary placeholder-gray-400"
                placeholder="Rechercher un utilisateur..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={onSearch}>
                <SearchIcon2 />
            </button>
        </div>
    )
}