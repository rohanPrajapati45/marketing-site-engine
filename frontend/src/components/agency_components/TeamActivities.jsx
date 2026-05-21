import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

function TeamActivities({ section }) {
  const { cards = [] } = section.data;

  const [currentSlide, setCurrentSlide] = useState(0);

  // HOW MANY DESKTOP SLIDES ARE POSSIBLE
  const desktopMaxSlide = Math.max(cards.length - 4, 0);

  // AUTO SLIDE

  useEffect(() => {
    const interval = setInterval(() => {
      // MOBILE
      if (window.innerWidth < 1024) {
        setCurrentSlide((prev) =>
          prev === cards.length - 1 ? 0 : prev + 1
        );
      }

      // DESKTOP
      else {
        setCurrentSlide((prev) =>
          prev >= desktopMaxSlide ? 0 : prev + 1
        );
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [cards.length, desktopMaxSlide]);

  // NEXT

  const nextSlide = () => {
    // MOBILE
    if (window.innerWidth < 1024) {
      setCurrentSlide((prev) =>
        prev === cards.length - 1 ? 0 : prev + 1
      );
    }

    // DESKTOP
    else {
      setCurrentSlide((prev) =>
        prev >= desktopMaxSlide ? 0 : prev + 1
      );
    }
  };

  // PREV

  const prevSlide = () => {
    // MOBILE
    if (window.innerWidth < 1024) {
      setCurrentSlide((prev) =>
        prev === 0 ? cards.length - 1 : prev - 1
      );
    }

    // DESKTOP
    else {
      setCurrentSlide((prev) =>
        prev === 0 ? desktopMaxSlide : prev - 1
      );
    }
  };

  return (
    <section
      className="
        w-full
        bg-[#fefefe]
        overflow-hidden
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div className="relative overflow-hidden">
        {/* MOBILE SLIDER */}

        <div className="block lg:hidden overflow-hidden w-full">
          <div
            className="
              flex

              transition-transform
              duration-[1400ms]
              ease-in-out
            "
            style={{
              width: `${cards.length * 100}%`,
              transform: `translateX(-${
                currentSlide * (100 / cards.length)
              }%)`,
            }}
          >
            {cards.map((item, index) => (
              <div
                key={index}
                className="
                  w-full
                  flex-shrink-0

                  h-[220px]
                  sm:h-[340px]

                  overflow-hidden
                "
                style={{
                  width: `${100 / cards.length}%`,
                }}
              >
                <img
                  src={item.image}
                  alt="Team Activity"
                  loading="lazy"
                  className="
                    w-full
                    h-full

                    object-cover
                    object-center
                  "
                />
              </div>
            ))}
          </div>

          {/* MOBILE DOTS */}

          <div
            className="
              absolute

              bottom-5
              left-1/2

              -translate-x-1/2

              flex
              items-center
              gap-2

              z-20
            "
          >
            {cards.map((_, index) => (
              <div
                key={index}
                className={`
                  h-[8px]
                  w-[8px]

                  rounded-full

                  transition-all
                  duration-300

                  ${
                    currentSlide === index
                      ? "bg-white scale-125"
                      : "bg-white/40"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP ORIGINAL VIEW */}

        <div className="hidden lg:block overflow-hidden w-full">
          <div
            className="
              flex

              transition-transform
              duration-700
              ease-in-out
            "
            style={{
              transform: `translateX(-${currentSlide * 25}%)`,
            }}
          >
            {cards.map((item, index) => (
              <div
                key={index}
                className="
                  w-[25%]
                  flex-shrink-0

                  h-[340px]

                  overflow-hidden
                "
              >
                <img
                  src={item.image}
                  alt="Team Activity"
                  loading="lazy"
                  className="
                    w-full
                    h-full

                    object-cover
                    object-center
                  "
                />
              </div>
            ))}
          </div>
        </div>

        {/* ARROWS */}

        <div
          className="
            absolute

            bottom-4
            right-4

            sm:bottom-6
            sm:right-6

            lg:bottom-8
            lg:right-8

            flex
            items-center

            gap-3
            lg:gap-5

            z-20
          "
        >
          <button
            onClick={prevSlide}
            className="
              text-white

              transition-all
              duration-300

              hover:scale-110
            "
          >
            <ArrowLeft
              size={38}
              strokeWidth={1.5}
              className="lg:w-[56px] lg:h-[56px]"
            />
          </button>

          <button
            onClick={nextSlide}
            className="
              text-white

              transition-all
              duration-300

              hover:scale-110
            "
          >
            <ArrowRight
              size={38}
              strokeWidth={1.5}
              className="lg:w-[56px] lg:h-[56px]"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export default TeamActivities;