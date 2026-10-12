import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFilter } from "@/providers/FilterProvider";
import { SelectValue } from "@/types/inputType";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "../inputs/Input";
import Select from "../inputs/Select";
import { ROLE_USER, STATUS_USER } from "@/constants/records";
import { GetUsersParamsType, UserStatus } from "@/types/userType";
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
type UserFilterProps = {
  SetParams: Dispatch<SetStateAction<GetUsersParamsType>>;
  params: GetUsersParamsType
}
const UserFilters = ({ params, SetParams }: UserFilterProps) => {
  const { filters, setFilters } = useFilter();
  const [searchText, setSearchText] = useState<string>("");


  // const debouncedValue = useDebounce(searchText as string, 1000);


  // const handleChangeSearchText = (value: string) => {
  //   setSearchText(value);
  // };


  // useEffect(() => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     page: 1,
  //     search_text: debouncedValue
  //   }));
  // }, [debouncedValue]);

  // const handleChangeFilters = (key: string, value: SelectValue) => {
  //   if (typeof value === "string") {
  //     setFilters((prev) => ({
  //       ...prev,
  //       page: 1,
  //       [key]: value,
  //     }));
  //   }
  // };

  const handleSearchtext = (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    SetParams({...params, search_text: searchText});
  }

  useEffect(() => {
    if (searchText.trim() === "") {
    SetParams({...params, search_text: ""});
    }
  }, [searchText]);


  return (
    <div>
      <div className="self-stretch justify-start items-center flex-col">
        {/* Add your filter components here */}
        <div className="flex flex-row gap-5">
          {/* Example filter components */}
          <form onSubmit={handleSearchtext} className="bg-white rounded-[10px] flex items-center justify-between h-[45px] w-[30%] px-2">
            <input
              type="search"
              className="outline-none border-none bg-transparent w-full text-grey text-[12px]"
              placeholder="Rechercher..."
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
            value={params.role as SelectValue}
            onChange={(value) => SetParams({ ...params, role: String(value) })}
            options={ROLE_USER}
            placeholder="Tous les roles"
          />
          <Select
            multiple={false}
            search={false}
            value={params.status as SelectValue}
            onChange={(value) => SetParams({...params, status: String(value) as UserStatus})}
            options={STATUS_USER}
            placeholder="Tous les status"
          />
        </div>
      </div>
      {/* Add any additional components or elements you need here */}
    </div>
  );
};

export default UserFilters;
