"use client";

import { getCountFolder } from "@/api/folderApi";
import BeingProcessedIcon from "@/assets/icons/dashboard/BeingProcessedIcon";
import NewFolderIcon from "@/assets/icons/dashboard/NewFolderIcon";
import RefusedIcon from "@/assets/icons/dashboard/RefusedIcon";
import ToBeCorrectedIcon from "@/assets/icons/dashboard/ToBeCorrectedIcon";
import ValidatedIcon from "@/assets/icons/dashboard/ValidateIcon";
import { CountFolderType } from "@/types/folderType";
import { useEffect, useState } from "react";

type MetricCardType = {
    title: string;
    value: number;
    icon: React.ReactNode;
};

export default function DashboardHeadOriginationHeader() {
    const [data, setData] = useState<CountFolderType>();

    const fetchStatistic = async () => {
        try {
            const res = await getCountFolder()
            setData(res);
            
        } catch (error) {
            
        } finally {

        }
    };

    useEffect(() => {
        fetchStatistic();
    }, []);

    return (
        <div className=" bg-[url('/images/record-dashboard-bg.png')] bg-cover p-[30px] w-full rounded-[30px] flex flex-col gap-3">
            <h2 className=" text-white text-[24px] font-bold">Vue d'ensemble des dossiers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricCard title="Nouveaux" value={data?.tobeprocessed ?? 0} icon={<NewFolderIcon />} />
                <MetricCard title="En cours de traitement" value={data?.inprocess ?? 0} icon={<BeingProcessedIcon />} />
                <MetricCard title="A corriger" value={data?.tocorrect ?? 0} icon={<ToBeCorrectedIcon />} />
                <MetricCard title="Validés" value={data?.approved ?? 0} icon={<ValidatedIcon />} />
                <MetricCard title="Refusés" value={data?.refused ?? 0} icon={<RefusedIcon />} />
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon }: MetricCardType) => {
    return (
        <div className=" p-[20px] rounded-[15px] bg-black bg-opacity-50 flex flex-col border-2 border-grey backdrop-blur-sm ">
            <div className=" flex gap-3 justify-start items-center">
            <div>{icon}</div>
                <h6 className=" text-[45px] text-white font-bold ">{value}</h6>
            </div>
            <h4 className=" text-white text-[14px] font-bold">{title}</h4>
        </div>
    )
}