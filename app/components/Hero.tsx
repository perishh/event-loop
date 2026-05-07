"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

/**
 * @brief Defines one temporary welcome hero image.
 */
type Welcome_Hero_Image = {
  id: string;
  imageSource: string;
  imageAlternativeText: string;
};

/**
 * @brief Stores the automatic hero change delay in milliseconds.
 */
const cycleDelayMilliseconds = 10000;

/**
 * @brief Stores the temporary hero images shown on the welcome page.
 */
const welcomeHeroImages: Welcome_Hero_Image[] = [
  {
    id: "welcome-hero-image-1",
    imageSource: "/images_hero/hero_image_1.png",
    imageAlternativeText: "EventLoop featured event banner 1",
  },

  {
    id: "welcome-hero-image-2",
    imageSource: "/images_hero/hero_image_2.png",
    imageAlternativeText: "EventLoop featured event banner 2",
  },

  {
    id: "welcome-hero-image-3",
    imageSource: "/images_hero/hero_image_3.png",
    imageAlternativeText: "EventLoop featured event banner 3",
  },

  {
    id: "welcome-hero-image-4",
    imageSource: "/images_hero/hero_image_4.png",
    imageAlternativeText: "EventLoop featured event banner 4",
  },
];

/**
 * @brief  Renders the shared welcome hero carousel section.
 * @return The JSX structure of the shared welcome hero carousel.
 */
export default function Hero() {
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
    <section className="eventloop-welcome-hero-section">
      <div className="eventloop-welcome-hero-image-wrapper">
        <div className="eventloop-welcome-hero-viewport" ref={emblaRef}>
          <div className="eventloop-welcome-hero-track">
            {welcomeHeroImages.map((welcomeHeroImage) => (
              <div
                key={welcomeHeroImage.id}
                className="eventloop-welcome-hero-slide"
              >
                <img
                  className="eventloop-welcome-hero-image"
                  src={welcomeHeroImage.imageSource}
                  alt={welcomeHeroImage.imageAlternativeText}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="button" className="eventloop-welcome-hero-ticket-button">
          Εισιτήρια
        </button>
      </div>

      <div className="eventloop-welcome-hero-dots">
        {welcomeHeroImages.map((welcomeHeroImage, welcomeHeroImageIndex) => (
          <button
            key={welcomeHeroImage.id}
            type="button"
            aria-label={`Μετάβαση στο hero ${welcomeHeroImageIndex + 1}`}
            onClick={() => scrollTo(welcomeHeroImageIndex)}
            className={
              welcomeHeroImageIndex === selectedIndex
                ? "eventloop-welcome-hero-dot eventloop-welcome-hero-dot-active"
                : "eventloop-welcome-hero-dot"
            }
          />
        ))}
      </div>
    </section>
  );
}
