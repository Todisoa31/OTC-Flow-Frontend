
import React, { Dispatch, SetStateAction } from 'react';
import TableImmatriculation from './Tra-eq-table/TableImmatriculation';
import TableDevis from './Tra-eq-table/TableDevis';
import TableFacture from './Tra-eq-table/TableFacture';

type Props = {
  item: Record<string, any>;
  setEdit: Dispatch<SetStateAction<{show: boolean; item: Record<string, any> | null}>>;  
  file_type: string;
}

const RowTableMultiple = (props: Props) => {  
  const { item, setEdit, file_type } = props;      
  switch (file_type) {
    case 'file_immatriculation':
      return <TableImmatriculation item={item} setEdit={setEdit} />;
    case 'file_devis':
      return <TableDevis item={item} setEdit={setEdit} />;
    case 'file_facture':
      return <TableFacture item={item} setEdit={setEdit} />;
    default:
      return <div>Aucun tableau disponible pour ce type de dossier.</div>;
  }  
}

export default RowTableMultiple;
