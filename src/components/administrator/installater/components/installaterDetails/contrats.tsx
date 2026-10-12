'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ContratIcon from '@/assets/icons/ContratIcon';
import AddIcon from '@/assets/icons/AddIcon';
import FileDownloadIcon from '@/assets/icons/FileDownloadIcon';
import CalendarFilledIcon from '@/assets/icons/CalendarFilledIcon';
import EyeViewerIcon from '@/assets/icons/EyeViewerIcon';

import AddContratModal from '../../../../modal/addContratModal';
import { getContratInfoForAnUser } from '@/api/contrat';
import { ADMIN_INSTALLATER_ROUTE } from '@/constants/routes';
import Spinner from '@/components/loader/PanelSprinner';
import { DownloadFile } from '@/utils/download';
import { renderModaliteItem } from '@/components/contracts/components/details/renderModalite';

type Message = { type: 'success' | 'error'; text: string };

export default function Contrats() {
  const router = useRouter();
  const { installateurId } = useParams();

  const [contrats, setContrats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [typeAjout, setTypeAjout] = useState<'contrat' | 'avenant' | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaitingUpload, setIsWaitingUpload] = useState(false);

  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Fonction utilitaire
  const formatDateToLongFR = (input: string): string => {
    const parts = input.includes('/') 
      ? input.split('/').reverse().join('-')
      : input;

    const date = new Date(parts);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };


  const fetchContracts = useCallback(async () => {
    if (!installateurId) return;
    setLoading(true);
    try {
      const data = await getContratInfoForAnUser(Number(installateurId));
      const sortedContrats = [...(data?.contrats || [])].sort((a, b) => b.id - a.id);

      const formatted = sortedContrats.map((c: any) => {
        const ficheOpFormatted = Object.entries(c.fiche_op || {})
          .filter(([, data]) => Array.isArray(data) && data.length > 0)
          .map(([key]) => {
            const match = key.match(/^fiche_op_(.*?)_cee$/);
            const nom = match ? match[1].replaceAll('_', ' ') : 'Inconnu';
            return nom.charAt(0).toUpperCase() + nom.slice(1);
          });
        const prix = c.tarification_structure || { type: "none" };

        return {
          id: c.id,
          name: c.contrat_name?.replaceAll('_', ' ') || 'Nom inconnu',
          contratID: c.contratID,
          status: c.status || 'Statut inconnu',
          fiches: ficheOpFormatted.length > 0 ? ficheOpFormatted : ['Fiches inconnues'],
          type: c.contrat_type || 'Type inconnu',
          volume: c.mf_volume_total_gwhc ? `${c.mf_volume_total_gwhc} GWhc` : '0 GWhc',
          prix,
          file: c.file.file || '',
          dateCreation: c.date_creation
            ? formatDateToLongFR(c.date_creation)
            : 'Date inconnue',
          dateSignature: c.signature?.signature_date
            ? formatDateToLongFR(c.signature.signature_date)
            : 'Date inconnue',
          dateLivraison: c.date_livraison
            ? formatDateToLongFR(c.date_livraison)
            : 'Date inconnue',
          rai: c.compte_oblige_nom_societe
        };
      });

      setContrats(formatted);

      if (formatted.length > 0) {
        setHighlightedId(formatted[0].id);
        setTimeout(() => setHighlightedId(null), 4000);
      }
    } catch (error) {
      console.error("Erreur récupération contrats :", error);
      setContrats([]);
    } finally {
      setLoading(false);
    }
  }, [installateurId]);

  useEffect(() => {
    if (installateurId) {
      fetchContracts();
    }
  }, [fetchContracts, installateurId]);


  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessages(prev => [{ type, text }, ...prev]);
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.text !== text));
    }, 10000);
  };

  const handleUploadStart = () => {
    setShowModal(false);
    setIsWaitingUpload(true);
  };

  const handleUploadSuccess = () => {
    setIsWaitingUpload(false);
    showMessage('success', 'Contrat ajouté avec succès.');

    // recharge les contrats
    fetchContracts();
  };

  const handleUploadError = (errMessage: string) => {
    setIsWaitingUpload(false);
    showMessage('error', errMessage || "Une erreur est survenue.");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'actif':
        return 'text-emerald-600';
      case 'expiré':
        return 'text-red-600';
      case 'en cours':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDotColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'actif':
        return 'bg-emerald-400';
      case 'expiré':
        return 'bg-red-400';
      case 'en cours':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <>
      {showModal && typeAjout && (
        <AddContratModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setTypeAjout(null);
          }}
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          installateurId={Number(installateurId)}
          typeAjout={typeAjout}
        />
      )}

      <div className="w-full h-full p-4 bg-white/40 border-l border-white backdrop-blur-lg flex flex-col">
        <div className="flex items-center gap-3.5 mb-7">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex justify-center items-center">
            <div className="w-6 h-6 rounded-md overflow-hidden">
              <ContratIcon />
            </div>
          </div>
          <h2 className="text-gray-900 text-2xl font-bold font-sans">Contrats</h2>
        </div>

        {isWaitingUpload && (
          <div className="text-sm text-gray-600 flex items-center gap-2 mb-3">
            <div className="w-4 h-4 border-2 border-t-transparent border-gray-600 rounded-full animate-spin" />
            Traitement du contrat en cours...
          </div>
        )}

        <div className="flex flex-col gap-2 mb-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`text-sm px-4 py-2 rounded-[20px] ${msg.type === 'success' ? 'bg-green-500 text-gray-800 text-sm font-bold' : 'bg-primary-red text-gray-800 text-sm font-bold'
                }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Liste des contrats */}
        <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1 pb-3">
          {loading ? (
            <div className="w-full p-[150px]"><Spinner /></div>
          ) : contrats.length === 0 ? (
            <div className="w-full text-center text-sm text-gray-600">Aucun contrat trouvé.</div>
          ) : (
            contrats.map((contrat) => (
              <div
                key={contrat.id}
                className={`w-full p-4 rounded-lg shadow-md outline outline-1 outline-white/70 backdrop-blur-lg flex flex-col gap-3.5 transition-all duration-500 ${
                  highlightedId === contrat.id
                    ? 'bg-yellow-100 animate-highlight'
                    : 'bg-white/40'
                }`}
              >
                <div className="text-slate-600 text-xs font-semibold">{contrat.name}</div>
                <div className="text-slate-600 text-xs font-sans">ID : {contrat.contratID}</div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(contrat.status)}`} />
                  <span className={`text-xs font-medium font-sans mb-1 ${getStatusColor(contrat.status)}`}>
                    {contrat.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {contrat.fiches?.map((fiche: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1.5 bg-[#f3f4f68c] text-gray-700 text-xs rounded-[5px] font-semibold"
                    >
                      {fiche}
                    </span>
                  ))}
                </div>
                <div className="text-slate-600 text-xs font-sans">Type : {contrat.type}</div>
                <div className="text-slate-600 text-xs font-sans">RAI : {contrat.rai}</div>
                <div className="text-slate-600 text-xs font-sans">Volume : {contrat.volume}</div>
                <div className="flex flex-col gap-1">
                  {Array.isArray(contrat.prix)
                    ? contrat.prix.map((modalite: any, idx: number) => (
                        <p key={idx} className="m-0">
                          {renderModaliteItem(modalite)}
                        </p>
                      ))
                    : <p className="m-0">{renderModaliteItem(contrat.prix)}</p>}
                </div>
                <div className="text-slate-600 text-xs font-sans">
                  <span className="text-slate-600 text-xs font-sans">
                    Date de création : {contrat.dateCreation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarFilledIcon />
                  <span className="text-slate-600 text-xs font-sans">
                    {`${contrat.dateSignature} - ${contrat.dateLivraison}`}
                  </span>
                </div>
                <div className="flex justify-end items-center gap-2.5">
                  <button onClick={() => router.push(`${ADMIN_INSTALLATER_ROUTE}/details/${installateurId}/contrat/${contrat.id}`)} className="w-6 h-6 bg-gray-900 rounded-md flex justify-center items-center">
                    <EyeViewerIcon active={true} />
                  </button>
                  <button onClick={() => DownloadFile(contrat.file, contrat.file.name || 'contrat.pdf')} className="w-6 h-6 bg-gray-900 rounded-md flex justify-center items-center">
                    <FileDownloadIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sticky bottom-0 left-0 w-full bg-white/30">
          <button
            onClick={() => { setTypeAjout('contrat'); setShowModal(true); }}
            className="w-full h-10 px-5 bg-gray-900 rounded-lg shadow-lg flex justify-center items-center gap-2.5 cursor-pointer"
          >
            <AddIcon active={true} />
            <span className="text-white text-xs font-bold font-sans">Ajouter un contrat</span>
          </button>
        </div>
      </div>
    </>
  );
}