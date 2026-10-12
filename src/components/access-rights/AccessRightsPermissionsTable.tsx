import React from 'react';
import CheckBox from '@/components/inputs/CheckBox';
import { Feature } from '@/api/authorisationApi';

type PermissionState = {
  [featureId: number]: {
    read: boolean;
    edit: boolean;
  };
};

interface PermissionsTableProps {
  features: Feature[];
  permissions: PermissionState;
  onToggle: (featureId: number, type: 'read' | 'edit') => void;
}

const PermissionsTable = ({ features, permissions, onToggle }: PermissionsTableProps) => {
  return (
    <div className="rounded-2xl border border-gray-300 overflow-hidden">
      {features.map((feat, idx) => (
        <div
          key={feat.id}
          className={`
            grid grid-cols-[1fr_repeat(2,80px)]
            items-center px-6 py-4
            text-sm text-gray-700
            ${idx < features.length - 1 ? 'border-b border-gray-300' : ''}
          `}
        >
          <div>{feat.name}</div>
          <div className="flex justify-center">
            <CheckBox
                id={`feat-${feat.id}-read`}
              checked={permissions[feat.id]?.read ?? false}
              onChange={() => onToggle(feat.id, 'read')}
            />
          </div>
          <div className="flex justify-center">
            <CheckBox
                id={`feat-${feat.id}-edit`}
              checked={permissions[feat.id]?.edit ?? false}
              onChange={() => onToggle(feat.id, 'edit')}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionsTable;
