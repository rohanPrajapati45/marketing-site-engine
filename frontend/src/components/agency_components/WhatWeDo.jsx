import { useEffect, useRef, useState } from "react";

function WhatWeDo({ section }) {
  const { title, subtitle, cards = [] } = section.data;

  const cardRefs = useRef([]);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const observers = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveCard(index);
          }
        },
        {
          threshold: 0.6,
        }
      );

      observer.observe(card);

      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [cards]);

  return (
    <section
      className="
        w-full
        bg-black
        text-white

        px-4
        sm:px-8
        lg:px-12

        py-14
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      {/* HEADER */}

      <div className="max-w-[1400px]">
        <h2
          className="
            text-[34px]
            sm:text-[58px]
            lg:text-[60px]

            font-bold

            tracking-[-2px]
            leading-none
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-5

            max-w-[1100px]

            text-[15px]
            sm:text-[18px]

            leading-[1.35]

            text-[#7C7C7C]

            font-[700]
          "
        >
          {subtitle}
        </p>
      </div>

      {/* CARDS */}

      <div
        className="
          mt-10
          lg:mt-14

          grid

          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-4
          lg:gap-5
        "
      >
        {cards.map((group, index) => {
          const isActive = activeCard === index;

          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`
                

                overflow-hidden

                transition-all
                duration-700
                ease-out

                hover:scale-[1.02]

                ${
  isActive
    ? "bg-[#F1F1F1] text-black"
    : "bg-[#24252B] text-white"
}

lg:bg-[#24252B]
lg:text-white

lg:hover:bg-[#F1F1F1]
lg:hover:text-black
lg:hover:scale-[1.02]
              `}
            >
              <div
                className="
                  px-6
                  sm:px-7

                  py-7
                  sm:py-8

                  min-h-[320px]
                  sm:min-h-[360px]

                  flex
                  flex-col

                  overflow-hidden
                "
              >
                {/* SCROLLABLE CONTENT */}

                <div
                  className="
                    flex-1

                    overflow-y-auto
                    overflow-x-hidden

                    pr-2

                    scrollbar-thin
                    scrollbar-thumb-[#666]
                    scrollbar-track-transparent
                  "
                >
                  {group.lines.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="
                        text-[15px]
                        sm:text-[17px]
                        lg:text-[16px]

                        font-[500]

                        leading-[1.25]

                        tracking-[-0.2px]

                        mb-7
                        last:mb-0

                        break-words
                      "
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WhatWeDo;