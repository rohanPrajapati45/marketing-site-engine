import React from "react";

const blogCards = [
  {
    id: 1,
    title: "TEDMOB Ranked Number 1 Web and App Development Company in Lebanon",
    date: "09, Apr 2026",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/950877162.png",
    link: "https://tedmob.com/blog/tedmob-ranked-number-1-web-and-app-development-company-in-lebanon",
  },
  {
    id: 2,
    title: "How Much Does App Development Cost in Saudi Arabia?",
    date: "24, Mar 2026",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/311886124.png",
    link: "https://tedmob.com/blog/how-much-does-app-development-cost-in-saudi-arabia-2026-guide",
  },
  {
    id: 3,
    title: "TEDMOB & Haigazian University Sign Strategic MoU to Advance AI",
    date: "26, Feb 2026",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/1241731308.jpeg",
    link: "https://tedmob.com/blog/advance-ai-technology-digital-innovation-in-lebanons-future-students",
  },
  {
    id: 4,
    title: "Why TEDMOB Is the Best Web Development Company",
    date: "20, Nov 2025",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/933657157.jpg",
    link: "https://tedmob.com/blog/tedmob-is-the-best-web-development-company",
  },
  {
    id: 5,
    title: "TEDMOB AI: Proud to Sponsor and Participate",
    date: "14, Nov 2025",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/1584488404.png",
    link: "https://tedmob.com/blog/tedmob-ai-company-in-lebanon",
  },
  {
    id: 6,
    title: "Website Development , Website Design, E-Commerce",
    date: "11, Nov 2025",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/294224740.png",
    link: "https://tedmob.com/blog/website-development-website-design-e-commerce-tedmob",
  },
];

function BlogCards() {
  return (
    <section className="w-full px-5 md:px-8 lg:px-10 py-10 bg-[#fafafa]">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {blogCards.map((card) => (
          <a
            key={card.id}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {/* Image */}
            <div className="overflow-hidden bg-gray-200">
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="w-full h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Text */}
            <div className="pt-3">
              <h2 className="text-[1.45rem] leading-[1.2] font-[350] text-[#2d2d2d]">
                {card.title}
                <span className="text-gray-500 font-[300]"> | {card.date}</span>
              </h2>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default BlogCards;
