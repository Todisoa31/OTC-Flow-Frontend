'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTitle } from '@/providers/TitleProvider';
import Button from '@/components/inputs/Button';
import SaveIcon from '@/assets/icons/SaveIcon';
import Input from '@/components/inputs/Input';
import PermissionsTable from './AccessRightsPermissionsTable';
import { getFeaturesApi, assignPermissionsApi, Feature } from '@/api/authorisationApi';
import { toast } from 'react-toastify';
import { ACCESS_RIGHT_CONFIGURATION_ROUTE } from '@/constants/routes';

interface PermissionState {
  [featureId: number]: {
    read: boolean;
    edit: boolean;
  };
}

const CreateRole = () => {
  const { setTitle } = useTitle();
  const router = useRouter();

  const [roleName, setRoleName] = useState('');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [permissions, setPermissions] = useState<PermissionState>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle('Créer un nouveau rôle');

    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const featuresData = await getFeaturesApi();
        setFeatures(featuresData);

        const defaultPermissions: PermissionState = {};
        for (const feat of featuresData) {
          defaultPermissions[feat.id] = { read: false, edit: false };
        }
        setPermissions(defaultPermissions);
      } catch (err) {
        console.error('Erreur lors du chargement des fonctionnalités :', err);
        toast.error('Impossible de charger les fonctionnalités.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, [setTitle]);

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
    if (!roleName.trim()) {
        toast.error('Le nom du rôle est requis.');
        return;
    }

    try {
        setLoading(true);

        // Clés de l'objet features doivent être des strings
        const featuresPayload = Object.fromEntries(
        Object.entries(permissions).map(([featureId, perms]) => [
            String(featureId),
            { read: perms.read, edit: perms.edit }
        ])
        );

        const payload = {
        role: {
            name: roleName.trim(),
        },
        features: featuresPayload,
        };

        await assignPermissionsApi(payload);
        toast.success('Rôle créé avec succès.');
        router.push(ACCESS_RIGHT_CONFIGURATION_ROUTE);
    } catch (err) {
        console.error('Erreur lors de la création du rôle :', err);
        toast.error('Impossible de créer le rôle.');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="flex max-md:flex-col p-8 items-start gap-8 w-full flex-wrap">
      <div className="w-full max-w-4xl mx-auto">
        <div className="px-8 py-10 flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-gray-800">Créer un nouveau rôle</h2>

          <div className="flex flex-col gap-4">
            <Input
              label="Nom du rôle"
              value={roleName}
              onChange={setRoleName}
              isRequired
            />
          </div>

          <div className="grid grid-cols-[1fr_repeat(2,80px)] px-6 text-xs font-semibold text-gray-600 tracking-wide">
            <div>Fonctionnalité</div>
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
};

export default CreateRole;
