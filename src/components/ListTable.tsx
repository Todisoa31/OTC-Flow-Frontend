import { cn } from "@/utils/tailwind";
import { useState } from "react";
import CheckBox from "./inputs/CheckBox";
import RecordStatusesButton from "./inputs/RecordStatusesButton";

type Header = { key: string; label: string; className?: string; imageKey?: string };

type ListAsTableProps = {
  headers: Header[];
  data: any[];
  originalData?: any[];
  title?: string;
  editableStatus?: boolean;
  isCofrac?: boolean;
  checkBox?: boolean;
  onClick?: (item: any) => void;
  onCheck?: (ids: number[]) => void;
};

function ListAsTable({
  headers,
  data,
  originalData,
  onClick,
  onCheck,
  editableStatus,
  isCofrac,
  checkBox
}: ListAsTableProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  const handleCheck = (id: number) => {
    setCheckedRows((prev) => {
      const newCheckedRows = prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id];
      onCheck?.(newCheckedRows);
      return newCheckedRows;
    });
  };

  const handleCheckAll = () => {
    if (checkedRows.length === data.length) {
      setCheckedRows([]);
      onCheck?.([]);
    } else {
      const allIds = data.map((item) => item.id);
      setCheckedRows(allIds);
      onCheck?.(allIds);
    }
  };

  const handleClickItem = (item: any) => {
    if (onClick) {
      onClick(originalData ? originalData.find((i: any) => i.id === item.id) : item);
    }
    setSelectedRow(item.id);
  };

  const generateHeader = () => {
    return headers.map((header, index) => {
      const isFirstHeader = index === 0;
      return (
        <th
          key={header.key}
          className={cn("text-left text-[#646d81] text-xs font-medium p-2", header.className)}
        >
          <div
            className={cn(
              "flex w-full items-center gap-2.5",
              isFirstHeader ? "pl-3.6" : "",
              header.className
            )}
          >
            {checkBox && isFirstHeader ? (
              <CheckBox
                id={header.key}
                checked={data.length > 0 && checkedRows.length === data.length}
                onChange={handleCheckAll}
                stopPropagation={true}
                size="small"
              />
            ) : null}
            {header.label}
          </div>
        </th>
      );
    });
  };

  const generateColumn = (item: any) => {
    return headers.map((header: any, index: number) => {
      const isFirstColumn = index === 0;
      const isLastColumn = index === headers.length - 1;
      const isActive = selectedRow === item.id;
      const isStatusColumn = header.key === "status";
      const isControleTypeColumn = header.key === "controlType";

      return (
        <td
          key={header.key}
          className={cn(
            "relative h-15 text-[#3a5f6e] text-xs font-medium break-all bg-[#fefefe]/40",
            header.className,
            isFirstColumn ? "rounded-l-3.6 pl-3.6" : "",
            isLastColumn ? "rounded-r-3.6" : "",
            isActive && isFirstColumn
              ? "border-l-2 border-t-2 border-b-2 border-l-[#65a5bf] border-t-[#65a5bf] border-b-[#65a5bf]"
              : isActive && "border-t-2 border-b-2 border-t-[#65a5bf] border-b-[#65a5bf]",
            isActive && isLastColumn
              ? "border-r-2 border-t-2 border-b-2 border-l-none border-r-[#65a5bf] border-t-[#65a5bf] border-b-[#65a5bf]"
              : isActive && "border-t-2 border-b-2 border-t-[#65a5bf] border-b-[#65a5bf]"
          )}
        >
          <div
            className={cn(
              "flex items-center relative max-h-15 gap-3.6 p-2 break-all",
              isStatusColumn ? "justify-end" : "overflow-hidden"
            )}
          >
            {checkBox && isFirstColumn ? (
              <CheckBox
                id={item.id}
                checked={checkedRows.includes(item.id)}
                onChange={() => handleCheck(item.id)}
                stopPropagation={true}
                size="small"
              />
            ) : null}
            {header.imageKey && (
              <img
                alt=""
                className="inline-block size-7.5 rounded-5 mr-2"
                src={item[header.imageKey] ?? "/images/usProfil.jpg"}
              />
            )}

            {isStatusColumn ? (
              <RecordStatusesButton
                status={item[header.key]}
                className="!h-7.5 ml-auto"
                editable={editableStatus}
                id={item.id}
                isCofrac={isCofrac}
              />
            ) : isControleTypeColumn ? (
              <span className="bg-[#3A5F6E1A] p-2.5 rounded-5 min-w-max">{item[header.key]}</span>
            ) : (
              item[header.key]
            )}
          </div>
        </td>
      );
    });
  };

  return (
    <div className="self-stretch grow flex flex-col gap-7.5">
      <table className="relative z-0 w-full rounded-15 backdrop-blur-[10px] overflow-hidden border-spacing-y-4 border-separate">
        <thead>
          <tr className="bg-transparent">{generateHeader()}</tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "relative !h-15 z-0 hover:!z-10  rounded-15 bg-transparent shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px]",
                onClick ? "cursor-pointer" : "",
                `zz-[${data.length - 1 - rowIndex}]`,
                selectedRow === item.id ? "border-2 border-indigo-600" : ""
              )}
              style={{ zIndex: data.length - rowIndex }}
              onClick={() => handleClickItem(item)}
            >
              {generateColumn(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListAsTable;
