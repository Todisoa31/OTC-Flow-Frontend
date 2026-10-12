'use client';;
import PieChartIcon from '@/assets/icons/PieChartIcon';
import CursorRightIcon from '@/assets/icons/CursorRightIcon';
import Button from '../inputs/Button';
import { PROGRESS_TRACKING } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { colors } from '@/constants/colors';
import { RecordMetricResponse } from '@/types/recordType';
import { useEffect, useState } from 'react';
import { getRecordMetricInstallerApi } from '@/api/recordInstallerApi';
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardDognutChart() {
    const [metricData, setMetricData] = useState<RecordMetricResponse[]>([]);
    const [chartKey, setChartKey] = useState(0);
    const router = useRouter();

    const data = {
        labels: metricData.map(item => item.status_title),
        datasets: [
            {
                label: 'Nombre',
                data: metricData.map(item => item.count),
                backgroundColor: metricData.map(item => item.color_background),
                hoverOffset: 10,
                spacing: 1
            },
        ],
    };

    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart: Chart) => {
            const { ctx, chartArea: { left, right, top, bottom } } = chart;

            // Calculate the center of the Doughnut circle
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;

            ctx.save();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            // Text styles
            ctx.fillStyle = '#000';
            ctx.font = '500 12px sans-serif'; // Added font weight directly
            // ctx.fontWeight= '500'; // Removed as it is not valid

            // Draw the first line of text
            ctx.fillStyle = colors.darkBlue;
            const text = 'Nombre de';
            ctx.fillText(text, centerX, centerY - 18);

            // Draw the first line of text
            ctx.fillStyle = colors.darkBlue;
            const text2 = 'dossiers';
            ctx.fillText(text2, centerX, centerY - 5);

            // Draw the second line of text
            ctx.fillStyle = 'black';
            ctx.font = 'bold 16px sans-serif';
            // Draw black background rectangle with border-radius
            const radius = 5; // Border radius
            const rectX = centerX - 15;
            const rectY = centerY + 9;
            const rectWidth = 30;
            const rectHeight = 20;

            ctx.beginPath();
            ctx.moveTo(rectX + radius, rectY);
            ctx.lineTo(rectX + rectWidth - radius, rectY);
            ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius);
            ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
            ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight);
            ctx.lineTo(rectX + radius, rectY + rectHeight);
            ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
            ctx.lineTo(rectX, rectY + radius);
            ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            const text3 = metricData.reduce((sum, item) => sum + item.count, 0).toString() || '0';
            ctx.fillText(text3, centerX, centerY + 20);

            ctx.restore();
        },
    };

    const handleGetRecodsMetric = async () => {
        try {
            const metrics: RecordMetricResponse[] = await getRecordMetricInstallerApi();
            setMetricData(metrics);
            // Force re-render of the chart by updating the key
            setChartKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        handleGetRecodsMetric();
    }, [])

    return (
        <div className="flex max-xs:w-auto w-[50%] p-[15px] flex-col justify-start items-start gap-[20px] rounded-[15px] border-[1.5px] border-solid border-[rgba(255,255,255,0.90)] bg-[rgba(255,255,255,0.50)] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] backdrop-blur-[15px]">
            <div className="flex h-[40px] max-md:h-auto justify-between items-center gap-2.5 inline-flex self-stretch">
                <div className="grow shrink basis-0 h-[40px] max-md:h-auto justify-center items-center gap-[15px] flex">
                    <div data-svg-wrapper><PieChartIcon /></div>
                    <div className="grow shrink basis-0">
                        <span className="text-black text-[24px] font-bold ">
                            Statut Administratif<br />
                        </span>
                        <span className="text-orange-primary text-sm font-normal  leading-[18px]">de mes dossiers</span>
                    </div>
                </div>

                <Button
                    label='Suivre mes dossiers'
                    iconLeft={<CursorRightIcon />}
                    className="bg-black"
                    onClick={() => router.push(PROGRESS_TRACKING)}
                />
            </div>

            <div className='h-[188px] w-full flex items-start justify-start'>
                <Doughnut
                    key={chartKey}
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right', // Use a valid value like 'top', 'bottom', etc.
                                labels: {
                                    boxWidth: 15,
                                    boxHeight: 15,
                                    padding: 10,
                                    font: {
                                        size: 12,         // Set font-size
                                        style: 'normal',  // Set font-style
                                        weight: 'bold',    // Set font-weight
                                        lineHeight: 1,    // Set line-height (use a numeric value)
                                    },
                                    generateLabels: (chart) => {
                                        const { data } = chart;
                                        return (data.labels ?? []).map((label, index) => ({
                                            //text: `${label}`, // Add the counter to the legend
                                            text: `${label}  ( ${data.datasets[0].data[index]} )`,
                                            fillStyle: Array.isArray(data.datasets[0].backgroundColor) && data.datasets[0].backgroundColor[index] ? data.datasets[0].backgroundColor[index] : undefined,
                                            strokeStyle: Array.isArray(data.datasets[0].backgroundColor) && data.datasets[0].backgroundColor[index] ? data.datasets[0].backgroundColor[index] : undefined,
                                            hidden: !chart.isDatasetVisible(0),
                                            index,
                                        }));
                                    },
                                },
                            },
                            tooltip: {
                                enabled: true,
                            }
                        },
                    }}
                    plugins={[centerTextPlugin]}
                />
            </div>
        </div>
    )
}

export default DashboardDognutChart