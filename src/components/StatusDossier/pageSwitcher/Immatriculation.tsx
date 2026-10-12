"use client";

import {
  getInfosExtractDataApi,
  updateFileStatusApi,
} from "@/api/recordInstallerApi";
import CommentIcon from "@/assets/icons/CommentIcon";
import ScoreButton from "@/components/inputs/ScoreButton";
import Select from "@/components/inputs/Select";
import CorrectionReferentModal from "@/components/modal/CorrectionModalReferent";
import { STATUSES_OPTIONS } from "@/constants/records";
import { UseCommentStore } from "@/stores/commentStore";
import { FileDetailFile, ImmatriculationTraType } from "@/types/fileType";
import { Statuses } from "@/types/recordType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableData from "./TableData";
import TableMultipleData from "./TableMultipleData";
import EditImmatriculationSidebar from "./EditImmatriculationSidebar";

type Props = {
  data: FileDetailFile[];
  status: string;
  typeDossier: string;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdated: boolean;
};

export default function Immatriculation({ data, status, typeDossier, setIsUpdated, isUpdated }: Props) {
  const { file_id } = useParams();
  const [selectStatus, setSelectStatus] = useState<string>(status);
  const [open, setOpen] = useState<boolean>(false);
  const { setShow } = UseCommentStore();
  const [correctionItem, setCorrectionItem] = useState<FileDetailFile | null>(
    null
  );
  const [dataExtract, setDataExtract] = useState<ImmatriculationTraType[]>([]);
  const [editImmatriculation, setEditImmatriculation] = useState<{
    show: boolean;
    item: Record<string, any> | null;
  }>({ show: false, item: null });

  const handleChangeStatus = async (status: string) => {
    try {
      await updateFileStatusApi(Number(file_id), status as Statuses);
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite !");
    }
  };

  const getInfosExtractData = async (file_id: number) => {
    try {
      const response = await getInfosExtractDataApi(file_id);
      if (!response) return;
      setDataExtract(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (["TRA_EQ_114", "TRA_EQ_117"].includes(typeDossier)) {
      getInfosExtractData(Number(file_id));
    }
  }, [data]);

  useEffect(() => {
    console.log("editImmatriculation changed:", editImmatriculation);
  }, [editImmatriculation]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-black text-[24px] font-bold">Immatriculation</h2>
          {!["TRA_EQ_114", "TRA_EQ_117"].includes(typeDossier) && (
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
          )}
        </div>
        {["TRA_EQ_114", "TRA_EQ_117"].includes(typeDossier) ? (
          <TableMultipleData
            data={dataExtract}
            setEdit={setEditImmatriculation}
          />
        ) : (
          <TableData
            data={data}
            setCorrectionItem={setCorrectionItem}
            setOpen={setOpen}
            typeDossier={typeDossier}
          />
        )}
      </div>

      {correctionItem && (
        <CorrectionReferentModal
          open={open}
          setOpen={setOpen}
          item={correctionItem}
          typeFormulaire={typeDossier}
        />
      )}

      {editImmatriculation.show && (
        <EditImmatriculationSidebar
          data={editImmatriculation.item}
          setEditImmatriculation={setEditImmatriculation}
          editImmatriculation={editImmatriculation}
          setIsUpdated={setIsUpdated}
          isUpdated={isUpdated}
        />
      )}
    </>
  );
}
