import ScoreButton from '@/components/inputs/ScoreButton';
import { FileDetailFile } from '@/types/fileType';
import React, { useEffect } from 'react';

type Props = {
  item: FileDetailFile;
  setCorrectionItem: React.Dispatch<React.SetStateAction<FileDetailFile | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  typeFormulaire: string;
}

const RowTable = (props: Props) => {
  const { item, setCorrectionItem, setOpen, typeFormulaire } = props;

  const className = `text-xs font-bold py-3 px-2 bg-[#FFFFFF66] text-[#3A5F6E] break-words align-top`;
  // useEffect(() => {
  //   console.log('RowTable rendered for type:', item);
  // }, [typeFormulaire]);
  return (
    <tr
        className="border-b-2 border-white cursor-pointer"
        onClick={() => {
            setCorrectionItem(item);
            setOpen(true);
        }}
    >
        <td title={item.infos} className={`${className} pl-3 `}>
            {item.infos}
        </td>
        <td title={item.devis} className={`${className} `}>
            {item.devis}
        </td>
        <td title={item.facture} className={`${className} `}>
            {item.facture}
        </td>
        <td title={item.attestation} className={`${className} `}>
            {item.attestation}
        </td>
        {typeFormulaire === 'RES_EC_104' && <>
          <td title={item.attestation_pose} className={`${className}`}>
              {item.attestation_pose}
          </td>          
        </>
        }

        {typeFormulaire === 'BAR_SE_109' && <>
          <td title={item.attestation_desembouage} className={`${className}`}>
              {item.attestation_desembouage}
          </td>
          <td title={item.cadre_contribution} className={`${className}`}>
              {item.cadre_contribution}
          </td>
        </>
        }
        {['TRA_EQ_114','TRA_EQ_117'].includes(typeFormulaire) && <>
          <td title={item.immatriculation} className={`${className}`}>
              {item.immatriculation}
          </td>
          </>
        }
        {typeFormulaire === 'TRA_EQ_117' && <>
          <td title={item.precarite} className={`${className}`}>
              {item.precarite}
          </td>
          </>
        }
        <td title={item.proposition ?? ""} className={`${className}`}>
            {item.proposition}
        </td>
        <td className={`${className} w-[31px]`}>
            <ScoreButton score={item.score ?? 0} />
        </td>
        <td title={item?.controller_corrections?.[0]?.correction_value} className={`${className}`}>
            {item?.controller_corrections?.[0]?.correction_value ?? '--'}
        </td>
    </tr>
  );
}

export default RowTable;
