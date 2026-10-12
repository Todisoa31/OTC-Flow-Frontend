'use client';;
import { getExportMachineApi } from '@/api/recordControllerApi';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CenterSpinner from '../loader/CenterSpinner';
import EmptyData from '../empty/EmptyData';
import { tableClassName, tbodyColClassName, tbodyRowClassName, theadColClassName, theadRowClassName } from '@/constants/table';
import { cn } from '@/utils/tailwind';
import Button from '../inputs/Button';
import DownloadIcon from '@/assets/icons/DownloadIcon';
import { colors } from '@/constants/colors';
import { convertToCSV, downloadCSV } from '@/utils/csv';
import { getRecordByIdApi } from '@/api/recordInstallerApi';
import TitleWithBack from '../TitleWithBack';
import { useTitle } from '@/providers/TitleProvider';

function ExportMachineResumeTable() {
    const _params = useParams();
    const { id, params } = _params;
    const job_id = params?.[0];
    const form_type = params?.[1];

    const [fetching, setFetching] = useState(false);
    const [data, setData] = useState<any>(null);
    const [recordDetail, setRecordDetail] = useState<Record<string, any>>({});
    const { setTitle } = useTitle();

    const handleGetRecordDetail = async (id: number) => {
        try {
            setFetching(true);
            const record = await getRecordByIdApi(id);
            setRecordDetail(record);
        } catch (error) {
            console.error('Error fetching record detail:', error);
        } finally {
            setFetching(false);
        }
    }

    const handleGoToExportMachineResume = async () => {
        try {
            setFetching(true);

            if (!job_id || !form_type) {
                console.error('No job_id found in record detail');
                toast.error("Aucun job_id trouvé dans le détail de l'enregistrement");
                return;
            }
            const response = await getExportMachineApi([job_id], form_type);
            if (response.data) {
                setData(response.data);
            }

        } catch (error) {
            console.error("Error downloading documents:", error);
        } finally {
            setFetching(false);
        }
    }

    const handleDownloadDocuments = async () => {
        if(data && data.length > 0) {
            const csv = convertToCSV(data);
            downloadCSV(csv, `export_machine_resume_${job_id}.csv`);
            //downloadJsonFile(data, `export_machine_resume_${job_id}.json`);
        } else {
            toast.error("Aucun document à télécharger");
        }
    }

    useEffect(() => {
        handleGoToExportMachineResume();
    }, []);

    useEffect(() => {
        handleGetRecordDetail(Number(id));
    }, [id])

    useEffect(() => {
        setTitle(<TitleWithBack title={recordDetail?.name ? `Dossier: ${recordDetail?.name}` : ''} />);
    }, [recordDetail]);

    if (fetching) {
        return <CenterSpinner />
    }

    if(!data) {
        return <EmptyData />
    }

    const keys = data?.[0] ? Object.keys(data?.[0]) : [];

    return (
        <div className="grow self-stretch px-[30px] py-[30px] relative flex flex-col justify-start items-start gap-5">
            <Button
                className="bg-black-secondary ml-auto"
                onClick={handleDownloadDocuments}
                iconLeft={<DownloadIcon fill={colors.white} />}
                label="Télécharger le document"
            />
            
            <table className={tableClassName}>
                <thead>
                    <tr className={theadRowClassName}>
                        <th className='px-5 text-left'>Clé</th>
                        {data.map((_: Record<string, any>, index: number) => (
                            <th key={index} className={theadColClassName}>Valeur {index + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {keys.map((key) => (
                        <tr key={key} className={tbodyRowClassName}>
                            <td className={cn([tbodyColClassName,'w-[250px] font-bold'])}>{key}</td>
                            {data.map((item: any, index: number) => (
                                <td key={`${key}-${index}`} className={cn([tbodyColClassName,'max-w-[20px]'])}>
                                    {item[key as keyof typeof item] || ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ExportMachineResumeTable