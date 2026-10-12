"use client";

import DatePickerIcon from "@/assets/icons/DatePickerIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import RedirectToIcon from "@/assets/icons/RidirectToIcon";
import { ADMIN_FILE_MONITORING_ROUTE } from "@/constants/routes";
import { StatusesType } from "@/types/general";
import Link from "next/link";

export default function FolderMessaging() {

    const link_to = `${ADMIN_FILE_MONITORING_ROUTE}/1`

    return (
        <div className=" p-[30px] max-h-[80vh] overflow-y-auto">
            <div className=" flex items-center justify-between">
                <h3 className=" font-bold text-black text-[18px]">Maison Dupon</h3>
                <Link href={link_to}>
                    <RedirectToIcon />
                </Link>
            </div>
            <div className=" grid grid-cols-2 mt-4 gap-2">
                <FolderInfo title="Type de dossier :" value="BAR-TH-160" />
                <FolderInfo title="Référence :" value="0123456789" />
                <FolderInfo title="Montant :" value="15 000 €" />
                <FolderInfo title="Soumission :" value="11 mars 2025" />
            </div>
            <div className=" flex flex-col gap-2 mt-4">
                <h3 className=" font-bold text-black text-[18px]">Documents</h3>
                <DocumentInfo title="Facture de l’installateur" status="approved" status_name="Validé" date="12 mars 20025 - 9:22" document_name="contrat-de-location.pdf" />
                <DocumentInfo title="Devis signé" status="inprocess" status_name="En cours de traitement" date="12 mars 20025 - 9:22" document_name="contrat-de-location.pdf" />
                <DocumentInfo title="Devis signé" status="tobeprocessed" status_name="Dossier déposé" date="12 mars 20025 - 9:22" document_name="contrat-de-location.pdf" />
            </div>
            <div className=" flex flex-col gap-2 mt-4 bg-[#FFFFFF66]  p-[15px] rounded-[10px]">
                <h3 className=" font-bold text-black text-[18px]">Photos Avant / Après des travaux</h3>
                <div className="font-bold p-2 rounded-[5px] w-fit text-xs text-white bg-[#65BFAA]">Valide</div>
                <div className=" flex items-center gap-2">
                    <DatePickerIcon />
                    <span className="font-bold text-grey text-xs">12 mars 20025 - 9:22</span>
                </div>
                <ImagesInfo images={["/images/maison1.png", "/images/maison2.png", "/images/maison1.png"]} />
                <ImagesInfo images={["/images/maison1.png", "/images/maison2.png", "/images/maison1.png"]} />
            </div>
        </div>
    )
};




const FolderInfo = ({ title, value }: { title: string; value: string }) => {
    return (
        <div className=" flex flex-col">
            <span className="font-bold text-grey text-xs">{title}</span>
            <span className=" text-[12px] text-black font-bold">{value}</span>
        </div>
    )
};

const DocumentInfo = ({ title, status, status_name, date, document_name }: { title: string; status: StatusesType; status_name: string; date: string; document_name: string }) => {

    const getBgColorFromStatus = (status: StatusesType) => {
        switch (status) {
            case "inprocess":
                return "#9BCADC"
            case "approved":
                return "#65BFAA"
            case "corrected":
                return "#65A5BF"
            case "refused":
                return "#EC4899"
            case "tobeprocessed":
                return "#646E81"
            case "tocorrect":
                return "#FCC567"
            default:
                break;
        }
    };

    return (
        <div className=" flex flex-col gap-2  bg-[#FFFFFF66] p-[15px] rounded-[10px]">
            <span className=" text-black text-[13px] font-bold">{title}</span>
            <div className="font-bold p-2 rounded-[5px] w-fit text-xs text-white" style={{ backgroundColor: getBgColorFromStatus(status) }}>{status_name}</div>
            <div className=" flex items-center gap-2">
                <DatePickerIcon />
                <span className="font-bold text-grey text-xs">{date}</span>
            </div>
            <div className=" flex items-center gap-2">
                <DownloadIcon />
                <span className="font-bold text-grey text-xs">{document_name}</span>
            </div>
        </div>
    )
};

const ImagesInfo = (images: { images: string[] }) => {
    return (
        <div className=" bg-white p-[15px] rounded-[10px] flex gap-2 flex-col border-2 border-[#65A5BF]">
            <h4 className=" text-[#3A5F6E] text-[12px]">Photo n1</h4>
            <div className=" flex gap-2 justify-between w-full">
                {images.images.slice(0, 2).map((image, index) => (
                    <img key={index} src={image} alt={`Photo ${index + 1}`} className=" w-1/2 h-[100px] object-cover rounded-[5px]" />
                ))}
            </div>
        </div>
    )
}