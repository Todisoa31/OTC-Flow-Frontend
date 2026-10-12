"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { updateFileStatusApi } from "@/api/recordInstallerApi";
import CommentIcon from "@/assets/icons/CommentIcon";
import ScoreButton from "@/components/inputs/ScoreButton";
import Select from "@/components/inputs/Select";
import CorrectionReferentModal from "@/components/modal/CorrectionModalReferent";
import { STATUSES_OPTIONS } from "@/constants/records";
import { UseCommentStore } from "@/stores/commentStore";
import {
  AttesationHonorType,
  FileDetailFile,
  TableType,
} from "@/types/fileType";
import { Statuses } from "@/types/recordType";
import {
  headDevisFactAhAttPose,
  headDevisFactAh,
  headDevisFactAhAttDeContrib,
  headDevisFactAhImmatriculation,
  headDevisFactAhImmatriculationPrecarite,
} from "@/constants/headDetailTable";

type Props = {
  data: AttesationHonorType;
  status: string;
  typeDossier: string;
};

const TABLE_HEADERS = [
  "Cadre de l'attestation sur l'honneur",
  "Devis",
  "Facture",
  "Attestation sur l'honneur",
  "Attestestation de Pose",
  "Proposition",
  "Score",
  "Correction",
];

export default function CertificatedOfhonor({
  data,
  status,
  typeDossier,
}: Props) {
  const { file_id } = useParams();
  const { setShow } = UseCommentStore();

  const [selectStatus, setSelectStatus] = useState<string>(status);
  const [tableHead, setTableHead] = useState<TableType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [correctionItem, setCorrectionItem] = useState<FileDetailFile | null>();
  const className = "text-xs font-bold py-3 px-2 bg-[#FFFFFF66] text-[#3A5F6E] break-words align-top";

  const handleChangeStatus = async (status: string) => {
    try {
      await updateFileStatusApi(Number(file_id), status as Statuses);
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite !");
    }
  };

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

  const renderTable = (cadre: FileDetailFile[], cadreTitle: string) => (
    <table className="w-full table-fixed border-separate border-spacing-0">
      <thead className="sticky top-0">
        <tr>
          {tableHead.map((item, index) => (
            <th
              key={index}
              className={`text-left font-[400] ${item.width} text-xs font-bold py-3 px-2 bg-[#65A5BF] text-white first:rounded-tl-[15px] last:rounded-tr-[15px]`}
            >
              {index === 0 ? cadreTitle : item.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cadre.map((item, index) => (
          <tr
            key={index}
            className="border-b-2 border-white cursor-pointer"
            onClick={() => {
              setCorrectionItem(item);
              setOpen(true);
            }}
          >
            <td
              title={item.infos}
              className={`${className} pl-3`}
            >
              {item.infos}
            </td>
            <td
              title={item.devis}
              className={`${className}`}
            >
              {item.devis}
            </td>
            <td
              title={item.facture}
              className={`${className}`}
            >
              {item.facture}
            </td>
            <td
              title={item.attestation}
              className={`${className}`}
            >
              {item.attestation}
            </td>
            {typeDossier === "RES_EC_104" && (
              <>
                <td
                  title={item.attestation_pose}
                  className={`${className}`}
                >
                  {item.attestation_pose}
                </td>
              </>
            )}

            {typeDossier === "BAR_SE_109" && (
              <>
                <td
                  title={item.attestation_desembouage}
                  className={`${className}`}
                >
                  {item.attestation_desembouage}
                </td>
                <td
                  title={item.cadre_contribution}
                  className={`${className}`}
                >
                  {item.cadre_contribution}
                </td>
              </>
            )}
            {['TRA_EQ_114','TRA_EQ_117'].includes(typeDossier) && <>
                <td title={item.immatriculation} className={`${className}`}>
                    {item.immatriculation}
                </td>
                </>
              }
              {typeDossier === 'TRA_EQ_117' && <>
                <td title={item.precarite} className={`${className}`}>
                    {item.precarite}
                </td>
                </>
              }
            <td
              title={item.proposition ?? ""}
              className={`${className}`}
            >
              {item.proposition}
            </td>
            <td className={`${className}`}>
              <ScoreButton score={item.score ?? 0} />
            </td>
            <td
              title={item?.controller_corrections?.[0]?.correction_value ?? undefined}
              className={`${className}`}
            >
              {item?.controller_corrections?.[0]?.correction_value ?? "--"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-black text-[24px] font-bold">
            Attestation sur l&apos;honneur
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShow(true)}
              className="bg-[#65A5BF] py-2 px-4 text-white w-fit flex items-center gap-2 rounded-[10px] text-xs font-bold"
            >
              <CommentIcon />
              Commentaires
            </button>
            <Select
              options={STATUSES_OPTIONS}
              onChange={(value) => {
                const newStatus = String(value);
                setSelectStatus(newStatus);
                handleChangeStatus(newStatus);
              }}
              value={selectStatus ?? ""}
              multiple={false}
              search={false}
            />
          </div>
        </div>

        {renderTable(data.cadreA, "Cadre A de l'attestation sur l'honneur")}
        {renderTable(data.cadreB, "Cadre B de l'attestation sur l'honneur")}
        {renderTable(data.cadreC, "Cadre C de l'attestation sur l'honneur")}
      </div>

      {correctionItem && (
        <CorrectionReferentModal
          open={open}
          setOpen={setOpen}
          item={correctionItem}
          typeFormulaire={typeDossier}
        />
      )}
    </>
  );
}
