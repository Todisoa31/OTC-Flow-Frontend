'use client'; // Indique que ce composant fonctionne côté client (Next.js)

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

// Import de composants et outils internes
import { useTitle } from '@/providers/TitleProvider';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import PasswordInput from '@/components/inputs/PasswordInput';
import Select from '@/components/inputs/Select';
import RoleSelector from '@/components/access-rights/AccessRightsRoleSelector';
import PermissionsTable from '@/components/access-rights/AccessRightsPermissionsTable';
import CenterSpinner from '@/components/loader/CenterSpinner';
import SaveIcon from '@/assets/icons/SaveIcon';
import { Eye, EyeOff, LockIcon } from 'lucide-react';
import SuspendDeleteButtons from '../components/deleteAccount';

// Appels API
import {
    getProfilesApi,
    getFeaturesApi,
    getRolePermissionsApi,
    assignPermissionsApi,
    Feature,
} from '@/api/authorisationApi';

import {
    getUsersByRole,
    getUserById,
    updateUserById,
} from '@/api/user';

import AvatarUploader from '@/components/photo-profil/AvatarUploader';
import TitleWithBack from '@/components/TitleWithBack';
import { getFile } from '@/utils/getFile';
import ConfirmRoleChangeModal from './ConfirmRoleChangeModal';

// Interfaces pour typer les données utilisées
interface Profile {
  id: number;
  name: string;
  description: string;
  code: string;
}

interface Option {
  label: string;
  value: number;
}

interface Referent {
  id: number;
  fullname: string;
  photo_profil?: string | null;
}

type PermissionState = {
  [featureId: number]: {
    read: boolean;
    edit: boolean;
  };
};

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  status: string;
  photo_profil?: string;
  created_at?: string;
  is_connected?: boolean;

  profil?: {
    id: number;
    name: string;
    description?: string;
    code?: string;
  };

  features?: {
    [featureId: number]: {
      read: boolean;
      edit: boolean;
    };
  };

  referents?: Referent[];
}


interface State {
  profiles: Profile[];
  features: Feature[];
  roleOptions: Option[];
  roles: Profile[];
  referents: Referent[];
  selectedRole: number | null;
  selectedRoleId: number | null;
  selectedRoleName: string;
  referentId: number | null;
  permissions: PermissionState;
  hasModifiedPermissions: boolean;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
  motDePasse: string;
  showPassword: boolean;
  user: User | null;
  loading: boolean;
  updating: boolean;
  loadingPage: boolean;
}

function UpdateAccount() {
  const { setTitle } = useTitle();
  const { id } = useParams(); // ID utilisateur depuis l'URL

  // État principal de la fiche utilisateur
  const [state, setState] = useState<State>({
    profiles: [],
    features: [],
    roleOptions: [],
    roles: [],
    referents: [],
    selectedRole: null,
    selectedRoleId: null,
    selectedRoleName: '',
    referentId: null,
    permissions: {},
    hasModifiedPermissions: false,
    lastname: '',
    firstname: '',
    email: '',
    role: '',
    motDePasse: '',
    showPassword: false,
    user: null,
    loading: true,
    updating: false,
    loadingPage: true,
  });

  // URL | fichier photo
  const [avatarUrl, setAvatarUrl] = useState<string>(''); 
  const [avatarFile, setAvatarFile] = useState<File | null>(null); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<Profile | null>(null);

  // Fonction pour modifier un champ dans le state
  const setField = useCallback(<K extends keyof State>(field: K, value: State[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Charger les infos de l'utilisateur sélectionné
  const fetchUser = useCallback(async () => {
    try {
      setField('loadingPage', true);
      const [userData, roles] = await Promise.all([
        getUserById(Number(id)),
        getProfilesApi(),
      ]);
      
      const roleObj = roles.find((r) => r.name === userData.role);

      setState((prev) => ({
        ...prev,
        user: {
          ...userData,
          status: ((userData as unknown) as User).status ?? 'Actif',
          features: ((userData as unknown) as User).features ?? {},
        },
        lastname: userData.lastname,
        firstname: userData.firstname,
        email: userData.email,
        role: userData.role,
        roles,
        selectedRoleId: roleObj?.id ?? null,
        selectedRoleName: roleObj?.name ?? '',
        referentId: ((userData as unknown) as User).referents?.[0]?.id ?? null,
        loadingPage: false,
      }));
      setAvatarUrl(userData.photo_profil ? getFile(userData.photo_profil) : '');
    } catch {
      toast.error("Erreur lors du chargement des informations de l'utilisateur.");
      setField('loadingPage', false);
    }
  }, [id, setField]);

  // Charger tous les rôles et fonctionnalités
  const fetchAll = useCallback(async () => {
    try {
      setField('loading', true);
      const [profilesData, featuresData] = await Promise.all([
        getProfilesApi(),
        getFeaturesApi(),
      ]);
      
      const roleOptions = profilesData.map((p) => ({ label: p.name, value: p.id }));
      const defaultPermissions = Object.fromEntries(
        featuresData.map((feat) => [feat.id, { read: false, edit: false }])
      );

      setState((prev) => ({
        ...prev,
        profiles: profilesData,
        features: featuresData,
        roleOptions,
        roles: profilesData,
        // Ne remplace pas le rôle sélectionné si déjà défini
        selectedRole: prev.selectedRole ?? (roleOptions[0]?.value || null),
        selectedRoleId: prev.selectedRoleId ?? (profilesData[0]?.id || null),
        selectedRoleName: prev.selectedRoleName || profilesData[0]?.name || '',
        permissions: defaultPermissions,
        loading: false,
      }));
    } catch {
      toast.error('Impossible de charger les rôles ou fonctionnalités.');
      setField('loading', false);
    }
  }, [setField]);

  // Charger les utilisateurs référents
  const loadReferents = useCallback(async () => {
    try {
      const referents = await getUsersByRole('Référent');
      const formatted = referents.map((u) => ({
        id: u.id,
        fullname: `${u.firstname} ${u.lastname}`,
        photo_profil: u.photo_profil ?? null,
      }));
      setField('referents', formatted);
    } catch {
      toast.error('Erreur de chargement des référents');
    }
  }, [setField]);

  // Charger les permissions liées à un rôle
  const loadRolePermissions = useCallback(
    async (selectedRole: number | null, features: Feature[]) => {
      if (!selectedRole || !features.length) return;
      try {
        setField('loading', true);
        const roleId = Number(selectedRole);
        const resp = await getRolePermissionsApi(roleId);
        const updatedPermissions = Object.fromEntries(
          features.map((feat) => [
            feat.id,
            resp.features?.[feat.id]?.read !== undefined
              ? { read: resp.features[feat.id].read, edit: resp.features[feat.id].edit }
              : { read: false, edit: false },
          ])
        );
        setField('permissions', updatedPermissions);
      } catch {
        toast.error('Impossible de charger les droits pour ce rôle.');
      } finally {
        setField('loading', false);
      }
    },
    [setField]
  );

  // Générer un mot de passe aléatoire
  const genererMotDePasse = () =>
    setField('motDePasse', Math.random().toString(36).slice(-10));

  // Activer/désactiver une permission (lecture/écriture)
  const togglePermission = (id: number, type: 'read' | 'edit') => {
    setState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [id]: {
          ...prev.permissions[id],
          [type]: !prev.permissions[id][type],
        },
      },
      hasModifiedPermissions: true,
    }));
  };

  // Sauvegarder les modifications de l'utilisateur
  const handleSave = async () => {
    if (!state.user) return;
  
    const currentUser = state.user;
    const selectedProfile = state.profiles.find((p) => p.name === state.role);
    const currentProfileId = currentUser.profil?.id;
    const selectedProfileId = selectedProfile?.id;
    const isSameRole = selectedProfileId === currentProfileId;
  
    interface UpdatedUserPayload {
      email: string;
      password?: string;
      role: string;
      firstname: string;
      lastname: string;
      photo_profil?: File;
      referentId?: number;
      features?: {
        [featureId: number]: {
          read: boolean;
          edit: boolean;
        };
      };
    }
  
    const updatedUserPayload: UpdatedUserPayload = {
      email: state.email,
      password: state.motDePasse || undefined,
      role: state.role,
      firstname: state.firstname,
      lastname: state.lastname,
      photo_profil: avatarFile ?? undefined,
      referentId: state.referentId ?? undefined,
      features: Object.fromEntries(
        Object.entries(state.permissions).map(([id, perms]) => [
          id,
          { read: perms.read, edit: perms.edit },
        ])
      ),
    };
  
    try {
      setField('updating', true);
  
      // Mise à jour utilisateur avec les permissions affichées
      await updateUserById(currentUser.id, updatedUserPayload);
  
      // Si le rôle a changé, on met aussi à jour les permissions du rôle
      if (!isSameRole && selectedProfile) {
        await assignPermissionsApi({
          role: {
            id: String(selectedProfile.id),
            name: selectedProfile.name,
          },
          features: updatedUserPayload.features!,
        });
        toast.success('Utilisateur et permissions du rôle mis à jour.');
      } else {
        toast.success('Utilisateur mis à jour.');
      }
  
      await fetchUser();
      setAvatarFile(null);
    } catch {
      toast.error("Impossible d’enregistrer les modifications.");
    } finally {
      setField('updating', false);
    }
  };  


  // Appel initial : charger l'utilisateur
  useEffect(() => {
    if (id) fetchUser();
  }, [fetchUser, id]);

  // Appel initial : charger les rôles/fonctionnalités
  useEffect(() => {
    setTitle(<TitleWithBack title={'Fiche utilisateur'} />);
    fetchAll();
  }, [fetchAll, setTitle]);

  // Appel initial : charger les référents
  useEffect(() => {
    loadReferents();
  }, [loadReferents]);

  // Charger les permissions une fois que le rôle et les features sont prêts
  useEffect(() => {
  // Rôle changé → permissions du rôle
  if (
    state.selectedRoleId &&
    state.selectedRoleId !== state.user?.profil?.id &&
    state.features.length > 0
  ) {
    loadRolePermissions(state.selectedRoleId, state.features);
  }

  // Même rôle → permissions personnalisées de l'utilisateur
  else if (state.user?.features && state.features.length > 0) {
    const userPermissions = Object.fromEntries(
      state.features.map((feat) => [
        feat.id,
        state.user?.features?.[feat.id] ?? { read: false, edit: false },
      ])
    );
    setField('permissions', userPermissions);
  }
}, [state.selectedRoleId, state.features, state.user?.features, state.user?.profil?.id, loadRolePermissions, setField]);


  if (state.loading && !state.features.length && !state.profiles.length)
    return <CenterSpinner />;

  // Affichage du formulaire utilisateur
  return (
    <div className="flex max-md:flex-col p-8 items-start gap-8 w-full flex-wrap">
      <div className="w-full max-w-4xl mx-auto">
        <div className="p-[30px] flex flex-col gap-8">
          {/* En-tête avec photo et bouton supprimer/suspendre */}
          <div className="flex justify-between items-start">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex items-center gap-4">
                <AvatarUploader image={avatarFile} setImage={setAvatarFile} preview={avatarUrl} />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{state.firstname} {state.lastname}</span>
                  <span className="text-sm text-gray-500 mt-1">{state.role}</span>
                </div>
              </div>
              <div className="flex flex-col items-end py-6">
                <SuspendDeleteButtons Users={{ firstname: state.firstname, lastname: state.lastname, role: state.role, status: state.user?.status }} />
              </div>
            </div>
          </div>

          {/* Formulaire de saisie */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <Input label="Nom" value={state.lastname} onChange={(v) => setField('lastname', v)} />
            <Input label="Prénom" value={state.firstname} onChange={(v) => setField('firstname', v)} />
            <Input label="Email" value={state.email} onChange={(v) => setField('email', v)} />
            <PasswordInput
              label="Mot de passe"
              value={state.motDePasse}
              onChange={(v) => setField('motDePasse', v)}
              icon={state.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              enableToggle
              update={genererMotDePasse}
              updateIcon={<LockIcon />}
              show={state.showPassword}
              onToggleShow={() => setField('showPassword', !state.showPassword)}
            />
          </div>

            <label
            className="text-[#3A5F6E] font-roboto font-medium text-[14px] leading-[1px] mb-[-0.5rem] mt-[-0.5rem]"
            >
              Type de profil :
            </label>
            <RoleSelector
              roleOptions={state.roles.map((r) => ({ label: r.name, value: r.id }))}
              selectedRole={state.selectedRoleId ?? ''}
              onChange={(id) => {
                const role = state.roles.find((r) => r.id === id);
                if (!role) return;

                // Stocke le rôle temporairement, n'applique rien pour l'instant
                setPendingRole(role);
                setShowConfirmModal(true);
              }}
            />

          {/* Sélecteur de référent */}
          {state.role === "Contrôleur" && (
            <>
              <label className="text-[#3A5F6E] font-roboto font-medium text-[14px] leading-[1px] mb-[-0.5rem] mt-[-0.5rem]">
                Référent :
              </label>
              <Select
                value={state.referentId ?? ''}
                onChange={(v) => setField('referentId', Number(v))}
                options={state.referents.map((r) => ({
                  value: r.id,
                  label: r.fullname,
                  image: r.photo_profil ? getFile(r.photo_profil) : '/images/usProfil.jpg'
                }))}
                // placeholder="Sélectionner un Référent"
                width="w-full h-[50px]"
                multiple={false}
                search={false}
              />
            </>
          )}

          {/* Table des permissions */}
          <div className="grid grid-cols-[1fr_repeat(2,80px)] px-6 mb-[-0.5rem] text-xs font-semibold text-gray-600 tracking-wide">
            <div>Module / Fonctionnalité</div>
            <div className="flex justify-center">Lecture</div>
            <div className="flex justify-center">Écriture</div>
          </div>

          <PermissionsTable
            features={state.features}
            permissions={state.permissions}
            onToggle={togglePermission}
          />

          {/* Bouton d'enregistrement */}
          <div className="flex justify-end">
            <Button
              label="Enregistrer les Modifications"
              iconLeft={<SaveIcon active />}
              onClick={handleSave}
              width="w-auto"
              loading={state.updating}
              disabled={state.updating || showConfirmModal}
            />
          </div>
        </div>
      </div>

      <ConfirmRoleChangeModal
        isOpen={showConfirmModal}
        newRoleName={pendingRole?.name || ''}
        onCancel={() => {
          setPendingRole(null);
          setShowConfirmModal(false);
        }}
        onConfirm={() => {
          if (!pendingRole) return;

          setState((prev) => ({
            ...prev,
            selectedRole: pendingRole.id,
            selectedRoleId: pendingRole.id,
            selectedRoleName: pendingRole.name,
            role: pendingRole.name,
            hasModifiedPermissions: false,
          }));

          setPendingRole(null);
          setShowConfirmModal(false);
        }}
      />
    </div>
  );
}

export default UpdateAccount;
