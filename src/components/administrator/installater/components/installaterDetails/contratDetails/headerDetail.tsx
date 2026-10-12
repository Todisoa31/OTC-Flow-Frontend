'use client';

import DownloadIcon from '@/assets/icons/DownloadIcon';
import React from 'react';
import dayjs from 'dayjs';
import Deliveries from '@/components/deliveries/deliverie';
import { useParams } from 'next/navigation';

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

export type HeaderDetailProps = {
  name?: string;
  id?: number;
  title: string;
  category: string;
  type: string;
  rai: string;
  dispositif: string;
  duree: string; // Durée en mois
  dateFin: string; // Date de livraison dynamique
  onDownload?: () => void;
};

// Fonction précise pour calculer les mois et jours restants
// const calculateRemainingTime = (endDate: dayjs.Dayjs, today: dayjs.Dayjs) => {
//   let tempDate = today.startOf('day');
//   let months = 0;

//   while (tempDate.add(1, 'month').isSameOrBefore(endDate, 'day')) {
//     tempDate = tempDate.add(1, 'month');
//     months++;
//   }

//   const days = endDate.diff(tempDate, 'day');
//   return { months, days };
// };

const HeaderDetailContrat: React.FC<HeaderDetailProps> = ({
  name,
  title,
  category,
  type,
  rai,
  dispositif,
  // duree,
  // dateFin,
  onDownload,
}) => {
  const { id } = useParams();
  const contratId = id ? Number(id) : 0;

  // const endDate = dayjs(dateFin).endOf('day');
  // const today = dayjs().startOf('day');

  // const { months: monthsToDisplay, days: daysToDisplay } = calculateRemainingTime(endDate, today);

  // // Déterminer le statut du contrat
  // let contractStatus = '';
  // let contractStatusColor = 'text-[#59b595]';

  // if (endDate.isBefore(today, 'day')) {
  //   contractStatus = 'Contrat expiré';
  //   contractStatusColor = 'text-red-600';
  // } else if (endDate.isSame(today, 'day')) {
  //   contractStatus = 'Contrat expiré aujourd\'hui';
  //   contractStatusColor = 'text-red-600';
  // } else if (endDate.diff(today, 'day') === 1) {
  //   contractStatus = 'Contrat expire demain';
  //   contractStatusColor = 'text-yellow-600';
  // }

  // // Couleur selon durée restante
  // let remainingTextColor = 'text-[#59b595]';
  // if (monthsToDisplay === 0 && daysToDisplay === 0) {
  //   remainingTextColor = 'text-red-600';
  // } else if (monthsToDisplay === 0 && daysToDisplay <= 5) {
  //   remainingTextColor = 'text-yellow-600';
  // }

  return (
    <div className="flex flex-row w-full">
      <div className="w-[70%] p-6 bg-[rgba(254,254,254,0.4)] shadow-md outline outline-[1px] outline-white backdrop-blur flex flex-col gap-5">
        <div className="w-full flex flex-row items-start gap-5">
          <div className="flex-1 flex flex-col justify-center items-start gap-2.5">
            <div className="text-[#101828] text-base font-bold leading-[18px]">
              {name}
            </div>
            <div className="text-[#101828] text-base font-bold leading-[18px]">
              <span className="text-[#646E81] font-medium">ID :</span>
              <span className="text-[#101828] font-bold"> {title}</span>
            </div>
            <div className="text-[#65A5BF] text-base font-medium leading-[18px]">
              {category}
            </div>
            <div className="text-sm leading-[18px]">
              <span className="text-[#646E81] font-medium">Type : </span>
              <span className="text-[#101828] font-bold">{type}</span>
            </div>
            <div className="text-sm leading-[18px]">
              <span className="text-[#646E81] font-medium">RAI : </span>
              <span className="text-[#101828] font-bold">{rai}</span>
            </div>
            <div className="text-sm leading-[18px]">
              <span className="text-[#646E81] font-medium">Dispositif : </span>
              <span className="text-[#101828] font-bold">{dispositif}</span>
            </div>
            {/* <div className="text-sm leading-[18px]">
              <span className="text-[#646E81] font-medium">Durée : </span>
              <span className="text-[#101828] font-bold">{duree} mois </span>
              {contractStatus ? (
                <span className={`font-semibold ${contractStatusColor}`}>
                  | {contractStatus} |
                </span>
              ) : (
                <span className={`font-bold ${remainingTextColor}`}>
                  | Restant :
                  {monthsToDisplay > 0 && ` ${monthsToDisplay} mois`}
                  {daysToDisplay > 0 &&
                    ` et ${daysToDisplay} jour${daysToDisplay > 1 ? 's' : ''}`} |
                </span>
              )}
            </div> */}
          </div>

          <button
            onClick={onDownload}
            className="h-10 px-5 bg-[#101828] shadow-[0_10px_40px_rgba(0,0,0,0.4)] rounded-[10px] flex items-center gap-2 text-white text-xs font-bold leading-[18px]"
          >
            <DownloadIcon fill="#fff" />
            Télécharger le contrat
          </button>
        </div>
      </div>

      <div className="w-[30%] p-6 bg-[#c0bfbf66] shadow-md outline outline-[1px] outline-white backdrop-blur">
        <Deliveries contratId={contratId} />
      </div>
    </div>
  );
};

export default HeaderDetailContrat;