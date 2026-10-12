"use client";

import { updateFileStatusApi } from "@/api/recordInstallerApi";
import CommentIcon from "@/assets/icons/CommentIcon";
import ScoreButton from "@/components/inputs/ScoreButton";
import Select from "@/components/inputs/Select";
import CorrectionReferentModal from "@/components/modal/CorrectionModalReferent";
import { STATUSES_OPTIONS } from "@/constants/records";
import { UseCommentStore } from "@/stores/commentStore";
import { FileDetailFile } from "@/types/fileType";
import { Statuses } from "@/types/recordType";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import TableData from "./TableData";

type Props = {
    data: FileDetailFile[];
    status: string;
    typeDossier: string
};
type TableType = {
  label: string;
  width: string;
}

export default function AttestationDesembouage({ data, status, typeDossier }: Props) {
    const { file_id } = useParams();

    const [selectStatus, setSelectStatus] = useState<string>(status);
    const [open, setOpen] = useState<boolean>(false);
    const { setShow } = UseCommentStore();
    const [correctionItem, setCorrectionItem] = useState<FileDetailFile | null>(null);

    
    const handleChangeStatus = async (status: string) => {
        try {
            await updateFileStatusApi(Number(file_id), status as Statuses);
        } catch (error) {
            console.error(error);
            toast.error("Une erreur s'est produite !");
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-black text-[24px] font-bold">Facture</h2>
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
                            value={selectStatus ?? ''}
                            multiple={false}
                            search={false}
                        />
                    </div>
                </div>

                 <TableData
                    data={data}
                    setCorrectionItem={setCorrectionItem}
                    setOpen={setOpen}
                    typeDossier={typeDossier}                    
                />
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
    )
}
