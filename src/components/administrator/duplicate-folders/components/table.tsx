"use client";

import { ADMIN_DUPLICATE_FOLDERS_ROUTE } from "@/constants/routes";
import { FolderOutputType } from "@/types/folderType";
import { useRouter } from "next/navigation";

type Props = {
    folders?: FolderOutputType[];
};

export default function TableDuplicateFolders({ folders }: Props) {
    const router = useRouter();

    const tableHead = [
        "Installateur",
        "Date de soumission",
        "Nom du dossier",
        "Type de dossier",
        "Référence",
        "Montants",
    ];

    return (
        <div className="flex flex-col h-[70vh] overflow-y-auto w-full">
            <div className="overflow-x-auto ">
                <table className="w-full table-fixed text-sm border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr className="text-left text-gray-600 text-[12px]">
                            {tableHead.map((head, index) => (
                                <th key={index} className="px-4 py-2">
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className=" text-[#3A5F6E] text-[12px]">
                        {[...Array(13)].map((_, index) => (
                            <tr
                                key={index}
                                className="bg-[#FFFFFF66] rounded-[12px] shadow-md cursor-pointer"
                                onClick={() => router.push(`${ADMIN_DUPLICATE_FOLDERS_ROUTE}/${index}`)}
                            >
                                {/* Installateur */}
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <img
                                        src="/images/usProfil.jpg"
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span>Sten Ali</span>
                                </td>

                                {/* Date de soumission */}
                                <td className="px-4 py-3">
                                    {new Date("2025-07-08T17:37:33.000Z").toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>

                                {/* Nom du dossier */}
                                <td className="px-4 py-3">Maison Dupont</td>

                                {/* Type de dossier */}
                                <td className="px-4 py-3">RES-ES-104</td>

                                {/* Référence */}
                                <td className="px-4 py-3">{index}</td>

                                {/* Montants */}
                                <td className="px-4 py-3">0 €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
