"use client";

import { useState } from "react";
import ClosePopupIcon from "@/assets/icons/ClosePopupIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";

type Props = {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
  canDownload?: boolean;
};

export default function PdfViewer({ fileUrl, fileName, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex justify-center items-center p-4">
      <div className="relative w-full max-w-[1000px] h-[95vh] bg-white rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 truncate max-w-[80%]" title={fileName}>
            {fileName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            aria-label="Fermer la visualisation PDF"
          >
            <ClosePopupIcon />
          </button>
        </div>

        {/* PDF iframe */}
        <iframe
          src={fileUrl}
          className="flex-1 w-full"
          onLoad={() => setIsLoading(false)}
          title={fileName}
          frameBorder="0"
          allowFullScreen
        >
          Votre navigateur ne supporte pas l&apos;affichage intégré des PDF.
        </iframe>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex justify-center items-center pointer-events-none">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}