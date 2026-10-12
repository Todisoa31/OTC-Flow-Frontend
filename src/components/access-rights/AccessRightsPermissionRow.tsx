import React from 'react';
import CheckBox from '@/components/inputs/CheckBox';
import { Feature } from '@/api/authorisationApi';

interface PermissionRowProps {
  feature: Feature;
  read: boolean;
  edit: boolean;
  onToggle: (featureId: number, type: 'read' | 'edit') => void;
}

const PermissionRow: React.FC<PermissionRowProps> = ({ feature, read, edit, onToggle }) => {
  return (
    <div
      className={`
        grid grid-cols-[1fr_repeat(2,80px)]
        items-center px-6 py-4
        text-sm text-gray-700
      `}
    >
      <div>{feature.name}</div>

      {/* Checkbox Lecture */}
      <div className="flex justify-center">
        <CheckBox
          id={`feat-${feature.id}-read`}
          checked={read}
          onChange={() => onToggle(feature.id, 'read')}
        />
      </div>

      {/* Checkbox Écriture */}
      <div className="flex justify-center">
        <CheckBox
          id={`feat-${feature.id}-edit`}
          checked={edit}
          onChange={() => onToggle(feature.id, 'edit')}
        />
      </div>
    </div>
  );
};

export default PermissionRow;
