import React from "react";

import RecentProjectCarousel from "./RecentProjectCarousel";

const RecentProjectsSection = () => {

  const sections = [
    {
      category: "FINTECH",

      projects: [
        {
          title: "NEO Digital Payment",
          image:
            "/fintech-imgs/fintech1.webp",
          link: "#",
        },

        {
          title: "CASH UNITED - Agent POS",
          image:
            "/fintech-imgs/fintech2.webp",
          link: "#",
        },

        {
          title: "EVO Wallet Lebanon",
          image:
            "/fintech-imgs/fintech3.webp",
          link: "#",
        },

        {
          title: "AFRICELL MOBILE MONEY",
          image:
            "/fintech-imgs/fintech4.webp",
          link: "#",
        },

        {
          title: "AFRICELL MOBILE MONEY",
          image:
            "/fintech-imgs/fintech5.webp",
          link: "#",
        },

        {
          title: "AFRICELL MOBILE MONEY",
          image:
            "/fintech-imgs/fintech6.webp",
          link: "#",
        },

        {
          title: "AFRICELL MOBILE MONEY",
          image:
            "/fintech-imgs/fintech7.webp",
          link: "#",
        },

        {
          title: "AFRICELL MOBILE MONEY",
          image:
            "/fintech-imgs/fintech8.webp",
          link: "#",
        },
      ],
    },

    {
      category: "APP DEVELOPMENT",

      projects: [
        {
          title: "DEBBAS",
          image:
            "/appdev-imgs/appdev1.webp",
          link: "#",
        },

        {
          title: "LIFE APP",
          image:
            "/appdev-imgs/appdev2.webp",
          link: "#",
        },

        {
          title: "PATCHI SALES APP",
          image:
            "/appdev-imgs/appdev3.webp",
          link: "#",
        },

        {
          title: "Business App",
          image:
            "/appdev-imgs/appdev4.webp",
          link: "#",
        },

        {
          title: "Business App",
          image:
            "/appdev-imgs/appdev5.webp",
          link: "#",
        },

        {
          title: "Business App",
          image:
            "/appdev-imgs/appdev6.webp",
          link: "#",
        },

        {
          title: "Business App",
          image:
            "/appdev-imgs/appdev7.webp",
          link: "#",
        },

        {
          title: "Business App",
          image:
            "/appdev-imgs/appdev8.webp",
          link: "#",
        },
      ],
    },
  ];

  return (
    <section className="mt-[1px]">

      {sections.map((section, index) => (
        <RecentProjectCarousel
          key={index}
          category={section.category}
          projects={section.projects}
          autoSlideDelay={
            3200 + (index * 900)
          }
        />
      ))}

    </section>
  );
};

export default RecentProjectsSection;