const services = [
  {
    title: "Design",
    desc: "Plan the future state of capabilities and chart a path to get there.",
  },

  {
    title: "Diagnose",
    desc: "Determine current capabilities and define the business need.",
  },

  {
    title: "Develop",
    desc: "Create a learning experience that works.",
  },

  {
    title: "Deliver",
    desc: "Obsessed with project management and exceeding client expectations.",
  },

  {
    title: "Drive",
    desc: "Ensure solutions continuously create impact.",
  },
];

function HowWeDo({ section }) {
  const { title, subtitle, cards = services } = section.data || {};

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

      <div className="max-w-[1450px]">
        <h2
          className="
            text-[32px]
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

            leading-[1.3]

            text-[#777]
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
          lg:grid-cols-5

          gap-5
        "
      >
        {cards.map((service, index) => (
          <div
            key={index}
            className="
              border
              border-[#D9D9D9]

              h-[260px]
              lg:h-[300px]

              px-6
              lg:px-7

              py-6

              flex
              flex-col

              bg-black
              text-white

              overflow-hidden

              transition-all
              duration-500
              ease-out

              hover:bg-white
              hover:text-black

              hover:scale-[1.03]
              hover:-translate-y-1

              cursor-pointer
            "
          >
            {/* TITLE */}

            <h3
              className="
                text-[22px]
                lg:text-[24px]

                font-[500]

                leading-tight
                tracking-[-0.5px]

                break-words
              "
            >
              {service.title}
            </h3>

            {/* DESCRIPTION */}

            <div
              className="
                mt-6

                flex-1

                overflow-y-auto
                overflow-x-hidden

                pr-1

                scrollbar-thin
                scrollbar-thumb-[#555]
                scrollbar-track-transparent
              "
            >
              <p
                className="
                  text-[15px]
                  lg:text-[16px]

                  leading-[1.6]

                  font-[400]

                  text-inherit

                  break-words
                "
              >
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowWeDo;