const industries = [
  {
    title: "Finance",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/678630862.svg",
  },

  {
    title: "Telecom",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/806329025.svg",
  },

  {
    title: "Healthcare",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/1203929516.svg",
  },

  {
    title: "Travel",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/617260528.svg",
  },

  {
    title: "logistics",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/1003329320.svg",
  },

  {
    title: "B2B & Entreprise",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/1645568391.svg",
  },

  {
    title: "e-commerce",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/287114565.svg",
  },

  {
    title: "Government",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/1839914653.svg",
  },

  {
    title: "Food & Beverage",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/532566286.svg",
  },

  {
    title: "Entertainment",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/1612749263.svg",
  },

  {
    title: "Education",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/1449781340.svg",
  },

  {
    title: "Real Estate",
    icon: "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/agency-industries/683516326.svg",
  },
];

function Industries({ section }) {
  const { title, cards = [] } = section.data;

  return (
    <section
      className="
        w-full

        bg-[#171A1F]
        text-white

        px-5
        sm:px-8
        lg:px-10

        py-10
        lg:py-14
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      {/* HEADER */}

      <div className="max-w-[1600px]">
        <h2
          className="
            text-[42px]
            sm:text-[58px]
            lg:text-[60px]

            font-black

            leading-none
            tracking-[-3px]
          "
        >
          {title}
        </h2>

        {/* GRID */}

        <ul
          className="
            mt-10
            lg:mt-12

            grid

            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6

            gap-10
            lg:gap-x-16
            gap-y-4
          "
        >
          {cards.map((item, index) => (
            <li key={index}>
              <div
                className="
                  border
                  border-[#E5E5E5]

                  h-[170px]
                  sm:h-[210px]
                  lg:h-[200px]

                  flex
                  flex-col

                  items-center
                  justify-center

                  text-center

                  px-2
                "
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  loading="lazy"
                  className="
                    w-[42px]
                    h-[42px]
                    lg:w-[50px]
                    lg:h-[50px]

                    object-contain
                  "
                />

                <p
                  className="
                    mt-6

                    text-[18px]
                    lg:text-[20px]

                    leading-[1.3]

                    font-[400]
                  "
                >
                  {item.title}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Industries;
