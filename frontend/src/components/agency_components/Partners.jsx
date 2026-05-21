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
        list-none

        transition-all
        duration-700
        ease-out

        lg:hover:-translate-y-3
        lg:hover:scale-[1.02]

        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }
      `}
      style={{
        transitionDelay: `${index * 60}ms`,
      }}
    >
      <a
        href={client.link}
        target="_blank"
        rel="noopener noreferrer"
        className="
          bg-[#DCDCDC]

          w-full

          h-[160px]
          sm:h-[180px]
          lg:h-[220px]

          flex
          items-center
          justify-center

          overflow-hidden

          group
        "
      >
        <img
          src={client.image}
          alt="partner"
          loading="lazy"
          className="
            max-w-[140px]
            max-h-[90px]

            sm:max-w-[170px]
            sm:max-h-[110px]

            lg:max-w-[220px]
            lg:max-h-[130px]

            w-auto
            h-auto

            object-contain

            grayscale
            lg:group-hover:grayscale-0

            transition-all
            duration-700
            ease-out

            lg:group-hover:scale-[1.05]
          "
        />
      </a>
    </li>
  );
}

function Partners({ section }) {
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
            text-[28px]
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

              list-none
              p-0
              m-0
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

                    gap-4

                    items-stretch
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

            grid-cols-4

            gap-5

            list-none
            p-0
            m-0
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

export default Partners;