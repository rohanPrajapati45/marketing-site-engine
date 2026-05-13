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

export default function StickySidebarSection() {
  const [activeIndex, setActiveIndex] = useState(0);

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
      }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex">
      {/* SIDEBAR */}
      <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 bg-[#0B0F19] px-10 xl:block">
        <div className="flex h-full flex-col justify-center">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`relative my-1 cursor-pointer text-[1rem] transition-all duration-500 ${
                activeIndex === index
                  ? "-translate-x-[1px] text-white"
                  : "text-white/35"
              }`}
            >
              {/* LINE */}
              <span
                className={`absolute left-[180px] top-1/2 h-[2px] -translate-y-1/2 bg-white transition-all duration-500 ${
                  activeIndex === index ? "w-[50px]" : "w-0"
                }`}
              />

              {service.navTitle}
            </div>
          ))}
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
        className={`scroll-mt-[140px] flex min-h-screen items-center px-0 py-[0px] transition-all duration-500 md:px-0 xl:px-0 ${
          activeIndex === index ? "text-[#111]" : "text-[#999]"
        }`}
      >
        <div
          className={`grid w-full gap-10 xl:grid-cols-2 ${
            isReverse ? "xl:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* TEXT SIDE */}
          <div className="max-w-[620px] mt-[60px]">
            <h1 className="mb-8 text-xl font-black leading-[0.95] tracking-tight md:text-3xl xl:text-4xl">
              {service.title}
            </h1>

            <p className="mb-10 max-w-[560px] text-[1rem] leading-[1.9] text-black/65 md:text-[1.05rem]">
              {service.description}
            </p>

            <ul className="grid list-none grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-10">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 text-[0.95rem] leading-relaxed text-black/75"
                >
                  <span className="absolute left-0">—</span>

                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* IMAGE SIDE */}
          <div className="relative">
            <div className="overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className={`h-[820px] w-full object-cover transition-all duration-700 ease-out ${
                  activeIndex === index
                    ? "scale-100 opacity-100"
                    : "scale-[0.98] opacity-75"
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