"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

/**
 * @brief Stores the automatic hero change delay in milliseconds.
 */
const cycleDelayMilliseconds = 10000;

interface Props {
  events: {
    id: string;
    image: string;
    title: string;
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
    <section className="mb-8">
      <div className="embla relative">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {events.map((event) => (
              <div key={event.id} className="embla__slide relative group">
                <img
                  src={event.image}
                  alt={event.title}
                  className="object-cover h-[400px] w-full"
                />
                <Link
                  href={`/events/${encodeURIComponent(event.id)}`}
                  className="z-10 absolute bottom-16 right-16 bg-orange-700 text-white px-4 py-2 rounded-lg shadow-lg opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  Εισιτήρια
                </Link>
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
