import { updateFileStatusApi } from "@/api/recordInstallerApi";
import CommentIcon from "@/assets/icons/CommentIcon";
import PencilIcon from "@/assets/icons/PencilIcon";
import Select from "@/components/inputs/Select";
import { STATUSES_OPTIONS } from "@/constants/records";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";
import { UseCommentStore } from "@/stores/commentStore";
import { Statuses } from "@/types/recordType";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type Props = {
  item: Record<string, any>;
  setEdit: Dispatch<SetStateAction<{ show: boolean; item: Record<string, any> | null }>>;
};

const TableImmatriculation = (props: Props) => {
  const { item, setEdit } = props;
  const { setCommentFileId } = useStatusDosserProvider();
  const { setShow } = UseCommentStore();
  const [selectStatus, setSelectStatus] = React.useState<string>(item.status || "");

  const handleChangeStatus = async (file_id: number, status: string) => {
    try {
      await updateFileStatusApi(Number(file_id), status as Statuses);
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite !");
    }
  };

  const formatDateForDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleComment = () => {
    setCommentFileId(item.file_id);
    setShow(true);
  };
  const className = `text-xs font-bold py-3 px-2 bg-[#FFFFFF66] text-[#3A5F6E] break-words align-top`;
  return (
    <tr className="border-b-2 border-white cursor-pointer">
      <td
        title={item.raison_sociale_professionnel}
        className={`${className} pl-3`}
      >
        {item.raison_sociale_professionnel || "-"}
      </td>
      <td title={item.siret_professionnel} className={`${className}`}>
        {item.siret_professionnel || "-"}
      </td>
      <td title={item.raison_sociale_beneficiaire} className={`${className}`}>
        {item.raison_sociale_beneficiaire || "-"}
      </td>
      <td title={item.siren_beneficiaire} className={`${className}`}>
        {item.siren_beneficiaire || "-"}
      </td>
      <td title={item.date_engagement_operation} className={`${className}`}>
        {formatDateForDisplay(item.date_engagement_operation) || "-"}
      </td>
      <td title={item.reference} className={`${className}`}>
        {item.reference || "-"}
      </td>
      <td title={item.location} className={`${className}`}>
        {item.location || "-"}
      </td>
      <td title={item.date_preuve} className={`${className}`}>
        {formatDateForDisplay(item.date_preuve) || "-"}
      </td>
      <td title={item.categorie_vehicule} className={`${className}`}>
        {item.categorie_vehicule || "-"}
      </td>
      <td title={item.parc_total_automobile} className={`${className}`}>
        {item.marque || "-"}
      </td>
      <td title={item.parc_automobile_collectivite} className={`${className}`}>
        {item.parc_automobile_collectivite || "-"}
      </td>
      <td title={item.date_premiere_immatriculation} className={`${className}`}>
        {formatDateForDisplay(item.date_premiere_immatriculation) || "-"}
      </td>
      <td
        title={item.date_immatriculation_operation}
        className={`${className}`}
      >
        {formatDateForDisplay(item.date_immatriculation_operation) || "-"}
      </td>
      <td title={item.numero_imatriculation} className={`${className}`}>
        {item.numero_imatriculation || "-"}
      </td>
      <td title={item.status} className={`${className}`}>
        {/* {item.status || '-'} */}
        <Select
          options={STATUSES_OPTIONS}
          onChange={(value) => {
            const newStatus = String(value);
            setSelectStatus(newStatus);
            handleChangeStatus(item.file_id, newStatus);
          }}
          value={selectStatus ?? ""}
          multiple={false}
          search={false}
          width="w-[full]"
        />
      </td>
      <td title={item.status} className={`${className}`}>
        <div className="flex gap-2">
          <button
            className="text-xs font-bold py-2 px-3 bg-primary-blue rounded-xl text-[#3A5F6E] break-words align-top"
            onClick={handleComment}
          >
            <CommentIcon />
          </button>
          <button
            className="text-xs font-bold py-2 px-3 bg-primary-blue rounded-xl text-[#3A5F6E] break-words align-top"
            onClick={() => setEdit({ show: true, item: item })}
          >
            <PencilIcon color="#FFF" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableImmatriculation;
