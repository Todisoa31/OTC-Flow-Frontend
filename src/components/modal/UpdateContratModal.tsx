'use client';

import React, { JSX, useState } from 'react';
import { Acheteur, ApporteurAffaire, Beneficiaire, ContractPayload, DetailContratProps, FicheOperation, formatLabel, Mandataire, RAI_OP, SignatureFields, Vendeur } from '@/types/contratType';
import { updateContratAPI } from '@/api/contrat';
import Spinner from '../loader/PanelSprinner';
import { UseAdminStore } from '@/stores/AdministratorStore';
import CloseIcon from '@/assets/icons/NotificationIcons/CloseIcon';
import { toast } from 'react-toastify';
// import { toContractUpdatePayload } from '@/types/convertContractToDetailContratProps';

interface UpdateContratModalProps {
  data: DetailContratProps;
  section: string;
  onClose: (updatedData?: DetailContratProps, updatedSection?: string) => void;
  avenantId: number | null;
}

interface InputFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (val: string) => void;
  readOnly?: boolean;
}

const InputField = ({ label, value, onChange, readOnly }: InputFieldProps) => (
  <div className="flex flex-1 flex-col gap-2">
    <label className="text-[#3A5F6E] text-sm font-medium">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 px-4 bg-[#1018280D] rounded-[10px] text-sm font-medium text-[#101828]"
      readOnly={readOnly}
    />
  </div>
);

const useFormUpdater = (
  setFormData: React.Dispatch<React.SetStateAction<DetailContratProps>>
) => (path: string, value: any) => {
  setFormData((prev) => {
    const keys = path.split('.');
    const updated: any = { ...prev };
    let current = updated;

    keys.slice(0, -1).forEach((key) => {
      if (!current[key]) current[key] = {};
      current = current[key];
    });

    current[keys.at(-1)!] = value;
    return updated;
  });
};

const renderCompanySection = (
  type: keyof DetailContratProps,
  formData: DetailContratProps,
  onChange: (path: string, value: string) => void
) => {
  const fields = [
    'nom_societe',
    'type_societe',
    'capital',
    'adresse',
    'ville',
    'numero_rcs',
    'prenom_nom',
    'fonction',
  ];

  return (
    <div className="flex flex-col gap-6">
      {fields
        .map((key) => {
          const path = `${type}.${type}_${key}`;
          const value = (formData as any)[type]?.[`${type}_${key}`] || '';
          return (
            <InputField
              key={key}
              label={formatLabel(key)}
              value={value}
              onChange={(val) => onChange(path, val)}
            />
          );
        })
        .reduce((acc: JSX.Element[][], field, index) => {
          const groupIndex = Math.floor(index / 2);
          acc[groupIndex] = acc[groupIndex] || [];
          acc[groupIndex].push(field);
          return acc;
        }, [])
        .map((group, i) => (
          <div key={i} className="flex gap-6">
            {group}
          </div>
        ))}
    </div>
  );
};

const renderSectionFields = (
  section: string,
  formData: DetailContratProps,
  onChange: (path: string, value: any) => void,
  searchTerms: Record<string, string>,
  setSearchTerms: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  avenantId: number | null
) => {
  switch (section) {
    case 'acheteur':
    case 'vendeur':
    case 'mandataire':
    case 'beneficiaire':
      return renderCompanySection(section as keyof DetailContratProps, formData, onChange);

    case "Modalité financière": {
      const avenants = (formData as any).avenants;
      const selectedAvenant =
        Array.isArray(avenants) && avenantId
          ? avenants.find((a: any) => a.id === avenantId)
          : null;

      const renderFields = (ts: any, pathPrefix: string) => {
        if (!ts) return null;

        const title = ts.type ? ts.type.charAt(0).toUpperCase() + ts.type.slice(1) : "Tarification";

        switch (ts.type) {
          case "paliers":
            return (
              <div className="flex flex-col gap-2 p-2 border rounded-md" key={pathPrefix}>
                <h5 className="font-semibold">{title}</h5>
                <InputField
                  label="Prix inférieurs"
                  value={ts.prix_inferieurs}
                  onChange={(val) => onChange(`${pathPrefix}.prix_inferieurs`, val)}
                />
                <InputField
                  label="Prix supérieurs"
                  value={ts.prix_superieurs}
                  onChange={(val) => onChange(`${pathPrefix}.prix_superieurs`, val)}
                />
              </div>
            );

          case "seuil":
            return (
              <div className="flex flex-col gap-2 p-2 border rounded-md" key={pathPrefix}>
                <h5 className="font-semibold">{title}</h5>
                <InputField
                  label="Seuil appliqué"
                  value={ts.seuil_display}
                  onChange={(val) => onChange(`${pathPrefix}.seuil_display`, val)}
                />
                <InputField
                  label="Prix inférieurs"
                  value={ts.prix_inferieurs}
                  onChange={(val) => onChange(`${pathPrefix}.prix_inferieurs`, val)}
                />
                <InputField
                  label="Prix supérieurs"
                  value={ts.prix_superieurs}
                  onChange={(val) => onChange(`${pathPrefix}.prix_superieurs`, val)}
                />
              </div>
            );

          case "simple":
            return (
              <div className="flex flex-col gap-2 p-2 border rounded-md" key={pathPrefix}>
                <h5 className="font-semibold">{title}</h5>
                <InputField
                  label="Valeur"
                  value={ts.value}
                  onChange={(val) => onChange(`${pathPrefix}.value`, val)}
                />
              </div>
            );

          case "cee":
            return (
              <div className="flex flex-col gap-2 p-2 border rounded-md" key={pathPrefix}>
                <h5 className="font-semibold">{title}</h5>
                <InputField
                  label="CEE classique"
                  value={ts.cee_classique}
                  onChange={(val) => onChange(`${pathPrefix}.cee_classique`, val)}
                />
                <InputField
                  label="CEE précarité"
                  value={ts.cee_precarite}
                  onChange={(val) => onChange(`${pathPrefix}.cee_precarite`, val)}
                />
              </div>
            );

          default:
            return (
              <div className="flex flex-col gap-2 p-2 border rounded-md" key={pathPrefix}>
                <h5 className="font-semibold">{title}</h5>
                {Object.entries(ts)
                  .filter(([key]) =>
                    !["type", "unit", "seuil", "seuil_display", "original_data"].includes(key)
                  )
                  .map(([key, value]) => (
                    <InputField
                      key={key}
                      label={formatLabel(key)}
                      value={value as string | number}
                      onChange={(val) => onChange(`${pathPrefix}.${key}`, val)}
                    />
                  ))}
              </div>
            );
        }
      };

      if (selectedAvenant) {
        const mf = selectedAvenant.tarification_structure;
        return (
          <div className="flex flex-col gap-6 p-4 border rounded-lg">
            <h4>Modalité financière avenant #{avenantId}</h4>
            {Array.isArray(mf)
              ? mf.map((item: any, idx: number) =>
                  renderFields(item, `avenants.${avenants.indexOf(selectedAvenant)}.tarification_structure.${idx}`)
                )
              : renderFields(mf, `avenants.${avenants.indexOf(selectedAvenant)}.tarification_structure`)}
          </div>
        );
      }

      const ts = (formData as DetailContratProps).tarification_structure;

      if (Array.isArray(ts)) {
        return (
          <div className="flex flex-col gap-6">
            {ts.map((item, index) =>
              renderFields(item, `tarification_structure.${index}`)
            )}
          </div>
        );
      } else {
        return <div className="flex flex-col gap-6">{renderFields(ts, "tarification_structure")}</div>;
      }
    }

    case 'Volume': {
      const avenants = (formData as any).avenants;
      const selectedAvenant = Array.isArray(avenants) && avenantId
        ? avenants.find((a: any) => a.id === avenantId)
        : null;

      if (selectedAvenant) {
        return (
          <div className="flex flex-col gap-6 p-4 border rounded-lg">
            <h4>Avenant #{avenantId}</h4>

            {'mf_volume_total_gwhc' in selectedAvenant && (
              <InputField
                label={`Volume total contractuel avenant #${avenantId}`}
                value={selectedAvenant.mf_volume_total_gwhc || ''}
                onChange={(val) => onChange(`avenants.${avenants.indexOf(selectedAvenant)}.mf_volume_total_gwhc`, val)}
              />
            )}

            {'mf_volume_par_mois_gwhc' in selectedAvenant && (
              <InputField
                label={`Volume mensuel contractuel avenant #${avenantId}`}
                value={selectedAvenant.mf_volume_par_mois_gwhc || ''}
                onChange={(val) => onChange(`avenants.${avenants.indexOf(selectedAvenant)}.mf_volume_par_mois_gwhc`, val)}
              />
            )}
          </div>
        );
      }

      // Sinon, afficher au niveau principal formData
      return (
        <div className="flex flex-col gap-6">
          <InputField
            label="Volume total contractuel"
            value={(formData as DetailContratProps).mf_volume_total_gwhc || ''}
            onChange={(val) => onChange('mf_volume_total_gwhc', val)}
          />
          <InputField
            label="Volume mensuel contractuel"
            value={(formData as DetailContratProps).mf_volume_par_mois_gwhc || ''}
            onChange={(val) => onChange('mf_volume_par_mois_gwhc', val)}
          />
        </div>
      );
    }

    case 'Dates': {
        const avenants = (formData as any).avenants;
        const selectedAvenant = Array.isArray(avenants) && avenantId
          ? avenants.find((a: any) => a.id === avenantId)
          : null;
          
        if (selectedAvenant) {
        return (
          <div className="flex flex-col gap-6 p-4 border rounded-lg">
            {/* Date livraison, afficher toujours */}
            <label>Date Livraison avenant #{avenantId}</label>
            <input
              type="text"  // <- changer ici
              value={selectedAvenant.date_livraison || ''}
              onChange={(e) => onChange(`avenants.${avenants.indexOf(selectedAvenant)}.date_livraison`, e.target.value)}
              className="border p-1 rounded w-full"
              // placeholder="YYYY-MM-DD" 
            />

            {/* Date signature : afficher uniquement si existe */}
            {selectedAvenant.signature && selectedAvenant.signature.signature_date && (
              <>
                <label>Date Signature avenant #{avenantId}</label>
                <input
                  type="text"  // <- changer ici aussi
                  value={selectedAvenant.signature.signature_date || ''}
                  onChange={(e) => onChange(`avenants.${avenants.indexOf(selectedAvenant)}.signature.signature_date`, e.target.value)}
                  className="border p-1 rounded w-full"
                  // placeholder="YYYY-MM-DD"
                />
              </>
            )}
          </div>
        );
      }

      // Sinon affichage date du contrat principal
      return (
        <div className="flex flex-col gap-6">
          <InputField
            label="Livraison"
            value={(formData as DetailContratProps).date_livraison || ''}
            onChange={(val) => onChange('date_livraison', val)}
          />
          <InputField
            label="Signature"
            value={(formData as DetailContratProps).signature?.signature_date || ''}
            onChange={(val) => onChange('signature.signature_date', val)}
          />
        </div>
      );
    }

    case 'Fiche opération': {
      const fichesOp = Object.entries((formData as DetailContratProps).fiche_op || {}).filter(
        ([, data]) => Array.isArray(data) && data.length > 0
      );

      return (
        <div className="flex flex-col gap-6">
          {fichesOp.map(([category, data]) => {
            const search = searchTerms[category]?.toLowerCase() || '';
            const filtered = data.filter((item: string) => item?.toLowerCase().includes(search));

            return (
              <div key={category} className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-4">
                  <h4 className="capitalize font-semibold text-[#090d0e]">
                    {category.replace('fiche_op_', '').replace('_cee', '').replaceAll('_', ' ')}
                  </h4>
                  <input
                    placeholder="Rechercher..."
                    value={searchTerms[category] || ''}
                    onChange={(e) =>
                      setSearchTerms((prev) => ({ ...prev, [category]: e.target.value }))
                    }
                    className="w-1/2 h-8 px-3 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto px-4">
                  {filtered.length > 0 ? (
                    filtered.map((code: string | number | readonly string[] | undefined, index: number) => (
                      <input
                        key={index}
                        value={code}
                        onChange={(e) => {
                          const updated = [...data];
                          updated[index] = e.target.value;
                          onChange(`fiche_op.${category}`, updated);
                        }}
                        className="h-10 px-4 bg-[#1018280D] rounded-[10px] text-sm text-[#101828]"
                      />
                    ))
                  ) : (
                    <div className="text-sm italic text-gray-400 px-4">Aucun résultat</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    default:
      return <p className="text-sm text-[#101828]">Aucune section sélectionnée</p>;
  }
};

const UpdateContratModal = ({ section, data, avenantId, onClose }: UpdateContratModalProps) => {
  const { setUpdateContratDetail } = UseAdminStore();
  const [formData, setFormData] = useState<DetailContratProps>(data);
  const [loading, setLoading] = useState(false);
  const handleChange = useFormUpdater(setFormData);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  

  const handleSave = async () => {
    setLoading(true);
    try {
      // Payload du contrat principal
      const contratPayload: ContractPayload = {
        contrat_type: formData.contrat_type,
        contrat_nature: formData.contrat_nature,
        contrat_name: formData.contrat_name,
        mf_somme_globale_ht_par_mwhc: formData.mf_somme_globale_ht_par_mwhc ?? 0,
        mf_volume_total_gwhc: formData.mf_volume_total_gwhc ?? 0,
        mf_volume_par_mois_gwhc: formData.mf_volume_par_mois_gwhc ?? 0,
        prix_total_ht_par_mwhc: formData.prix_total_ht_par_mwhc,
        date_livraison: formData.date_livraison,
        duree_contrat_en_mois: formData.duree_contrat_en_mois,
        status: formData.status,
        date_creation: formData.date_creation,
        mf_dispositif_cee: formData.mf_dispositif_cee,
        tarification_structure: formData.tarification_structure
          ? Array.isArray(formData.tarification_structure)
            ? formData.tarification_structure
            : [formData.tarification_structure]
          : undefined,
        avenants: formData.avenants,
        contrat_acheteur: formData.acheteur ?? {} as Acheteur,
        contrat_vendeur: formData.vendeur ?? {} as Vendeur,
        contrat_beneficiaire: formData.beneficiaire ?? {} as Beneficiaire,
        contrat_mandataire: formData.mandataire ?? {} as Mandataire,
        contrat_signature: formData.signature ?? {} as SignatureFields,
        contrat_apporteur: formData.apporteur ?? {} as ApporteurAffaire,
        contrat_fiche_op: formData.fiche_op ?? {} as FicheOperation,
        contrat_rai_op: formData.rai_op ?? {} as RAI_OP,
        percentage_delivery: formData.percentage_delivery ?? 0,
        contrat_acheteur_nom_societe: formData.acheteur_nom_societe,
        contrat_vendeur_nom_societe: formData.vendeur_nom_societe,
        contrat_beneficiaire_nom_societe: formData.beneficiaire_nom_societe,
        contrat_mandataire_nom_societe: formData.mandataire_nom_societe,
        contrat_signature_nom_societe: formData.signature_nom_societe,
        contrat_apporteur_nom_societe: formData.apporteur_nom_societe,
      };

      let payloadToSend;
      let idToSend;

      if (avenantId) {
        const avenant = formData.avenants.find(a => a.id === avenantId);
        if (!avenant) throw new Error("Avenant introuvable");

        payloadToSend = {
          contratID: formData.contratID,
          contrat_type: avenant.contrat_type,
          contrat_nature: avenant.contrat_nature,
          contrat_name: avenant.contrat_name,
          date_creation: formData.date_creation,
          date_livraison: avenant.date_livraison,
          duree_contrat_en_mois: avenant.duree_contrat_en_mois,
          mf_somme_globale_ht_par_mwhc: avenant.mf_somme_globale_ht_par_mwhc,
          mf_volume_total_gwhc: avenant.mf_volume_total_gwhc,
          mf_volume_par_mois_gwhc: avenant.mf_volume_par_mois_gwhc,
          prix_total_ht_par_mwhc: avenant.prix_total_ht_par_mwhc,
          status: formData.status,
          
          tarification_structure: Array.isArray(avenant.tarification_structure)
            ? (avenant.tarification_structure.filter(
                (ts): ts is NonNullable<typeof ts> =>
                  ts !== null &&
                  ["simple", "cee", "seuil", "paliers"].includes(ts.type)
              ) as ContractPayload['tarification_structure'])
            : ([avenant.tarification_structure].filter(
                (ts): ts is NonNullable<typeof ts> =>
                  ts !== null &&
                  ["simple", "cee", "seuil", "paliers"].includes(ts.type)
              ) as ContractPayload['tarification_structure']),
        };

        idToSend = avenant.id;
      } else {
        
        payloadToSend = {
          ...contratPayload,
          tarification_structure: Array.isArray(formData.tarification_structure)
            ? (formData.tarification_structure.filter(
                (ts): ts is NonNullable<typeof ts> =>
                  ts !== null &&
                  ["simple", "cee", "seuil", "paliers"].includes(ts.type)
              ) as ContractPayload['tarification_structure'])
            : ([formData.tarification_structure].filter(
                (ts): ts is NonNullable<typeof ts> =>
                  ts !== null &&
                  ["simple", "cee", "seuil", "paliers"].includes(ts.type)
              ) as ContractPayload['tarification_structure']),
        };
        idToSend = formData.id;
      }

      // Appel API
      const updated = await updateContratAPI(idToSend, payloadToSend);

      if (updated) {
        setUpdateContratDetail();
        onClose(updated, section);
      } else {
        throw new Error('Erreur lors de la mise à jour du contrat');
      }
    } catch (err: any) {
      console.error('Erreur API :', err);
      toast.error(`Erreur lors de la mise à jour de la section "${section}" : ${err?.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-[800px] max-w-full bg-white rounded-[40px] overflow-hidden flex flex-col shadow-xl">
        <div className="h-20 px-8 py-5 bg-[#C3D6E9]/30 flex items-center justify-between">
          <h2 className="text-[#101828] text-[18px] font-bold capitalize">{section}</h2>
          <button onClick={() => onClose()} className="w-10 h-10 bg-white rounded-full hover:bg-gray-300 flex items-center justify-center text-gray-700">
            {/* <div className="w-2.5 h-2.5 bg-[#101828] rounded-full" /> */}
            <CloseIcon/>
          </button>
        </div>

        {/* Conteneur des champs de formulaire avec hauteur défilante */}
        <div className="flex-1 px-8 py-6 overflow-y-auto max-h-[calc(100vh-220px)]">
          {renderSectionFields(section, formData, handleChange, searchTerms, setSearchTerms, avenantId)}
        </div>

        {/* Section du bouton d'enregistrement */}
        <div className="flex justify-end gap-5 px-8 py-4">
          <button
            onClick={() => onClose()}
            className="h-10 px-5 bg-[#646E81] text-white font-bold text-sm rounded-[10px] shadow-md"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`h-10 px-5 ${loading ? 'bg-gray-400' : 'bg-[#101828]'} text-white font-bold text-sm rounded-[10px] shadow-lg`}
          >
            {loading ? <Spinner size="sm" /> : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateContratModal;