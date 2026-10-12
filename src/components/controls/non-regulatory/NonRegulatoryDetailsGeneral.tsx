import Select from "@/components/inputs/Select";
import { CONTROL_STATUSES_OPTIONS } from "@/constants/records";
import { FolderOutputType } from "@/types/folderType";
import { formatFrenchDate } from "@/utils/getHourMinute";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRecordByIdApi } from "@/api/recordInstallerApi";
import { updateFolderStatusApi } from "@/api/dossier";
import { Statuses } from "@/types/recordType";
import Button from "@/components/inputs/Button";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    data: Readonly<FolderOutputType>
}

function NonRegulatoryDetailsGeneral(props: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState<FolderOutputType>();
  const { id } = useParams();
    const {
        job_id,
        type_dossier,
        volume,
        information_file_reference_facture,
        information_file_montant_cee,
        information_file_quantite,
        information_file_beneficiaire_telephone,
        information_file_signature_devis,
        information_file_date_facture,
        date_validation,
        information_file_addresse_travaux
    } = props.data || {};

    const { open, setOpen } = props;

    const getFolderDetail = async () => {
        if (id) {
            try {
                setLoading(true);
                const res = await getRecordByIdApi(Number(id));
                setFolder(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

     const handleUpdateStatus = async (statusCode: Statuses) => {
          if (!id) return;
          try {
              setLoading(true);
              setStatus(statusCode);
              await updateFolderStatusApi(Number(id), statusCode);
          } catch (error) {
              console.error("Error updating status:", error);
          } finally {
              setLoading(false);
          }
      }

    useEffect(() => {
        getFolderDetail();
    }, [id]);

    useEffect(() => {
        if (folder) {
            setStatus(folder.status?.code || null);
        }
    }, [folder]);

    

    return (
        <div className="self-stretch p-[30px] bg-[#fefefe]/40 shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-[30px]">
            <div className="self-stretch inline-flex justify-center items-center gap-5">
                <div className="flex-1 flex justify-between items-center gap-2.5">
                    <div className="justify-start text-[#646d81] text-2xl font-bold">Informations générales</div>
                    <Button
                        label="Commentaires et observations"
                        onClick={() => {
                            setOpen(!open);
                        }}
                        width="w-fit"
                    />
                </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-[15px]">
                <div className="self-stretch inline-flex justify-start items-start gap-[15px]">
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Référence :</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{job_id || '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Fiche :</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{type_dossier || '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">N ° Facture:</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{information_file_reference_facture || '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Volume CEE (classique)</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{volume ? `${volume} GWh cumac` : "-"}</div>
                    </div>
                    <div className="z-10 flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Status</div>
                         <Select
                            options={CONTROL_STATUSES_OPTIONS}
                            onChange={(value) => handleUpdateStatus(value as Statuses)}
                            value={status as string}
                            multiple={false}
                            search={false}
                            placeholder=""
                            width="w-full"
                            className="border border-primary-blue bg-[#65a5bf] bg-white rounded-lg text-sm text-[#101828] font-normal leading-[18px] h-[40px]"
                        />
                    </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-[15px]">
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Prime Client :</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{information_file_montant_cee || "-"}</div>
                    </div>
                    <div className="hidden flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Valorisable? :</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">Oui</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Quantité</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{information_file_quantite || '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Adresse travaux</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{information_file_addresse_travaux || '-'}</div>
                    </div>
                   
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-[15px]">
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Signature devis :</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{information_file_signature_devis || '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Émission facture </div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{information_file_date_facture || '-'}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Réception dossier complet</div>
                        <div className="justify-start text-xs font-bold leading-[18px]">{date_validation ? formatFrenchDate(date_validation) : "-"}</div>
                    </div>
                    <div className="flex-1 self-stretch p-[15px] bg-[#fefefe]/40 hover:bg-[#65a5bf] hover:text-white text-[#101828] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-start items-start gap-2.5">
                        <div className="justify-start text-xs font-medium">Numéro Tel pour contrôle</div>
                        <div className="justify-start text-sm font-bold leading-[18px]">{information_file_beneficiaire_telephone || "-"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NonRegulatoryDetailsGeneral