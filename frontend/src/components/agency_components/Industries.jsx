import { useEffect, useRef, useState } from "react";

function IndustryItem({ item }) {
  return (
    <li
      className="
        flex
        flex-col

        items-center
        justify-center

        text-center
      "
    >
      {/* MOBILE = ONLY ICON + TEXT */}

      <div className="flex flex-col items-center justify-center lg:hidden">
        <img
          src={item.icon}
          alt={item.title}
          loading="lazy"
          className="
            w-[42px]
            h-[42px]

            object-contain
          "
        />

        <p
          className="
            mt-4

            text-[14px]

            leading-[1.3]

            font-[400]
          "
        >
          {item.title}
        </p>
      </div>

      {/* DESKTOP = ORIGINAL BOX DESIGN */}

      <div
        className="
          hidden
          lg:flex

          border
          border-[#E5E5E5]

          h-[200px]
          w-full

          flex-col

          items-center
          justify-center

          text-center

          px-2
        "
      >
        <img
          src={item.icon}
          alt={item.title}
          loading="lazy"
          className="
            w-[50px]
            h-[50px]

            object-contain
          "
        />

        <p
          className="
            mt-6

            text-[20px]

            leading-[1.3]

            font-[400]
          "
        >
          {item.title}
        </p>
      </div>
    </li>
  );
}

function Industries({ section }) {
  const { title, cards = [] } = section.data;

  const [activeSlide, setActiveSlide] = useState(0);

  const sliderRef = useRef(null);

  // 6 items per slide
  const totalSlides = Math.ceil(cards.length / 6);

  // AUTO SLIDE
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || window.innerWidth >= 1024) return;

    const interval = setInterval(() => {
      const width = slider.offsetWidth;

      const nextSlide =
        activeSlide === totalSlides - 1
          ? 0
          : activeSlide + 1;

      slider.scrollTo({
        left: width * nextSlide,
        behavior: "smooth",
      });

      setActiveSlide(nextSlide);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeSlide, totalSlides]);

  // HANDLE MANUAL SCROLL
  const handleScroll = () => {
    if (!sliderRef.current) return;

    const scrollLeft = sliderRef.current.scrollLeft;

    const width = sliderRef.current.offsetWidth;

    const index = Math.round(scrollLeft / width);

    setActiveSlide(index);
  };

  return (
    <section
      className="
        w-full

        bg-[#171A1F]
        text-white

        px-5
        sm:px-8
        lg:px-10

        py-10
        lg:py-14
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div className="max-w-[1600px]">
        {/* HEADER */}

        <h2
          className="
            text-[30px]
            sm:text-[50px]
            lg:text-[60px]

            font-black

            leading-none
          "
        >
          {title}
        </h2>

        {/* MOBILE SLIDER */}

        <div className="block lg:hidden mt-10 overflow-hidden">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="
              flex

              overflow-x-auto
              overflow-y-hidden

              snap-x
              snap-mandatory

              scrollbar-hide

              scroll-smooth
            "
          >
            {Array.from({
              length: totalSlides,
            }).map((_, groupIndex) => {
              const group = cards.slice(
                groupIndex * 6,
                groupIndex * 6 + 6
              );

              return (
                <div
                  key={groupIndex}
                  className="
                    min-w-full

                    shrink-0

                    snap-center

                    grid
                    grid-cols-3

                    gap-x-8
                    gap-y-10

                    place-items-center
                  "
                >
                  {group.map((item, index) => (
                    <IndustryItem
                      key={index}
                      item={item}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* DOTS */}

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({
              length: totalSlides,
            }).map((_, index) => (
              <div
                key={index}
                className={`
                  h-[8px]
                  w-[8px]

                  rounded-full

                  transition-all
                  duration-300

                  ${
                    activeSlide === index
                      ? "bg-white scale-125"
                      : "bg-[#5A5A5A]"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP GRID */}

        <ul
          className="
            hidden
            lg:grid

            mt-12

            grid-cols-6

            gap-10
            lg:gap-x-16
            gap-y-4
          "
        >
          {cards.map((item, index) => (
            <IndustryItem
              key={index}
              item={item}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Industries;