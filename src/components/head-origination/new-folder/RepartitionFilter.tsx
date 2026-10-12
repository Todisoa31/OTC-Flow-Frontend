import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFilter } from "@/providers/FilterProvider";
import { SelectValue } from "@/types/inputType";
import { useDebounce } from "@/hooks/useDebounce";

import { TYPE_DOSSIER } from "@/constants/records";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import { getUsersV2 } from "@/api/user";
import isEqual from "lodash.isequal";
import { UserTypeOutput } from "@/types/userType";
import { GlobalParamsType } from "@/types/folderType";
import UserSelect from "@/components/inputs/UserSelect";
import { ROLE_INSTALLER } from "@/constants/userConst";

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
  params: GlobalParamsType;
  setParams: Dispatch<SetStateAction<GlobalParamsType>>
}

const RepartitionFilters = ({ params, setParams }: Props) => {
  const { filters, setFilters } = useFilter();
  const [searchText, setSearchText] = useState<string>("");
  const [installateurOption, setInstallateurOption] = useState<ItemPage[]>([]);
  const [dateCreation, setDateCreation] = useState<string>("");
  const [text, setText] = useState<string>('');
  const [selectedInstaller, setSelectedInstaller] = useState<number[]>([]);


  const debouncedValue = useDebounce(searchText as string, 1000);


  const handleChangeSearchText = (value: string) => {
    setSearchText(value);
  };


  const handleGetTeamReferent = async () => {
    try {
      const response = await getUsersV2({ role: ROLE_INSTALLER });
      const user = response.users;
      const itemsPage: ItemPage[] = user.map((item: UserTypeOutput) => ({
        value: item.id,
        label: `${item.firstname} ${item.lastname}`,
      }));

      setInstallateurOption((prev) => {
        const newOptions: ItemPage[] = [
          { value: null as unknown as number, label: "Tous les installateurs" }, // Ajout de l'option "Tous"
          ...itemsPage,
        ];

        const same = isEqual(prev, newOptions);

        if (!same) {
          return newOptions;
        }

        return prev;
      });


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setFilters({
      page: 1,
      per_page: 10,
    });
  }, []);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search_text: debouncedValue
    }));
  }, [debouncedValue]);

  // useEffect(() => {
  //   if (params.installateur === 0) {
  //     setParams({...params, installateur: null})
  //   }
  // }, [params]);

  useEffect(() => {
    handleGetTeamReferent();
  }, [installateurOption])

  const handleChangeFilters = (key: string, value: SelectValue) => {
    if (typeof value === "string" || "number" === typeof value) {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        [key]: value,
      }));
    }
  };


  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateCreation(value);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      date_creation: value,
    }));

    setParams({ ...params, start_date: value })
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setParams({ ...params, search_text: text });
  };

  useEffect(() => {
       handleChangeFilters("installateur", selectedInstaller.join(","));
       setParams({ ...params, installateur: selectedInstaller.join(",") });
  },[selectedInstaller]);

  return (
    <div className="w-full">
      <div className="self-stretch justify-start items-center flex-col">
        {/* Add your filter components here */}
        <div className="flex flex-row gap-5">
          <div className="self-stretch inline-flex flex-col justify-center items-start gap-5 w-full">
              <Input
                placeholder="Rechercher par nom de dossier"
                width=""
                height="h-[40px]"
                value={String(params.search_text)}
                onChange={(value) => setParams({ ...params, search_text: value })}
                className="text-xs text-black font-medium grow"
                rightIcon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z"
                      fill="#101828"
                    />
                  </svg>
                }
              />
            <div className="inline-flex justify-start items-start gap-5">
              <div className="flex-1 h-10 rounded-[10px] flex justify-start items-center gap-2.5">
                <Select
                  multiple={false}
                  search={false}
                  value={params.type_dossier as SelectValue}
                  onChange={(value) => {
                    handleChangeFilters("type_dossier", value)
                    setParams({ ...params, type_dossier: String(value) })
                  }}
                  options={TYPE_DOSSIER}
                  placeholder="Type de dossier"
                />
              </div>

              {/* <div className="flex-1 h-10 rounded-[10px] flex justify-start items-center gap-2.5">
                <Select
                  multiple={false}
                  search={false}
                  value={filters.contrat as SelectValue}
                  onChange={(value) => handleChangeFilters("type_dossier", value)}
                  options={TYPE_DOSSIER}
                  placeholder="Contrat"
                />
              </div> */}
              <div className="w-64 flex-1 h-10 px-3.5 bg-white rounded-[10px] flex justify-start items-center gap-2.5">
                <input placeholder="date de création" type="date" name="" id="" className="text-dark-blue text-xs font-medium w-full outline-none"
                  value={dateCreation}
                  onChange={handleChangeDate} />
              </div>

                <UserSelect
                    value={selectedInstaller}
                    setUser={setSelectedInstaller}
                    role={ROLE_INSTALLER}
                    label="Installateur"
                />
            </div>
          </div>
        </div>
      </div>
      {/* Add any additional components or elements you need here */}
    </div>
  );
};

export default RepartitionFilters;


