import React, { useEffect, useRef, useState } from "react";

const services = [
  {
    title: "SOFTWARE DEVELOPMENT",
    navTitle: "Software Development",

    image: "/whatwedo/whatwedo1.webp",

    description:
      "45+ developers and engineers combine agile product development with the latest frameworks to build scalable Digital Solutions:",

    items: [
      "Website development",
      "Mobile App development",
      "Custom Development",
      "Systems integration",
      "API development",
      "Data & Content Migrations",
      "Backend & CMS Development",
      "E-Commerce & Loyalty",
      "CRM, Sales Force",
      "Microsoft Dynamics",
    ],
  },

  {
    title: "MACHINE LEARNING & AI",
    navTitle: "Machine Learning & AI",

    image: "/whatwedo/whatwedo2.webp",

    description:
      "We assist businesses in adopting AI, speeding up their digital transformation, enhancing decision-making, and improving customer experiences:",

    items: [
      "Model Training",
      "Data Engineering Services",
      "NLP Solutions",
      "Computer Vision Solutions",
      "Recommendations Systems",
      "Enterprise AI Capability",
      "AI Integration",
      "Data Analytics",
      "AI Chatbots",
    ],
  },

  {
    title: "OUTSOURCING SERVICES",
    navTitle: "Outsourcing Services",
    image: "/whatwedo/whatwedo3.webp",
    description:
      "TEDMOB outsourcing services streamline your business operations, providing cost-effective solutions and freeing up your resources to focus on core objectives:",

    items: [
      "Managed Services",
      "Strategic Talent Acquisition",
      "Diverse Skill Sets",
      "Screening & Evaluation",
      "Flexible Placement Models",
      "Innovation and R&D",
      "Project Management",
      "Strategic Planning",
      "QA & Support",
    ],
  },

  {
    title: "EXPERIENCE DESIGN",
    navTitle: "Experience Design",
    image: "/whatwedo/whatwedo4.jpg",
    description:
      "We ensure a user-friendly Interface because we understand that only a perfect Digital Solution Design can Lead to a perfect Development:",

    items: [
      "User Experience (UX)",
      "User Interface (UI)",
      "Digital Design",
      "Web Design",
      "E-commerce Design",
      "Brand Creation",
      "Digital Product Design",
      "Information Architecture",
      "Prototyping",
      "APP Design",
    ],
  },

  {
    title: "SEO & MARKETING",
    navTitle: "SEO & Marketing",
    image: "/whatwedo/whatwedo5.webp",
    description:
      "We dive into the data to understand how they interact with your products and identify opportunities to improve your SEO, Engagement & Drive Retention:",

    items: [
      "SEO / SEM Services",
      "Media Planning & Buying",
      "Product Launch Campaigns",
      "Performance Optimization",
      "Content Creation & Planning",
      "Growth Hacking",
      "App Store Optimization",
      "Targeted User Acquisition",
      "ROI Monitoring & Reporting",
    ],
  },
];

export default function StickySidebarSection({ section }) {
  const { services = [] } = section.data;
  const [activeIndex, setActiveIndex] = useState(0);

  const [sidebarOffset, setSidebarOffset] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrollProgress = scrollTop / docHeight; // 0 → 1

      if (scrollProgress >= 0.7) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionRefs = useRef([]);

  useEffect(() => {
    const sections = sectionRefs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target);

            setActiveIndex(index);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const sidebarTranslate = activeIndex * -28;

  return (
    <section className="flex">
      {/* SIDEBAR */}
      <aside
        className="
            sticky
            top-0
            hidden
            h-screen
            w-[350px]
            shrink-0
            overflow-hidden
            xl:block
        "
        style={{
          background: "linear-gradient(to bottom, #2D2E32, #0D0F13)",
        }}
      >
        {/* INNER CONTENT */}
        <div
          className="flex h-full  px-10 py-22"
          style={{
            transform: `translateY(${activeIndex * 80}px)`,
            transition: "transform 800ms cubic-bezier(0.5,1,0.1,1)",
          }}
        >
          <div className="w-full">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`
                    group
                    relative
                    flex
                    items-center
                    py-2
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${
                      activeIndex === index
                        ? "translate-x-[1px]"
                        : "translate-x-0"
                    }
                `}
              >
                {/* SMALL DEFAULT LINE */}
                <span
                  className="
                    absolute
                    left-[230px]
                    top-1/2
                    h-[1px]
                    -translate-y-1/2
                    bg-white/25
                    "
                  style={{
                    width: activeIndex === index ? "56px" : "22px",
                    transition:
                      "width 500ms cubic-bezier(0.22,1,0.36,1), background-color 500ms cubic-bezier(0.22,1,0.36,1)",
                    backgroundColor:
                      activeIndex === index
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.25)",
                  }}
                />

                {/* TEXT */}
                <span
                  className={`
                    w-full
                    pr-[50px]
                    text-right
                    text-[15px]
                    tracking-[0.02em]
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    uppercase
                    ${
                      activeIndex === index
                        ? "font-medium text-[#f4f4f4]"
                        : "font-medium text-white/35"
                    }
                    `}
                >
                  {service.navTitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 bg-[#f4f4f4]">
        {services.map((service, index) => {
          const isReverse = index % 2 !== 0;

          return (
            <section
              key={service.title}
              ref={(el) => (sectionRefs.current[index] = el)}
              className={`flex transition-all duration-500 ${
                activeIndex === index ? "text-[#111]" : "text-[#999]"
              }`}
            >
              <div
                className={`grid h-[630px] w-full items-start overflow-hidden xl:grid-cols-2 ${
                  isReverse ? "xl:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* TEXT SIDE */}
                <div className="flex h-full py-10">
                  <div className="w-full px-5 xl:px-8">
                    <h1 className="mb-3 text-[40px] font-bold">
                      {service.title}
                    </h1>

                    <p className="mb-12 text-[18px] leading-[1.8] ">
                      {service.description}
                    </p>

                    <ul className=" font-[600] ">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start text-[16px] leading-[1.7]"
                        >
                          <span className="mt-[0px] shrink-0">—</span>

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* IMAGE SIDE */}
                <div className="relative h-full">
                  <div className="h-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className={`block h-full w-full object-cover transition-all duration-700 ease-out ${
                        activeIndex === index
                          ? "scale-100 opacity-100"
                          : "scale-100 opacity-75"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
