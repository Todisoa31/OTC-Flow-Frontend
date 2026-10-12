"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../popup/Modal";
import ScoreButton from "../inputs/ScoreButton";
import Button from "../inputs/Button";
import { FileDetailFile } from "@/types/fileType";
import { createCorrectionApi } from "@/api/recordControllerApi";
import { useParams } from "next/navigation";
import { UseReferentFileStore } from "@/stores/ReferentFileStore";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
    item: FileDetailFile;
    typeFormulaire: string;
};

export default function CorrectionReferentModal({
    open,
    setOpen,
    item,
    typeFormulaire
}: Props) {
    const { setUpdateDetail } = UseReferentFileStore();

    const [loading, setLoading] = useState<boolean>(false);
    const { file_id } = useParams();
    const [text, setText] = useState<string>(item?.controller_corrections[0]?.correction_value);

    const handleValidateCorrection = async () => {
        setLoading(true);
        try {
            await createCorrectionApi(Number(file_id), text, item.variables, item.infos);
            setUpdateDetail();
            setOpen(false);
            setText("");
        } catch {

        } finally {
            setLoading(false);
        }
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            title={"Correction du Contrôleur"}
            isOpen={open}
            onClose={onClose}
            footer={
                <div className="self-stretch flex flex-col justify-start items-end gap-2.5 ml-auto">
                    <Button
                        label="Valider"
                        className="bg-black-secondary"
                        loading={loading}
                        onClick={handleValidateCorrection}
                    />
                </div>
            }
        >
            <div className="w-[700px] flex relative bg-white rounded-[40px] overflow-hidden">
                <div className="w-full self-stretch grow inline-flex flex-col justify-start items-start">
                    <div className="w-full self-stretch p-[30px] grow flex flex-col justify-start items-start gap-5">
                        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                            <div className="flex-1 justify-start text-black-secondary text-sm font-bold leading-[18px]">
                                {item?.infos}
                            </div>
                            <ScoreButton score={item?.score ?? 0} />
                        </div>

                        <div className="w-full self-stretch grow flex flex-col justify-start items-start gap-5">
                            <div className="w-full self-stretch inline-flex justify-start items-center gap-[15px]">
                                <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Devis</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.devis}
                                    </div>
                                </div>
                                <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Facture</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.facture}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full self-stretch inline-flex justify-start items-center gap-[15px]">
                                <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Attestation sur l&#39;honneur</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.attestation}
                                    </div>
                                </div>
                                {typeFormulaire === 'RES_EC_104' && <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Attestestation de Pose</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.attestation_pose}
                                    </div>
                                </div>}
                            </div>
                            {typeFormulaire === 'BAR_SE_109' && <div className="w-full self-stretch inline-flex justify-start items-center gap-[15px]">
                                <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Attestation de désembouage</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.attestation_desembouage}
                                    </div>
                                </div>
                                <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Cadre de contribution</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.cadre_contribution}
                                    </div>
                                </div>
                            </div>}
                            {['TRA_EQ_114', 'TRA_EQ_117'].includes(typeFormulaire) && <div className="w-full self-stretch inline-flex justify-start items-center gap-[15px]">
                                <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Certificat(s) d&#39;immatriculation</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.immatriculation}
                                    </div>
                                </div>
                                {typeFormulaire === 'TRA_EQ_117' && <div className="w-[50%]  flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Critère de précarité</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium break-words">
                                        {item?.precarite}
                                    </div>
                                </div>}
                            </div>}                                



                            <div className="w- full self-stretch p-[15px] bg-[#65bfaa]/20 rounded-[10px] flex flex-col justify-start items-start gap-2.5">
                                <div className="justify-start text-black-secondary text-xs font-medium">Proposition</div>
                                <div className="self-stretch justify-start text-grey text-xs font-medium break-words">
                                    {item?.proposition}
                                </div>
                            </div>
                        </div>

                        <textarea
                            className=" w-full border rounded-[10px] p-[15px] outline-none text-[12px] text-grey"
                            placeholder="Ajouter votre correction ..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        </Modal>
    );
}