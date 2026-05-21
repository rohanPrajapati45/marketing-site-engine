import React, {
  useEffect,
  useRef,
  useState,
} from "react";

const RecentProjectCarousel = ({
  category,
  projects,
  autoSlideDelay,
}) => {

  const carouselRef = useRef(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [cardsPerView, setCardsPerView] =
    useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setCardsPerView(1);
      } else if (width < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();

    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  useEffect(() => {

    const carousel =
      carouselRef.current;

    if (!carousel) return;

    const cards =
      carousel.querySelectorAll(
        ".recent-project-card"
      );

    if (!cards.length) return;

    const gap = 18;

    const singleCardWidth =
      cards[0].offsetWidth + gap;

    const maxIndex =
      Math.max(0, projects.length - cardsPerView);

    const interval = setInterval(() => {

      if (currentIndex >= maxIndex) {

        carousel.scrollTo({
          left: 0,
          behavior: "smooth",
        });

        setCurrentIndex(0);
      }

      else {

        const nextIndex =
          currentIndex + 1;

        carousel.scrollTo({
          left:
            nextIndex *
            singleCardWidth,
          behavior: "smooth",
        });

        setCurrentIndex(nextIndex);
      }

    }, autoSlideDelay);

    return () =>
      clearInterval(interval);

  }, [
    currentIndex,
    projects.length,
    cardsPerView,
  ]);

  return (
    <div className="mb-[78px]">

      {/* CATEGORY */}
      <div className="max-w-[1600px] mx-auto px-[1px]">

        <div
          className="
            inline-flex
            items-center

            bg-black
            w-fit
            px-[9px]    
            py-[11px]
          "
        >
          <h2
            className="
              text-white
              text-[1.95rem]
              font-[500]
              uppercase
              leading-none
              tracking-[-0.05em]
            "
          >
            {category}
          </h2>

        </div>

      </div>

      {/* CAROUSEL */}
      <div className="relative overflow-hidden mt-[5px]">

        <div
          ref={carouselRef}
          className="
            flex
            gap-[18px]

            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory

            px-[2px]

            no-scrollbar
          "
        >

          {projects.map(
            (project, index) => (

              <a
                key={index}
                href={project.link}
                className="
                  recent-project-card

                  shrink-0

                  w-full
                  sm:w-[calc((100%-18px)/2)]
                  lg:w-[calc((100%-36px)/3)]

                  snap-start
                  group
                "
              >

                {/* IMAGE */}
                <div
                  className="
                    relative
                    overflow-hidden

                    bg-[#f4f4f4]
                  "
                >

                  <img
                    src={project.image}
                    alt={project.title}
                    className="
                      w-full
                      h-[220px]
                      sm:h-[260px]

                      object-cover

                      transition-transform
                      duration-[1600ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]

                      group-hover:scale-[1.04]
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0

                      bg-black/0

                      transition-all
                      duration-[900ms]

                      group-hover:bg-black/[0.03]
                    "
                  />

                </div>

                {/* TITLE */}
                <div className="pt-[10px]">

                  <h3
                    className="
                      text-[1.02rem]
                      font-[400]
                      text-[#3a3a3a]

                      tracking-[-0.02em]

                      transition-all
                      duration-[700ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]

                      group-hover:translate-x-[5px]
                    "
                  >
                    {project.title}
                  </h3>

                </div>

              </a>
            )
          )}

        </div>

      </div>

      {/* DOTS */}
      <div
        className="
          flex
          justify-center
          items-center

          gap-[10px]

          mt-[22px]
        "
      >

        {Array.from({
          length:
            Math.max(0, projects.length - (cardsPerView - 1)),
        }).map((_, index) => (

          <button
            key={index}
            onClick={() => {

              const carousel =
                carouselRef.current;

              if (!carousel) return;

              const cards =
                carousel.querySelectorAll(
                  ".recent-project-card"
                );

              if (!cards.length) return;

              const gap = 18;

              const singleCardWidth =
                cards[0].offsetWidth + gap;

              carousel.scrollTo({
                left:
                  index *
                  singleCardWidth,
                behavior: "smooth",
              });

              setCurrentIndex(index);
            }}
            className={`
              rounded-full
              cursor-pointer

              transition-all
              duration-[700ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]

              ${
                currentIndex === index
                  ? "bg-black w-[11px] h-[11px]"
                  : "bg-[#d6d6d6] w-[9px] h-[9px]"
              }
            `}
          />

        ))}

      </div>

    </div>
  );
};

export default RecentProjectCarousel;