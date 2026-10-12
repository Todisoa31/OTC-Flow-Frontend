'use client';

import React, { JSX, useState, useEffect } from 'react';
import {
  Acheteur,
  ApporteurAffaire,
  Beneficiaire,
  ContractPayload,
  DetailContratProps,
  FicheOperation,
  formatLabel,
  Mandataire,
  RAI_OP,
  SignatureFields,
  Vendeur,
} from '@/types/contratType';
import { addContratAPI, updateContratAPI } from '@/api/contrat';
import Spinner from '../loader/PanelSprinner';
import CloseIcon from '@/assets/icons/NotificationIcons/CloseIcon';
import { getInitialFormData } from '@/types/initialFormDataContrat';
import { UseAdminStore } from '@/stores/AdministratorStore';

interface AddContratModalProps {
  data: DetailContratProps;
  section: string;
  onClose: (addedData?: DetailContratProps, addedSection?: string) => void;
}

interface InputFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (val: string) => void;
  readOnly?: boolean;
  onBlur?: () => void;
}

interface TarificationStructure {
  type: 'simple' | 'cee' | 'seuil' | 'paliers';
  unit: string;
  value?: number;
  seuil?: number;
  seuil_display?: string;
  prix_inferieurs?: number;
  prix_superieurs?: number;
  cee_classique?: number;
  cee_precarite?: number;
  original_data?: Record<string, any>;
}

type TarificationField = {
  field: keyof TarificationStructure;
  type: string;
  label: string;
  placeholder?: string;
};

const TYPE_FIELDS: Record<TarificationStructure["type"], TarificationField[]> = {
  seuil: [
    { field: "seuil", type: "number", label: "Seuil" },
    { field: "seuil_display", type: "text", label: "Seuil Appliqué", placeholder: "Ex : 500 MWhc" },
    { field: "prix_inferieurs", type: "number", label: "Prix Inférieurs" },
    { field: "prix_superieurs", type: "number", label: "Prix Supérieurs" },
  ],
  cee: [
    { field: "cee_classique", type: "number", label: "CEE Classique" },
    { field: "cee_precarite", type: "number", label: "CEE Précarité" },
  ],
  simple: [
    { field: "value", type: "number", label: "Valeur" },
  ],
  paliers: [
    { field: "seuil", type: "number", label: "Seuil" },
    { field: "prix_inferieurs", type: "number", label: "Prix Inférieurs" },
    { field: "prix_superieurs", type: "number", label: "Prix Supérieurs" },
  ],
};

const InputField = ({ label, value, onChange, readOnly, onBlur }: InputFieldProps) => (
  <div className="flex flex-1 flex-col gap-2">
    <label className="text-[#3A5F6E] text-sm font-medium">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 px-4 bg-[#1018280D] rounded-[10px] text-sm font-medium text-[#101828]"
      onBlur={onBlur}
      readOnly={readOnly}
    />
  </div>
);

const formAdder = (
  setFormData: React.Dispatch<React.SetStateAction<DetailContratProps>>
) => (path: string, value: any) => {
  setFormData((prev) => {
    const keys = path.split('.');
    const updated = { ...prev };
    let current: any = updated;
    keys.slice(0, -1).forEach((key) => {
      if (!current[key]) current[key] = {};
      current = current[key];
    });
    if (
      typeof current[keys.at(-1)!] === 'object' &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      current[keys.at(-1)!] = {
        ...current[keys.at(-1)!],
        ...value,
      };
    } else {
      current[keys.at(-1)!] = value;
    }
    return updated;
  });
};

const renderInputGroup = (
  fields: string[],
  basePath: string,
  formData: any,
  onChange: (path: string, value: any) => void
) => (
  <div className="flex flex-col gap-6">
    {fields
      .map((key) => (
        <InputField
          key={key}
          label={formatLabel(key.replace(`${basePath}_`, ''))}
          value={formData?.[key] ?? ''}
          onChange={(val) => onChange(`${basePath}.${key}`, val)}
        />
      ))
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

const renderSimpleFields = (
  fields: { label: string; path: string }[],
  formData: DetailContratProps,
  onChange: (path: string, value: string) => void
) => (
  <div className="flex flex-col gap-6">
    {fields.map(({ label, path }) => (
      <InputField
        key={path}
        label={label}
        value={path.split('.').reduce((acc: any, key) => acc?.[key], formData) || ''}
        onChange={(val) => onChange(path, val)}
      />
    ))}
  </div>
);

const SECTEURS = [
  'residentiel',
  'tertiaire',
  'industrie',
  'agriculture',
  'reseaux',
  'transport',
];

const AddContratModal = ({ section, onClose, 
    data }: AddContratModalProps) => {
        const { setUpdateContratDetail } = UseAdminStore();
      
  const [formData, setFormData] = useState<DetailContratProps>(getInitialFormData());
  const [loading, setLoading] = useState(false);

  // State pour secteurs cochés (fiche_op)
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [ceeInputValues, setCeeInputValues] = useState<Partial<Record<typeof SECTEURS[number], string>>>({});


  useEffect(() => {
    if (section.toLowerCase().startsWith('fiche opération')) {
      const ficheOp = formData.contrat_fiche_op || {};
      const secteursChecked = SECTEURS.filter((sector) => {
        const applicableKey = `fiche_op_${sector}_applicable` as keyof typeof ficheOp;
        const ceeKey = `fiche_op_${sector}_cee` as keyof typeof ficheOp;

        const isApplicable = ficheOp[applicableKey] && ficheOp[applicableKey].toString().trim() !== '';
        const ceeArray = Array.isArray(ficheOp[ceeKey]) ? ficheOp[ceeKey] : [];
        const ceeCleaned = ceeArray.filter((item) => item.trim() !== '');

        return isApplicable || ceeCleaned.length > 0;
      });
      setSelectedSectors(secteursChecked);
    } else {
      setSelectedSectors([]);
    }
  }, [formData.contrat_fiche_op, section]);

  const handleChange = (path: string, value: any) => {
    if (path.startsWith('fiche_op.')) {
      const key = path.replace('fiche_op.', '');

      setFormData((prev) => {
        const prevFicheOp = prev.fiche_op || {
          id: 0,
          contrat: 0,
          fiche_op_residentiel_applicable: '',
          fiche_op_residentiel_cee: [],
          fiche_op_tertiaire_applicable: '',
          fiche_op_tertiaire_cee: [],
          fiche_op_industrie_applicable: '',
          fiche_op_industrie_cee: [],
          fiche_op_agriculture_applicable: '',
          fiche_op_agriculture_cee: [],
          fiche_op_reseaux_applicable: '',
          fiche_op_reseaux_cee: [],
          fiche_op_transport_applicable: '',
          fiche_op_transport_cee: [],
        };

        return {
          ...prev,
          fiche_op: {
            ...prevFicheOp,
            [key]: value,
          },
        };
      });

    } else if (path.startsWith('contrat_fiche_op.')) {
      const key = path.replace('contrat_fiche_op.', '');

      setFormData((prev) => {
        const prevContratFicheOp = prev.contrat_fiche_op || {
          id: 0,
          contrat: 0,
          fiche_op_residentiel_applicable: '',
          fiche_op_residentiel_cee: [],
          fiche_op_tertiaire_applicable: '',
          fiche_op_tertiaire_cee: [],
          fiche_op_industrie_applicable: '',
          fiche_op_industrie_cee: [],
          fiche_op_agriculture_applicable: '',
          fiche_op_agriculture_cee: [],
          fiche_op_reseaux_applicable: '',
          fiche_op_reseaux_cee: [],
          fiche_op_transport_applicable: '',
          fiche_op_transport_cee: [],
        };

        return {
          ...prev,
          contrat_fiche_op: {
            ...prevContratFicheOp,
            [key]: value,
          },
        };
      });

    } else {
      formAdder(setFormData)(path, value);
    }
  };

  const handleSectorCheckboxChange = (sector: string) => {
    setSelectedSectors((prev) => {
      let newSelected: string[];

      if (prev.includes(sector)) {
        // On décoche le secteur, on vide uniquement ce secteur
        newSelected = prev.filter((s) => s !== sector);
        setFormData((prevForm) => {
          const prevFicheOp = prevForm.contrat_fiche_op || {};
          const applicableKey = `fiche_op_${sector}_applicable` as keyof typeof prevFicheOp;
          const ceeKey = `fiche_op_${sector}_cee` as keyof typeof prevFicheOp;

          // On ne touche qu'aux secteurs modifiés
          const newContratFicheOp = { ...prevFicheOp };
          delete newContratFicheOp[applicableKey];
          delete newContratFicheOp[ceeKey];

          return {
            ...prevForm,
            contrat_fiche_op: newContratFicheOp,
          };
        });
      } else {
        newSelected = [...prev, sector];
        setFormData((prevForm) => {
          const prevFicheOp = prevForm.contrat_fiche_op || {};
          const applicableKey = `fiche_op_${sector}_applicable` as keyof typeof prevFicheOp;
          const ceeKey = `fiche_op_${sector}_cee` as keyof typeof prevFicheOp;

          // Initialisation des valeurs pour ce secteur
          const ceeCleaned = Array.isArray(prevFicheOp[ceeKey])
            ? (prevFicheOp[ceeKey] as string[]).filter((item) => item.trim() !== '')
            : [];

          return {
            ...prevForm,
            contrat_fiche_op: {
              ...prevFicheOp,
              [applicableKey]: prevFicheOp[applicableKey] || 'En vigueur',
              [ceeKey]: ceeCleaned,
            },
          };
        });
      }

      return newSelected;
    });
  };

  const renderFicheOperationFields = () => {
    const ficheOpContrat = formData.contrat_fiche_op || {};
    const ficheOp = formData.fiche_op || {} as FicheOperation;

    const getValue = (key: keyof FicheOperation) => {
      const value = ficheOpContrat[key] ?? ficheOp[key];
      return Array.isArray(value) ? value.join(', ') : value ?? '';
    };

    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          {SECTEURS.map((sector) => (
            <label key={sector} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSectors.includes(sector)}
                onChange={() => handleSectorCheckboxChange(sector)}
              />
              {sector.charAt(0).toUpperCase() + sector.slice(1)}
            </label>
          ))}
        </div>

        {selectedSectors.length === 0 && <p>Aucun secteur sélectionné</p>}

        {selectedSectors.map((sector) => {
          const applicableKey = `fiche_op_${sector}_applicable` as keyof FicheOperation;
          const ceeKey = `fiche_op_${sector}_cee` as keyof FicheOperation;

          return (
            <div key={sector} className="border p-4 rounded-lg">
              <h3 className="font-bold capitalize mb-2">{sector}</h3>

              <InputField
                label={`Applicable (${sector})`}
                value={getValue(applicableKey)}
                onChange={(val) => handleChange(`contrat_fiche_op.${applicableKey}`, val)}
              />
              <InputField
                label={`CEE (${sector}) (séparés par des virgules)`}
                value={
                  ceeInputValues[sector] ??
                  (Array.isArray(ficheOp[ceeKey]) ? (ficheOp[ceeKey] as string[]).join(', ') : '')
                }
                onChange={(val) => {
                  setCeeInputValues((prev) => ({ ...prev, [sector]: val }));
                }}
                onBlur={() => {
                  const rawVal = ceeInputValues[sector] ?? '';
                  const formatted = rawVal
                    .split(',')
                    .map((item) => item.trim())
                    .filter((item) => item !== '');
                  handleChange(`contrat_fiche_op.${ceeKey}`, formatted);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderModaliteFinanciereFields = () => {
    const tarificationStructure =
      formData.tarification_structure || ({} as TarificationStructure);

    const isTarificationStructure = (obj: any): obj is TarificationStructure => {
      return obj && typeof obj === "object" && "type" in obj;
    };

    const getValue = (key: keyof TarificationStructure) => {
      if (isTarificationStructure(tarificationStructure)) {
        return tarificationStructure[key] ?? "";
      }
      return "";
    };

    const handleFieldChange = (field: string, value: string | number | Record<string, any>) => {
      handleChange(`tarification_structure.${field}`, value);
    };

    const renderField = (field: {
      field: keyof TarificationStructure;
      type: string;
      label: string;
      placeholder?: string;
    }) => {
      const val = getValue(field.field);

      // Si c'est un objet, on ne rend pas d'input simple
      if (typeof val === "object" && val !== null) {
        return (
          <div className="flex flex-col gap-1" key={field.field as string}>
            <label className="text-[#3A5F6E] text-sm font-medium">
              {field.label} :
            </label>
            <pre className="p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
              {JSON.stringify(val, null, 2)}
            </pre>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1" key={field.field as string}>
          <label htmlFor={field.field as string} className="text-[#3A5F6E] text-sm font-medium">
            {field.label} :
          </label>
          <input
            type={field.type}
            id={field.field as string}
            value={val as string | number}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.field as string, e.target.value)}
            className="p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65A5BF]"
          />
        </div>
      );
    };

    const TYPE_LABELS: Record<string, string> = {
      simple: "Classiques",
      cee: "Classiques et Précarités",
      seuil: "Seuil",
      paliers: "Paliers",
    };

    const UNIT_OPTIONS = ["MWhc", "GWhc", "kWhc"];

    const toggleRadio = (field: keyof TarificationStructure, option: string) => {
      const current = getValue(field);
      handleChange(`tarification_structure.${field}`, current === option ? "" : option);
    };

    return (
      <div className="flex flex-col gap-6">
        {/* Type de tarification */}
        <div className="flex flex-col gap-4">
          <span className="text-[#3A5F6E] text-sm font-medium">Type de tarification :</span>
          <div className="flex flex-wrap gap-12 pl-10">
            {["simple", "cee", "seuil", "paliers"].map((type) => (
              <label
                key={type}
                htmlFor={type}
                className="flex items-center gap-4 cursor-pointer text-sm font-medium px-2 py-1 rounded hover:bg-[#65A5BF]"
              >
                <input
                  type="radio"
                  id={type}
                  name="tarification_type"
                  value={type}
                  checked={getValue("type") === type}
                  onChange={() => {}}
                  onClick={() => toggleRadio("type", type)}
                  className="h-5 w-5 accent-[#65A5BF] focus:ring-2 focus:ring-[#65A5BF] cursor-pointer"
                />
                <span className="text-[#3A5F6E] pl-3">{TYPE_LABELS[type]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Unité */}
        <div className="flex flex-col gap-4">
          <span className="text-[#3A5F6E] text-sm font-medium">Unité :</span>
          <div className="flex flex-wrap gap-12 pl-10">
            {UNIT_OPTIONS.map((unit) => (
              <label
                key={unit}
                htmlFor={unit}
                className="flex items-center gap-4 cursor-pointer text-sm font-medium px-2 py-1 rounded hover:bg-[#65A5BF]"
              >
                <input
                  type="radio"
                  id={unit}
                  name="tarification_unit"
                  value={unit}
                  checked={getValue("unit") === unit}
                  onChange={() => {}}
                  onClick={() => toggleRadio("unit", unit)}
                  className="h-5 w-5 accent-[#65A5BF] focus:ring-2 focus:ring-[#65A5BF] cursor-pointer"
                />
                <span className="text-[#3A5F6E] pl-3">{unit}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Champs conditionnels */}
        {TYPE_FIELDS[getValue("type") as keyof typeof TYPE_FIELDS]?.map((field) => renderField(field))}
      </div>
    );
  };

  const renderSectionFields = (
    section: string,
    formData: DetailContratProps,
    onChange: (path: string, value: any) => void
  ) => {
    // const contratId = data?.id;
    switch (section) {
      case 'acheteur':
      case 'vendeur':
      case 'mandataire':
      case 'beneficiaire':
        const fields = [
          'nom_societe',
          'type_societe',
          'capital',
          'adresse',
          'ville',
          'numero_rcs',
          'prenom_nom',
          'fonction',
        ].map((f) => `${section}_${f}`);
        return renderInputGroup(fields, section, formData[section], onChange);

      case 'Modalité financière':
        return renderModaliteFinanciereFields();


      case 'Volume':
        return renderSimpleFields(
          [
            { label: 'Volume total contractuel', path: 'mf_volume_total_gwhc' },
            { label: 'Volume mensuel contractuel', path: 'mf_volume_par_mois_gwhc' },
          ],
          formData,
          onChange
        );

      case 'Dates':
        return renderSimpleFields(
          [
            { label: 'Livraison', path: 'date_livraison' },
            { label: 'Signature', path: 'signature.signature_date' },
          ],
          formData,
          onChange
        );

      default:
        if (section.toLowerCase().startsWith('fiche opération')) {
          return renderFicheOperationFields();
        }
        return <p className="text-sm text-[#101828]">Aucune section sélectionnée</p>;
    }
  };

  const convertFinancialModalPayload = (tarificationStructure: TarificationStructure): TarificationStructure => {
    const { type, unit, seuil, seuil_display, prix_inferieurs, prix_superieurs, cee_classique, cee_precarite, value } = tarificationStructure;
    
    const convertedPayload: TarificationStructure = {
      type,
      unit,
    };

    switch (type) {
      case 'simple':
        // Si 'value' est une string ou un number, on force la conversion
        convertedPayload.value = value ? (typeof value === 'string' ? parseFloat(value) : value) : undefined;
        break;
        
      case 'cee':
        // Pas de conversion nécessaire ici pour les champs cee_classique et cee_precarite
        convertedPayload.cee_classique = cee_classique ? (typeof cee_classique === 'string' ? parseFloat(cee_classique) : cee_classique)  : undefined;
        convertedPayload.cee_precarite = cee_precarite ? (typeof cee_precarite === 'string' ? parseFloat(cee_precarite) : cee_precarite)  : undefined;
        break;
        
      case 'seuil':
        // Conversion explicite des valeurs 'seuil', 'prix_inferieurs', et 'prix_superieurs' en number
        convertedPayload.seuil = seuil ? (typeof seuil === 'string' ? parseFloat(seuil) : seuil) : 0;
        convertedPayload.seuil_display = seuil_display ? String(seuil_display) : '';
        convertedPayload.prix_inferieurs = prix_inferieurs ? (typeof prix_inferieurs === 'string' ? parseFloat(prix_inferieurs) : prix_inferieurs) : undefined;
        convertedPayload.prix_superieurs = prix_superieurs ? (typeof prix_superieurs === 'string' ? parseFloat(prix_superieurs) : prix_superieurs) : undefined;
        break;

      case 'paliers':
        convertedPayload.seuil = seuil ? (typeof seuil === 'string' ? parseFloat(seuil) : seuil) : undefined;
        convertedPayload.prix_inferieurs = prix_inferieurs ? (typeof prix_inferieurs === 'string' ? parseFloat(prix_inferieurs) : prix_inferieurs) : undefined;
        convertedPayload.prix_superieurs = prix_superieurs ? (typeof prix_superieurs === 'string' ? parseFloat(prix_superieurs) : prix_superieurs) : undefined;

        // Génération dynamique de original_data à partir des valeurs existantes
        convertedPayload.original_data = {};
        Object.keys(tarificationStructure)
          .filter(k => !["type", "unit", "seuil", "prix_inferieurs", "prix_superieurs"].includes(k))
          .forEach((key) => {
            convertedPayload.original_data = convertedPayload.original_data || {};
            convertedPayload.original_data[key] = (tarificationStructure as any)[key];
          });

        // fallback si original_data vide
        if (Object.keys(convertedPayload.original_data).length === 0) {
          convertedPayload.original_data = {
            prix_inferieurs,
            prix_superieurs
          };
        }
        break;


      default:
        throw new Error(`Type de tarification inconnu : ${type}`);
    }

    return convertedPayload;
  };


  const handleSave = async () => {
    setLoading(true);

    try {
      const id = data?.id ?? 0;

      // Reconstruire la fiche opération si besoin
      const updatedFicheOp = buildUpdatedFicheOp(selectedSectors, formData.contrat_fiche_op);

      // Construire le payload partiel selon la section
      const partialPayload: Partial<ContractPayload> = buildPartialPayload(section, formData, updatedFicheOp);

      // Si la fiche opération n'a pas changé, on ne l'envoie pas
      if (Object.keys(updatedFicheOp).length === 0) {
        delete partialPayload.contrat_fiche_op;
      }

      let added: any;

      switch (section.toLowerCase()) {
        case "modalité financière": {
          const convertedFinancialPayload = formData.tarification_structure && convertFinancialModalPayload(formData.tarification_structure);

          // Normaliser l'ancien tarif en tableau
          const oldTarif = data.tarification_structure;
          const tarificationArray = Array.isArray(oldTarif) ? oldTarif : oldTarif ? [oldTarif] : [];

          // Construire le contratPayload complet
          const contratPayload: ContractPayload = {
            contrat_type: data.contrat_type,
            contrat_nature: data.contrat_nature,
            contrat_name: data.contrat_name,
            mf_somme_globale_ht_par_mwhc: data.mf_somme_globale_ht_par_mwhc ?? 0,
            mf_volume_total_gwhc: data.mf_volume_total_gwhc ?? 0,
            mf_volume_par_mois_gwhc: data.mf_volume_par_mois_gwhc ?? 0,
            prix_total_ht_par_mwhc: data.prix_total_ht_par_mwhc,
            date_livraison: data.date_livraison,
            duree_contrat_en_mois: data.duree_contrat_en_mois,
            status: data.status,
            date_creation: data.date_creation,
            mf_dispositif_cee: data.mf_dispositif_cee,
            tarification_structure: [...tarificationArray, convertedFinancialPayload],
            avenants: data.avenants,
            contrat_acheteur: data.acheteur ?? {} as Acheteur,
            contrat_vendeur: data.vendeur ?? {} as Vendeur,
            contrat_beneficiaire: data.beneficiaire ?? {} as Beneficiaire,
            contrat_mandataire: data.mandataire ?? {} as Mandataire,
            contrat_signature: data.signature ?? {} as SignatureFields,
            contrat_apporteur: data.apporteur ?? {} as ApporteurAffaire,
            contrat_fiche_op: data.fiche_op ?? {} as FicheOperation,
            contrat_rai_op: data.rai_op ?? {} as RAI_OP,
            percentage_delivery: data.percentage_delivery ?? 0,
            contrat_acheteur_nom_societe: data.acheteur_nom_societe,
            contrat_vendeur_nom_societe: data.vendeur_nom_societe,
            contrat_beneficiaire_nom_societe: data.beneficiaire_nom_societe,
            contrat_mandataire_nom_societe: data.mandataire_nom_societe,
            contrat_signature_nom_societe: data.signature_nom_societe,
            contrat_apporteur_nom_societe: data.apporteur_nom_societe,
          };

          added = await updateContratAPI(id, contratPayload);
          break;
        }

        case "fiche opération":
          added = await addContratAPI(id, partialPayload);
          break;
        
        case "modalité financière": {
          if (!formData.tarification_structure) break;

          // Normaliser le payload converti en tableau
          const convertedPayloadArray = Array.isArray(formData.tarification_structure)
            ? formData.tarification_structure.map(convertFinancialModalPayload)
            : [convertFinancialModalPayload(formData.tarification_structure)];

          // Anciennes modalités existantes
          const oldTarif = data.tarification_structure;
          const tarificationArray = Array.isArray(oldTarif)
            ? oldTarif
            : oldTarif
              ? [oldTarif]
              : [];

          // Fusionner et filtrer les éléments valides
          const mergedTarification = [
            ...tarificationArray,
            ...convertedPayloadArray.filter(ts => ts && ["simple", "cee", "seuil", "paliers"].includes(ts.type))
          ];

          // Construire le payload complet
          const contratPayload: ContractPayload = {
            ...data,
            tarification_structure: mergedTarification,
          };

          added = await updateContratAPI(id, contratPayload);
          break;
        }

        default:
          added = await updateContratAPI(id, partialPayload);
          break;
      }

      if (added) {
        setUpdateContratDetail();
        onClose(added, section);
      } else {
        throw new Error("Erreur lors de l'ajout des données");
      }
    } catch (err) {
      console.error("Erreur API :", err);
    } finally {
      setLoading(false);
    }
  };

  // === Utils ===
  const buildUpdatedFicheOp = (
    selectedSectors: string[],
    ficheOpData?: Partial<FicheOperation>
  ): Partial<FicheOperation> => {
    const updated: Partial<FicheOperation> = {};

    for (const sector of selectedSectors) {
      const applicableKey = `fiche_op_${sector}_applicable` as keyof FicheOperation;
      const ceeKey = `fiche_op_${sector}_cee` as keyof FicheOperation;

      const applicableValue = ficheOpData?.[applicableKey];
      const ceeValue = ficheOpData?.[ceeKey];

      const hasCeeArray = Array.isArray(ceeValue) && ceeValue.length > 0;

      if (applicableValue || (Array.isArray(ceeValue) && ceeValue.length > 0)) {
        updated[applicableKey] = (applicableValue ?? 'En vigueur') as any;
        updated[ceeKey] = (hasCeeArray ? ceeValue : []) as any;
      }
    }

    return updated;
  };

  const buildPartialPayload = (
    section: string,
    formData: any,
    updatedFicheOp: Partial<FicheOperation>
  ): Partial<ContractPayload> => {
    const s = section.toLowerCase();
    const payload: Partial<ContractPayload> = {};

    switch (s) {
      case 'acheteur':
        payload.contrat_acheteur = formData.acheteur;
        payload.contrat_acheteur_nom_societe = formData.acheteur_nom_societe;
        break;
      case 'vendeur':
        payload.contrat_vendeur = formData.vendeur;
        payload.contrat_vendeur_nom_societe = formData.vendeur_nom_societe;
        break;
      case 'mandataire':
        payload.contrat_mandataire = formData.mandataire;
        payload.contrat_mandataire_nom_societe = formData.mandataire_nom_societe;
        break;
      case 'beneficiaire':
        payload.contrat_beneficiaire = formData.beneficiaire;
        payload.contrat_beneficiaire_nom_societe = formData.beneficiaire_nom_societe;
        break;
      case 'dates':
        payload.date_livraison = formData.date_livraison;
        payload.contrat_signature = formData.signature;
        payload.contrat_signature_nom_societe = formData.signature_nom_societe;
        break;
      case 'volume':
        payload.mf_volume_total_gwhc = formData.mf_volume_total_gwhc;
        payload.mf_volume_par_mois_gwhc = formData.mf_volume_par_mois_gwhc;
        break;
      case 'modalité financière':
        const ts = formData.tarification_structure;
        if (ts) {
          const typePayload: any = {
            type: ts.type,  
            unit: ts.unit,
          };

          switch (ts.type) {
            case 'seuil':
              typePayload.seuil = ts.seuil;
              typePayload.seuil_display = ts.seuil_display;
              typePayload.prix_inferieurs = ts.prix_inferieurs;
              typePayload.prix_superieurs = ts.prix_superieurs;
              break;
            case 'cee':
              typePayload.cee_classique = ts.cee_classique;
              typePayload.cee_precarite = ts.cee_precarite;
              break;
            case 'simple':
              typePayload.value = ts.value;
              break;
            case 'paliers':
              typePayload.seuil = ts.seuil;
              typePayload.prix_inferieurs = ts.prix_inferieurs;
              typePayload.prix_superieurs = ts.prix_superieurs;

              // Génération dynamique de original_data
              typePayload.original_data = {};
              Object.keys(ts)
                .filter(k => !["type", "unit", "seuil", "prix_inferieurs", "prix_superieurs"].includes(k))
                .forEach((key) => {
                  typePayload.original_data[key] = ts[key];
                });

              // Si original_data est vide, on peut mettre un fallback
              if (Object.keys(typePayload.original_data).length === 0) {
                typePayload.original_data = {
                  "prix_inferieurs": ts.prix_inferieurs,
                  "prix_superieurs": ts.prix_superieurs
                };
              }
              break;
          }

          payload.tarification_structure = typePayload;
        }
        break;
      default:
        if (s.startsWith('fiche opération')) {
          payload.contrat_fiche_op = updatedFicheOp as FicheOperation;
        } else {
          throw new Error(`Section non prise en charge: ${section}`);
        }
    }

    return payload;
  };

  // Reset formData à chaque changement de section
  useEffect(() => {
    setFormData(getInitialFormData());
    setSelectedSectors([]); // reset secteurs cochés
  }, [section]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-[800px] max-w-full bg-white rounded-[40px] overflow-hidden flex flex-col shadow-xl">
        <div className="h-20 px-8 py-5 bg-[#C3D6E9]/30 flex items-center justify-between">
          <h2 className="text-[#101828] text-[18px] font-bold capitalize">{section}</h2>
          <button
            onClick={() => onClose()}
            className="w-10 h-10 bg-white rounded-full hover:bg-gray-300 flex items-center justify-center text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 px-8 py-6 overflow-y-auto max-h-[calc(100vh-220px)]">
          {renderSectionFields(section, formData, handleChange)}
        </div>

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
            className={`h-10 px-5 ${
              loading ? 'bg-gray-400' : 'bg-[#101828]'
            } text-white font-bold text-sm rounded-[10px] shadow-lg`}
          >
            {loading ? <Spinner size="sm" /> : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContratModal;