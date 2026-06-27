"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { EVENT_TYPE_LABELS } from "@/prisma/mapper";
import { EventType } from "../generated/prisma/enums";
import { formatDate } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";

/**
 * @brief Stores the automatic hero change delay in milliseconds.
 */
const cycleDelayMilliseconds = 10000;

interface Props {
  events: {
    id: string;
    image: string;
    title: string;
    startDateTime: Date;
    venue: string;
    city: string;
    type: EventType;
  }[];
}

/**
 * @brief  Renders the shared welcome hero carousel section.
 * @return The JSX structure of the shared welcome hero carousel.
 */
export default function Hero({ events }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    [
      Autoplay({
        delay: cycleDelayMilliseconds,
        stopOnInteraction: false,
      }),
    ],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.plugins().autoplay?.play();

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.plugins().autoplay?.play();
  }, [emblaApi]);

  return (
    <section className="mb-8 select-none">
      <div className="embla relative">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {events.map((event) => (
              <div key={event.id} className="embla__slide relative group">
                <SafeImage
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  preload
                  wrapperClassName="h-[420px] w-full"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    {/* Text info */}
                    <div className="text-white max-w-2xl">
                      <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-wider text-orange-400 mb-1 md:mb-2">
                        {EVENT_TYPE_LABELS[event.type]}
                      </span>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-1 md:mb-2">
                        {event.title}
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-white/80 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(event.startDateTime)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.venue}, {event.city}
                        </span>
                      </p>
                    </div>

                    {/* CTA button */}
                    <Link
                      href={`/events/${encodeURIComponent(event.id)}`}
                      className="shrink-0 self-start sm:self-auto bg-orange-600 hover:bg-orange-500 text-white text-sm md:text-base font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                      Εισιτήρια
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-1.5 mt-4">
        {events.map((event, index) => (
          <button
            key={event.id}
            type="button"
            aria-label={`Μετάβαση στο hero ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={`rounded-full h-2 ${index === selectedIndex ? "w-4" : "w-2"} focus:outline-none ${index === selectedIndex ? "bg-purple-500" : "bg-purple-200"} focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-all`}
          />
        ))}
      </div>
    </section>
  );
}
