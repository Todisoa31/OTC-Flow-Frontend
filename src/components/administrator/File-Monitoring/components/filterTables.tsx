"use client";

import SearchIcon2 from "@/assets/icons/SearchIcon2";
import Select from "@/components/inputs/Select";
import UserSelect from "@/components/inputs/UserSelect";
import { MERGED_STATUSES_OPTIONS, TYPE_DOSSIER } from "@/constants/records";
import { ROLE_INSTALLER } from "@/constants/userConst";
import { GlobalParamsType } from "@/types/folderType";

type Props = {
  params: GlobalParamsType;
  setParams: (newParams: Partial<GlobalParamsType>) => void;
};

// Helpers pour conversion date
const formatDateForInput = (date?: string) =>
  date ? date.split("/").reverse().join("-") : "";

const formatDateForParams = (value: string) => {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export default function HeaderFileMonitoring({  params, setParams }: Props) {
  // Centraliser toutes les mises à jour du state + provider
  const updateParams = (newParams: Partial<GlobalParamsType>) => {
    setParams({ ...params, ...newParams });
  };

  const handleSearchTextSubmit = (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        {/* Recherche */}
        <form
          onSubmit={handleSearchTextSubmit}
          className="bg-white rounded-[10px] flex items-center justify-between h-[45px] w-[30%] px-2"
        >
          <input
            type="search"
            className="outline-none border-none bg-transparent w-full text-grey text-[12px]"
            placeholder="Rechercher un dossier"
            value={params.search_text || ""}
            onChange={(e) => updateParams({ search_text: e.target.value })}
          />
          <button onClick={handleSearchTextSubmit}>
            <SearchIcon2 />
          </button>
        </form>

        {/* Statut */}
        <Select
          options={MERGED_STATUSES_OPTIONS}
          onChange={(value) => updateParams({ status: String(value) })}
          value={params.status ?? ""}
          multiple={false}
          search={false}
          placeholder="Tous les statuts"
        />

        {/* Type de dossier */}
        <Select
          options={TYPE_DOSSIER}
          onChange={(value) => updateParams({ type_dossier: String(value) })}
          value={params.type_dossier ?? ""}
          multiple={false}
          search={false}
          placeholder="Tous les types de dossier"
        />

        {/* Dates */}
        <div className="bg-white rounded-[10px] flex gap-2 px-2 h-[45px] items-center justify-evenly text-[12px] text-[#3A5F6E]">
          <input
            type="date"
            value={formatDateForInput(params.start_date)}
            onChange={(e) => updateParams({ start_date: formatDateForParams(e.target.value) })}
          />
          <span>|</span>
          <input
            type="date"
            value={formatDateForInput(params.end_date)}
            onChange={(e) => updateParams({ end_date: formatDateForParams(e.target.value) })}
          />
        </div>
      </div>

      {/* Champ utilisateur */}
      <UserSelect
        value={params.installateur ? params.installateur.split(",").map(Number) : []}
        setUser={(list) => updateParams({ installateur: (list as number[]).join(",") })}
        role={ROLE_INSTALLER}
        label="Installateur"
      />
    </div>
  );
}
