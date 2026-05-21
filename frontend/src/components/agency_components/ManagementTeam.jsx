import { useEffect, useRef, useState } from "react";

const teamMembers = [
  {
    name: "Lara Jannoun",
    role: "Director of Strategic & Technology Projects",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/1411598431.jpg",
  },

  {
    name: "Wassim Seifeddine",
    role: "CTO & AI Tech Lead",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/141507803.jpg",
  },

  {
    name: "Jozy Yaacoub",
    role: "Financial Director",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/1492849806.jpg",
  },

  {
    name: "Marianne Chamoun",
    role: "Assistant CEO",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/443205995.jpg",
  },

  {
    name: "Ali Kassem",
    role: "Project Manager",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/355673301.jpg",
  },

  {
    name: "Raffi Kestanian",
    role: "iOS Tech Lead",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/1968895145.jpg",
  },

  {
    name: "Saleh Aweek",
    role: "Android Tech Lead",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/966601775.jpg",
  },

  {
    name: "Ibrahim Tarhini",
    role: "Tech Lead | Web development department",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/1482321894.jpg",
  },

  {
    name: "Hussein Harake",
    role: "Tech Lead | Web development department",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/267147450.jpg",
  },

  {
    name: "Mohamad Al Zohbie",
    role: "Tech Lead | Web development department",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/team-members/412427731.jpg",
  },
];

function ManagementTeam() {
  const cardRefs = useRef([]);
  const [visibleCards, setVisibleCards] = useState(() => new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);

            setVisibleCards((prev) => {
              const next = new Set(prev);
              next.add(index);
              return next;
            });

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
        lg:py-20
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
            lg:text-[72px]

            font-bold
            tracking-[-2px]
            leading-none
          "
        >
          Management Team
        </h2>

        <p
          className="
            mt-5

            max-w-[1000px]

            text-[15px]
            sm:text-[18px]

            text-[#8A8A8A]

            font-[600]
            leading-[1.4]
          "
        >
          Meet the people leading innovation, strategy and technology behind
          the company.
        </p>
      </div>

      {/* CARDS */}

      <div
        className="
          mt-12
          lg:mt-16

          grid

          grid-cols-2
          lg:grid-cols-4

          gap-x-4
          sm:gap-x-8

          gap-y-8
          sm:gap-y-14
        "
      >
        {teamMembers.map((member, index) => (
          <div
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            data-index={index}
            className="
              group
              cursor-pointer

              flex
              flex-col

              overflow-hidden

              transition-all
              duration-500
              ease-out
            "
            style={{
              opacity: visibleCards.has(index) ? 1 : 0,
              transform: visibleCards.has(index)
                ? "translateY(0)"
                : "translateY(80px)",

              transition:
                "opacity 0.8s ease-out, transform 0.8s ease-out",

              transitionDelay: `${index * 100}ms`,

              willChange: "opacity, transform",
            }}
          >
            {/* IMAGE */}

            <div
              className="
                overflow-hidden

                bg-[#D9D9D9]

                aspect-[0.8]

                mb-4
              "
            >
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="
                  w-full
                  h-full

                  object-cover
                  object-top

                  grayscale

                  transition-all
                  duration-700
                  ease-out

                  group-hover:grayscale-0
                  group-hover:scale-[1.04]
                "
              />
            </div>

            {/* NAME */}

            <h3
              className="
                text-[16px]
                sm:text-[26px]

                font-[700]

                tracking-[-0.5px]
                leading-tight
              "
            >
              {member.name}
            </h3>

            {/* ROLE */}

            <p
              className="
                mt-2

                text-[13px]
                sm:text-[16px]

                text-[#A3A3A3]

                font-[600]

                leading-[1.3]
              "
            >
              {member.role}
            </p>
          </div>
        ))}

        {/* LAST CARD */}

        <div
          className="
            border
            border-[#2A2A2A]

            min-h-[220px]
            sm:min-h-[300px]

            flex
            items-center
            justify-center

            text-center

            transition-all
            duration-500
            ease-out

            hover:bg-white
            hover:text-black

            cursor-pointer
          "
        >
          <div>
            <p
              className="
                text-[28px]
                sm:text-[40px]

                font-[700]
                leading-none
              "
            >
              +45
            </p>

            <p
              className="
                mt-2

                text-[24px]
                sm:text-[38px]

                font-[700]
                leading-none
              "
            >
              Employees
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ManagementTeam;