'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import AddIcon from '@/assets/icons/AddIcon';
import CalendarFilledIcon from '@/assets/icons/CalendarFilledIcon';
import FileDownloadIcon from '@/assets/icons/FileDownloadIcon';
import AvenantIcon from '@/assets/icons/AvenantIcon';

import { DownloadFile } from '@/utils/download';
import Spinner from '@/components/loader/PanelSprinner';
import { HEAD_ORIGINATION_ROUTE, INSTALLER_ROUTE } from '@/constants/routes';
import AddContratModal from '../modal/addContratModal';
import { getAvenantsForUser } from '@/api/contrat';
import { useAvenantSelection } from '@/contexts/Avenant/AvenantSelectionContext';
import { ContratAndAvenantsProps } from '@/types/contratType';

type AvenantUIProps = {
  id: number;
  name: string;
  file: string;
  dateApplication: string;
  dateCreation: string;
  status: string | null;
};

type Message = { type: 'success' | 'error'; text: string };

export default function Avenants() {
  // const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { id, contract_id } = useParams();

  const params_ = useParams()
  const installateurId = Number(params_.installateurId) || Number(searchParams.get('installer')) || 0

  const { selectedAvenantId, setSelectedAvenantId } = useAvenantSelection();

  const shouldShowAddButton =
    !pathname.includes(HEAD_ORIGINATION_ROUTE) &&
    !pathname.includes(INSTALLER_ROUTE);

  const [avenants, setAvenants] = useState<AvenantUIProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaitingUpload, setIsWaitingUpload] = useState(false);

  const formatDateToLongFR = (input: string): string => {
    const date = new Date(input);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const fetchAvenants = useCallback(async () => {
    const contract = id ? id : contract_id;
    if (!contract) {
      console.warn('No contract id provided.');
      setAvenants([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response: ContratAndAvenantsProps = await getAvenantsForUser(
        Number(contract)
      );

      const formatItem = (a: any): AvenantUIProps => ({
        id: a.id,
        name: a.contrat_name || 'Avenant sans nom',
        file: a.file?.file || '',
        dateApplication: a.date_application
          ? formatDateToLongFR(a.date_application)
          : 'Date inconnue',
        dateCreation: a.date_creation
          ? formatDateToLongFR(a.date_creation)
          : 'Date inconnue',
        status: a.status,
      });

      const contratPrincipalFormatted =
        response.contrat_principale && !Array.isArray(response.contrat_principale)
          ? formatItem(response.contrat_principale)
          : null;

      const avenantsFormatted = (response.avenants || [])
        .sort((a, b) => b.id - a.id)
        .map(formatItem);

      const finalList = contratPrincipalFormatted
        ? [contratPrincipalFormatted, ...avenantsFormatted]
        : avenantsFormatted;

      setAvenants(finalList);
    } catch (error) {
      console.error('Erreur récupération avenants :', error);
      setAvenants([]);
    } finally {
      setLoading(false);
    }
  }, [id, contract_id]);

  useEffect(() => {
    fetchAvenants();
  }, [fetchAvenants]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessages((prev) => [{ type, text }, ...prev]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.text !== text));
    }, 7000);
  };

  const handleUploadStart = () => {
    setShowModal(false);
    setIsWaitingUpload(true);
  };

  const handleUploadSuccess = () => {
    setIsWaitingUpload(false);
    showMessage('success', 'Avenant ajouté avec succès.');
    fetchAvenants();
  };

  const handleUploadError = (msg: string) => {
    setIsWaitingUpload(false);
    showMessage('error', msg || 'Erreur lors de l’ajout de l’avenant.');
  };

  const handleClickAvenant = (avenant: AvenantUIProps, isContratPrincipal: boolean) => {
    // const contract = id ? id : contract_id;
    if (isContratPrincipal) {
      setSelectedAvenantId(avenant.id);
    } else {
      setSelectedAvenantId(avenant.id);
    }
  };


  return (
    <>
      {showModal && (
        <AddContratModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          installateurId={Number(installateurId)}
          typeAjout="avenant"
        />
      )}

      <div className="w-full h-full p-4 bg-white/40 border-l border-white backdrop-blur-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-7">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex justify-center items-center">
            <AvenantIcon />
          </div>
          <h2 className="text-gray-900 text-xl font-bold font-sans">
            Contrat et Avenants
          </h2>
        </div>

        {/* Upload info */}
        {isWaitingUpload && (
          <div className="text-sm text-gray-600 flex items-center gap-2 mb-3">
            <div className="w-4 h-4 border-2 border-t-transparent border-gray-600 rounded-full animate-spin" />
            Traitement de l’avenant en cours...
          </div>
        )}

        {/* Messages */}
        <div className="flex flex-col gap-2 mb-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`text-sm px-4 py-2 rounded-[20px] ${
                msg.type === 'success'
                  ? 'bg-green-500 text-gray-800 font-bold'
                  : 'bg-primary-red text-gray-800 font-bold'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1 pb-3">
          {loading ? (
            <div className="w-full p-[150px]">
              <Spinner />
            </div>
          ) : avenants.length === 0 ? (
            <div className="text-center text-sm text-gray-600">
              Aucun avenant trouvé.
            </div>
          ) : (
            avenants.map((avenant, index) => {
              const isContratPrincipal = index === 0;
              const isSelected = selectedAvenantId === avenant.id;

              return (
                <div
                  key={avenant.id}
                  onClick={() => handleClickAvenant(avenant, isContratPrincipal)}
                  className={`cursor-pointer w-full p-4 rounded-lg shadow-md outline outline-1 outline-white/70 backdrop-blur-lg flex flex-col gap-3.5 transition-all duration-500
                    ${
                      isContratPrincipal
                        ? 'bg-white text-[#101828] cursor-pointer'
                        : isSelected
                        ? 'bg-black text-white'
                        : 'bg-white text-[#101828]'
                    }
                  `}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div className="flex flex-col gap-1">
                      {isContratPrincipal && (
                        <span className="inline-block px-2 py-0.5 text-xs font-bold text-white bg-[#65A5BF] rounded-full select-none">
                          Contrat principal
                        </span>
                      )}
                      <div className="text-sm font-semibold">{avenant.name}</div>
                    </div>

                    {!isContratPrincipal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          DownloadFile(avenant.file, 'avenant.pdf');
                        }}
                        className={`rounded-md flex justify-center items-center px-2 py-1 ${
                          isSelected ? 'bg-white text-black' : 'bg-gray-900 text-white'
                        }`}
                        aria-label={`Télécharger ${avenant.name}`}
                      >
                        <FileDownloadIcon fillColor={isSelected ? 'black' : 'white'} />
                      </button>
                    )}
                  </div>

                  <div className="text-xs">Créé le : {avenant.dateCreation}</div>

                  {!isContratPrincipal && avenant.dateApplication !== 'Date inconnue' && (
                    <div className="flex items-center gap-2 text-xs font-sans">
                      <CalendarFilledIcon />
                      <span>Date d&#39;application : {avenant.dateApplication}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Add button */}
        {shouldShowAddButton && (
          <div className="sticky bottom-0 left-0 w-full bg-white/30">
            <button
              onClick={() => setShowModal(true)}
              className="w-full h-10 px-5 bg-gray-900 rounded-lg shadow-lg flex justify-center items-center gap-2.5 cursor-pointer"
            >
              <AddIcon active />
              <span className="text-white text-xs font-bold">Ajouter un avenant</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}