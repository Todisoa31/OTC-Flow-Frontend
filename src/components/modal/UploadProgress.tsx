'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface UploadProgressOverlayProps {
  progress: number;
  estimatedTimeRemaining: number | null;
}

export default function UploadProgressOverlay({
  progress,
  estimatedTimeRemaining,
}: UploadProgressOverlayProps) {
  const [estimatedRemaining, setEstimatedRemaining] = useState('Calcul en cours...');
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById('upload-progress-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'upload-progress-root';
      document.body.appendChild(el);
    }
    setContainer(el);
  }, []);

  useEffect(() => {
    if (progress === 100 || estimatedTimeRemaining === 0) {
      setEstimatedRemaining('0m 0s');
    } else if (
      estimatedTimeRemaining !== null &&
      isFinite(estimatedTimeRemaining) &&
      estimatedTimeRemaining > 0
    ) {
      const minutes = Math.floor(estimatedTimeRemaining / 60);
      const seconds = Math.floor(estimatedTimeRemaining % 60);
      setEstimatedRemaining(`${minutes}m ${seconds}s`);
    } else {
      setEstimatedRemaining('...');
    }
  }, [progress, estimatedTimeRemaining]);

  if (!container) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-not-allowed">
      <div className="relative w-60 h-60 mb-4">
        <svg className="w-full h-full" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="10" fill="none" />
          <circle cx="80" cy="80" r="70" stroke={progress >= 95 ? '#facc15' : '#3b82f6'} strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={(1 - progress / 100) * 2 * Math.PI * 70} strokeLinecap="round" transform="rotate(-90 80 80)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
          {progress}%
        </div>
      </div>

      <div className="text-white text-sm font-medium">
        Estimation :{' '}
        <span className="text-blue-400 font-bold">{estimatedRemaining}</span>
      </div>
    </div>,
    container
  );
}