import { getDataRecap } from '@/api/recordInstallerApi';
import DownloadIcon from '@/assets/icons/DownloadIcon';
import Button from '@/components/inputs/Button';
import { STATUS_CHOICES } from '@/constants/records';
import { convertApiToCsv } from '@/utils/csv';
import React, { useEffect } from 'react';

type Props = {
  jobId: string;
  status: string
};

const RecapitulationTRA = (props: Props) => {  
  const { jobId, status } = props;
  const [loadingRecap, setLoadingRecap] = React.useState<boolean>(false);
  const [statusValue, setStatusValue] = React.useState<string | undefined>('');

  function getStatusLabel(value: string): string {
    return STATUS_CHOICES.find((item) => item.value === value)?.label ?? value;
  }
  const handleDownloadRecap = async (jobId: string) => {
    if(jobId) {
      try {
          setLoadingRecap(true);
          const response = await getDataRecap(jobId);
          console.log(response);
          const csvContent = convertApiToCsv(response);
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "recapitulation.csv";
          link.click();
      }catch (error) {
          console.error("Error generating recap data:", error);
      } finally {
          setLoadingRecap(false);
      }
    }
  }

  useEffect(() => {
    if (status) {
      setStatusValue(getStatusLabel(status));
    }
  },[status])
    
  return (
    <div className="w-full p-[30px]">
        <div className="w-full self-stretch p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-3.5">
            <div className="w-full flex justify-between items-center gap-2.5">
              <h2 className="text-zinc-700 text-sm font-bold">Recapitulatifs</h2>
              <div className="text-xs bg-primary-blue h-[25px] flex items-center font-bold py-[10px] px-[5px] rounded-[5px] w-fit text-xs text-white">{statusValue}</div>
            </div>
            <Button
              label="Télécharger le récapitulatif"
              className="bg-black px-[20px] py-[8px]  flex items-center gap-2 text-white rounded-[10px] shadow-xl"
              iconLeft={<DownloadIcon fill="#fff" />}
              onClick={() => handleDownloadRecap(jobId)}
              width="w-auto"
              loading={loadingRecap}
            />
        </div>
    </div>
  );
}

export default RecapitulationTRA;
