"use client";

import { GetFolders } from "@/api/folderApi";
import GoToIcon from "@/assets/icons/GoToIcon";
import CenterSpinner from "@/components/loader/CenterSpinner";
import { REFERENT_FILE_MONITORING_ROUTE } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";
import { StatusesType } from "@/types/general";
import { getFile } from "@/utils/getFile";
import { formatTimestamp } from "@/utils/getHourMinute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FileMonitoringSection() {
    const router = useRouter();
    const [folders, setFolders] = useState<FolderOutputType[]>([]);
    const [loading, setLoading] = useState(false);

    const getFolders = async () => {
        setLoading(true);
        try {
            const res = await GetFolders({
                page: 1,
                per_page: 3
            });
            setFolders(res?.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFolders();
    }, []);

    const getColor = (status: StatusesType) => {
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

    const tableHead = [
        "Contrôleur en charge",
        "Date",
        "Nom du dossier",
        "Type de dossier",
        "Référence",
        "Volume CEE",
        "Volume précarité",
        "Statut administratif",
        "",
    ];

    return (
        <div className=" flex flex-col gap-6">
            <div className=" flex items-center justify-between">
                <h2 className=" text-[18px] text-black font-bold">Suivi des dossiers</h2>
                <Link href={REFERENT_FILE_MONITORING_ROUTE} className=" rounded-[10px] shadow-xl shadow-[#61A1BFB2] bg-[#65A5BF] p-3 w-fit text-white flex items-center gap-2 text-[px]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.72448 4.38207C1.66669 4.68837 1.66669 5.05609 1.66669 5.79154V11.6667C1.66669 14.8094 1.66669 16.3808 2.643 17.3571C3.61931 18.3334 5.19066 18.3334 8.33335 18.3334H11.6667C14.8094 18.3334 16.3807 18.3334 17.357 17.3571C18.3334 16.3808 18.3334 14.8094 18.3334 11.6667V9.83167C18.3334 7.63803 18.3334 6.54121 17.6921 5.82827C17.6332 5.7627 17.5707 5.70028 17.5052 5.6413C16.7922 5.00008 15.6954 5.00008 13.5018 5.00008H13.1904C12.229 5.00008 11.7483 5.00008 11.3003 4.87239C11.0542 4.80225 10.8171 4.70401 10.5935 4.5796C10.1864 4.35314 9.8465 4.01323 9.16669 3.33342L8.70814 2.87487C8.48029 2.64702 8.36637 2.53309 8.24664 2.43384C7.73046 2.00594 7.09723 1.74365 6.42966 1.68123C6.27482 1.66675 6.11371 1.66675 5.79148 1.66675C5.05603 1.66675 4.68831 1.66675 4.38201 1.72454C3.03361 1.97895 1.97889 3.03367 1.72448 4.38207ZM10.2084 8.33342C10.2084 7.98824 10.4882 7.70842 10.8334 7.70842H15C15.3452 7.70842 15.625 7.98824 15.625 8.33342C15.625 8.67859 15.3452 8.95842 15 8.95842H10.8334C10.4882 8.95842 10.2084 8.67859 10.2084 8.33342Z" fill="white" />
                    </svg>
                    Afficher tous les dossier
                </Link>
            </div>

            <table className=" w-full border-separate border-spacing-y-[10px]">
                <thead>
                    <tr>
                        {tableHead.map((head, index) => (
                            <th
                                key={index}
                                className="text-start px-4 py-2 font-medium text-[12px] text-grey"
                            >
                                {head}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? <CenterSpinner /> :
                        folders.map((item) => {
                            const firstFile = item.files.find((file) => file.type_file === "file_devis")?.id;

                            return (
                                <tr key={item.id} className=" bg-white cursor-pointer text-[12px] text-grey"
                                    onClick={() => router.push(`${REFERENT_FILE_MONITORING_ROUTE}/${item.id}/file-details/${firstFile}`)}>
                                    <td className=" pl-4 py-3 rounded-l-[10px] ">
                                        <div className=" flex items-center gap-2">
                                            <img src={getFile(item.processed_by?.photo_profil ?? "") || "/images/usProfil.jpg"} alt="png" width={40} height={40} className=" !h-[40px]" />
                                            {!item.processed_by
                                                ? "Non renseigné"
                                                : `${item.processed_by.firstname} ${item.processed_by.lastname}`}
                                        </div>
                                    </td>
                                    <td className=" pl-4">{formatTimestamp(item.created_at)}</td>
                                    <td className=" pl-4">{item.name}</td>
                                    <td className=" pl-4">{item.type_dossier}</td>
                                    <td
                                        className="pl-4 max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                                        title={item.job_id}
                                    >
                                        {item.job_id}
                                    </td>
                                    <td className=" pl-4">{item.volume} MWhc</td>
                                    <td className=" pl-4">{item.volume_precarite} MWhc</td>
                                    <td className=" pl-4">
                                        <div className=" rounded-[5px] p-2 text-white w-fit" style={{ backgroundColor: getColor(item.status.code as StatusesType) }}>
                                            {item.status.title}
                                        </div>
                                    </td>
                                    <td className=" pl-4 rounded-r-[10px]"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            router.push(`${REFERENT_FILE_MONITORING_ROUTE}/${item.id}`)
                                        }}
                                    >
                                         <span className="bg-[#646E81]/50 rounded-[5px] text-white font-bold text-xs py-2 px-5">Détail</span>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
};