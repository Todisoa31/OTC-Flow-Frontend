import React from 'react';
import Select from '@/components/inputs/Select';
import Button from '@/components/inputs/Button';
import AddIcon from '@/assets/icons/AddIcon';

// Interface définissant une option de rôle (label visible et valeur associée)
interface Option {
  label: string;
  value: number;
}

// Interface des props attendues par le composant RoleSelector
interface RoleSelectorProps {
  roleOptions: Option[];
  selectedRole: number | string;
  onChange: (value: number | null) => void;
  onCreateRole?: () => void;
}

// Composant fonctionnel affichant un sélecteur de rôle et un bouton pour en créer un nouveau
const RoleSelector = ({
  roleOptions,
  selectedRole,
  onChange,
  onCreateRole,
}: RoleSelectorProps) => (
  <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 h-[50px] rounded-[10px] bg-white border border-white text-gray-500">
    
    {/* Sélecteur de rôle */}
    <Select
      multiple={false}
      search={false}
      value={selectedRole}
      onChange={(value) => {
        const parsed = Number(value);
        onChange(isNaN(parsed) ? null : parsed);
      }}
      options={roleOptions}
      width="flex-1"
    />

    {/* Bouton pour créer un nouveau rôle, affiché uniquement si la prop onCreateRole est définie */}
    {onCreateRole && (
      <Button
        label="Créer un nouveau rôle"
        iconLeft={<AddIcon active={true} />}
        onClick={onCreateRole}
        width="w-auto"
      />
    )}
  </div>
);

export default RoleSelector;
