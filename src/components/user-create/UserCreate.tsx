'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

import Input from '@/components/inputs/Input';
import PasswordInput from '@/components/inputs/PasswordInput';
import Button from '@/components/inputs/Button';
import SaveIcon from '@/assets/icons/SaveIcon';
import MagicIcon from '@/assets/icons/MagicIcon';
import CenterSpinner from '../loader/CenterSpinner';

import {
    getProfilesApi,
    getFeaturesApi,
    getRolePermissionsApi,
    Feature,
} from '@/api/authorisationApi';
import { getUsersByRole, registerUser } from '@/api/user';

import RoleSelector from '@/components/access-rights/AccessRightsRoleSelector';
import PermissionsTable from '@/components/access-rights/AccessRightsPermissionsTable';
import AvatarUploader from '../photo-profil/AvatarUploader';
import Select from '../inputs/Select';
import { useTitle } from '@/providers/TitleProvider';
import TitleWithBack from '../TitleWithBack';

// Définition des types pour les rôles et référents
interface RoleProfile {
  id: number;
  name: string;
  description: string;
  code: string;
}

interface Referent {
  id: number;
  fullname: string;
}

// Structure de permissions (lecture/écriture) par fonctionnalité
type PermissionState = {
  [featureId: number]: {
    read: boolean;
    edit: boolean;
  };
};

export default function CreateUser() {
  const { setTitle } = useTitle();
  // Champs utilisateur
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Rôles disponibles et sélectionné
  const [roles, setRoles] = useState<RoleProfile[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedRoleName, setSelectedRoleName] = useState('');

  // Référents si le rôle sélectionné est "Contrôleur"
  const [referents, setReferents] = useState<Referent[]>([]);
  const [referentId, setReferentId] = useState<number | null>(null);

  // Gestion des permissions
  const [features, setFeatures] = useState<Feature[]>([]);
  const [permissions, setPermissions] = useState<PermissionState>({});
  const [hasModifiedPermissions, setHasModifiedPermissions] = useState(false);

  // États de chargement
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);


  useEffect(() => {
    setTitle(<TitleWithBack title="Ajouter un utilisateur" />);
  }, []);
  // Chargement initial des rôles et fonctionnalités
  useEffect(() => {
    const init = async () => {
      try {
        const [profiles, featureList] = await Promise.all([
          getProfilesApi(),
          getFeaturesApi(),
        ]);

        setRoles(profiles);
        setFeatures(featureList);

        // Initialiser toutes les permissions à false (aucun droit accordé par défaut)
        const initialPerm: PermissionState = {};
        featureList.forEach((f) => {
          initialPerm[f.id] = { read: false, edit: false };
        });
        setPermissions(initialPerm);
      } catch {
        toast.error('Erreur de chargement initial.');
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, []);

  // Chargement des permissions si un rôle est sélectionné (et non modifiées manuellement)
  useEffect(() => {
    if (!selectedRoleId || features.length === 0 || hasModifiedPermissions) return;

    const loadPermissions = async () => {
      try {
        const res = await getRolePermissionsApi(selectedRoleId);
        const loaded: PermissionState = {};

        for (const f of features) {
          const match = res.features?.[f.id.toString()];
          loaded[f.id] = {
            read: match?.read ?? false,
            edit: match?.edit ?? false,
          };
        }
        setPermissions(loaded);
      } catch {
        toast.error('Impossible de charger les permissions du rôle.');
      }
    };

    loadPermissions();
  }, [selectedRoleId, features, hasModifiedPermissions]);

  // Si le rôle sélectionné est "Contrôleur", charger les référents
  useEffect(() => {
    const loadReferents = async () => {
      if (selectedRoleName !== 'Contrôleur') {
        setReferents([]);
        setReferentId(null);
        return;
      }

      try {
        const referents = await getUsersByRole('Référent');
        interface User {
          id: number;
          firstname: string;
          lastname: string;
        }
        const refs = referents.map((u: User) => ({
          id: u.id,
          fullname: `${u.firstname} ${u.lastname}`,
        }));
        setReferents(refs);
      } catch {
        toast.error('Erreur de chargement des référents');
      }
    };

    loadReferents();
  }, [selectedRoleName]);

  // Inverse une permission lecture/écriture pour un module donné
  const togglePermission = (id: number, type: 'read' | 'edit') => {
    setPermissions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: !prev[id][type],
      },
    }));
    setHasModifiedPermissions(true); // Empêche rechargement automatique du rôle
  };

  // Fonction appelée lors de la soumission du formulaire
  const handleRegister = async () => {
    // Validation des champs requis
    if (!nom || !prenom || !email || !motDePasse || !selectedRoleName) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }

    // if (selectedRoleName === 'Contrôleur' && !referentId) {
    //   toast.error('Veuillez sélectionner un référent.');
    //   return;
    // }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', motDePasse);
      formData.append('firstname', prenom);
      formData.append('lastname', nom);
      formData.append('role', selectedRoleName);
      formData.append('status', 'Actif');

      if (referentId !== null) {
        formData.append('referent_id', String(referentId));
      }

      if (avatarFile) {
        formData.append('photo_profil', avatarFile);
      }

      // Construction de l'objet permissions à envoyer
      const featuresPayload = Object.fromEntries(
        Object.entries(permissions).map(([featureId, perm]) => [
          featureId,
          { read: perm.read, edit: perm.edit },
        ])
      );
      formData.append("features", JSON.stringify(featuresPayload));

      // Debug: afficher les données
      for (const pair of formData.entries()) {
        //console.log(pair[0] + ':', pair[1]);
      }

      await registerUser(formData);
      toast.success('Utilisateur enregistré avec succès');
      resetForm(); // Réinitialise le formulaire
    } catch {
      toast.error('Échec de l’enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation des champs du formulaire après enregistrement
  const resetForm = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setMotDePasse('');
    setAvatarFile(null);
    setSelectedRoleId(null);
    setSelectedRoleName('');
    setReferentId(null);
    setHasModifiedPermissions(false);

    // Remise à zéro des permissions
    const initialPerm: PermissionState = {};
    features.forEach((f) => {
      initialPerm[f.id] = { read: false, edit: false };
    });
    setPermissions(initialPerm);
  };

  // Affiche un loader pendant l'initialisation
  if (initializing) return <CenterSpinner />;

  return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <AvatarUploader key={avatarFile ? avatarFile.name : 'default'} image={avatarFile} setImage={setAvatarFile} />

        {/* Champs utilisateur */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nom" value={nom} onChange={setNom} />
          <Input label="Prénom" value={prenom} onChange={setPrenom} />
          <Input label="Email" value={email} onChange={setEmail} />
          <PasswordInput
            label="Mot de passe"
            value={motDePasse}
            onChange={setMotDePasse}
            icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            enableToggle
            show={showPassword}
            onToggleShow={() => setShowPassword(!showPassword)}
            generateIcon={<MagicIcon active />}
            onGenerate={() => setMotDePasse(Math.random().toString(36).slice(-10))}
          />
        </div>

        {/* Sélecteur de rôle */}
        <div className="flex items-center">
          <label className="text-[#3A5F6E] font-roboto font-medium text-[14px] mt-[-0.5rem] mb-[-0.5rem] mr-2">
            Type de profil :
          </label>
        </div>
        <RoleSelector
          roleOptions={roles.map((r) => ({ label: r.name, value: r.id }))}
          selectedRole={selectedRoleId ?? ''}
          onChange={(id) => {
            const role = roles.find((r) => r.id === id);
            setSelectedRoleId(id);
            setSelectedRoleName(role?.name || '');
            setHasModifiedPermissions(false);
          }}
        />

        {/* Sélecteur de référent si rôle = Contrôleur */}
        {selectedRoleName === 'Contrôleur' && (
          <Select
            multiple={false}
            search={false}
            value={referentId ?? ''}
            onChange={(value) => setReferentId(Number(value))}
            options={referents.map((r) => ({
              label: r.fullname,
              value: r.id,
            }))}
            placeholder="Sélectionner un Référent"
            width="w-full h-[50px]"
          />
        )}

        {/* Tableau des permissions */}
        <div>
          <div className="grid grid-cols-[1fr_repeat(2,80px)] leading-[18px] m-4 px-6 text-sm text-gray-600 tracking-wide">
            <div>Module / Fonctionnalité</div>
            <div className="text-center">Lecture</div>
            <div className="text-center">Écriture</div>
          </div>

          <PermissionsTable
            features={features}
            permissions={permissions}
            onToggle={togglePermission}
          />
        </div>

        {/* Bouton d'enregistrement */}
        <div className="flex justify-end">
          <Button
            label="Enregistrer"
            iconLeft={<SaveIcon active />}
            onClick={handleRegister}
            loading={loading}
          />
        </div>
      </div>
  );
}