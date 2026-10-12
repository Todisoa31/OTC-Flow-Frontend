import { useEffect, useState } from "react";
import { getContratInfo } from "@/api/contrat"; 

type DeliveryData = {
  volume_total_gwhc: number;
  total_classique_gwhc: number;
  percentage_delivery: number;
};

export default function Deliveries({ contratId }: { contratId: number }) {
  const [data, setData] = useState<DeliveryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await getContratInfo(contratId);
            if (!result) {
                throw new Error("Aucune donnée trouvée pour ce contrat");
            }
            setData({
                volume_total_gwhc: result?.mf_volume_total_gwhc ?? 0,
                total_classique_gwhc: result?.total_classique_gwhc ?? 0,
                percentage_delivery: result?.percentage_delivery ?? 0,
            });
        } catch (error) {
            console.error("Erreur récupération données de livraison :", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [contratId]);

  if (loading || !data) return null;

  const { volume_total_gwhc, total_classique_gwhc, percentage_delivery } = data;
  const percentage = Math.min(Math.max(percentage_delivery, 0), 100);

  return (
    <div className="w-full flex flex-col gap-2 p-[10px] bg-[#E4E4E466] rounded-lg">
      <div className="text-[#101828] text-[16px] font-semibold">Livraison</div>
      <div className="text-[#101828] text-[14px] flex justify-between items-center">
        <span className="font-bold">
          {percentage >= 100
            ? "Totalement livré"
            : percentage > 0
            ? "Partiellement livré"
            : "Pas encore livré"}
        </span>
        <span>({percentage}%)</span>
      </div>
      <div className="rounded-full w-full bg-white h-[12px]">
        <div
          className="h-full bg-[#65A5BF] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[14px]">
        <span className="text-[#353944]">{total_classique_gwhc}</span>
        <span className="text-[#65A5BF]">{volume_total_gwhc}</span>
      </div>
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-[#646E81]">GWh cumac</span>
        <span className="text-[#646E81]">GWh cumac</span>
      </div>
    </div>
  );
}