import React from "react";
import HeadDashboardPage from "./HeadDashboardPage";
import EvolutionDossier from "./EvolutionDossier";
import DashboardDognutChart from "./DashboardStatut";
import AnomalyWarning from "./AnomalyWarning";
import ListFile from "@/assets/icons/ListFile";
import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import DownloadIcon2 from "@/assets/icons/DownloadIcon2";
import TrashIcon2 from "@/assets/icons/TrashIcon2";

const AnalysteDashboard = () => {
  return (
    <>
      {/* <HeadDashboardPage /> */}
      <div className="w-full h-[100vh]">
        <EvolutionDossier />
      </div>
      {/* <div className="flex max-md:flex-col p-8 items-start gap-8 self-stretch w-full flex-wrap">
        <AnomalyWarning />
        <DashboardDognutChart />
      </div>

      <div className="self-stretch px-7 inline-flex flex-col justify-start items-start gap-5">
        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
          <div className="w-10 h-10 bg-gray-900 rounded-[10px] flex justify-center items-center gap-2.5">
            <div className="w-6 h-6 relative overflow-hidden">
              <ListFile fill='#fff'/>
            </div>
          </div>
          <div className="flex-1 justify-start text-gray-900 text-2xl font-bold">
            Rapports personnalisés
          </div>
          <button className="h-10 px-5 bg-gray-900 rounded-[10px] shadow-[0px_10px_40px_0px_rgba(16,24,40,0.50)] flex justify-start items-center gap-2.5">
            <div className="justify-start text-white text-xs font-bold leading-none">
              Afficher tous
            </div>
            <div className="w-5 h-5 relative overflow-hidden">
              <ArrowRightIcon />
            </div>
          </button>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
          <div className="self-stretch h-14 pl-5 pr-3.5 bg-white/40 rounded-2xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex justify-center items-center gap-3.5">
            <div className="w-44 flex justify-start items-center gap-2.5">
              <div className="justify-start text-gray-900 text-xs font-bold">
                Rapport mensuel CEE
              </div>
            </div>
            <div className="flex-1 flex justify-start items-start gap-2.5">
              <div className="justify-start text-gray-500 text-xs font-medium">
                Tous types, Janvier 2025
              </div>
            </div>
            <div className="flex-1 flex justify-start items-start gap-2.5">
              <div className="justify-start text-gray-500 text-xs font-medium">
                01/02/2025
              </div>
            </div>
            <div className="flex-1 flex justify-start items-start gap-2.5">
              <div className="justify-start text-gray-500 text-xs font-medium">
                PDF
              </div>
            </div>
            <button className="w-7 h-7 bg-gray-500/5 rounded-[5px] flex justify-center items-center gap-2.5">
              <div className="w-4 h-4 relative rounded-[5px] overflow-hidden">
                <DownloadIcon2 />
              </div>
            </button>
            <button className="w-7 h-7 bg-gray-500/5 rounded-[5px] flex justify-center items-center gap-2.5">
              <div className="w-4 h-4 relative overflow-hidden">
                <TrashIcon2 fill='#000'/>
              </div>
            </button>
          </div>
        </div>
      </div>
       */}
    </>
  );
};

export default AnalysteDashboard;
