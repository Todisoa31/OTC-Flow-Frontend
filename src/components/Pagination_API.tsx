import NextIcon from "@/assets/icons/pagination/NextIcon";
import NextIconX2 from "@/assets/icons/pagination/NextIconX2";
import { PaginationType } from "@/types/general";

type Props = {
  pagination: PaginationType;
  setPagination: (value: PaginationType) => void;
};

export default function PaginationApi({ pagination, setPagination }: Props) {
  const { page, total_pages, per_page, total_entries } = pagination;

  const goToPage = (p: number) => {
    if (p < 1 || p > total_pages) return;
    setPagination({ ...pagination, page: p });
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    setPagination({ ...pagination, page: 1, per_page: newPerPage });
  };

  const getVisiblePages = () => {
    const start = Math.max(1, page - 2);
    const end = Math.min(total_pages, start + 4);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startItem = total_entries === 0 ? 0 : (page - 1) * per_page + 1;
  const endItem = Math.min(page * per_page, total_entries);

  return (
    <div className="w-full sticky bottom-0 p-4 rounded-[15px] bg-white flex justify-between items-center">
      <div className="flex gap-2 items-center">
        { page > 5 && <button onClick={() => goToPage(1)} disabled={page === 1} className="rotate-180"><NextIconX2 /></button>}
        { page !== 1 && <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="rotate-180"><NextIcon /></button>}

        {getVisiblePages().map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-[40px] h-[40px] flex items-center justify-center rounded-[10px] text-[12px] ${p === page ? "bg-[#65A5BF] text-white" : "bg-[#646E811A] text-[#646E81]"}`}
          >
            {p}
          </button>
        ))}

        {total_pages !== page && (
          <div className=" flex gap-2 items-center pl-[30px]">
            <span>...</span>
            <button
              onClick={() => goToPage(total_pages)}
              className={`w-[40px] h-[40px] flex items-center justify-center rounded-[10px] text-[12px] ${total_pages === page ? "bg-[#65A5BF] text-white" : "bg-[#646E811A] text-[#646E81]"}`}
            >
              {total_pages}
            </button>
          </div>
        )}

        <button onClick={() => goToPage(page + 1)} disabled={page === total_pages}><NextIcon /></button>
        <button onClick={() => goToPage(total_pages)} disabled={page === total_pages}><NextIconX2 /></button>
      </div>

      <div className="flex items-center gap-2 text-black">
        <label htmlFor="perPage" className="text-sm text-gray-600">
          {startItem} à {endItem} sur {total_entries}
        </label>
        <select
          id="perPage"
          value={per_page}
          onChange={handlePerPageChange}
          className="border rounded px-2 py-1 outline-none text-gray-600"
        >
          {[10, 20, 50, 100].map((value) => (
            <option key={value} value={value} className="text-sm text-gray-600">{value}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
