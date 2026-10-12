'use client';;
import Button from "@/components/inputs/Button";
import RecordList from "../records-lists/RecordList";
import { SUBMIT_FILE_ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useFilter } from "@/providers/FilterProvider";
import { useEffect, useState } from "react";
import { getRecordApi } from "@/api/recordInstallerApi";
import { RecordResponse } from "@/types/recordType";
import AddFolderIcon from "@/assets/icons/AddFolderIcon";

function DashboardRecords() {
    const router = useRouter();
    const { setData, data } = useFilter();
    const [loading, setLoading] = useState(false);

    const handleGetRecords = async () => {
        try {
            setLoading(true);
            const response = await getRecordApi({ page: 1, per_page: 5 });
            setData(response.data as RecordResponse[]);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        handleGetRecords();
    }, [])

    return (
        <div className="h-[489px] grow self-stretch px-[30px] flex-col justify-start items-start gap-[30px] inline-flex">
            <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-black-secondary text-2xl font-bold ">Mes Derniers Dossiers</div>
                <Button
                    label={"Soumettre un dossier"}
                    iconLeft={<AddFolderIcon />}
                    className="w-[250px]"
                    onClick={() => router.push(SUBMIT_FILE_ROUTE)}
                />
            </div>
            <RecordList records={data} loading={loading} />
        </div>
    );
}

export default DashboardRecords