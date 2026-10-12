'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getFile } from '@/utils/getFile';

interface AvatarUploaderProps {
  image: File | null;
  setImage: (file: File | null) => void;
  preview?: string;
}

export default function AvatarUploader({
  image,
  setImage,
  preview,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('/images/usProfil.jpg');

  useEffect(() => {
    let objectUrl: string | null = null;

    if (image) {
      objectUrl = URL.createObjectURL(image);
      setImageUrl(objectUrl);
    } else if (preview) {
      setImageUrl(getFile(preview));
    } else {
      setImageUrl('/images/usProfil.jpg');
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [image, preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }

  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-center">
      <div className="relative">
        <img
          key={imageUrl}
          src={imageUrl}
          alt="Avatar"
          width={112}
          height={112}
          className="w-28 h-28 rounded-full object-cover border border-gray-300"
        />

        {/* Bouton crayon */}
        <div
          className="absolute bottom-0 right-0 bg-dark-blue p-1 rounded-full cursor-pointer"
          onClick={triggerFileInput}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 13V16H7L15.6 7.4L12.6 4.4L4 13Z" />
          </svg>
        </div>

        {/* Input caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}