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

        min-h-[200px]

        px-8
        py-4

        flex
        flex-col

        bg-black
        text-white

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
            <h3
              className="
          text-[20px]

          font-[400]
            py-2
          leading-none
          tracking-[-0.5px]
        "
            >
              {service.title}
            </h3>

            <p
              className="
          mt-7

          text-[15px]

          leading-[1.45]
            
          font-[400]

          text-inherit
        "
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowWeDo;
