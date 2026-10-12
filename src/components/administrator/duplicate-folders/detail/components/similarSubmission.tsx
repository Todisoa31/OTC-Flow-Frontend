import DownloadIcon from "@/assets/icons/DownloadIcon";

export default function SimilarSubmission() {
    const tableHead = [
        "Installateur",
        "Date de soumission",
        "Nom du dossier",
        "Type de dossier",
        "Référence",
        "Montants",
        ""
    ];

    return (
        <div className=" flex flex-col p-[30px] gap-4">
            <h4 className=" text-[#646E81] text-[24px] font-bold">Soumissions similaires</h4>
            <div className="flex flex-col h-[45vh] overflow-y-auto w-full">
                <div className="flex-1">
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
                            {[...Array(3)].map((_, index) => (
                                <tr
                                    key={index}
                                    className="bg-[#FFFFFF66] rounded-[12px] shadow-md"
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
                                    <td className="px-4 py-3">
                                        <button>
                                            <DownloadIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
