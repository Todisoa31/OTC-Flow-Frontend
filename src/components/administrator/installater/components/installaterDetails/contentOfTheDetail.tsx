'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTitle } from '@/providers/TitleProvider';
import TitleWithBack from '@/components/TitleWithBack';
import CenterSpinner from '@/components/loader/CenterSpinner';
import ManagesAnAccount from './managesAnAccount';
import { getUserInstalleur } from '@/api/userApi';
import { SubcontractorInputType } from '@/types/userType';

// interface Subcontractor {
//   legal_representative: string;
//   email: string;
//   siren: string;
//   phone: string;
// }

interface LegalField {
  label: string;
  value: string;
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center text-red-600">
    <p className="mb-4 font-semibold text-lg">{message}</p>
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-2 px-5 h-10 text-sm font-bold text-white rounded-[10px] bg-gray-900 shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:bg-gray-950 transition"
    >
      Retour à la liste des utilisateurs
    </button>
  </div>
);

export default function ContentOfTheDetail() {
  const { installateurId } = useParams();
  const { setTitle } = useTitle();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [legalInfo, setLegalInfo] = useState<LegalField[][]>([]);
  // const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    lastname: '',
    role: '',
    status: '',
  });

  const [subcontractors, setSubcontractors] = useState<SubcontractorInputType[]>([]);

  useEffect(() => {
    setTitle(<TitleWithBack title="Détails Installateur" />);
  }, [setTitle]);

  useEffect(() => {
    const fetchData = async () => {
      if (!installateurId) {
        setError("ID utilisateur manquant");
        setLoading(false);
        return;
      }

      try {
        const res = await getUserInstalleur(Number(installateurId));
        if (!res || !res.user || !res.installer) {
          setError("Utilisateur introuvable");
          return;
        }

        const { user, installer } = res;

        setUserInfo({
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          role: user.role || 'Installateur',
          status: user.status || '',
        });

        setAvatarUrl(user.photo_profil || '/images/usProfil.jpg');

        setLegalInfo([
          [
            { label: 'Raison sociale', value: installer.company_name || '—' },
            { label: 'SIREN', value: installer.siren || '—' },
          ],
          [
            { label: 'Représentant légal', value: installer.legal_representative || '—' },
            { label: 'Email', value: user.email || '—' },
          ],
          [
            { label: 'Téléphone', value: installer.phone || '—' },
            { label: 'Adresse', value: installer.address || '—' },
          ],
        ]);

        setSubcontractors(installer.subcontractors || []);
      } catch (err) {
        console.error('Erreur lors du chargement de l’utilisateur :', err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [installateurId]);

  if (loading) return <CenterSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex flex-col p-8 gap-8 w-full">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt="Photo de profil"
              className="w-28 h-28 rounded-full object-cover border border-gray-300"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">
                {userInfo.firstname} {userInfo.lastname}
              </span>
              <span className="text-sm text-gray-500 mt-1 underline">{userInfo.role}</span>
            </div>
          </div>
          <div className="flex flex-col items-end py-6">
            <ManagesAnAccount Users={userInfo} />
          </div>
        </div>

        <section className="pt-6">
          <h2 className="text-lg font-semibold">Informations légales</h2>
          <div className="mt-6 bg-gray-50/40 backdrop-blur-md rounded-2xl shadow p-6 space-y-6">
            {legalInfo.map((row, i) => (
              <div key={i} className="grid grid-cols-2 gap-6">
                {row.map((field, j) => (
                  <div key={j} className="space-y-2">
                    <div className="text-sm text-gray-500 font-medium m-2">{field.label} :</div>
                    <div className="h-10 px-4 bg-white rounded-2xl flex items-center text-gray-600 font-medium">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Sous-traitants</h2>
          <div className="flex flex-col gap-4">
            <div className="px-5 py-2 flex items-center gap-[15px]">
              <div className="w-[30%] text-black-secondary text-xs font-medium">Nom</div>
              <div className="w-[30%] text-black-secondary text-xs font-medium">Email</div>
              <div className="w-[25%] text-black-secondary text-xs font-medium">SIREN</div>
              <div className="w-[25%] text-black-secondary text-xs font-medium">Téléphone</div>
            </div>

            {subcontractors.map((sc, idx) => (
              <div
                key={idx}
                className="px-5 py-3 flex items-center gap-[15px] bg-[#fefefe]/40 rounded-[15px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] border border-white/70 backdrop-blur-[10px] hover:bg-slate-100 transition duration-200"
              >
                <div className="w-[30%] text-slate-600 text-xs">{sc.legal_representative}</div>
                <div className="w-[30%] text-slate-600 text-xs">{sc.email}</div>
                <div className="w-[25%] text-slate-600 text-xs">{sc.siren}</div>
                <div className="w-[25%] text-slate-600 text-xs">{sc.phone}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
