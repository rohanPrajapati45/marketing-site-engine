import { useEffect, useRef, useState } from "react";

function ExpertiseItem({ item, index }) {
  const ref = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`
        flex
        items-center
        justify-center

        transition-all
        duration-700
        ease-out

        lg:hover:-translate-y-4
        lg:hover:scale-[1.03]

        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        }
      `}
      style={{
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="
          w-full

          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full

            h-[120px]
            sm:h-[150px]
            lg:h-[190px]

            flex
            items-center
            justify-center

            overflow-hidden
          "
        >
          <img
            src={item.image}
            alt="Certification"
            loading="lazy"
            className="
              max-w-[120px]
  max-h-[70px]

  sm:max-w-[150px]
  sm:max-h-[90px]

  lg:max-w-[220px]
  lg:max-h-[140px]

  w-auto
  h-auto

              object-contain

              transition-transform
              duration-700
              ease-out

              lg:hover:scale-[1.06]
            "
          />
        </div>
      </a>
    </li>
  );
}

function Expertise({ section }) {
  const { title, subtitle, cards = [] } = section.data;

  const [activeSlide, setActiveSlide] = useState(0);

  const sliderRef = useRef(null);

  const totalSlides = Math.ceil(cards.length / 4);

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

        bg-[#F7F7F7]

        px-5
        sm:px-8
        lg:px-8

        py-10
        lg:py-14
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div className="max-w-[1700px]">
        {/* HEADER */}

        <h2
          className="
            text-[28px]
            sm:text-[52px]
            lg:text-[60px]

            font-black

            leading-none
            

            text-[#1E2329]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-6

            text-[15px]
            lg:text-[16px]

            font-[700]

            text-[#7A7A7A]
          "
        >
          {subtitle}
        </p>

        {/* MOBILE SLIDER */}

        <div className="block lg:hidden mt-12 overflow-hidden">
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
                groupIndex * 4,
                groupIndex * 4 + 4
              );

              return (
                <div
                  key={groupIndex}
                  className="
                    min-w-full

                    shrink-0

                    snap-center

                    grid
                    grid-cols-2

                    gap-x-8
                    gap-y-10

                    place-items-center
                  "
                >
                  {group.map((item, index) => (
                    <ExpertiseItem
                      key={index}
                      item={item}
                      index={index}
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
                      ? "bg-black scale-125"
                      : "bg-[#C9C9C9]"
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

            mt-14

            grid-cols-6

            gap-x-10
            gap-y-14

            items-center
          "
        >
          {cards.map((item, index) => (
            <ExpertiseItem
              key={index}
              item={item}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Expertise;