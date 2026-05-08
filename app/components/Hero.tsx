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
    <section>
      <div className="embla relative">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {welcomeHeroImages.map((welcomeHeroImage) => (
              <div
                key={welcomeHeroImage.id}
                className="embla__slide relative group"
              >
                <img
                  src={welcomeHeroImage.imageSource}
                  alt={welcomeHeroImage.imageAlternativeText}
                />
                <button
                  type="button"
                  className="z-10 absolute bottom-16 right-16 bg-orange-700 text-white px-4 py-2 rounded-lg shadow-lg opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  Εισιτήρια
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-1.5 mt-4">
        {welcomeHeroImages.map((img, index) => (
          <button
            key={img.id}
            type="button"
            aria-label={`Μετάβαση στο hero ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={`bg-purple-300 rounded-full h-2 w-${index === selectedIndex ? "4" : "2"} focus:outline-none ${index === selectedIndex ? "bg-purple-500" : ""} focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-all`}
          />
        ))}
      </div>
    </section>
  );
}
