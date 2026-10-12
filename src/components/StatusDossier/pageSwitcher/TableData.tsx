import React, { useEffect, useState } from "react";
import RowTable from "./RowTable";
import { TableType, FileDetailFile } from "@/types/fileType";
import {
  headDevisFactAh,
  headDevisFactAhAttDeContrib,
  headDevisFactAhAttPose,
  headDevisFactAhImmatriculation,
  headDevisFactAhImmatriculationPrecarite,
} from "@/constants/headDetailTable";
import { FOLDER_TYPES } from "@/constants/records";

type Props = {
  data: FileDetailFile[];
  setCorrectionItem: React.Dispatch<
    React.SetStateAction<FileDetailFile | null>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  typeDossier: string;
};

const TableData = (props: Props) => {
  const { data, setCorrectionItem, setOpen, typeDossier } = props;
  const [tableHead, setTableHead] = useState<TableType[]>([]);


  useEffect(() => {
    switch (typeDossier) {
      case "RES_EC_104":
        setTableHead(headDevisFactAhAttPose);        
        break;

      case "BAT_TH_146":
      case "BAR_TH_160":
        setTableHead(headDevisFactAh);        
        break;

      case "BAR_SE_109":
      case "BAR_SE_108":
        setTableHead(headDevisFactAhAttDeContrib);        
        break;

      case "TRA_EQ_114":
        setTableHead(headDevisFactAhImmatriculation);        
        break;
        
      case "TRA_EQ_117":
        setTableHead(headDevisFactAhImmatriculationPrecarite);        
        break;
      default:
        setTableHead([]);
        break;
    }
  }, [typeDossier]);

 

  return (
    <table className="w-full table-fixed border-separate border-spacing-0">
      <thead className="sticky top-0">
        <tr>
          {tableHead.map((item, index) => (
            <th
              key={index}
              className={`text-left font-[400] ${item.width} text-xs font-bold py-3 px-2 bg-[#65A5BF] text-white first:rounded-tl-[15px] last:rounded-tr-[15px]`}
            >
              {item.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => (
          <RowTable
            key={index}
            item={item}
            setCorrectionItem={setCorrectionItem}
            setOpen={setOpen}
            typeFormulaire={typeDossier}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TableData;
