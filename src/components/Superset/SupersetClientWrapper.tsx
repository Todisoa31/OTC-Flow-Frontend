'use client';
import React from 'react';
import SupersetEmbed from './SupersetEmbed';
import { guestToken } from '@/api/authorisationApi';
import { AxiosResponse } from 'axios';

interface SupersetClientWrapperProps {
  id: number
}

const SupersetClientWrapper: React.FC<SupersetClientWrapperProps> = ({
  id
}) => {
  const fetchToken = async () => {
    const res = await guestToken(id) as AxiosResponse<{ guest_token: string }>;
    return res.data.guest_token;
  }
  return (
    <></>
    // <div className="w-[100%] h-[1200px]">
    //   <SupersetEmbed
    //     dashboardId={process.env.NEXT_PUBLIC_DASHBOARD_ID_EVOLUTION_DOSSIER!}
    //     supersetDomain={process.env.NEXT_PUBLIC_API_URL_SUPERSET!}
    //     getToken={fetchToken}
    //   />
    // </div>
  );
};

export default SupersetClientWrapper;
