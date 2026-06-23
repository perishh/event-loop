"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import SafeImage from "./SafeImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaCarouselProps {
  images: string[];
  className?: string;
  gesturesEnabled?: boolean;
  size?: "compact" | "normal";
  eventTitle?: string;
  showEmptyState?: boolean;
  imageAlt?: string;
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
}

export default function MediaCarousel({
  images,
  className = "",
  size = "normal",
  eventTitle,
  showEmptyState = false,
  imageAlt = "media",
  selectedIndex: externalSelectedIndex,
  onSelectedIndexChange,
}: MediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: images.length > 1 },
    [],
  );

  const isControlled = externalSelectedIndex !== undefined;
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const selectedIndex = isControlled
    ? externalSelectedIndex
    : internalSelectedIndex;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    if (!isControlled) {
      setInternalSelectedIndex(index);
    }
    onSelectedIndexChange?.(index);
  }, [emblaApi, isControlled, onSelectedIndexChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const heightClass = size === "compact" ? "h-44" : "h-64 sm:h-96";
  const dotActiveClass =
    size === "compact" ? "bg-violet-600" : "bg-violet-600 w-4";
  const dotInActiveClass =
    size === "compact" ? "bg-violet-200" : "bg-violet-100";

  if (!images || images.length === 0) {
    if (!showEmptyState) return null;

    return (
      <div className="flex h-44 items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50/80 text-violet-700">
        <div className="text-center px-4">
          <p className="font-semibold">Χωρίς εικόνες</p>
          {eventTitle && (
            <p className="text-xs text-violet-600 mt-1">{eventTitle}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`embla overflow-hidden rounded-3xl ${
          size === "normal"
            ? "shadow-lg shadow-violet-500/10 outline-2 outline-violet-100"
            : ""
        }`}
        ref={emblaRef}
      >
        <div className="flex touch-pan-y">
          {images.map((src, idx) => (
            <div key={`${src}-${idx}`} className="relative flex-[0_0_100%]">
                <SafeImage
                  src={src}
                  alt={
                    eventTitle
                      ? `${eventTitle} εικόνα ${idx + 1}`
                      : `${imageAlt} ${idx + 1}`
                  }
                  fill
                  preload={idx === 0}
                  sizes={
                    size === "compact"
                      ? "(max-width: 640px) 100vw, 380px"
                      : "(max-width: 640px) 100vw, 50vw"
                  }
                  wrapperClassName={`w-full ${heightClass}`}
                  className="object-cover"
                />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label={size === "compact" ? "Προηγούμενη εικόνα" : "Previous"}
            onClick={() => emblaApi?.scrollPrev()}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 text-white transition ${
              size === "compact"
                ? "bg-black/45 shadow-lg shadow-black/10 hover:bg-black/60"
                : "bg-black/40 hover:bg-black/50"
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label={size === "compact" ? "Επόμενη εικόνα" : "Next"}
            onClick={() => emblaApi?.scrollNext()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 text-white transition ${
              size === "compact"
                ? "bg-black/45 shadow-lg shadow-black/10 hover:bg-black/60"
                : "bg-black/40 hover:bg-black/50"
            }`}
          >
            <ChevronRight size={16} />
          </button>
          <div className="flex justify-center gap-2 mt-5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={
                  size === "compact"
                    ? `Μετάβαση στην εικόνα ${idx + 1}`
                    : `Go to slide ${idx + 1}`
                }
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`size-2 rounded-full transition-all ${
                  idx === selectedIndex ? dotActiveClass : dotInActiveClass
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
