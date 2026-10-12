import DeleteIcon from "@/assets/icons/DeleteIcon";
import PencilWhiteIcon from "@/assets/icons/PencilWhiteIcon";
import { HEAD_ORIGINATION_ROUTE, INSTALLER_ROUTE } from "@/constants/routes";
import dayjs from "dayjs";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SectionTitleProps {
  title: string;
  onEdit?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  hasSelection?: boolean;
}

export const SectionTitle = ({ title, onEdit, onAdd, onDelete, hasSelection }: SectionTitleProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  const handleSelect = (action?: () => void) => {
    action?.();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const lowerTitle = title.toLowerCase();
  const isFicheOperation =
    lowerTitle.includes("fiche opération") ||
    lowerTitle.includes("modalité financière");
  const canShowButton =
    !pathname.includes(HEAD_ORIGINATION_ROUTE) &&
    !pathname.includes(INSTALLER_ROUTE);

  return (
    <div className="flex items-center justify-between group">
      {/* Titre */}
      <div className="text-[#101828] text-base font-bold leading-[18px]">
        {title}
      </div>

      {canShowButton &&
        (isFicheOperation ? (
          <div
            className="relative opacity-0 group-hover:opacity-100 transition"
            ref={menuRef}
          >
            <button
              onClick={hasSelection ? onDelete : handleMenuToggle}
              className={`text-white p-2 rounded hover:opacity-80 transition ${hasSelection ? "bg-[#f30404]  hover:border-[#f30404] hover:bg-[#f30404]" : "bg-[#101828]"}`}
            >
              {hasSelection ? <DeleteIcon color="white"/> : <PencilWhiteIcon />}
            </button>

            {!hasSelection && isMenuOpen && (
              <div className="absolute right-full top-0 ml-2 bg-white shadow-lg rounded-lg border border-gray-200 z-10 flex flex-col">
                <button
                  onClick={() => handleSelect(onEdit)}
                  className="px-4 py-2 text-sm text-gray-800 text-left rounded transition 
                            hover:border hover:border-[#65A5BF] hover:bg-blue-50 focus:border-[#65A5BF] focus:bg-blue-100"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleSelect(onAdd)}
                  className="px-4 py-2 text-sm text-gray-800 text-left rounded transition 
                            hover:border hover:border-[#65A5BF] hover:bg-blue-50 focus:border-[#65A5BF] focus:bg-blue-100"
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>
        ) : (
          onEdit && (
            <button
              onClick={onEdit}
              className="bg-[#101828] text-white p-2 rounded hover:opacity-80 transition opacity-0 group-hover:opacity-100"
            >
              <PencilWhiteIcon />
            </button>
          )
        ))}
    </div>
  );
};

export const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-start gap-[10px]">
    <div className="text-[#3A5F6E] text-xs font-medium">{label}</div>
    <div className="text-[#101828] text-xs font-bold leading-[18px]">{value}</div>
  </div>
);

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="p-5 h-full bg-[#FEFEFE]/40 shadow-md rounded-[10px] border border-white/70 backdrop-blur-[10px] flex gap-[15px]">
    {children}
  </div>
);

export const BlocColumn = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-[20px] w-[200px]">{children}</div>
);

export const BlocDoubleColumn = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-[20px] flex-1">{children}</div>
);

export const VolumeInfo = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-[#3A5F6E] text-sm font-medium leading-[18px]">{label}</span>
    <span className="text-[#101828] text-sm font-bold ml-1">{value}</span>
  </div>
);

// Fonction précise pour calculer les mois et jours restants
export const calculateRemainingTime = (endDate: dayjs.Dayjs, today: dayjs.Dayjs) => {
  let tempDate = today.startOf('day');
  let months = 0;

  while (tempDate.add(1, 'month').isSameOrBefore(endDate, 'day')) {
    tempDate = tempDate.add(1, 'month');
    months++;
  }

  const days = endDate.diff(tempDate, 'day');
  return { months, days };
};