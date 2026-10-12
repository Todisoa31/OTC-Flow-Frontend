'use client';

import PieChartIcon from '@/assets/icons/PieChartIcon';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { colors } from '@/constants/colors';
import { RecordAnalyticsMetricResponse } from '@/types/recordType';
import { useEffect, useState } from 'react';
import { getRecordMetricAnalystApi } from '@/api/recordInstallerApi';

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardDognutChart() {
  const [metricData, setMetricData] = useState<RecordAnalyticsMetricResponse>({
    total_dossier: 0,
    nombre_dossier_par_type: [],
  });

  const [chartKey, setChartKey] = useState(0);
  const router = useRouter();

  const getRandomHexColor = (): string => {
    const letters = '0123456789ABCDEF';
    return (
      '#' +
      Array.from({ length: 6 })
        .map(() => letters[Math.floor(Math.random() * 16)])
        .join('')
    );
  };

  const data = {
    labels: metricData.nombre_dossier_par_type?.map((item) => item.type_dossier) || [],
    datasets: [
      {
        label: 'Nombre',
        data: metricData?.nombre_dossier_par_type.map((item) => item.count),
        backgroundColor: metricData?.nombre_dossier_par_type.map((item) => item.background_color),
        hoverOffset: 10,
        spacing: 1,
      },
    ],
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart: Chart) => {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
      } = chart;

      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      ctx.save();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      ctx.fillStyle = '#000';
      ctx.font = '500 12px sans-serif';

      ctx.fillStyle = colors.darkBlue;
      ctx.fillText('Nombre de', centerX, centerY - 18);

      ctx.fillStyle = colors.darkBlue;
      ctx.fillText('dossiers', centerX, centerY - 5);

      ctx.fillStyle = 'black';
      ctx.font = 'bold 16px sans-serif';

      const radius = 5;
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
      const text3 =
        metricData?.nombre_dossier_par_type.reduce((sum, item) => sum + item.count, 0).toString() || '0';
      ctx.fillText(text3, centerX, centerY + 20);

      ctx.restore();
    },
  };

  const handleGetRecodsMetric = async () => {
    try {
      const metrics: RecordAnalyticsMetricResponse = await getRecordMetricAnalystApi();
      setMetricData(metrics);
      setChartKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    handleGetRecodsMetric();
  }, []);

  return (
    <div className="flex flex-1 max-xs:w-auto lg:min-w-[650px] p-[15px] flex-col justify-start items-start gap-[20px] rounded-[15px] border-[1.5px] border-solid border-[rgba(255,255,255,0.90)] bg-[rgba(255,255,255,0.50)] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] backdrop-blur-[15px]">
      <div className="flex h-[40px] max-md:h-auto justify-between items-center gap-2.5 inline-flex self-stretch">
        <div className="grow shrink basis-0 h-[40px] max-md:h-auto justify-center items-center gap-[15px] flex">
          <div data-svg-wrapper>
            <PieChartIcon />
          </div>
          <div className="grow shrink basis-0">
            <span className="text-black text-[24px] font-bold ">Répartition par type</span>            
          </div>
        </div>
      </div>

      <div className="w-full flex items-start justify-start gap-8">
        <div className="h-[350px] w-[350px]">
          <Doughnut
            key={chartKey}
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                },
              },
            }}
            plugins={[centerTextPlugin]}
          />
        </div>

        {/* 👇 Custom Legend HTML */}
        <div className="flex flex-col gap-2 mt-2">
          {metricData.nombre_dossier_par_type.map((item, index) => (
            <div key={index} className="flex flex-start items-baseline gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.background_color }}
              />
              <div className="flex flex-start flex-col">
                <div className="text-sm font-bold text-black">{item.type_dossier}</div>
                <div className="text-xs  font-bold text-gray-500">{item.percentage}% ({item.count}) </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardDognutChart;
