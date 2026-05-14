import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const blogCards = [
  {
    id: 1,
    title: "TEDMOB Ranked Number 1 Web and App Development Company in Lebanon",
    date: "09, Apr 2026",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/950877162.png",
    link: "/blog-details/1",
  },
  {
    id: 2,
    title: "How Much Does App Development Cost in Saudi Arabia?",
    date: "24, Mar 2026",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/311886124.png",
    link: "/blog-details/2",
  },
  {
    id: 3,
    title: "TEDMOB & Haigazian University Sign Strategic MoU to Advance AI",
    date: "26, Feb 2026",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/1241731308.jpeg",
    link: "/blog-details/3",
  },
  {
    id: 4,
    title: "Why TEDMOB Is the Best Web Development Company",
    date: "20, Nov 2025",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/933657157.jpg",
    link: "/blog-details/4",
  },
  {
    id: 5,
    title: "TEDMOB AI: Proud to Sponsor and Participate",
    date: "14, Nov 2025",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/1584488404.png",
    link: "/blog-details/5",
  },
  {
    id: 6,
    title: "Website Development , Website Design, E-Commerce",
    date: "11, Nov 2025",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/294224740.png",
    link: "/blog-details/6",
  },
];

function BlogCards() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-20");
          }
        });
      },
      { threshold: 0.15 },
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full px-5 md:px-8 lg:px-10 py-10 bg-[#fafafa]">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {blogCards.map((card, index) => (
          <Link
            to={card.link}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group block opacity-0 translate-y-20 transition-all duration-700 ease-out"
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
              <h2 className="text-[1.25rem] leading-[1.2] font-[350] text-[#2d2d2d]">
                {card.title}
                <span className="text-gray-500 font-[300]"> | {card.date}</span>
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BlogCards;
