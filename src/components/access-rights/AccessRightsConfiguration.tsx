'use client';

import React, { useEffect, useState } from 'react';
import { useTitle } from '@/providers/TitleProvider';
import Button from '@/components/inputs/Button';
import SaveIcon from '@/assets/icons/SaveIcon';
import { getProfilesApi, getFeaturesApi, getRolePermissionsApi, assignPermissionsApi, Feature } from '@/api/authorisationApi';
import { toast } from 'react-toastify';
import PermissionsTable from './AccessRightsPermissionsTable';
import RoleSelector from './AccessRightsRoleSelector';
import { SelectValue } from '@/types/inputType';
import { useRouter } from 'next/navigation';
import { ACCESS_RIGHT_CREATION_ROUTE } from '@/constants/routes';
import CenterSpinner from "../loader/CenterSpinner";

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

type PermissionState = {
  [featureId: number]: {
    read: boolean;
    edit: boolean;
  };
};

function AccessRightsConfiguration() {
  const router = useRouter();
  const { setTitle } = useTitle();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [selectedRole, setSelectedRole] = useState<SelectValue | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [permissions, setPermissions] = useState<PermissionState>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTitle('Configuration des droits d\'accès');

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [profilesData, featuresData] = await Promise.all([
          getProfilesApi(),
          getFeaturesApi(),
        ]);

        setProfiles(profilesData);
        const options: Option[] = profilesData.map((p) => ({
          label: p.name,
          value: p.id,
        }));
        setRoleOptions(options);

        if (options.length > 0) {
          setSelectedRole(options[0].value);
        }

        setFeatures(featuresData);

        const defaultPermissions: PermissionState = {};
        for (const feat of featuresData) {
          defaultPermissions[feat.id] = { read: false, edit: false };
        }
        setPermissions(defaultPermissions);
      } catch (err) {
        console.error('Erreur lors du chargement initial :', err);
        toast.error('Impossible de charger les rôles ou fonctionnalités.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [setTitle]);

  useEffect(() => {
    const loadRolePermissions = async () => {
      if (selectedRole === null || features.length === 0) return;

      try {
        setLoading(true);
        const roleId = Number(selectedRole);
        const resp = await getRolePermissionsApi(roleId);

        const permFromApi: PermissionState = {};
        for (const feat of features) {
          const key = feat.id.toString();
          if (resp.features && resp.features[key]) {
            permFromApi[feat.id] = {
              read: resp.features[key].read,
              edit: resp.features[key].edit,
            };
          } else {
            permFromApi[feat.id] = { read: false, edit: false };
          }
        }
        setPermissions(permFromApi);
      } catch (err) {
        console.error('Erreur lors de la récupération des droits du rôle :', err);
        toast.error('Impossible de charger les droits pour ce rôle.');
      } finally {
        setLoading(false);
      }
    };

    loadRolePermissions();
  }, [selectedRole, features]);

  const togglePermission = (featureId: number, type: 'read' | 'edit') => {
    setPermissions((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [type]: !prev[featureId][type],
      },
    }));
  };

  const handleSave = async () => {
    if (selectedRole === null) {
      toast.error('Veuillez sélectionner un rôle avant d’enregistrer.');
      return;
    }

    const roleObj = profiles.find((p) => p.id === Number(selectedRole));
    if (!roleObj) {
      toast.error('Rôle sélectionné invalide.');
      return;
    }

    const payload = {
      role: {
        id: String(roleObj.id),
        name: roleObj.name,
      },
      features: Object.fromEntries(
        Object.entries(permissions).map(([featId, perms]) => [
          featId,
          { read: perms.read, edit: perms.edit },
        ])
      ),
    };

    try {
      setLoading(true);
      await assignPermissionsApi(payload);
      toast.success('Permissions mises à jour avec succès.');
    } catch (err) {
      console.error('Erreur lors de l’envoi des permissions :', err);
      toast.error('Impossible d’enregistrer les permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && features.length === 0 && profiles.length === 0) {
    return <CenterSpinner />
  }

  return (
    <div className="flex max-md:flex-col p-8 items-start gap-8 w-full flex-wrap">
      <div className="w-full max-w-4xl mx-auto">
        <div className="px-8 py-10 flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Configuration des droits d’accès
          </h2>

          <RoleSelector
            roleOptions={roleOptions}
            selectedRole={Number(selectedRole)}
            onChange={(value) => setSelectedRole(value)}
            onCreateRole={() => {
              router.push(ACCESS_RIGHT_CREATION_ROUTE)
            }}
          />

          <div className="grid grid-cols-[1fr_repeat(2,80px)] px-6 text-xs font-semibold text-gray-600 tracking-wide">
            <div>Module / Fonctionnalité</div>
            <div className="flex justify-center">Lecture</div>
            <div className="flex justify-center">Écriture</div>
          </div>

          <PermissionsTable
            features={features}
            permissions={permissions}
            onToggle={togglePermission}
          />

          <div className="flex justify-end">
            <Button
              label="Enregistrer"
              iconLeft={<SaveIcon active={true} />}
              onClick={handleSave}
              width="w-auto"
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessRightsConfiguration;