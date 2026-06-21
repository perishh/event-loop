"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { EventCard, EventCardProps } from "@/components/EventCard";

interface Props {
  events: EventCardProps[];
}

/**
 * @brief  Renders the popular upcoming events carousel.
 * @return The JSX structure of the popular upcoming events section.
 */
export default function PopularEventsCarousel({ events }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "end" });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    // Updates the arrow button availability when the carousel scrolls.
    function onSelect() {
      setCanScrollPrev(emblaApi!.canScrollPrev());
      setCanScrollNext(emblaApi!.canScrollNext());
    }

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section>
      <div className="flex items-center justify-between w-full px-8">
        <div className="flex items-center space-x-6">
          <Flame size={36} />
          <h2 className="text-2xl font-bold tracking-wide">
            Δημοφιλείς εκδηλώσεις
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="border-2 border-orange-200 hover:border-orange-300 active:border-orange-400 hover:bg-orange-50 rounded-full p-1.5 transition-colors"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Προηγούμενες εκδηλώσεις"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="border-2 border-orange-200 hover:border-orange-300 active:border-orange-400 hover:bg-orange-50 rounded-full p-1.5 transition-colors"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Επόμενες εκδηλώσεις"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="embla mt-4">
        <div className="embla__viewport pb-8" ref={emblaRef}>
          <div className="embla__container">
            {events.map((event) => (
              <div
                style={{ flex: "0 0 300px" }}
                className="pl-4"
                key={event.id}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
