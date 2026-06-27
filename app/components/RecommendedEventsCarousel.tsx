"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { EventCard, EventCardProps } from "@/components/EventCard";

interface Props {
  events: EventCardProps[];
}

export default function RecommendedEventsCarousel({ events }: Props) {
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
          <Sparkles size={36} className="text-amber-600" />
          <h2 className="text-2xl font-bold tracking-wide">
            Προτεινόμενες για εσάς
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="border-2 border-amber-200 hover:border-amber-300 active:border-amber-400 hover:bg-amber-50 rounded-full p-1.5 transition-colors"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Προηγούμενες προτεινόμενες"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="border-2 border-amber-200 hover:border-amber-300 active:border-amber-400 hover:bg-amber-50 rounded-full p-1.5 transition-colors"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Επόμενες προτεινόμενες"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="embla mt-4 select-none">
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
