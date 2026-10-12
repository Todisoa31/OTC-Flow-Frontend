import React, { useEffect, useState } from "react";
import Button from "../inputs/Button";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import { getDataRecap, updateCSVFile, updateStatusRecap, uploadRecordFilev2Api } from "@/api/recordInstallerApi";
import { convertAllJobsToSingleCsv, convertApiToCsv } from "@/utils/csv";
import Select from "../inputs/Select";
import { keyToField, STATUS_CHOICES, STATUSES_OPTIONS } from "@/constants/records";
import AddHonorAttestation from "./AddHonorAttestation";
import DocUploader from "../inputs/DocUploader";
import { ApiResponse} from "@/types/recordType";
type Props = {
  jobId: string;
  statusValue?: string;
};
export type UploadStatus = 'error' | 'success' | 'uploading' | 'initial' | 'extracting';

const RecapitulationInstaller = (props: Props) => {
  const { jobId, statusValue } = props;
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [statusFile, setStatusFile] = useState<UploadStatus>('initial');
  const [fileRecap, setFileRecap] = useState<File | null>(null);
  const [loadingRecap, setLoadingRecap] = useState<boolean>(false);
  

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

  const handleChangeStatusRecap = async (status_code: string) => {
    try{
      const response = await updateStatusRecap(jobId, status_code);
      setStatus(status_code);
      if (!response) return;
    }catch(error){
      console.error('Error changing status recap:', error);
    }
  }

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file= e.target.files?.[0];
    if (!file) return;
    if(file){
      setFileRecap(file);
      try {
          setStatusFile('extracting');
          const response = await updateCSVFile(jobId, file);
          if (!response) return;
          setStatusFile('success');
          return true
      } catch (error) {
          console.error('Error uploading files:', error);
          setStatusFile('error');
          return false
      }
    }
  }

  useEffect(() => {
    if (statusValue) {
      setStatus(statusValue);
    }
  }, [statusValue]);

  return (
    <div className="px-[30px] mb-5">
      <div className="relative z-[20] px-[30px] self-stretch p-5 bg-[#fefefe]/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white outline-opacity-70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-5">
          <div className="flex justify-between w-full gap-2.5">
            <div className="self-stretch justify-start text-black-secondary text-sm font-bold leading-[18px]">
              Recapitulation
            </div>
            <div>
              <Select
                  multiple={false}
                  search={false}
                  value={status as string}
                  onChange={(value) => handleChangeStatusRecap(value as string)}
                  options={STATUS_CHOICES.filter((option) => ['corrected','approved','tovalidate'].includes(option.value))}
                  placeholder="Changer le status"
              />
            </div>
          </div>   
        <div className="flex self-stretch justify-end items-center gap-5">
            <div className="w-[80%]">
                  <DocUploader
                    label={``}
                    state={statusFile}
                    onChange={handleUploadFile}
                    file={fileRecap}
                    noPadding={true}
                    acceptFiles=".csv"
                    
                  />                    
                </div>
            <Button
              label="Télécharger le récapitulatif"
              className="bg-black px-[20px] py-[8px]  flex items-center gap-2 text-white rounded-[10px] shadow-xl"
              iconLeft={<DownloadIcon fill="#fff" />}
              onClick={() => handleDownloadRecap(jobId)}
              width="w-auto"
              height="h-[50px]"
              loading={loadingRecap}
            />
        </div>
      </div>
    </div>
  );
};

export default RecapitulationInstaller;
