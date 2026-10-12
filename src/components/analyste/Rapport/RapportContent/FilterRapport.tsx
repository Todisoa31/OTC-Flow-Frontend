'use client';
import { useEffect, useState } from "react";
import { SelectValue } from "@/types/inputType";
import { TYPE_DOSSIER } from "@/constants/records";
import { useFilter } from "@/providers/FilterProvider";
import { getUsersV2 } from "@/api/user";
import isEqual from "lodash.isequal";
import { UserTypeOutput } from "@/types/userType";
import { getFile } from "@/utils/getFile";
import Select from "@/components/inputs/Select";
import Input from "@/components/inputs/Input";
import { ROLE_INSTALLER } from "@/constants/userConst";


const FilterRapport = () => {
  const { filters, setFilters } = useFilter();
  const [searchText, setSearchText] = useState<string>("");
  
  const [installateurOption, setInstallateurOption] = useState<
    { value: number; label: string; image: string }[]
  >([]);

  const handleChangeFilters = (key: string, value: SelectValue) => {
    if (typeof value === "string" || "number" === typeof value) {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        [key]: value,
      }));
    }
  };
  const handleChangeSearchText = (value: string) => {
    setSearchText(value);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search_text: value,
    }));
  };


  const handleGetTeamReferent = async () => {
    try {
      const response = await getUsersV2({ role: ROLE_INSTALLER });
      const user = response.users;
      const itemsPage: { value: number; label: string; image: string }[] =
        user.map((item: UserTypeOutput) => ({
          value: item.id,
          label: `${item.firstname} ${item.lastname}`,
          image: item.photo_profil
            ? getFile(item.photo_profil)
            : "/images/usProfil.jpg",
        }));

      setInstallateurOption((prev) => {
        // Comparer rapidement la longueur et les IDs (ou stringify si petit)
        const same = isEqual(prev, itemsPage);

        if (!same) {
          return itemsPage;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleGetTeamReferent();
  }, [installateurOption]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5">
      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <div className="flex-1 min-h-10 h-auto px-3.5 bg-white rounded-[10px] flex justify-start items-center gap-2.5">
          <div className="justify-start text-dark-blue text-xs font-bold whitespace-nowrap">
            Installateur :
          </div>
          <Select
            multiple={true}            
            search={false}
            value={
              filters.installateur
                ? String(filters.installateur).split(",").map(Number) // string[] -> number[]
                : []
            }
            onChange={(value) => {
              const selectedNumbers = (value as string[]).map(Number);
              handleChangeFilters("installateur", selectedNumbers.join(","));
            }}
            options={installateurOption}
            placeholder="Aucun"
            width="w-[95%]"
            className="bg-transparent w-full"
          />
        </div>
        <div className="flex-1 h-10 px-3.5 bg-white rounded-[10px] flex justify-start items-center gap-2.5">
          <div className="justify-start text-dark-blue text-xs font-bold whitespace-nowrap">
            Beneficiaire :
          </div>
          <Select
            multiple={false}
            search={false}
            value={filters.beneficiaire as SelectValue}
            onChange={(value) => handleChangeFilters("beneficiaire", value)}
            options={installateurOption}
            placeholder="Bénéficiaire"
            width="w-full"
            className="bg-transparent w-full"
          />
        </div>
        <div className="w-48 h-10 flex justify-start items-center gap-2.5">
          <Select
            multiple={false}
            search={false}
            value={filters.type_dossier as SelectValue}
            onChange={(value) => handleChangeFilters("type_dossier", value)}
            options={TYPE_DOSSIER}
          />
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <div className="flex-1 h-10 flex justify-start items-center gap-2.5">
          <Input
            placeholder="Rechercher un dossier"
            width=""
            height="h-[40px]"
            value={searchText}
            onChange={(value) => handleChangeSearchText(value)}
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
        </div>
      </div>
    </div>
  );
};

export default FilterRapport;
