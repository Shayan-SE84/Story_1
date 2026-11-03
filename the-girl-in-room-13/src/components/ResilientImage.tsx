import React, { useState } from 'react';
import { Eye } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EBE6DF] dark:bg-[#161412] text-[#57534E] dark:text-[#A8A29E] p-8 text-center border border-[#D6CEBE] dark:border-[#292524] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Eye className="w-6 h-6 mb-2 opacity-60" />
        <p className="font-display text-base italic">{fallbackLabel || alt}</p>
        <span className="text-xs font-mono-tabular mt-1 opacity-75">
          Archival Visual Plate · Case File 13
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
