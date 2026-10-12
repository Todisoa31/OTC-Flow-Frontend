'use client';
import { FILE_TYPES } from "@/constants/records";
import { EXPORT_MACHINE_ROUTE, routeWithParams } from "@/constants/routes";
import { useParams, useRouter } from "next/navigation";

function ExportMachinetTab() {
    const params = useParams();
    const router = useRouter();

    if (!params) return null
    const { id: recordId, file_type } = params;

    return (
        <div className="self-stretch px-[30px] inline-flex justify-start items-start gap-[15px]">
            {Object.entries(FILE_TYPES).map(([key, value], index) => (
                <button
                    type="button"
                    onClick={() => router.push(routeWithParams(EXPORT_MACHINE_ROUTE, { id: Number(recordId), file_type: key }))}
                    key={index}
                    className={`flex-1 p-[15px] ${key === file_type ? "bg-primary-blue text-white font-bold" : "bg-[#646d81]/10 text-[#646d81] font-medium"
                        } rounded-[10px] inline-flex flex-col justify-start items-center gap-[60px]`}
                >
                    <span className="self-stretch text-center justify-start text-xs">
                        {value}
                    </span>
                </button>
            ))}
        </div>
    )
}

export default ExportMachinetTab