'use client';

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getRecordMetricControllererApi } from "@/api/recordControllerApi";

import BeingProcessedIcon from "@/assets/icons/dashboard/BeingProcessedIcon";
import NewFolderIcon from "@/assets/icons/dashboard/NewFolderIcon";
import RefusedIcon from "@/assets/icons/dashboard/RefusedIcon";
import ToBeCorrectedIcon from "@/assets/icons/dashboard/ToBeCorrectedIcon";
import ValidatedIcon from "@/assets/icons/dashboard/ValidateIcon";

type DossierStat = {
  status_id: number;
  status_code: string;
  status_title: string;
  count: number;
  color_text: string;
  color_background: string;
};

type DisplayMetric = {
  key: string;
  label: string;
  count: number;
  icon: React.ReactNode;
  colorText: string;
  colorBg: string;
};

export default function OverViewInheader() {
  const [metrics, setMetrics] = useState<DisplayMetric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data: DossierStat[] = await getRecordMetricControllererApi();

        // Exclure le statut "corrected"
        const filtered = data.filter((d) => d.status_code !== "corrected");

        // Transformer et renommer les statuts
        const transformed: DisplayMetric[] = filtered.map((d) => ({
          key: d.status_code,
          label: mapLabel(d.status_code),
          count: d.count,
          icon: getIconByStatusCode(d.status_code),
          colorText: d.color_text,
          colorBg: d.color_background,
        }));

        // Réordonner les statuts selon la logique métier
        const order = ["tobeprocessed", "inprocess", "tocorrect", "approved", "refused"];
        const sorted = transformed.sort(
          (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
        );

        setMetrics(sorted);
      } catch {
        toast.error("Impossible de charger les statistiques.");
      }
    };

    fetchMetrics();
  }, []);

  const getIconByStatusCode = (code: string) => {
    switch (code) {
      case "tobeprocessed":
        return <NewFolderIcon />;
      case "inprocess":
        return <BeingProcessedIcon />;
      case "tocorrect":
        return <ToBeCorrectedIcon />;
      case "approved":
        return <ValidatedIcon />;
      case "refused":
        return <RefusedIcon />;
      default:
        return <div className="w-6 h-6 bg-gray-300 rounded-full" />;
    }
  };

  const mapLabel = (code: string): string => {
    switch (code) {
      case "tobeprocessed":
        return "Nouveaux";
      case "inprocess":
        return "En cours";
      case "tocorrect":
        return "À corriger";
      case "approved":
        return "Validé";
      case "refused":
        return "Refusé";
      default:
        return code;
    }
  };

  return (
    <div className="bg-[url('/images/record-dashboard-bg.png')] bg-cover p-[30px] w-full rounded-[30px] flex flex-col gap-3">
      <h2 className="text-white text-[24px] font-bold">Vue d'ensemble</h2>
      <div className="grid grid-cols-5 gap-4">
        {metrics.map((item) => (
          <MetricCard
            key={item.key}
            title={item.label}
            value={item.count}
            icon={item.icon}
            colorText={item.colorText}
            colorBg={item.colorBg}
          />
        ))}
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorBg: string;
  colorText: string;
};

const MetricCard = ({ title, value, icon, colorText }: MetricCardProps) => {
  return (
    <div
      className="p-[20px] rounded-[15px] bg-black bg-opacity-50 flex flex-col border-2 border-grey backdrop-blur-sm"
      style={{ color: colorText }}
    >
      <div className="flex gap-1 items-center flex-col">
        <div>{icon}</div>
        <h6 className="text-[36px] font-bold">{value}</h6>
        <h4 className="text-[14px] font-bold">{title}</h4>
      </div>
    </div>
  );
}