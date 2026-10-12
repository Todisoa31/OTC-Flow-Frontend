import React, { useEffect, useState } from "react";
// import { useFilter } from "@/providers/FilterProvider";
import { SelectValue } from "@/types/inputType";
// import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import { STATUS_USER } from "@/constants/records";
import { InstallerpayloadType } from "@/types/installerTypes";
import SearchIcon2 from "@/assets/icons/SearchIcon2";

export type RoleUser = {
  value: string;
  label: string;
};

export type StatusUser = {
  value: string;
  label: string;
}
export type ItemPage = {
  value: number;
  label: string;
}

type Props = {
  payload: InstallerpayloadType;
  setPayload: (val: InstallerpayloadType) => void;
};

const InstallaterFilters = ({ payload, setPayload }: Props) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchtext = (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    setPayload({ ...payload, search_text: searchText });
  }

  useEffect(() => {
  if (searchText.trim() === "" && payload.search_text !== "") {
    setPayload({ ...payload, search_text: "" });
  }
}, [searchText]);


  return (
    <div>
      <div className="self-stretch justify-start items-center flex-col">
        <div className="flex flex-row gap-5">
          <form onSubmit={handleSearchtext} className="bg-white rounded-[10px] flex items-center justify-between h-[45px] w-[40%] px-2">
            <input
              type="search"
              className="outline-none border-none bg-transparent w-full text-grey text-[12px]"
              placeholder="Rechercher un installateur"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <button onClick={handleSearchtext}>
              <SearchIcon2 />
            </button>
          </form>
          <Select
            multiple={false}
            search={false}
            value={payload.status as SelectValue}
            onChange={(value: SelectValue) => setPayload({ ...payload, status: String(value) })}
            options={STATUS_USER}
            placeholder="Tous les status"
          />
        </div>
      </div>
    </div>
  );
};

export default InstallaterFilters;
