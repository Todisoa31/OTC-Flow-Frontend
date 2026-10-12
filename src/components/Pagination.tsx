import { useFilter } from "@/providers/FilterProvider";
import Select from "@/components/inputs/Select";
import { SelectValue } from "@/types/inputType";
import { JSX } from "react";
import { NUMBER_ITEMS_PAGE } from "@/constants/records";

interface PaginationProps {
    totalPages: number;
}

function Pagination(props: PaginationProps) {
    const { totalPages } = props
    const { filters, setFilters } = useFilter();
    const currentPage = Number(filters.page);

    // Handle the click event when changing pages
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters((prev) => ({
                ...prev,
                page: page
            }));
        }
    };

    const handleChangeItemsPerPage = (nbRecord?: number) =>{
      setFilters((prev) => ({
        ...prev,
          per_page: nbRecord ? Number(nbRecord) : 10
      }));  
    }

    // Render page numbers with ellipsis for large ranges
    const renderPageNumbers = () => {
        const pages: Array<JSX.Element> = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                const isCurrent = i === currentPage;
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-[40px] h-[40px] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5 ${isCurrent ? 'bg-primary-blue' : 'bg-gray'
                            }`}
                    >
                        
                        <span className={`${isCurrent ? 'text-white font-bold leading-[18px]':'text-grey font-medium'} justify-start text-xs`}>{i}</span>
                    </button>
                );
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                pages.push(
                    <span key={`ellipsis-${i}`} className="mx-1">
                        ...
                    </span>
                );
            }
        }
        return pages;
    };


    const setNumbersItemsByPage= () => {
      return (
        <Select
            multiple={false}
            search={false}
            value={filters.per_page as SelectValue}
            onChange={(value) => handleChangeItemsPerPage(Number(value))}
            options={NUMBER_ITEMS_PAGE}
            placeholder="Nombre d'item par page"
            className="bg-primary-blue w-auto"
            dropdownBackgroundColor= '#f0f9ff'
          />
      )
    }

    return (
        <div className="self-stretch sticky bottom-[0px] p-[15px] bg-white rounded-[15px] inline-flex justify-between items-center gap-[15px]">
          <div>
            {renderPageNumbers()}
          </div>
          <div>
            {setNumbersItemsByPage()}
          </div>
        </div>
    )
}

export default Pagination