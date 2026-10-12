// 'use client';
// import React, { useEffect, useRef } from 'react';
// import { embedDashboard } from '@superset-ui/embedded-sdk';
// import CenterSpinner from '../loader/CenterSpinner';

// interface SupersetEmbedProps {
//   dashboardId: string;
//   supersetDomain: string;
//   getToken: () => Promise<string>;
// }

// const SupersetEmbed: React.FC<SupersetEmbedProps> = ({
//   dashboardId,
//   supersetDomain,
//   getToken,
// }) => {
//   const [srcSuperset, setSrcSuperset] = React.useState<string | null>(null);


//   useEffect(() => {
//     const embed = async () => {
//       try {
//         const token = await getToken();
//         const src = `${supersetDomain.replace(/\/$/, '')}/embedded/${token}`;
//         setSrcSuperset(src);
//       } catch (error) {
//         console.error('Erreur lors de la génération du token :', error);
//       }
//     };

//     embed();
//   }, [supersetDomain, getToken]);
  
//   return srcSuperset ? (
//     <iframe
//       src={srcSuperset}
//       width="100%"
//       height="1200"
//       style={{ border: 'none' }}
//       allowFullScreen
//     ></iframe>
//   ) : (
//     <CenterSpinner />
//   );
// };

// export default SupersetEmbed;
'use client'; // indispensable si tu es en Next.js app router

import React, { useEffect, useRef } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';

interface SupersetEmbedProps {
  dashboardId: string; // UUID du dashboard, pas l'ID numérique !
  supersetDomain: string; // ex: "http://51.44.12.225:8088"
  getToken: () => Promise<string>; // une fonction async qui retourne le token JWT
}

const SupersetEmbed: React.FC<SupersetEmbedProps> = ({
  dashboardId,
  supersetDomain,
  getToken,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = await getToken();

      embedDashboard({
        id: dashboardId,
        supersetDomain,
        mountPoint: containerRef.current!,
        fetchGuestToken: () => Promise.resolve(token),
        dashboardUiConfig: {
          hideTitle: false,
          hideChartControls: true,
        },
      });
    };

    loadDashboard();
  }, [dashboardId, supersetDomain, getToken]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default SupersetEmbed;
