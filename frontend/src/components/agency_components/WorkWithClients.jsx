import { useEffect, useRef, useState } from "react";

function ClientItem({ client, index }) {
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

        h-[70px]
        sm:h-[80px]
        lg:h-[85px]

        transition-all
        duration-700
        ease-out

        lg:hover:-translate-y-3

        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }
      `}
      style={{
        transitionDelay: `${index * 55}ms`,
      }}
    >
      <div
        className="
          overflow-hidden

          w-full

          h-[38px]
          sm:h-[70px]
          lg:h-[85px]

          flex
          items-center
          justify-center
        "
      >
        <img
          src={client.image}
          alt={client.name}
          loading="lazy"
          className="
            w-auto

            max-w-[120px]
            sm:max-w-[150px]
            lg:max-w-[250px]

            h-full

            object-contain
            object-center

            mix-blend-multiply
          "
        />
      </div>
    </li>
  );
}

function WorkWithClients({ section }) {
  const { title, subtitle, cards = [] } = section.data;

  const [activeSlide, setActiveSlide] = useState(0);

  const sliderRef = useRef(null);

  const totalSlides = Math.ceil(cards.length / 4);

  const handleScroll = () => {
    if (!sliderRef.current) return;

    const scrollLeft = sliderRef.current.scrollLeft;

    const width = sliderRef.current.offsetWidth;

    const index = Math.round(scrollLeft / width);

    setActiveSlide(index);
  };

  useEffect(() => {
  if (!sliderRef.current || totalSlides <= 1) return;

  const slider = sliderRef.current;

  const interval = setInterval(() => {
    const nextSlide =
      activeSlide === totalSlides - 1
        ? 0
        : activeSlide + 1;

    slider.scrollTo({
      left: nextSlide * slider.offsetWidth,
      behavior: "smooth",
    });

    setActiveSlide(nextSlide);
  }, 2000);

  return () => clearInterval(interval);
}, [activeSlide, totalSlides]);

  return (
    <section
      className="
        w-full

        bg-[#fafafa]

        px-5
        sm:px-8
        lg:px-10

        py-8
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
            text-[32px]
    sm:text-[40px]
    lg:text-[55px]

    font-black

    leading-none
  

    text-[#1F2329]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-8

            text-[16px]

            font-[700]

            text-[#7A7A7A]
          "
        >
          {subtitle}
        </p>

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

                    gap-y-6
                    gap-x-6

                    place-items-center
                  "
                >
                  {group.map((client, index) => (
                    <ClientItem
                      key={index}
                      client={client}
                      index={index}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* DOTS */}

          <div className="flex justify-center gap-2 mt-5">
            {Array.from({
              length: totalSlides,
            }).map((_, index) => (
              <div
                key={index}
                className={`
                  h-[7px]
                  rounded-full

                  transition-all
                  duration-300

                  ${
                    activeSlide === index
                      ? "w-2 bg-black"
                      : "w-2 bg-[#C5C5C5]"
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

            grid-cols-10

            gap-x-4
          "
        >
          {cards.map((client, index) => (
            <ClientItem
              key={index}
              client={client}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WorkWithClients;