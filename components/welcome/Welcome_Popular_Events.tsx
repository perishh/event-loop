"use client";

/*
 * =========================================================================
 * FILE         :   components/welcome/Welcome_Popular_Events.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Popular upcoming events carousel for the welcome page.
 * =========================================================================
 */


/* Imports the hooks used by the responsive popular events carousel. */
import { useEffect, useRef, useState } from "react";

/* Imports the CSS properties type used for custom carousel variables. */
import type { CSSProperties } from "react";


/**
 * @brief Defines one temporary popular event.
 */
type Welcome_Popular_Event = {
    /* Stores the unique event id. */
    id: number;

    /* Stores the event date text. */
    date: string;

    /* Stores the event title. */
    title: string;

    /* Stores the event location. */
    location: string;

    /* Stores the public image source path. */
    imageSource: string;
};


/**
 * @brief Defines the popular events slide direction.
 */
type Popular_Events_Slide_Direction = "previous" | "next";


/**
 * @brief Defines the custom CSS variables used by the popular events carousel.
 */
type Popular_Events_Carousel_Style = CSSProperties & {
    /* Stores the carousel animation duration CSS variable. */
    "--popular-events-carousel-animation-duration": string;
};


/**
 * @brief Stores the fixed popular event card width used by the carousel.
 */
const popularEventCardWidthPixels = 260;


/**
 * @brief Stores the fixed gap between popular event cards.
 */
const popularEventCardGapPixels = 32;


/**
 * @brief Stores the popular events arrow button size in pixels.
 */
const popularEventArrowSizePixels = 48;


/**
 * @brief Stores the popular events carousel animation duration in milliseconds.
 *        This works like a C #define for the carousel movement speed.
 */
const popularEventsCarouselAnimationDurationMilliseconds = 1000;


/**
 * @brief Stores the temporary popular events shown on the welcome page.
 */
const welcomePopularEvents: Welcome_Popular_Event[] = [
    { id: 1, date: "25 ΣΕΠΤΕΜΒΡΙΟΥ 2026", title: "JAZZ UNDER THE STARS", location: "ODEON GRAND STAGE", imageSource: "/images_popular_events/popular_event_1.png" },
    { id: 2, date: "18 ΙΟΥΛΙΟΥ 2026", title: "ATHENS ROCK NIGHT", location: "TECHNOPOLIS", imageSource: "/images_popular_events/popular_event_2.png" },
    { id: 3, date: "9 ΑΥΓΟΥΣΤΟΥ 2026", title: "SUMMER BEATS FESTIVAL", location: "ATHENS OPEN AIR", imageSource: "/images_popular_events/popular_event_3.png" },
    { id: 4, date: "14 ΝΟΕΜΒΡΙΟΥ 2026", title: "INDIE LIGHTS - LIVE", location: "CITY HALL STAGE", imageSource: "/images_popular_events/popular_event_4.png" },
    { id: 5, date: "2 ΔΕΚΕΜΒΡΙΟΥ 2026", title: "ELECTROFUNK NIGHT", location: "TECHNOPOLIS", imageSource: "/images_popular_events/popular_event_5.png" },
    { id: 6, date: "10 ΔΕΚΕΜΒΡΙΟΥ 2026", title: "CLASSICAL EVENING", location: "ODEON GRAND STAGE", imageSource: "/images_popular_events/popular_event_6.png" },
    { id: 7, date: "5 ΙΑΝΟΥΑΡΙΟΥ 2027", title: "WINTER JAZZ SESSION", location: "CITY HALL STAGE", imageSource: "/images_popular_events/popular_event_7.png" },
    { id: 8, date: "15 ΙΑΝΟΥΑΡΙΟΥ 2027", title: "ROCK & SOUL", location: "TECHNOPOLIS", imageSource: "/images_popular_events/popular_event_8.png" },
    { id: 9, date: "20 ΙΑΝΟΥΑΡΙΟΥ 2027", title: "POP BEATS NIGHT", location: "ATHENS OPEN AIR", imageSource: "/images_popular_events/popular_event_9.png" },
    { id: 10, date: "28 ΙΑΝΟΥΑΡΙΟΥ 2027", title: "LATIN FIESTA", location: "CITY HALL STAGE", imageSource: "/images_popular_events/popular_event_10.png" },
    { id: 11, date: "3 ΦΕΒΡΟΥΑΡΙΟΥ 2027", title: "ELECTRO NIGHT", location: "TECHNOPOLIS", imageSource: "/images_popular_events/popular_event_11.png" },
    { id: 12, date: "12 ΦΕΒΡΟΥΑΡΙΟΥ 2027", title: "ACOUSTIC SESSIONS", location: "ODEON GRAND STAGE", imageSource: "/images_popular_events/popular_event_12.png" },
    { id: 13, date: "18 ΦΕΒΡΟΥΑΡΙΟΥ 2027", title: "HIP HOP LIVE", location: "ATHENS OPEN AIR", imageSource: "/images_popular_events/popular_event_13.png" },
    { id: 14, date: "25 ΦΕΒΡΟΥΑΡΙΟΥ 2027", title: "BLUES FESTIVAL", location: "CITY HALL STAGE", imageSource: "/images_popular_events/popular_event_14.png" },
    { id: 15, date: "3 ΜΑΡΤΙΟΥ 2027", title: "INDIE POP NIGHT", location: "TECHNOPOLIS", imageSource: "/images_popular_events/popular_event_15.png" },
];


/**
 * @brief  Renders one popular event card.
 * @param  popularEvent  the event data shown inside the card.
 * @return The JSX structure of one popular event card.
 */
function Welcome_Popular_Event_Card({ popularEvent }: { popularEvent: Welcome_Popular_Event }) {
    /* Stores whether the popular event image failed to load. */
    const [popularEventImageIsMissing, setPopularEventImageIsMissing] = useState(false);

    /* Returns one popular event card. */
    return (
        /* Popular event card wrapper. */
        <article className="eventloop-popular-event-card">
            {/* Shows the image area of the card. */}
            <div className="eventloop-popular-event-image-area">
                {/* Shows the image only when it exists. */}
                {!popularEventImageIsMissing && (
                    <img
                        /* Loads the event image. */
                        src={popularEvent.imageSource}
                        /* Describes the event image. */
                        alt={popularEvent.title}
                        /* Hides the broken image if the file does not exist. */
                        onError={() => setPopularEventImageIsMissing(true)}
                        /* Applies the event image style. */
                        className="eventloop-popular-event-image"
                    />
                )}
            </div>

            {/* Shows the text area of the card. */}
            <div className="eventloop-popular-event-text-area">
                {/* Shows the event date. */}
                <p className="eventloop-popular-event-date">
                    {popularEvent.date}
                </p>

                {/* Shows the event title. */}
                <h3 className="eventloop-popular-event-title">
                    {popularEvent.title}
                </h3>

                {/* Shows the event location. */}
                <p className="eventloop-popular-event-location">
                    {popularEvent.location}
                </p>
            </div>
        </article>
    );
}


/**
 * @brief Defines the properties of a popular events arrow icon.
 */
type Welcome_Popular_Events_Arrow_Icon_Props = {
    /* Stores the direction of the arrow icon. */
    direction: "previous" | "next";
};


/**
 * @brief  Renders a centered SVG chevron for the popular events arrows.
 * @param  direction  the direction where the arrow points.
 * @return The JSX structure of the arrow icon.
 */
function Welcome_Popular_Events_Arrow_Icon({
    direction,
}: Welcome_Popular_Events_Arrow_Icon_Props) {
    /* Stores the SVG path for the requested arrow direction. */
    const arrowIconPath =
        direction === "previous"
            ? "M15 6L9 12L15 18"
            : "M9 6L15 12L9 18";

    /* Returns the centered SVG arrow icon. */
    return (
        /* SVG chevron icon used inside the circular carousel button. */
        <svg
            aria-hidden="true"
            className="eventloop-popular-events-arrow-icon"
            viewBox="0 0 24 24"
        >
            {/* Draws the chevron shape. */}
            <path d={arrowIconPath} />
        </svg>
    );
}


/**
 * @brief  Renders the popular upcoming events carousel.
 * @return The JSX structure of the popular upcoming events section.
 */
export default function Welcome_Popular_Events() {
    /* Stores the available carousel area reference. */
    const popularEventsAvailableAreaRef = useRef<HTMLDivElement | null>(null);

    /* Stores the animation timeout id. */
    const popularEventsAnimationTimeoutRef = useRef<number | null>(null);

    /* Stores how many event cards can fit in the visible carousel area. */
    const [visiblePopularEventCount, setVisiblePopularEventCount] = useState(1);

    /* Stores the first currently visible popular event index. */
    const [currentPopularEventStartIndex, setCurrentPopularEventStartIndex] = useState(0);

    /* Stores the first next visible popular event index during animation. */
    const [nextPopularEventStartIndex, setNextPopularEventStartIndex] = useState<number | null>(null);

    /* Stores the current carousel slide direction. */
    const [popularEventsSlideDirection, setPopularEventsSlideDirection] =
        useState<Popular_Events_Slide_Direction>("next");

    /* Stores whether the carousel is currently sliding. */
    const [popularEventsCarouselIsSliding, setPopularEventsCarouselIsSliding] = useState(false);

    /* Stores the last valid start index of the popular event carousel. */
    const maximumPopularEventStartIndex = Math.max(0, welcomePopularEvents.length - visiblePopularEventCount);

    /* Stores the carousel index used for the arrow button visibility. */
    const popularEventsArrowStateStartIndex =
        nextPopularEventStartIndex ?? currentPopularEventStartIndex;
    
    /* Stores only the currently visible popular events. */
    const currentVisiblePopularEvents = welcomePopularEvents.slice(
        currentPopularEventStartIndex,
        currentPopularEventStartIndex + visiblePopularEventCount
    );

    /* Stores only the next visible popular events during animation. */
    const nextVisiblePopularEvents =
        nextPopularEventStartIndex === null
            ? []
            : welcomePopularEvents.slice(
                nextPopularEventStartIndex,
                nextPopularEventStartIndex + visiblePopularEventCount
            );

    /* Stores the carousel animation duration as a CSS variable. */
    const popularEventsCarouselStyle: Popular_Events_Carousel_Style = {
        "--popular-events-carousel-animation-duration": `${popularEventsCarouselAnimationDurationMilliseconds}ms`,
    };

    /* Updates the number of visible cards when the available area changes. */
    useEffect(() => {
        /**
         * @brief Calculates how many full event cards fit in the available width.
         */
        function updateVisiblePopularEventCount() {
            /* Stops if the available area is not ready yet. */
            if (popularEventsAvailableAreaRef.current === null) {
                return;
            }

            /* Stores the available width for the whole carousel row. */
            const availablePopularEventsWidth = popularEventsAvailableAreaRef.current.clientWidth;

            /* Stores the width left for cards after arrows and gaps are removed. */
            const availablePopularEventCardsWidth =
                availablePopularEventsWidth -
                2 * popularEventArrowSizePixels -
                2 * popularEventCardGapPixels;

            /* Calculates how many complete cards fit in the available cards width. */
            const nextVisiblePopularEventCount = Math.max(
                1,
                Math.floor(
                    (availablePopularEventCardsWidth + popularEventCardGapPixels) /
                    (popularEventCardWidthPixels + popularEventCardGapPixels)
                )
            );

            /* Stores the visible count without exceeding the total event count. */
            setVisiblePopularEventCount(Math.min(welcomePopularEvents.length, nextVisiblePopularEventCount));
        }

        /* Updates the visible event count once when the component loads. */
        updateVisiblePopularEventCount();

        /* Creates a resize observer for the full carousel area. */
        const popularEventsResizeObserver = new ResizeObserver(updateVisiblePopularEventCount);

        /* Starts watching the full carousel area. */
        if (popularEventsAvailableAreaRef.current !== null) {
            popularEventsResizeObserver.observe(popularEventsAvailableAreaRef.current);
        }

        /* Stops watching the full carousel area when the component is removed. */
        return () => {
            popularEventsResizeObserver.disconnect();
        };
    }, []);

    /* Keeps the carousel start index valid when the visible count changes. */
    useEffect(() => {
        /* Clamps the current start index inside the valid range. */
        setCurrentPopularEventStartIndex((currentStartIndex) =>
            Math.min(currentStartIndex, maximumPopularEventStartIndex)
        );
    }, [maximumPopularEventStartIndex]);

    /* Clears pending animation timers when the component is removed. */
    useEffect(() => {
        /* Returns the cleanup function for animation timers. */
        return () => {
            /* Clears the animation timeout if it exists. */
            if (popularEventsAnimationTimeoutRef.current !== null) {
                window.clearTimeout(popularEventsAnimationTimeoutRef.current);
            }
        };
    }, []);

    /**
     * @brief Moves the carousel to another group with a real slide effect.
     * @param requestedPopularEventStartIndex the requested first visible event index.
     * @param requestedSlideDirection the requested slide direction.
     */
    function movePopularEventsCarousel(
        requestedPopularEventStartIndex: number,
        requestedSlideDirection: Popular_Events_Slide_Direction
    ) {
        /* Stops if the carousel is already sliding. */
        if (popularEventsCarouselIsSliding) {
            return;
        }

        /* Stops if the requested group is already visible. */
        if (requestedPopularEventStartIndex === currentPopularEventStartIndex) {
            return;
        }

        /* Stores the next group that will slide into view. */
        setNextPopularEventStartIndex(requestedPopularEventStartIndex);

        /* Stores the requested slide direction. */
        setPopularEventsSlideDirection(requestedSlideDirection);

        /* Starts the carousel slide animation. */
        setPopularEventsCarouselIsSliding(true);

        /* Finishes the carousel slide after the animation duration. */
        popularEventsAnimationTimeoutRef.current = window.setTimeout(() => {
            /* Makes the next group the current visible group. */
            setCurrentPopularEventStartIndex(requestedPopularEventStartIndex);

            /* Removes the temporary next group. */
            setNextPopularEventStartIndex(null);

            /* Ends the carousel slide state. */
            setPopularEventsCarouselIsSliding(false);
        }, popularEventsCarouselAnimationDurationMilliseconds);
    }

    /**
     * @brief Moves the carousel to the previous visible group.
     */
    function goToPreviousPopularEvents() {
        /* Stores the previous carousel group start index. */
        const previousPopularEventStartIndex = Math.max(
            0,
            currentPopularEventStartIndex - visiblePopularEventCount
        );

        /* Moves to the previous group with a real carousel slide. */
        movePopularEventsCarousel(previousPopularEventStartIndex, "previous");
    }

    /**
     * @brief Moves the carousel to the next visible group.
     */
    function goToNextPopularEvents() {
        /* Stores the next carousel group start index. */
        const nextPopularEventStartIndexValue = Math.min(
            maximumPopularEventStartIndex,
            currentPopularEventStartIndex + visiblePopularEventCount
        );

        /* Moves to the next group with a real carousel slide. */
        movePopularEventsCarousel(nextPopularEventStartIndexValue, "next");
    }

    /* Returns the popular events section. */
    return (
        /* Popular events section wrapper. */
        <section
            className="eventloop-popular-events-section"
            style={popularEventsCarouselStyle}
        >
            {/* Popular events section title. */}
            <h2 className="eventloop-popular-events-title">
                Δημοφιλείς επερχόμενες εκδηλώσεις:
            </h2>

            {/* Popular events carousel wrapper. */}
            <div
                ref={popularEventsAvailableAreaRef}
                className="eventloop-popular-events-carousel"
            >
                {/* Previous carousel button. */}
                <button
                    type="button"
                    aria-label="Προηγούμενες εκδηλώσεις"
                    disabled={popularEventsArrowStateStartIndex === 0}
                    onClick={goToPreviousPopularEvents}
                    className="eventloop-popular-events-arrow-button"
                >
                    {/* Shows the centered previous arrow icon. */}
                    <Welcome_Popular_Events_Arrow_Icon direction="previous" />
                </button>

                {/* Carousel window that contains only the current and next groups. */}
                <div className="eventloop-popular-events-carousel-window">
                    {/* Current group of visible cards. */}
                    <div
                        className={
                            popularEventsCarouselIsSliding
                                ? `eventloop-popular-events-carousel-group eventloop-popular-events-carousel-current-group eventloop-popular-events-carousel-current-group-${popularEventsSlideDirection}`
                                : "eventloop-popular-events-carousel-group eventloop-popular-events-carousel-current-group"
                        }
                    >
                        {/* Creates one card for each current visible popular event. */}
                        {currentVisiblePopularEvents.map((popularEvent) => (
                            <Welcome_Popular_Event_Card
                                key={popularEvent.id}
                                popularEvent={popularEvent}
                            />
                        ))}
                    </div>

                    {/* Next group of visible cards during the slide animation. */}
                    {popularEventsCarouselIsSliding && (
                        <div
                            className={`eventloop-popular-events-carousel-group eventloop-popular-events-carousel-next-group eventloop-popular-events-carousel-next-group-${popularEventsSlideDirection}`}
                        >
                            {/* Creates one card for each next visible popular event. */}
                            {nextVisiblePopularEvents.map((popularEvent) => (
                                <Welcome_Popular_Event_Card
                                    key={popularEvent.id}
                                    popularEvent={popularEvent}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Next carousel button. */}
                <button
                    type="button"
                    aria-label="Επόμενες εκδηλώσεις"
                    disabled={popularEventsArrowStateStartIndex >= maximumPopularEventStartIndex}
                    onClick={goToNextPopularEvents}
                    className="eventloop-popular-events-arrow-button"
                >
                    {/* Shows the centered next arrow icon. */}
                    <Welcome_Popular_Events_Arrow_Icon direction="next" />
                </button>
            </div>
        </section>
    );
}


