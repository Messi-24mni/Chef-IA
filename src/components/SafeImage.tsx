import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function SafeImage({ src, alt, className = "" }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-sky-100 to-blue-100 text-sky-800 p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <ChefHat className="w-8 h-8 mb-2 text-sky-600" strokeWidth={1.75} />
        <span className="text-xs font-medium text-slate-700 text-center line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
