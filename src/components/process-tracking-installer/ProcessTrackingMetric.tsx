import { JSX, useEffect, useState } from "react"
import ClockSquareIcon from "@/assets/icons/ClockSquareIcon"
import CloseSquareWhiteIcon from "@/assets/icons/CloseSquareWhiteIcon"
import DocumentIconAddIcon from "@/assets/icons/DocumentIconAddIcon"
import PencilWhiteIcon from "@/assets/icons/PencilWhiteIcon"
import { getRecordMetricInstallerApi } from "@/api/recordInstallerApi"
import { RecordMetricResponse } from "@/types/recordType"
import { ROLE_INSTALLER } from "@/constants/userConst"
import { useAuth } from "@/providers/AuthProvider"
import { getRecordMetricControllererApi } from "@/api/recordControllerApi"

const processTrackingMetricData = [
    //{ key: 1, title: 'Brouillons', code: 'draft', count: 0, bgClass: 'bg-grey', icon: <DocumentIconAddIcon /> },
    { key: 1, title: 'Dossier déposé', code: 'tobeprocessed', count: 0, bgClass: 'bg-grey', icon: <DocumentIconAddIcon /> },
    { key: 2, title: 'En cours de traitement', code: 'inprocess', count: 0, bgClass: 'bg-primary-blue', icon: <ClockSquareIcon /> },
    { key: 3, title: 'A corriger', code: 'tocorrect', count: 0, bgClass: 'bg-primary-orange', icon: <PencilWhiteIcon /> },
    { key: 4, title: 'Validés', code: 'approved', count: 0, bgClass: 'bg-primary-green', icon: <PencilWhiteIcon /> },
    { key: 5, title: 'Refusés', code: 'refused', count: 0, bgClass: 'bg-pink-500', icon: <CloseSquareWhiteIcon /> }
]

type ProcessTrackingMetricItemsProps = {
    key: number;
    title: string;
    code: string;
    count: number;
    bgClass: string;
    icon: JSX.Element;
}

function ProcessTrackingMetricItems(props: ProcessTrackingMetricItemsProps) {
    const { title, count, bgClass, icon } = props

    return (
        <div className="h-[130px] flex-1 min-w-[200px] grow px-[30px] self-stretch py-5 relative bg-black/50 rounded-[15px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white/50 backdrop-blur-[5px] inline-flex flex-col justify-center items-center gap-5">
            <div className={`${bgClass} w-[40px] h-[40px] left-[15px] top-[15px] absolute rounded-[10px] inline-flex justify-center items-center gap-2.5`}>
                <div className="w-6 h-6 relative rounded-[5px] overflow-hidden">
                    <div data-svg-wrapper className="absolute">{icon}</div>
                </div>
            </div>
            <div className="justify-start text-white text-[50px] font-bold">{count}</div>
            <div className="justify-start text-white text-sm font-bold leading-[18px]">{title}</div>
        </div>
    )
}

function ProcessTrackingMetric() {
    const [metricData, setMetricData] = useState<ProcessTrackingMetricItemsProps[]>(processTrackingMetricData);
    const { user } = useAuth();
    const isIntallerRole = user?.role === ROLE_INSTALLER;
    
    const handleGetRecodsMetric = async () => {
        try {
            const metrics: RecordMetricResponse[] = isIntallerRole ? await getRecordMetricInstallerApi() : await getRecordMetricControllererApi();
            const updatedMetrics = processTrackingMetricData.map(item => {
                const metric = metrics.find((metric: RecordMetricResponse) => metric.status_code === item.code);
                return {
                    ...item,
                    count: metric ? metric.count : 0
                };
            });
            setMetricData(updatedMetrics);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        handleGetRecodsMetric();
    }, [])
    
    return (
        <div className="self-stretch min-h-[254px] relative rounded-[30px] inline-flex flex-col justify-start items-start gap-[30px] overflow-hidden bg-[url('/images/record-dashboard-bg.png')] bg-cover p-[30px]">
            <div className="self-stretch justify-start text-white text-2xl font-bold">Vue d’ensemble </div>
            <div className="self-stretch flex flex-wrap self-stretch  justify-start items-start gap-[30px] min-h-[150px]">
                {metricData.map((item: ProcessTrackingMetricItemsProps) => (
                    <ProcessTrackingMetricItems
                        key={item.key}
                        title={item.title}
                        count={item.count}
                        code={item.code}
                        bgClass={item.bgClass}
                        icon={item.icon} />
                ))}
            </div>
        </div>
    )
}

export default ProcessTrackingMetric