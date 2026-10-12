import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { FileUploadingStatus } from '../SingleDossier';
import InputsRESEC104 from './Inputs_RES_EC_104';
import { RecordFileJobId } from '@/types/recordType';
import { useRecords } from '@/providers/CreateRecordProvider';
import { uploadRecordFilev2Api, uploadRecordFilev4 } from '@/api/recordInstallerApi';
import { UploadStatus } from '@/components/inputs/DocUploader';
import InputsBATTH146 from './InputsRESBATTH146';
import InputsTRAEQ114 from './InputsTRAEQ114';
import InputsTRAEQ117 from './InputsTRAEQ117';
import InputsBARSE109 from './InputsBARSE109';

type Props = {
  formType: string;
  fileUploadingStatus: FileUploadingStatus;
  setUploadingFileStatus: Dispatch<SetStateAction<FileUploadingStatus>>;
}
const InputsList = (props: Props) => {
  const { formType, fileUploadingStatus, setUploadingFileStatus } = props;
  const { payload, setPayload, uploadPayload, setUploadPayload, setExtractedData, isAttInsideAttPose, setIsAttInsideAttPose } = useRecords();

  const handleUpdateFileStatus = (key: keyof RecordFileJobId, status: UploadStatus) => {
          setUploadingFileStatus(prevState => ({
              ...prevState,
              [key]: status
          }));
      }

      
  const handleUploadFile = async (file: File, key: keyof RecordFileJobId) => {
      try {
          handleUpdateFileStatus(key, 'extracting');
          const response = await uploadRecordFilev2Api(key, file, payload.form_type, payload.job_id);
          if (response.data) {
            
              setPayload(prev => ({
                  ...prev,
                  items: {
                      ...prev.items,
                      [key]: response.data
                  }
              }));
              
              setExtractedData(prev => ({
                  ...prev,
                  [key]: response.data
              }));                
          }
          /*clearInterval(intervale);*/
          handleUpdateFileStatus(key, 'success');
          return true
      } catch (error) {
          console.error(key, 'Error uploading files:', error);
          handleUpdateFileStatus(key, 'error');
          return false
      }
  }

  const handleUploadFilev4 = async (file: File, key: keyof RecordFileJobId) => {
      try {
          handleUpdateFileStatus(key, 'extracting');
          const response = await uploadRecordFilev4(key, file, payload.form_type, payload.job_id);
          if (response.data) {
              setPayload(prev => ({
                  ...prev,
                  items: {
                      ...prev.items,
                      [key]: response.data
                  }
              }));
              
              setExtractedData(prev => ({
                  ...prev,
                  [key]: response.data
              }));                
          }
          handleUpdateFileStatus(key, 'success');
          return true
      } catch (error) {
          console.error(key, 'Error uploading files:', error);
          handleUpdateFileStatus(key, 'error');
          return false
      }
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, key: keyof RecordFileJobId) => {
      const file = e.target.files?.[0];
      if (file) {
          setUploadPayload(prev => ({
              ...prev,
              [key]: file
          }));
          handleUploadFile(file, key);
      }
  }

  const handleChangeFilev4 = (e: React.ChangeEvent<HTMLInputElement>, key: keyof RecordFileJobId) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploadPayload(prev => ({
            ...prev,
            [key]: file
        }));
        handleUploadFilev4(file, key);
      }
  }
  useEffect(() => {
    console.log(`InputsList: formType changed to ${formType}`);
  },[formType])


  switch (formType) {
    case 'RES_EC_104':
      return <InputsRESEC104 fileUploadingStatus={fileUploadingStatus} handleChangeFile={handleChangeFile}/>;
    case 'BAT_TH_146':
    case 'BAR_TH_160':
      return <InputsBATTH146 fileUploadingStatus={fileUploadingStatus} handleChangeFile={handleChangeFile}/>;    
    case 'TRA_EQ_114':
      return <InputsTRAEQ114 />;
    case 'TRA_EQ_117':
      return <InputsTRAEQ117 />;
    case 'BAR_SE_109':
    case 'BAR_SE_108':
      return <InputsBARSE109 fileUploadingStatus={fileUploadingStatus} handleChangeFile={handleChangeFilev4}/>;
    // Add more cases for other form types as needed
    default:
      return null;
  }
}

export default InputsList;

