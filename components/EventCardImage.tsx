"use client";

import { useState } from "react";

export default function EventCardImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-t-2xl border border-dashed border-violet-200 bg-violet-50/80 text-violet-700 ${className ?? ""}`}
      >
        <div className="text-center px-4">
          <p className="font-semibold text-sm">Χωρίς εικόνα</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
