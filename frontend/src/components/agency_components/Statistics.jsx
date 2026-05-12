import { useEffect, useRef, useState } from "react";

const statsData = [
  {
    title: "Projects",
    number: 400,
    lines: [
      "We have taken projects from",
      "ideas to digital experience. We",
      "have made few mistakes along",
      "the way, which made us even",
      "smarter",
    ],
  },
  {
    title: "Years",
    number: 10,
    lines: [
      "With over 10 years of industry",
      "expertise, we continue to deliver",
      "exceptional Digital",
      "Transformation solutions",
    ],
  },
  {
    title: "Talents",
    number: 50,
    lines: [
      "Tech Leads, Project Managers,",
      "Business Analysts, Full Stack",
      "Web Developers, UI/UX creative",
      "team continuously share",
      "knowledge inside our company",
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
        threshold: 0.4,
      },
    );

    observer.observe(card);

    const handleScroll = () => {
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const walls = card.querySelectorAll(".wall");

      const maxDelay = (walls.length - 1) * 0.12;

      const start = window.innerHeight * 1;
      const end = window.innerHeight / 2 - rect.height / 2;

      let progress = (start - rect.top) / (start - end);

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
      max-w-[440px]

      min-h-[320px]
      sm:min-h-[480px]
      lg:min-h-[480px]

      px-6
      sm:px-8
      lg:px-[42px]

      pt-8
      sm:pt-10
      lg:pt-[42px]

      pb-8
      sm:pb-10
      lg:pb-[40px]

      flex
      flex-col
    "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div
        className="
        text-[28px]
        sm:text-[32px]
        lg:text-[36px]

        font-[300]
        tracking-[-1px]
      "
      >
        {item.title}
      </div>

      <div
        className="
        mt-5
        sm:mt-7

        text-[72px]
        sm:text-[86px]
        lg:text-[95px]

        leading-none
        font-[200]
        tracking-[-4px]
      "
      >
        <CountUp end={item.number} start={visible} />+
      </div>

      <div className="mt-auto flex flex-col">
        {item.lines.map((line, index) => (
          <div
            key={index}
            className="
            relative
            w-fit
            overflow-hidden

            text-[10px]
            sm:text-[15px]
            lg:text-[20px]

            leading-[1.08]

            font-[300]
            tracking-[-0.5px]
          "
          >
            {line}

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

function Statistics() {
  return (
    <section className="w-full bg-[#ECECEC] py-10 sm:py-14 lg:py-[60px]">
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
        {statsData.map((item, index) => (
          <ReputationCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}

export default Statistics;
