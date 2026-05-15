import { useEffect, useRef, useState } from "react";

const clients = [
  {
    name: "Toyota",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/2126786316.png",
  },
  {
    name: "Alfardan Group",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1234784539.png",
  },
  {
    name: "Zain",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/487585540.png",
  },
  {
    name: "USAID",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/450538554.png",
  },
  {
    name: "Sanita",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/932838626.png",
  },
  {
    name: "Chronora",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/990380556.png",
  },
  {
    name: "Spinneys",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/3468944.png",
  },
  {
    name: "MBC",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1310936977.png",
  },
  {
    name: "Unicef",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/298841887.png",
  },
  {
    name: "McDonald's",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/749293166.png",
  },
  {
    name: "Africell",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1630290294.png",
  },
  {
    name: "Sanofi",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/453573080.png",
  },
  {
    name: "Ooredoo",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1450529123.png",
  },
  {
    name: "NYMCARD",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1797975091.png",
  },
  {
    name: "OMT",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1057543036.png",
  },
  {
    name: "IDM",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1077994846.png",
  },
  {
    name: "Jallad",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/672616672.png",
  },
  {
    name: "Life",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1796840537.png",
  },
  {
    name: "Rifai",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/790444017.png",
  },
  {
    name: "Saudi Signs",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/246103352.png",
  },
  {
    name: "Vodafone",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/645513243.png",
  },
  {
    name: "Globemed",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/2081961552.png",
  },
  {
    name: "Dar",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/755932002.png",
  },
  {
    name: "Alfa",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/491618948.png",
  },
  {
    name: "IPT",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1760914763.png",
  },
  {
    name: "Sodetel",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1058769945.png",
  },
  {
    name: "IRC",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/790569376.png",
  },
  {
    name: "Allianz",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/876611546.png",
  },
  {
    name: "Banque",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1492006509.png",
  },
  {
    name: "Bank Audi",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/work-with/1513853162.png",
  },
];

function ClientItem({ client, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`
        flex
        items-center
        justify-center

        h-[70px]
        sm:h-[80px]
        lg:h-[85px]

        transition-all
        duration-700
        ease

        hover:-translate-y-3

        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
      style={{
        transitionDelay: `${index * 55}ms`,
      }}
    >
      <div
        className="
    overflow-hidden

    w-full

    h-[38px]
    sm:h-[80px]
    lg:h-[85px]

    flex
    items-center
    justify-center
  "
      >
        <img
          src={client.image}
          alt={client.name}
          loading="lazy"
          className="
      w-auto

      max-w-[150px]
      sm:max-w-[180px]
      lg:max-w-[250px]

      h-full

      object-cover
      object-center

      mix-blend-multiply
    "
        />
      </div>
    </li>
  );
}

function WorkWithClients({ section }) {
  const { title, subtitle, cards = [] } = section.data;
  return (
    <section
      className="
        w-full

        bg-[#fafafa]

        px-5
        sm:px-8
        lg:px-10

        py-8
        lg:py-14
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div className="max-w-[1600px]">
        {/* HEADER */}

        <h2
          className="
            text-[52px]
            sm:text-[40px]
            lg:text-[55px]

            font-black

            leading-none
            tracking-[-3px]

            text-[#1F2329]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-8

            text-[16px]
            sm:text-[16px]
            lg:text-[16px]

            font-[700]

            text-[#7A7A7A]
          "
        >
          {subtitle}
        </p>

        {/* CLIENTS */}

        <ul
          className="
            mt-10
            lg:mt-12

            grid

            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-10

            gap-y-2
            sm:gap-y-2
            lg:gap-y-0

            gap-x-5
            lg:gap-x-4
          "
        >
          {cards.map((client, index) => (
            <ClientItem key={index} client={client} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WorkWithClients;
