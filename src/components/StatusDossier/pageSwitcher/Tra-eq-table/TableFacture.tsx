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

const TableFacture = (props: Props) => {
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
      <td title={item.numero_devis} className={`${className} pl-3`}>
        {item.numero_devis || "-"}
      </td>
      <td title={item.reference_facture} className={`${className} pl-3`}>
        {item.reference_facture || "-"}
      </td>
      <td title={item.adresse_travaux} className={`${className} pl-3`}>
        {item.adresse_travaux || "-"}
      </td>
      <td title={item.marque} className={`${className} pl-3`}>
        {item.marque || "-"}
      </td>
      <td title={item.referenciel} className={`${className} pl-3`}>
        {item.referenciel || "-"}
      </td>
      <td title={item.quantite} className={`${className} pl-3`}>
        {item.quantite || "-"}
      </td>
      <td title={item.prix_unitaire} className={`${className} pl-3`}>
        {item.prix_unitaire || "-"}
      </td>
      <td title={item.date_facture} className={`${className} pl-3`}>
        {formatDateForDisplay(item.date_facture) || "-"}
      </td>
      <td title={item.object_facture} className={`${className} pl-3`}>
        {item.object_facture || "-"}
      </td>
      <td title={item.montant_cce} className={`${className} pl-3`}>
        {item.montant_cce || "-"}
      </td>
      <td title={item.beneficiaire_raison_sociale} className={`${className} pl-3`}>
        {item.beneficiaire_raison_sociale || "-"}
      </td>
      <td title={item.sous_traitant_siren} className={`${className} pl-3`}>
        {item.sous_traitant_siren || "-"}
      </td>
      <td title={item.sous_traitant_entreprise} className={`${className} pl-3`}>
        {item.sous_traitant_entreprise || "-"}
      </td>
      <td title={item.presence_sous_traitant} className={`${className} pl-3`}>
        {item.presence_sous_traitant || "-"}
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

export default TableFacture;
