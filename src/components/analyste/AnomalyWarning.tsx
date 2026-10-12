import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import ArrowRightIcon2 from "@/assets/icons/ArrowRightIcon2";
import WarningIcon from "@/assets/icons/WarningIcon";
import React from "react";

const AnomalyWarning = () => {
  return (
    <div className="flex-1 self-stretch p-3.5 bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white/90 backdrop-blur-lg inline-flex flex-col justify-center items-center gap-6 overflow-hidden">
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 flex justify-center items-center gap-3.5">
          <div className="w-10 h-10 bg-gray-900 rounded-[10px] flex justify-center items-center gap-2.5">
            <WarningIcon fill="#fff"/>
          </div>
          <div className="flex-1 justify-start text-gray-900 text-2xl font-bold">
            Alertes & Anomalies
          </div>
        </div>
        <button className="h-10 px-5 bg-gray-900 rounded-[10px] shadow-[0px_10px_40px_0px_rgba(16,24,40,0.50)] flex justify-start items-center gap-2.5">
          <div className="justify-start text-white text-xs font-bold leading-none">
            Afficher tous
          </div>
          <ArrowRightIcon />
        </button>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
        <div className="self-stretch pl-5 pr-3.5 py-5 bg-white/40 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-2.5">
          <div className="justify-start text-gray-900 text-sm font-bold leading-none">
            Taux de refus élevé - Installateur ABC
          </div>
          <div className="justify-start text-slate-600 text-xs font-bold leading-none">
            15% de refus sur les 7 derniers jours (seuil: 10%)
          </div>
          <div className="justify-start text-slate-600 text-xs font-medium">
            Il y a 2 heures
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
        <div className="self-stretch pl-5 pr-3.5 py-5 bg-white/40 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-2.5">
          <div className="justify-start text-gray-900 text-sm font-bold leading-none">
            Taux de refus élevé - Installateur ABC
          </div>
          <div className="justify-start text-slate-600 text-xs font-bold leading-none">
            15% de refus sur les 7 derniers jours (seuil: 10%)
          </div>
          <div className="justify-start text-slate-600 text-xs font-medium">
            Il y a 2 heures
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
        <div className="self-stretch pl-5 pr-3.5 py-5 bg-white/40 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-2.5">
          <div className="justify-start text-gray-900 text-sm font-bold leading-none">
            Taux de refus élevé - Installateur ABC
          </div>
          <div className="justify-start text-slate-600 text-xs font-bold leading-none">
            15% de refus sur les 7 derniers jours (seuil: 10%)
          </div>
          <div className="justify-start text-slate-600 text-xs font-medium">
            Il y a 2 heures
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyWarning;
