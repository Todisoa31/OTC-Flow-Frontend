import { useFilter } from "@/providers/FilterProvider";
import Select from "@/components/inputs/Select";
import { SelectValue } from "@/types/inputType";
import { NUMBER_ITEMS_PAGE } from "@/constants/records";

import CaretLeft2Icon from "@/assets/icons/CaretLeft2Icon";
import DirectionRightIcon from "@/assets/icons/DirectionIconLeft";
import CaretRightIcon from "@/assets/icons/CaretRightIcon";

interface PaginationProps {
  totalPages: number;
  totalItems?: number; // totalItems devient optionnel
}

function Pagination({ totalPages, totalItems: propsTotalItems }: PaginationProps) {
  const { filters, setFilters, totalItems: contextTotalItems } = useFilter();

  const currentPage = Number(filters.page || 1);
  const perPage = Number(filters.per_page || 10);

  // Priorité au props.totalItems, sinon fallback sur context
  const totalItems = propsTotalItems ?? contextTotalItems ?? 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setFilters((prev) => ({ ...prev, page }));
    }
  };

  const handleChangeItemsPerPage = (nbRecord?: number) => {
    setFilters((prev) => ({
      ...prev,
      per_page: nbRecord || 10,
      page: 1,
    }));
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        const isCurrent = i === currentPage;
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-[40px] h-[40px] rounded-[10px] inline-flex items-center justify-center ${
              isCurrent ? "bg-primary-blue text-white font-bold" : "bg-gray-100 text-gray-600"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pages.push(
          <span key={`ellipsis-${i}`} className="mx-1 text-gray-500">
            ...
          </span>
        );
      }
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalItems);

  return (
    <div className="w-full sticky bottom-0 p-4 bg-white rounded-[15px] flex flex-wrap items-center justify-between gap-4 border-t">
      {/* Navigation */}
      <div className="flex items-center gap-2 flex-wrap">
        {currentPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 rounded-[10px] bg-black text-white hover:bg-gray-900 flex items-center justify-center"
            >
              <span className="transform rotate-180">
                <DirectionRightIcon />
              </span>
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-10 h-10 rounded-[10px] bg-black text-white hover:bg-gray-900 flex items-center justify-center"
            >
              <CaretLeft2Icon />
            </button>
          </>
        )}

        {renderPageNumbers()}

        {currentPage < totalPages && (
          <>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-10 h-10 rounded-[10px] bg-black text-white hover:bg-gray-900 flex items-center justify-center"
            >
              <CaretRightIcon />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 rounded-[10px] bg-black text-white hover:bg-gray-900 flex items-center justify-center"
            >
              <DirectionRightIcon />
            </button>
          </>
        )}
      </div>

      {/* Infos & Select */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {startIndex + 1} à {endIndex} sur {totalItems}
        </span>

        <div className="flex w-20">
          <Select
            multiple={false}
            search={false}
            value={filters.per_page as SelectValue}
            onChange={(value) => handleChangeItemsPerPage(Number(value))}
            options={NUMBER_ITEMS_PAGE}
            placeholder="Éléments par page"
            className="w-auto bg-white border border-gray-300 text-sm"
            dropdownBackgroundColor="#f0f9ff"
          />
        </div>
      </div>
    </div>
  );
}

export default Pagination;
