const services = [
  [
    "E-Commerce Solutions",
    "Loyalty Program Solutions",
    "Enterprise Solutions",
    "Website Development",
    "Mobile Application Development",
  ],

  [
    "Artificial Intelligence",
    "Machine learning",
    "Connected Hardware",
    "ChatBots",
    "Emerging Technologies",
  ],

  [
    "User Research & Testing",
    "UI/UX Design",
    "Information Architecture",
    "Experience Strategy",
    "Prototyping & Optimization",
  ],

  [
    "Talent Acquisition & Outsourcing",
    "Cross Industry Capabilities",
    "Multi-Tech Support",
    "Digital Transformation Services",
    "ASO /SEO / SEM",
  ],
];

function WhatWeDo({ section }) {
  const { title, subtitle, cards = [] } = section.data;
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
        lg:py-14
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      {/* HEADER */}
      <div className="max-w-[1450px]">
        <h2
          className="
            text-[30px]
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
            mt-6

            max-w-[1200px]

            text-[16px]
            sm:text-[18px]
            lg:text-[18px]

            leading-[1.3]

            text-[#777]
            font-[700]
        "
        >
          {subtitle}
        </p>
      </div>

      {/* CARDS */}
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
        {cards.map((group, index) => (
          <div
            key={index}
            className="
        bg-[#2a2b2f]

        min-h-[150px]
        lg:min-h-[200px]

        px-6
        lg:px-7

        py-6
        lg:py-7

        flex
        flex-col

        transition-all
        duration-500
        ease-out

        hover:bg-[#F3F3F3]
        hover:text-black
        hover:scale-[1.025]

        cursor-pointer
      "
          >
            {group.lines.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="
            text-[17px]
            sm:text-[18px]
            lg:text-[16px]

            font-[400]

            tracking-[-0.2px]

            leading-[1.15]

            mb-7
            last:mb-0
          "
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhatWeDo;
