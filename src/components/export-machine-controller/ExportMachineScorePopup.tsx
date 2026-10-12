'use client';;
import Modal from "../popup/Modal";
import Button from "../inputs/Button";
import Input from "../inputs/Input";
import { useRecord } from "@/providers/RecordProvider";
import ScoreButton from "../inputs/ScoreButton";
import { createCorrectionApi } from "@/api/recordControllerApi";
import { useState } from "react";

type Props = Readonly<{
    isOpen: boolean;
    onClose: () => void;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}>;

function ExportMachineCorrectionPopup(props: Props) {
    const { isOpen, title, onClose, setRefresh } = props;
    const { selectedFile, selectedExtractedData, setSelectedExtractedData } = useRecord();
    const [loading, setLoading] = useState(false);

    const correction = selectedExtractedData?.controller_corrections?.[0]?.correction_value || '';
    
    const onChangeCorrection = (value: string) => {
        setSelectedExtractedData((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                controller_corrections: [
                    {
                        ...prev.controller_corrections?.[0],
                        correction_value: value,
                        id: prev.controller_corrections?.[0]?.id || 0, // Ensure `id` is defined
                        created_at: prev.controller_corrections?.[0]?.created_at || new Date().toISOString(), // Provide default `created_at`
                    },
                    ...(prev.controller_corrections?.slice(1) || [])
                ]
            };
        });
    }

    const handleValidateCorrection = async () => {
        try{
            setLoading(true);
            if(!selectedFile?.id || !selectedExtractedData?.variables || !correction) return;
            const { infos, variables } = selectedExtractedData;
            const response = await createCorrectionApi(selectedFile?.id, correction.toString(), variables, infos);
            if(response){
                onClose();
                setRefresh(prev => !prev);
            }
        }catch(error){
            console.error('Error creating correction:', error);
        }finally{
            setLoading(false);
        }
    }

    return (
        <Modal
            title={title}
            isOpen={isOpen}
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
            <div className="w-[500px] flex relative bg-white rounded-[40px] overflow-hidden">
                <div className="self-stretch grow inline-flex flex-col justify-start items-start">
                    <div className="self-stretch p-[30px] grow flex flex-col justify-start items-start gap-5">
                        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                            <div className="flex-1 justify-start text-black-secondary text-sm font-bold leading-[18px]">
                                {selectedExtractedData?.infos}
                            </div>
                            <ScoreButton score={selectedExtractedData?.score || 0} />
                        </div>

                        <div className="self-stretch grow flex flex-col justify-start items-start gap-5">
                            <div className="self-stretch inline-flex justify-start items-center gap-[15px]">
                                <div className="flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Devis</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium">
                                        {selectedExtractedData?.devis}
                                    </div>
                                </div>
                                <div className="flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Facture</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium">
                                        {selectedExtractedData?.facture}
                                    </div>
                                </div>
                            </div>

                            <div className="self-stretch inline-flex justify-start items-center gap-[15px]">
                                <div className="flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Attestation sur l'honneur</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium">
                                        {selectedExtractedData?.attestation}
                                    </div>
                                </div>
                                <div className="flex-1 p-[15px] bg-[#c3d6e9]/20 rounded-[10px] inline-flex flex-col justify-center items-start gap-2.5">
                                    <div className="justify-start text-black-secondary text-xs font-medium">Attestestation de Pose</div>
                                    <div className="self-stretch justify-start text-[#646d81] text-xs font-medium">
                                        {selectedExtractedData?.attestation_pose}
                                    </div>
                                </div>
                            </div>

                            <div className="self-stretch p-[15px] bg-[#65bfaa]/20 rounded-[10px] flex flex-col justify-start items-start gap-2.5">
                                <div className="justify-start text-black-secondary text-xs font-medium">Proposition</div>
                                <div className="self-stretch justify-start text-grey text-xs font-medium">
                                {selectedExtractedData?.proposition}
                                </div>
                            </div>

                            <div className="self-stretch flex flex-col justify-start items-start gap-[15px]">
                                {/* <div className="justify-start text-black-secondary text-xs font-medium">Correction du contrôleur</div>
                                
                                    <div className="justify-center text-[#101828]/30 text-xs font-medium">Ajouter votre correction ...</div>
                                </div> */}

                                <Input
                                    className="w-full text-xs"
                                    placeholder="Ajouter votre correction ..."
                                    type="text"
                                    value={correction.toString()}
                                    height="h-auto min-h-[78px]"
                                    onChange={(value) => onChangeCorrection(value)}
                                    multiline={true}
                                    outline
                                />

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ExportMachineCorrectionPopup