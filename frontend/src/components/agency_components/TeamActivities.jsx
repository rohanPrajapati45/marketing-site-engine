import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const teamActivities = [
  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/573834303.jfif",
  },

  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/956235381.jpeg",
  },

  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/1227089550.jpeg",
  },

  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/689650001.jfif",
  },

  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/1689159825.jpg",
  },

  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/215765465.jpg",
  },

  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/1624314847.jpg",
  },

  {
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-activities/1268855950.jpg",
  },
];

function TeamActivities() {
  const [startIndex, setStartIndex] = useState(0);

  // AUTO MOVE

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2500);

    return () => clearInterval(interval);
  }, [startIndex]);

  const nextSlide = () => {
    setStartIndex((prev) => (prev >= teamActivities.length - 4 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? teamActivities.length - 4 : prev - 1,
    );
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
        {/* SLIDER */}

        <div className="overflow-hidden w-full">
          <div
            className="
      flex

      transition-transform
      duration-700
      ease-in-out
    "
            style={{
              transform: `translateX(-${startIndex * 25}%)`,
            }}
          >
            {teamActivities.map((item, index) => (
              <div
                key={index}
                className="
          min-w-[25%]
          flex-shrink-0

          relative

          h-[160px]
          sm:h-[230px]
          lg:h-[360px]

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
            lg:bottom-6
            lg:right-6

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
