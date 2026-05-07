"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ArrowIcon from "@/components/ArrowIcon";

/**
 * @brief Defines one temporary popular event.
 */
interface PopularEvent {
  id: number;
  date: string;
  title: string;
  location: string;
  imageSource: string;
}

/**
 * @brief Stores the temporary popular events shown on the welcome page.
 */
const welcomePopularEvents: PopularEvent[] = [
  {
    id: 1,
    date: "25 ΣΕΠΤΕΜΒΡΙΟΥ 2026",
    title: "JAZZ UNDER THE STARS",
    location: "ODEON GRAND STAGE",
    imageSource: "/images_popular_events/popular_event_1.png",
  },
  {
    id: 2,
    date: "18 ΙΟΥΛΙΟΥ 2026",
    title: "ATHENS ROCK NIGHT",
    location: "TECHNOPOLIS",
    imageSource: "/images_popular_events/popular_event_2.png",
  },
  {
    id: 3,
    date: "9 ΑΥΓΟΥΣΤΟΥ 2026",
    title: "SUMMER BEATS FESTIVAL",
    location: "ATHENS OPEN AIR",
    imageSource: "/images_popular_events/popular_event_3.png",
  },
  {
    id: 4,
    date: "14 ΝΟΕΜΒΡΙΟΥ 2026",
    title: "INDIE LIGHTS - LIVE",
    location: "CITY HALL STAGE",
    imageSource: "/images_popular_events/popular_event_4.png",
  },
  {
    id: 5,
    date: "2 ΔΕΚΕΜΒΡΙΟΥ 2026",
    title: "ELECTROFUNK NIGHT",
    location: "TECHNOPOLIS",
    imageSource: "/images_popular_events/popular_event_5.png",
  },
  {
    id: 6,
    date: "10 ΔΕΚΕΜΒΡΙΟΥ 2026",
    title: "CLASSICAL EVENING",
    location: "ODEON GRAND STAGE",
    imageSource: "/images_popular_events/popular_event_6.png",
  },
  {
    id: 7,
    date: "5 ΙΑΝΟΥΑΡΙΟΥ 2027",
    title: "WINTER JAZZ SESSION",
    location: "CITY HALL STAGE",
    imageSource: "/images_popular_events/popular_event_7.png",
  },
  {
    id: 8,
    date: "15 ΙΑΝΟΥΑΡΙΟΥ 2027",
    title: "ROCK & SOUL",
    location: "TECHNOPOLIS",
    imageSource: "/images_popular_events/popular_event_8.png",
  },
  {
    id: 9,
    date: "20 ΙΑΝΟΥΑΡΙΟΥ 2027",
    title: "POP BEATS NIGHT",
    location: "ATHENS OPEN AIR",
    imageSource: "/images_popular_events/popular_event_9.png",
  },
  {
    id: 10,
    date: "28 ΙΑΝΟΥΑΡΙΟΥ 2027",
    title: "LATIN FIESTA",
    location: "CITY HALL STAGE",
    imageSource: "/images_popular_events/popular_event_10.png",
  },
  {
    id: 11,
    date: "3 ΦΕΒΡΟΥΑΡΙΟΥ 2027",
    title: "ELECTRO NIGHT",
    location: "TECHNOPOLIS",
    imageSource: "/images_popular_events/popular_event_11.png",
  },
  {
    id: 12,
    date: "12 ΦΕΒΡΟΥΑΡΙΟΥ 2027",
    title: "ACOUSTIC SESSIONS",
    location: "ODEON GRAND STAGE",
    imageSource: "/images_popular_events/popular_event_12.png",
  },
  {
    id: 13,
    date: "18 ΦΕΒΡΟΥΑΡΙΟΥ 2027",
    title: "HIP HOP LIVE",
    location: "ATHENS OPEN AIR",
    imageSource: "/images_popular_events/popular_event_13.png",
  },
  {
    id: 14,
    date: "25 ΦΕΒΡΟΥΑΡΙΟΥ 2027",
    title: "BLUES FESTIVAL",
    location: "CITY HALL STAGE",
    imageSource: "/images_popular_events/popular_event_14.png",
  },
  {
    id: 15,
    date: "3 ΜΑΡΤΙΟΥ 2027",
    title: "INDIE POP NIGHT",
    location: "TECHNOPOLIS",
    imageSource: "/images_popular_events/popular_event_15.png",
  },
];

/**
 * @brief  Renders one popular event card.
 * @param  popularEvent  the event data shown inside the card.
 * @return The JSX structure of one popular event card.
 */
function EventCard({ popularEvent }: { popularEvent: PopularEvent }) {
  const [isImageMissing, setIsImageMissing] = useState(false);

  return (
    <article className="eventloop-popular-event-card">
      <div className="eventloop-popular-event-image-area">
        {!isImageMissing && (
          <img
            src={popularEvent.imageSource}
            alt={popularEvent.title}
            onError={() => setIsImageMissing(true)}
            className="eventloop-popular-event-image"
          />
        )}
      </div>

      <div className="eventloop-popular-event-text-area">
        <p className="eventloop-popular-event-date">{popularEvent.date}</p>
        <h3 className="eventloop-popular-event-title">{popularEvent.title}</h3>
        <p className="eventloop-popular-event-location">
          {popularEvent.location}
        </p>
      </div>
    </article>
  );
}

/**
 * @brief  Renders the popular upcoming events carousel.
 * @return The JSX structure of the popular upcoming events section.
 */
export default function PopularEvents() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

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
    <section className="eventloop-popular-events-section">
      <h2 className="eventloop-popular-events-title">
        Δημοφιλείς επερχόμενες εκδηλώσεις:
      </h2>

      <div className="eventloop-popular-events-carousel">
        <button
          type="button"
          aria-label="Προηγούμενες εκδηλώσεις"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          className="eventloop-popular-events-arrow-button"
        >
          <ArrowIcon direction="previous" />
        </button>

        <div
          className="eventloop-popular-events-carousel-window"
          ref={emblaRef}
        >
          <div className="eventloop-popular-events-carousel-group">
            {welcomePopularEvents.map((popularEvent) => (
              <EventCard key={popularEvent.id} popularEvent={popularEvent} />
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Επόμενες εκδηλώσεις"
          disabled={!canScrollNext}
          onClick={scrollNext}
          className="eventloop-popular-events-arrow-button"
        >
          <ArrowIcon direction="next" />
        </button>
      </div>
    </section>
  );
}
