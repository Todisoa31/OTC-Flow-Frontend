"use client";

import { GetAuditLog } from "@/api/audit";
import CalendarIcon from "@/assets/icons/dashboard/CalendarIcon";
import ValidationRateIcon from "@/assets/icons/dashboard/ValidationRateIcon";
import ReloadIcon from "@/assets/icons/ReloadIcon";
import { ActivityLogType, AditHistoryOutputType } from "@/types/auditType";
import { formatTimestamp } from "@/utils/getHourMinute";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";


type CardType = {
    title: string;
    value: number;
    icon: React.ReactNode;
    option: "%" | "jrs";
};

export default function LastActions() {
    const [historiques, setHistoriques] = useState<ActivityLogType[]>([]);

    const fecthHistories = async () => {
        try {
            const res = await GetAuditLog({
                tablename: "Dossier",
                page: 1,
                per_page: 3
            });
            setHistoriques(res?.data)

        } catch (error) {

        }
    }

    useEffect(() => {
        fecthHistories();
    }, [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="col-span-1 md:col-span-2 border border-white p-[15px] rounded-[15px] bg-[#FFFFFF80] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ReloadIcon />
                        <div className="flex flex-col gap-1">
                            <span className="text-black text-[12px]">Dernières</span>
                            <span className="text-black text-[18px] font-bold">actions</span>
                        </div>
                    </div>
                    {/* <button className="flex items-center gap-2 py-2 px-3 bg-black shadow-xl rounded-[10px] text-white text-[12px]">
                        Voir l'historique
                        <ArrowRight />
                    </button> */}
                </div>
                <div className="mt-4 flex flex-col gap-3">
                    {historiques?.map((item) => (
                        <div key={item.id} className="shadow-xl bg-white rounded-[10px] p-[15px] w-full text-[12px] text-grey flex items-center justify-between">
                            <span>{item.description}</span>
                            <span>{formatTimestamp(item.timestamp)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-2 md:order-2 bg-[url('/images/bg-2.png')] bg-cover p-[15px] w-full rounded-[15px] flex flex-col gap-3">
                <Card title="Taux de validation" value={48} option="%" icon={<ValidationRateIcon />} />
            </div>
        </div>
    )
};

const Card = ({ icon, value, title, option }: CardType) => {
    return (
        <div className=" p-[10px] rounded-[15px] bg-black bg-opacity-50 flex flex-col border-2 border-grey backdrop-blur-sm h-full ">
            <div className=" flex gap-3 justify-between h-full items-start">
                <div>{icon}</div>
                <div className=" text-[50px] text-white font-bold flex flex-col h-full items-center justify-center ">
                    <span>{value} {option}</span>

                    <h4 className=" text-white text-[14px] font-bold w-full text-center">{title}</h4>
                </div>
                <span></span>
            </div>
        </div>
    )
};