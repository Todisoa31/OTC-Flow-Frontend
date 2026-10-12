'use client';
import React, { useEffect } from 'react';
import HeadReportPage from './HeadReportPage';
import { useTitle } from '@/providers/TitleProvider';
import AnalystRapportContent from './RapportContent/AnalystRapportContent';

const AnalystRapport = () => {
      const { setTitle } = useTitle();
  
      useEffect(() => {
          setTitle("Rapports personnalisés");
      }, []);
  
  return (
    <>
      <HeadReportPage />
      <AnalystRapportContent />
    </>
  );
}

export default AnalystRapport;
