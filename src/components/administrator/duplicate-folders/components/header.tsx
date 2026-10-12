import SearchIcon2 from "@/assets/icons/SearchIcon2";
import Select from "@/components/inputs/Select";
import { TYPE_DOSSIER } from "@/constants/records";
import { DuplicateFilterType } from "@/types/general";
import { filter } from "jszip";
import { Dispatch, SetStateAction } from "react";

type Props = {
    filter: DuplicateFilterType;
    setFilter: Dispatch<SetStateAction<DuplicateFilterType>>;
};

export default function HeaderDuplicateFolder({ filter, setFilter }: Props) {
    return (
        <div className=" flex flex-col gap-4">
            <h2 className=" text-[##101828] text-[24px] font-bold">Dossiers doublons</h2>
            <div className=" flex items-center gap-4">
                <div className=" flex items-center p-[15px] rounded-[10px] h-[42px] w-[500px] bg-white justify-between">
                    <input type="text"
                        className=" text-[12px] outline-none w-full"
                        placeholder="Rechercher un dossier"
                        value={filter.searchText}
                        onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
                    />
                    <button>
                        <SearchIcon2 />
                    </button>
                </div>

                <Select
                    options={TYPE_DOSSIER}
                    onChange={(value) => setFilter({ ...filter, folder_type: String(value) })}
                    value={filter.folder_type ?? ""}
                    multiple={false}
                    search={false}
                    placeholder="Tous les types de dossier"
                />

                <input type="date" className=" text-[12px] h-[43px] px-[15px] rounded-[10px] w-[200px]"
                    onChange={(e) => {
                        const [year, month, day] = e.target.value.split("-");
                        const formattedDate = `${day}/${month}/${year}`;
                        setFilter({ ...filter, date_submission: formattedDate });
                    }}
                />
            </div>
        </div>
    )
}