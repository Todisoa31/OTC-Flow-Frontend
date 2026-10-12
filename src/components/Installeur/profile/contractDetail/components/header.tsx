import DownloadIcon from "@/assets/icons/DownloadIcon";
import { ContractTypeDetail } from "@/types/contratType";
import { DownloadFile } from "@/utils/download";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

type Props = {
  contract: ContractTypeDetail | null;
};

function getRemainingPeriod(contractDate?: string | null) {
  const endDate = dayjs(contractDate);
  const today = dayjs();

  if (!contractDate || !endDate.isValid()) {
    return { monthsRemaining: 0, daysRemaining: 0, months: 0, days: 0 };
  }

  let tempDate = today.clone();
  let months = 0;

  while (true) {
    const nextMonth = tempDate.add(1, "month");
    if (!nextMonth.isSameOrBefore(endDate)) break;

    months++;
    tempDate = nextMonth;
  }

  const days = endDate.diff(tempDate, "day");

  return {
    monthsRemaining: endDate.diff(today, "month"),
    daysRemaining: endDate.diff(today, "day"),
    months,
    days,
  };
}

function getContractStatus(monthsRemaining: number, daysRemaining: number) {
  if (monthsRemaining < 0 || (monthsRemaining === 0 && daysRemaining < 0)) {
    return { text: "Contrat expiré", color: "text-red-600" };
  }
  if (monthsRemaining === 0 && daysRemaining === 0) {
    return { text: "Contrat expiré aujourd'hui", color: "text-red-600" };
  }
  if (monthsRemaining === 0 && daysRemaining === 1) {
    return { text: "Contrat expire demain", color: "text-yellow-600" };
  }
  return { text: "", color: "text-[#59b595]" };
}

function getRemainingColor(months: number, days: number) {
  if ((months <= 1 && days <= 1) || (months === 0 && days === 0)) {
    return "text-red-600";
  }
  if (months === 0 && days <= 5) {
    return "text-yellow-600";
  }
  return "text-[#59b595]";
}

export default function ContractHeader({ contract }: Props) {
  const { monthsRemaining, daysRemaining, months, days } = getRemainingPeriod(contract?.date_livraison);
  const { text: contractStatus, color: contractStatusColor } = getContractStatus(monthsRemaining, daysRemaining);
  const remainingTextColor = getRemainingColor(months, days);

  const renderDuration = () => {
    if (contractStatus) {
      return (
        <span className={`font-semibold ${contractStatusColor}`}>
          | {contractStatus} |
        </span>
      );
    }

    if (monthsRemaining >= 0) {
      return (
        <span className={`font-bold ${remainingTextColor}`}>
          {months > 0 && `| Restant : ${months} mois`}{" "}
          {days > 0 && `et ${days} jour${days > 1 ? "s" : ""} |`}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="flex shadow-md">
      <div className="w-[70%] p-[30px] flex justify-between items-start bg-[#FFFFFF66]">
        <div className="flex flex-col gap-1">
          <div className="text-[16px] text-[#101828] font-bold">{contract?.contrat_name ?? ""}</div>
          <div className="text-[16px] text-[#646E81] font-bold">
            ID : <span className="text-[#101828] font-bold">{contract?.contratID ?? ""}</span>
          </div>
          <div className="text-[#65A5BF] text-[16px]">{contract?.contrat_nature ?? ""}</div>
          <div className="text-[#646E81] text-[14px] flex items-center gap-2">
            Type : <span className="text-[#101828] font-bold">{contract?.contrat_type ?? ""}</span>
          </div>
          <div className="text-[#646E81] text-[14px] flex items-center gap-2">
            RAI : <span className="text-[#101828] font-bold">{contract?.compte_oblige_nom_societe ?? ""}</span>
          </div>
          <div className="text-[#646E81] text-[14px] flex items-center gap-2">
            Dispositif : <span className="text-[#101828] font-bold">{contract?.mf_dispositif_cee ?? ""}</span>
          </div>
          <div className="text-sm leading-[18px]">
            <span className="text-[#646E81] font-medium">Durée : </span>
            <span className="text-[#101828] font-bold">{contract?.duree_contrat_en_mois} mois </span>
            {renderDuration()}
          </div>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-[#101828] rounded-[10px] text-white p-[10px]"
          onClick={() => {
            if (contract?.file.file) {
              DownloadFile(contract.file.file, contract.file.name);
            }
          }}
        >
          <DownloadIcon fill="#fff" />
          Télécharger le contrat
        </button>
      </div>

      <div className="w-[30%] flex flex-col gap-2 p-[30px] border border-white bg-[#E4E4E466]">
        <div className="text-[#101828] text-[16px] font-bold">Livraison</div>
        <div className="text-[#101828] text-[14px] flex justify-between items-center">
          <span className="font-bold">Partiellement livré</span>
          <span>({contract?.percentage_delivery ?? 0}%)</span>
        </div>
        <div className="rounded-full w-full bg-white">
          <div
            className="p-1 bg-[#65A5BF] rounded-full"
            style={{ width: `${contract?.percentage_delivery ?? 0}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-[#353944]">{contract?.total_classique_gwhc ?? 0}</span>
          <span className="text-[#65A5BF]">{contract?.volume_total_gwhc ?? 0}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#646E81]">GWh cumac</span>
          <span className="text-[#646E81]">GWh cumac</span>
        </div>
      </div>
    </div>
  );
}