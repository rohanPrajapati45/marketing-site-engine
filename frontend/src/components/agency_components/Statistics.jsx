import { useEffect, useRef, useState } from "react";

const statsData = [
  {
    title: "Projects",
    number: 400,
    lines: [
      "We have taken projects from ideas to digital experience.",
      "We have made few mistakes along the way,",
      "which made us even smarter and more experienced.",
      "Our process continuously evolves through execution.",
    ],
  },

  {
    title: "Years",
    number: 10,
    lines: [
      "With over 10 years of industry expertise,",
      "we continue to deliver exceptional",
      "Digital Transformation solutions.",
    ],
  },

  {
    title: "Talents",
    number: 50,
    lines: [
      "Tech Leads, Project Managers, Business Analysts,",
      "Full Stack Web Developers, UI/UX creative team",
      "continuously share knowledge inside our company.",
    ],
  },
];

function CountUp({ end, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;

    const duration = 2000;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, start]);

  return <span>{count}</span>;
}

function ReputationCard({ item }) {
  const cardRef = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          observer.unobserve(card);
        }
      },
      {
        threshold: 0.35,
      }
    );

    if (card) observer.observe(card);

    const handleScroll = () => {
      if (!card) return;

      const rect = card.getBoundingClientRect();

      const walls = card.querySelectorAll(".wall");

      const maxDelay = (walls.length - 1) * 0.12;

      const viewportHeight = window.innerHeight;

      const startPoint = viewportHeight - rect.height * 0.8;

      const endPoint = viewportHeight / 2 - rect.height * 0.7;

      let progress = (startPoint - rect.top) / (startPoint - endPoint);

      progress = Math.max(0, Math.min(progress, 1));

      progress *= 1 + maxDelay;

      walls.forEach((wall, index) => {
        const delay = index * 0.12;

        let lineProgress = progress - delay;

        lineProgress = Math.max(0, Math.min(lineProgress, 1));

        wall.style.transform = `scaleX(${1 - lineProgress})`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      observer.disconnect();

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="
        bg-[#11151B]
        text-[#F2ECE6]

        w-full
        max-w-[360px]
        sm:max-w-[420px]

        h-[420px]
        sm:h-[480px]

        px-6
        sm:px-8

        pt-7
        sm:pt-10

        pb-7
        sm:pb-10

        flex
        flex-col

        overflow-hidden
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      {/* TITLE */}

      <div
        className="
          text-[20px]
          sm:text-[30px]
          lg:text-[36px]

          font-[300]

          tracking-[-1px]
        "
      >
        {item.title}
      </div>

      {/* NUMBER */}

      <div
        className="
          mt-5
          sm:mt-7

          text-[64px]
          sm:text-[86px]
          lg:text-[95px]

          leading-none

          font-[200]

          tracking-[-4px]
        "
      >
        <CountUp end={item.number} start={visible} />+
      </div>

      {/* DESCRIPTION */}

      <div
        className="
          mt-auto

          overflow-y-auto
          overflow-x-hidden

          pr-2

          max-h-[140px]
          sm:max-h-[180px]

          scrollbar-thin
          scrollbar-thumb-[#555]
          scrollbar-track-transparent
        "
      >
        {item.lines.map((line, index) => (
          <div
            key={index}
            className="
              relative

              w-full

              overflow-hidden

              text-[15px]
              sm:text-[18px]
              lg:text-[20px]

              leading-[1.45]

              font-[300]

              tracking-[-0.5px]

              break-words
            "
          >
            {line}

            {/* WALL ANIMATION */}

            <div
              className="
                wall

                absolute
                inset-0

                bg-[#11151B]

                opacity-90

                origin-right

                pointer-events-none
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Statistics({ section }) {
  const { cards = statsData } = section?.data || {};

  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-[60px]">
      <div
        className="
          w-full

          px-4
          sm:px-6
          lg:px-10

          flex
          justify-center

          gap-5
          lg:gap-8

          flex-wrap
        "
      >
        {cards.map((item, index) => (
          <ReputationCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}

export default Statistics;