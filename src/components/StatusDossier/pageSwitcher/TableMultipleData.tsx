import { headDevisTRA_EQ, headFactureTRA_EQ, headImmatriculationTRA_EQ } from '@/constants/headDetailTable';
import { ImmatriculationTraType, TableType } from '@/types/fileType';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import RowTable from './RowTable';
import RowTableMultiple from './RowMultiple';
import { UseReferentFileStore } from '@/stores/ReferentFileStore';
type Props = {
  data: Record<string, any>[];
  setEdit: Dispatch<SetStateAction<{show: boolean; item: Record<string, any> | null}>>; 
}

const TableMultipleData = (props: Props) => {
  const { activeMenuSwitcher } = UseReferentFileStore();

 const { data, setEdit } = props;
 const [tableHead, setTableHead] = useState<TableType[]>([]);
 
 useEffect(() => {
  switch (activeMenuSwitcher?.code) {
    case 'file_immatriculation':
      setTableHead(headImmatriculationTRA_EQ);
      break;
    case 'file_devis':
      setTableHead(headDevisTRA_EQ);
      break;
    case 'file_facture':
      setTableHead(headFactureTRA_EQ);
      break;
    
    default:
      setTableHead([]);
      break;
  }  
 }, [activeMenuSwitcher]);

  return (
    <table className="w-full table-fixed border-separate border-spacing-0">
      <thead className="sticky top-0">
        <tr>
          {tableHead.map((item, index) => (
            <th
              key={index}
              title={item.label}
              style={{ width: item.width }}
              className={`text-left font-[400] ${item.width} text-xs  font-bold py-3 px-2 bg-[#65A5BF] text-white first:rounded-tl-[15px] last:rounded-tr-[15px] max-w-[270px] align-bottom`}
            >
              {item.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => (
          <RowTableMultiple
            key={index}
            item={item}
            setEdit={setEdit}
            file_type={activeMenuSwitcher?.code || ''}
          />
        ))}
      </tbody>
    </table>
  );
}

export default TableMultipleData;
