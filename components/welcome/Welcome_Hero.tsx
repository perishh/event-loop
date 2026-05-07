"use client";

/*
 * =========================================================================
 * FILE         :   components/welcome/Welcome_Hero.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Shared welcome hero carousel component.
 *                  It is used by both logged and not logged welcome pages.
 * =========================================================================
 */


/* Imports the effect hook used for automatic hero cycling. */
import { useEffect, useState } from "react";


/**
 * @brief Defines one temporary welcome hero image.
 */
type Welcome_Hero_Image = {
    /* Stores the unique hero image id. */
    id: string;

    /* Stores the public image source path. */
    imageSource: string;

    /* Stores the image alternative text. */
    imageAlternativeText: string;
};


/**
 * @brief Stores the automatic hero change delay in milliseconds.
 */
const welcomeHeroCycleDelayMilliseconds = 10000;


/**
 * @brief Stores the temporary hero images shown on the welcome page.
 */
const welcomeHeroImages: Welcome_Hero_Image[] = [
    {
        /* Stores the first hero banner id. */
        id: "welcome-hero-image-1",

        /* Stores the first hero banner path. */
        imageSource: "/images_hero/hero_image_1.png",

        /* Stores the first hero banner alternative text. */
        imageAlternativeText: "EventLoop featured event banner 1",
    },

    {
        /* Stores the second hero banner id. */
        id: "welcome-hero-image-2",

        /* Stores the second hero banner path. */
        imageSource: "/images_hero/hero_image_2.png",

        /* Stores the second hero banner alternative text. */
        imageAlternativeText: "EventLoop featured event banner 2",
    },

    {
        /* Stores the third hero banner id. */
        id: "welcome-hero-image-3",

        /* Stores the third hero banner path. */
        imageSource: "/images_hero/hero_image_3.png",

        /* Stores the third hero banner alternative text. */
        imageAlternativeText: "EventLoop featured event banner 3",
    },

    {
        /* Stores the fourth hero banner id. */
        id: "welcome-hero-image-4",

        /* Stores the fourth hero banner path. */
        imageSource: "/images_hero/hero_image_4.png",

        /* Stores the fourth hero banner alternative text. */
        imageAlternativeText: "EventLoop featured event banner 4",
    },
];


/**
 * @brief  Renders the shared welcome hero carousel section.
 * @return The JSX structure of the shared welcome hero carousel.
 */
export default function Welcome_Hero() {
    /* Stores the currently visible hero image index. */
    const [activeWelcomeHeroImageIndex, setActiveWelcomeHeroImageIndex] = useState(0);

    /* Stores the track position class for the active hero image. */
    const welcomeHeroTrackPositionClassName = `eventloop-welcome-hero-track-position-${activeWelcomeHeroImageIndex}`;

    /* Changes the active hero image automatically after a fixed delay. */
    useEffect(() => {
        /* Creates a new timeout every time the active hero image changes. */
        const welcomeHeroTimeoutId = window.setTimeout(() => {
            /* Moves to the next hero image and returns to the first after the last one. */
            setActiveWelcomeHeroImageIndex((currentWelcomeHeroImageIndex) =>
                (currentWelcomeHeroImageIndex + 1) % welcomeHeroImages.length
            );
        }, welcomeHeroCycleDelayMilliseconds);

        /* Clears the timeout when the active hero image changes again. */
        return () => {
            /* Stops the previous automatic hero change timeout. */
            window.clearTimeout(welcomeHeroTimeoutId);
        };
    }, [activeWelcomeHeroImageIndex]);

    /* Returns the shared welcome hero carousel section. */
    return (
        /* Main hero section shown under the header. */
        <section className="eventloop-welcome-hero-section">
            {/* Hero image wrapper. */}
            <div className="eventloop-welcome-hero-image-wrapper">
                {/* Horizontal hero track that creates the slide effect. */}
                <div className={`eventloop-welcome-hero-track ${welcomeHeroTrackPositionClassName}`}>
                    {/* Creates one full-width slide for each hero image. */}
                    {welcomeHeroImages.map((welcomeHeroImage) => (
                        /* Renders one hero slide. */
                        <div
                            /* Uses the hero image id as the unique key. */
                            key={welcomeHeroImage.id}
                            /* Applies the hero slide style. */
                            className="eventloop-welcome-hero-slide"
                        >
                            {/* Visible hero banner image. */}
                            <img
                                /* Loads the hero image. */
                                src={welcomeHeroImage.imageSource}
                                /* Describes the hero image. */
                                alt={welcomeHeroImage.imageAlternativeText}
                                /* Applies the hero image style. */
                                className="eventloop-welcome-hero-image"
                            />
                        </div>
                    ))}
                </div>

                {/* Tickets button shown over the hero image. */}
                <button
                    /* Keeps this button inactive until event details are connected. */
                    type="button"
                    /* Applies the hero tickets button style. */
                    className="eventloop-welcome-hero-ticket-button"
                >
                    {/* Prints the button label. */}
                    Εισιτήρια
                </button>
            </div>

            {/* Hero dots wrapper. */}
            <div className="eventloop-welcome-hero-dots">
                {/* Creates one dot button for each hero image. */}
                {welcomeHeroImages.map((welcomeHeroImage, welcomeHeroImageIndex) => (
                    /* Renders one clickable hero dot. */
                    <button
                        /* Uses the hero image id as the unique key. */
                        key={welcomeHeroImage.id}
                        /* Keeps the dot as a normal button. */
                        type="button"
                        /* Describes the dot button action. */
                        aria-label={`Μετάβαση στο hero ${welcomeHeroImageIndex + 1}`}
                        /* Changes the active hero image when the dot is clicked. */
                        onClick={() => setActiveWelcomeHeroImageIndex(welcomeHeroImageIndex)}
                        /* Applies active style only to the selected hero image. */
                        className={
                            welcomeHeroImageIndex === activeWelcomeHeroImageIndex
                                ? "eventloop-welcome-hero-dot eventloop-welcome-hero-dot-active"
                                : "eventloop-welcome-hero-dot"
                        }
                    />
                ))}
            </div>
        </section>
    );
}



