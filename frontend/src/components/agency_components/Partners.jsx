import { useEffect, useRef, useState } from "react";

const partners = [
  {
    link: "https://evulpa.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/1621825262.png",
  },

  {
    link: "https://gte.tedmob.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/2074614409.png",
  },

  {
    link: "https://nymcard.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/770870888.png",
  },

  {
    link: "https://aga-adk.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/907204380.png",
  },

  {
    link: "https://www.thearlab.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/694568439.png",
  },

  {
    link: "https://4dsme.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/1570685982.webp",
  },

  {
    link: "http://thechannel-me.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/1726764729.jpg",
  },

  {
    link: "http://numbase.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/43603629.jpg",
  },

  {
    link: "https://www.rizkgroup.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/149820745.jpg",
  },

  {
    link: "http://aub.edu.lb",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/2085297417.jpg",
  },

  {
    link: "http://grey.com/en",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/1037864398.jpg",
  },

  {
    link: "http://mcsaatchi.me",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/partners/736168035.jpg",
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
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}

      transition-all
      duration-700
      ease-out
    `}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      <a
        href={client.link}
        target="_blank"
        rel="noopener noreferrer"
        className="
    bg-[#DCDCDC]

    h-[170px]
    sm:h-[190px]
    lg:h-[190px]

    flex
    items-center
    justify-center

    overflow-hidden

    group
  "
      >
        <img
          src={client.image}
          alt="partner"
          loading="lazy"
          className="


      object-contain

      grayscale
      group-hover:grayscale-0

      transition-all
      duration-500
      ease-out
    "
        />
      </a>
    </li>
  );
}

function Partners() {
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
          OUR PARTNERS
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
          We don’t limit our work to any single industry.We also serve different
          local & regional partners.
        </p>

        {/* CLIENTS */}

        <ul
          className="
            mt-10
            lg:mt-14

            grid

            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4

            gap-5
            "
        >
          {partners.map((client, index) => (
            <ClientItem key={index} client={client} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Partners;
