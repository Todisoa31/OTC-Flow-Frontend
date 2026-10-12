"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DatePickerIcon from "@/assets/icons/DatePickerIcon";
import EyeIconV2 from "@/assets/icons/EyeIconV2";
import DownloadFileIcon from "@/assets/icons/DownloadFileIcon";
import { ContratListType } from "@/types/contratType";
import { INSTALLER_PROFILE_ROUTE } from "@/constants/routes";
import { DownloadFile } from "@/utils/download";
import { formatFrenchDate } from "@/utils/getHourMinute";
import { renderModaliteItem } from "@/components/contracts/components/details/renderModalite";

type Props = {
  data: ContratListType;
  redirection?: string;
};

const ContractRow = ({ data, redirection }: Props) => {
  const [cKey, setCkey] = useState<string[]>([]);

  useEffect(() => {
    if (!data.fiche_op) return;

    const ceeKeys = Object.keys(data.fiche_op).filter(
      (key) => key.startsWith("fiche_op") && key.endsWith("cee")
    );

    setCkey(
      ceeKeys.map((key) =>
        key.replace(/^fiche_op_/, "").replace(/_cee$/, "")
      )
    );
  }, [data.fiche_op]);

  return (
    <div className="flex flex-col gap-2 bg-[#FFFFFF66] text-[#3A5F6E] rounded-[10px] shadow-md p-[15px] font-[500] text-[12px]">
      <h4 className="font-bold text-black">{data?.contrat_name}</h4>
      <h4>ID : {data?.contratID}</h4>

      {/* Status */}
      <div
        className={`flex gap-2 items-center ${
          data?.status ? "text-[#65BFAA]" : "text-[#FCC567]"
        }`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle
            cx="5"
            cy="5"
            r="5"
            fill={data?.status ? "#65BFAA" : "#FCC567"}
          />
        </svg>
        {data?.status ? "actif" : "expiré"}
      </div>

      {/* Fiche OP */}
      {cKey.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cKey.map((key, index) => (
            <span
              key={index}
              className="bg-[#1018280D] text-[#3A5F6E] text-[12px] p-[10px] rounded-[5px] capitalize"
            >
              {key}
            </span>
          ))}
        </div>
      )}

      {/* Infos */}
      <div>Type : {data?.contrat_type ?? ""}</div>
      <div>
        RAI : <b>{data?.compte_oblige_nom_societe ?? ""}</b>
      </div>
      <div>Volume : {data?.mf_volume_total_gwhc ?? 0} GWhc</div>

      {/* Tarification */}
      {data?.tarification_structure && (
        <div className="flex flex-col gap-1">
          {Array.isArray(data.tarification_structure)
            ? data.tarification_structure.map((modalite: any, idx: number) => (
                <div key={idx}>{renderModaliteItem(modalite)}</div>
              ))
            : renderModaliteItem(data.tarification_structure)}
        </div>
      )}

      <div>Date de création : {formatFrenchDate(data?.date_creation)}</div>

      {/* Signature */}
      <div className="flex items-center gap-2">
        <DatePickerIcon />
        {formatFrenchDate(data?.signature.signature_date ?? "")} -{" "}
        {formatFrenchDate(data?.date_livraison ?? "")}
      </div>

      {/* Actions */}
      <div className="mt-2 w-full flex gap-2 justify-end">
        <Link
          href={
            redirection
              ? `${redirection}/${data?.id}`
              : `${INSTALLER_PROFILE_ROUTE}/${data?.id}`
          }
        >
          <EyeIconV2 />
        </Link>
        <button onClick={() => DownloadFile(data?.file.file)}>
          <DownloadFileIcon />
        </button>
      </div>
    </div>
  );
};

export default ContractRow;
