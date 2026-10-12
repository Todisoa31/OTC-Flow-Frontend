import { ActivityLogType } from "@/types/auditType";
import { formatSessionDuration, formatTimestamp } from "@/utils/getHourMinute";

type Props = {
    histories: ActivityLogType[]
};

export default function TableHistoryActivityLog({ histories }: Props) {

    const headerLists = ["Date & Heure", "Utilisateur", "Rôle", "Action réalisée", "Type de déconnexion", "Durée de session"];

    return (
        <table className=" w-full rounded-[10px]">
            <colgroup>
                <col className="w-[15%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[10%]" />
            </colgroup>
            <thead>
                <tr>
                    {headerLists.map((item, index) => (
                        <th className=" px-4 py-4 text-start text-[#646E81] text-[12px] " key={index}>{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody className=" text-[14px]">
                {histories?.map((item) => (
                    <tr key={item.id} className=" border border-[#1018281A] align-middle">
                        <td className=" px-4 py-2 rounded border-l text-start text-[#101828]">{formatTimestamp(item.timestamp)}</td>
                        <td className="px-4 py-2 align-middle text-start text-[#3A5F6E]">
                            <div className="flex items-center gap-2 min-h-[40px]">
                                <div className="w-[30px] h-[30px] rounded-xl overflow-hidden">
                                    <img
                                        src={item.created_by.photo_profil ?? "/images/usProfil.jpg"}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {item.created_by.firstname || item.created_by.email}
                            </div>
                        </td>
                        <td className=" px-4 py-2  text-start text-[#3A5F6E]">{item.created_by.role}</td>
                        <td className=" px-4 py-2 text-start text-[#3A5F6E]">{item.description}</td>
                        <td className=" px-4 py-2 text-start text-[#3A5F6E]">
                            {item.action_type === "LOGOUT"
                                ? (item.logout_type === "LOGOUT"
                                    ? "Déconnexion normale"
                                    : "Déconnexion en quittant le navigateur")
                                : ""}
                        </td>
                        <td className=" px-4 py-2 border-r  text-start text-[#101828]">{item.session_duration ? formatSessionDuration(item.session_duration) : ""}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};