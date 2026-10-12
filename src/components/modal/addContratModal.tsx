"use client";

import React, { useEffect, useState } from 'react';
import AddIcon from '@/assets/icons/AddIcon';
import AddContratIcon from '@/assets/icons/AddContratIcon';
import PdfIcon from '@/assets/icons/PdfIcon';
import { addAvenant, addContratFileApi } from '@/api/contrat';
import { UseContractStore } from '@/stores/ContratStore';
// import CenterSpinner from '@/components/loader/CenterSpinner';
import UploadProgressOverlay from '@/components/modal/UploadProgress';
import { useParams } from 'next/navigation';
import { AxiosProgressEvent } from 'axios';

interface AddContratModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUploadStart?: () => void;
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
  installateurId: number;
  typeAjout?: 'contrat' | 'avenant';
}

export default function AddContratModal({
  isOpen,
  onClose,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  installateurId,
  typeAjout,
}: AddContratModalProps) {
  const { setUpdateContract } = UseContractStore();
  const { id, contract_id } = useParams();
  const contractId = id || contract_id;

  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  const resetState = () => {
    setError(null);
    setSelectedFileName(null);
    setProgress(0);
    setIsUploading(false);
    setEstimatedTimeRemaining(null);
  };

  const updateProgress = (progressEvent: AxiosProgressEvent) => {
    if (!progressEvent.total) return;

    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;

    setProgress(percent);

    if (percent > 0 && percent < 100) {
      const estimatedTotal = elapsed / (percent / 100);
      const remaining = estimatedTotal - elapsed;
      setEstimatedTimeRemaining(Math.max(0, Math.floor(remaining)));
    }

    if (percent === 100) {
      setEstimatedTimeRemaining(0);
      onUploadStart?.();
      // setLoading(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) return setError('La taille maximale de 20 Mo est dépassée.');

    try {
      setIsUploading(true);
      setStartTime(Date.now());
      setSelectedFileName(file.name);
      setError(null);

      const uploadFn = typeAjout === 'avenant'
        ? addAvenant.bind(null, Number(contractId), installateurId)
        : addContratFileApi.bind(null, installateurId);

      const response = await uploadFn(file, updateProgress);

      if (response.success === false || response.status_code >= 400 || response.error) {
        let message = 'Upload réussi mais erreur détectée.';
        try {
          const parsed = typeof response.error === 'string'
            ? JSON.parse(response.error)
            : response.error;
          message = parsed?.detail || response.error || message;
        } catch {
          message = typeof response.error === 'string' ? response.error : message;
        }
        onUploadError?.(message);
      } else {
        onUploadSuccess?.();
      }

      setUpdateContract();
      onClose?.();
      resetState();
    } catch (err: any) {
      console.error(err);
      let message = "Une erreur est survenue lors de l'envoi.";
      try {
        const raw = err.response?.data?.error;
        message = typeof raw === 'string' ? raw.replace(/^\[?"?|"?\]?$/g, '') : message;
      } catch {}
      onUploadError?.(message);
    } finally {
      setIsUploading(false);
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUploading) return;
    const preventRefresh = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) e.preventDefault();
    };
    const preventClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('keydown', preventRefresh, true);
    window.addEventListener('click', preventClick, true);
    return () => {
      window.removeEventListener('keydown', preventRefresh, true);
      window.removeEventListener('click', preventClick, true);
    };
  }, [isUploading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 flex justify-center items-center">
      {isUploading && (
        <UploadProgressOverlay progress={progress} estimatedTimeRemaining={estimatedTimeRemaining} />
      )}

      <div className="relative w-full max-w-[600px]">
        <div className="w-full h-full pb-10 bg-white rounded-[30px] shadow-[0px_0px_40px_rgba(0,0,0,0.15)] flex flex-col items-center gap-10 overflow-hidden relative">
          <button
            onClick={() => {
              onClose?.();
              resetState();
            }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center"
            disabled={isUploading}
          >
            &times;
          </button>

          <div className="w-full h-20 px-[30px] py-5 bg-[#C3D6E980] flex items-center gap-5">
            <h1 className="flex-1 text-[#101828] text-[18px] font-bold">
              {typeAjout === 'avenant' ? 'Ajouter un nouvel avenant' : 'Ajouter un nouveau contrat'}
            </h1>
          </div>

          {/* {loading ? (
            <div className="h-[300px] flex flex-col gap-3 items-center">
              <CenterSpinner center />
              <p className="text-grey text-[14px]">Nous vous prions de patienter un instant.</p>
            </div>
          ) : ( */}
            <div className="w-full max-w-[500px] py-[30px] pb-[50px] bg-white rounded-[20px] border-[#65A5BF] border-[3px] border-dashed flex flex-col items-center gap-[10px]">
              <div className="w-[160px] h-[160px] relative">
                <AddContratIcon />
              </div>

              <div className="flex flex-col items-center gap-[30px]">
                <h2 className="text-[#101828] text-[24px] font-bold">
                  {typeAjout === 'avenant' ? 'Ajout d’un avenant' : 'Ajout d’un contrat'}
                </h2>

                <label className="cursor-pointer h-10 px-5 bg-[#65A5BF] shadow-[0px_10px_40px_rgba(97,161,191,0.70)] rounded-[10px] flex items-center gap-2 hover:bg-[#5793a7] transition">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                    disabled={isUploading}
                  />
                  <div className="w-[20px] h-[20px] relative">
                    <AddIcon active />
                  </div>
                  <span className="text-white text-[12px] font-bold leading-[18px]">
                    Parcourir un fichier
                  </span>
                </label>

                {selectedFileName && !error && (
                  <div className="w-full text-left flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 text-[#101828] text-sm font-medium">
                      <PdfIcon className="w-4 h-4" />
                      <span className="max-w-[300px] truncate">{selectedFileName}</span>
                    </div>
                  </div>
                )}

                <p className="text-[#646E81] text-[14px] font-medium leading-[18px]">
                  Taille max : 20 Mo
                </p>
              </div>
            </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}