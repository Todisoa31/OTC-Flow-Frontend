'use client';;
import DashboardNotification from './DashboardNotification';
import DashboardRecords from './DashboardRecords';
import { useTitle } from '@/providers/TitleProvider';
import { useEffect } from 'react';
import DashboardDognutChart from './DashboardStatut';

function Dashboard() {
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle('Tableau de bord');
    }, [])

    return (
        <>
            <div className="flex max-md:flex-col p-8 items-start gap-8 self-stretch w-full flex-wrap">
                <DashboardDognutChart />
                <DashboardNotification />
                {/* <DashboardMetric /> */}
            </div>
            <DashboardRecords />
        </>
    );

}

export default Dashboard