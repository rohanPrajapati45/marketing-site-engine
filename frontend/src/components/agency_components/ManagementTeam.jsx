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

const lastCard = {
  title: "+45 more",
  subtitle: "Employees",
};

function ManagementTeam({ section }) {
  const {
    title,
    subtitle,
    lastCardTitle,
    lastCardSubtitle,

    cards: [{ name, role, image }],
  } = section.data;

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
    lg:grid-cols-4

    gap-x-8
    gap-y-14
  "
      >
        {cards.map((member, index) => (
          <div
            key={index}
            className="
        group
        cursor-pointer
      "
          >
            {/* IMAGE */}

            <div
              className="
          overflow-hidden

          bg-[#D9D9D9]

          aspect-[0.88]

          mb-5
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
            object-center

            grayscale

            group-hover:grayscale-0

            transition-all
            duration-700
            ease-out

            group-hover:scale-[1.03]
          "
              />
            </div>

            {/* TEXT */}

            <h3
              className="
          text-[28px]

          font-[700]

          tracking-[-1px]

          leading-none
        "
            >
              {member.name}
            </h3>

            <p
              className="
          mt-3

          text-[16px]

          text-[#A3A3A3]

          font-[700]

          leading-[1.25]
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
      border-white

      aspect-[0.88]

      flex
      items-center
      justify-center

      text-center

      cursor-pointer

      transition-all
      duration-500
      ease-out

      hover:bg-white
      hover:text-black
    "
        >
          <div>
            <p
              className="
          text-[32px]
          font-[700]
          leading-none
        "
            >
              {lastCardTitle}
            </p>

            <p
              className="
          mt-2

          text-[32px]
          font-[700]
          leading-none
        "
            >
              {lastCardSubtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ManagementTeam;
