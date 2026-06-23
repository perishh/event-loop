"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  preload?: boolean;
  fallback?: React.ReactNode;
  spinnerSize?: "sm" | "md" | "lg";
}

export default function SafeImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  fill = false,
  width,
  height,
  sizes,
  preload = false,
  fallback,
  spinnerSize = "md",
}: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const showPlaceholder = !src || hasError;
  const isExternal = typeof src === "string" && /^(https?:)?\/\//.test(src);

  const spinnerSizeClass =
    spinnerSize === "sm"
      ? "w-5 h-5 border-[2px]"
      : spinnerSize === "lg"
        ? "w-10 h-10 border-[3px]"
        : "w-7 h-7 border-[2px]";

  // Placeholder / Error
  if (showPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-violet-200 bg-violet-50/80 text-violet-700 ${wrapperClassName} ${className}`}
      >
        {fallback ?? (
          <div className="text-center px-4">
            <p className="font-semibold text-sm">
              {!src ? "Χωρίς εικόνα" : "Αποτυχία φόρτωσης"}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Loading
  const loadingOverlay = isLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-violet-50/80 animate-pulse z-10">
      <div
        className={`${spinnerSizeClass} border-violet-300 border-t-violet-600 rounded-full animate-spin`}
      />
    </div>
  );

  // Fill Mode
  if (fill) {
    return (
      <div className={`relative overflow-hidden ${wrapperClassName}`}>
        {loadingOverlay}
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={isExternal}
          sizes={sizes}
          preload={preload}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
    );
  }

  // Fixed Mode
  return (
    <div
      className={`relative inline-block overflow-hidden ${wrapperClassName}`}
    >
      {loadingOverlay}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={isExternal}
        preload={preload}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
