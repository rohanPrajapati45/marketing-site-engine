import { useEffect, useState } from "react";
import Btn_slide from "../Btn_slide";


function JoinOurTeam({ section }) {
  const {
    title,
    description,
    buttonText,
    buttonLink,
    cards = [],
  } = section.data;

  const [currentImage, setCurrentImage] = useState(0);

  // AUTO IMAGE CHANGE

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % cards.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="
        w-full

        bg-[#ECECEC]

        px-4
        sm:px-8
        lg:px-10

        py-12
        lg:py-20
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
      id="careers"
    >
      <div
        className="
          max-w-[1650px]

          mx-auto

          grid
          grid-cols-1
          lg:grid-cols-2

          gap-10
          lg:gap-16

          items-center
        "
      >
        {/* LEFT CONTENT */}

        <div className="order-2 lg:order-1">
          <h2
            className="
              text-[35px]
              sm:text-[58px]
              lg:text-[60px]

              font-black

              uppercase

            

              leading-none

              text-[#1E2228]
            "
          >
            {title}
          </h2>

          <div
            className="
              mt-8

              text-[#767676]

              text-[17px]
              lg:text-[15px]

              font-[700]

              leading-[1.9]

              max-w-[720px]
            "
          >
            <p>{description}</p>

            <p>
              Were always on the look-out people with a passion for digital,
              please send your CV!
            </p>
          </div>

          {/* BUTTON */}

          <a href={buttonLink}>
            <div className="py-10">
              <Btn_slide inside={buttonText} />
            </div>
          </a>
        </div>

        {/* RIGHT IMAGE SLIDER */}

        {/* RIGHT IMAGE SLIDER */}

        <div
          className="
    order-1 lg:order-2

    relative

    overflow-hidden

    aspect-[1.38]

    bg-[#D9D9D9]
  "
        >
          {/* SLIDER TRACK */}

          <div
            className="flex h-full transition-transform duration-[1800ms] ease-in-out"
            style={{
              width: `${cards.length * 100}%`,
              transform: `translateX(-${currentImage * (100 / cards.length)}%)`,
            }}
          >
            {cards.map((item, index) => (
              <div
                key={index}
                className="w-full h-full flex-shrink-0"
                style={{
                  width: `${100 / cards.length}%`,
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="
            w-full
            h-full

            object-cover

            grayscale

            hover:grayscale-0

            transition-all
            duration-700
          "
                />
              </div>
            ))}
          </div>

          {/* BOTTOM DARK FADE */}

          <div
            className="
      absolute
      inset-0

      bg-gradient-to-t
      from-black/80
      via-black/10
      to-transparent

      pointer-events-none
    "
          />
        </div>
      </div>
    </section>
  );
}

export default JoinOurTeam;
