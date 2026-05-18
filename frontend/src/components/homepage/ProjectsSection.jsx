import { useEffect, useState } from "react";
import { getImageTheme } from "../../hooks/useMediaTheme";
import "../../styles/ProjectsSection.css";

const projectsData = [
  {
    id: 1,
    titleBold: "Fintech Solutions",
    titleLines: ["E-Wallet & Omnichannel", "Digital Banking"],
    clientLogo: "/images/logos/logo1.png",
    clientLogoAlt: "OMT Pay",
    clientName: "OMT",
    clientCountry: "",
    mockupImage: "/images/page1.webp",
    mockupAlt: "OMT Pay App Mockup",
    caseStudyUrl: "/work/omt",
  },
  {
    id: 2,
    titleBold: "Telecom Solutions",
    titleLines: ["Web & Mobile App Solutions", "For Telecom Operators"],
    clientLogo: "/images/logos/logo2.png",
    clientLogoAlt: "Zain",
    clientName: "ZAIN",
    clientCountry: "SAUDI ARABIA",
    mockupImage: "/images/page2.webp",
    mockupAlt: "Zain App Mockup",
    caseStudyUrl: "/work/zain",
  },
  {
    id: 3,
    titleBold: "E-Commerce Solutions",
    titleLines: ["Custom E-Commerce", "Websites & Mobile Apps"],
    clientLogo: "/images/logos/logo3.png",
    clientLogoAlt: "Z&V",
    clientName: "Z&V",
    clientCountry: "",
    mockupImage: "/images/page3.jpg",
    mockupAlt: "Z&V App Mockup",
    caseStudyUrl: "/work/zv",
  },
  {
    id: 4,
    titleBold: "Mobile Banking",
    titleLines: ["Full-Featured Digital", "Banking Platform"],
    clientLogo: "/images/logos/logo4.png",
    clientLogoAlt: "Bokra",
    clientName: "BOKRA",
    clientCountry: "MENA REGION",
    mockupImage: "/images/page4.jpg",
    mockupAlt: "Bokra App Mockup",
    caseStudyUrl: "/work/bokra",
  },
  {
    id: 5,
    titleBold: "Healthcare Technology",
    titleLines: ["Smart Digital Health", "Solutions & Platforms"],
    clientLogo: "/images/logos/logo5.png",
    clientLogoAlt: "Client 5",
    clientName: "CLIENT 5",
    clientCountry: "",
    mockupImage: "/images/page5.jpg",
    mockupAlt: "Healthcare App Mockup",
    caseStudyUrl: "/work/client5",
  },
  {
    id: 6,
    titleBold: "Entertainment Platform",
    titleLines: ["Music & Media Streaming", "for the MENA Region"],
    clientLogo: "/images/logos/logo6.png",
    clientLogoAlt: "Client 6",
    clientName: "CLIENT 6",
    clientCountry: "",
    mockupImage: "/images/page6.jpg",
    mockupAlt: "Entertainment App Mockup",
    caseStudyUrl: "/work/client6",
  },
  {
    id: 7,
    titleBold: "Brand & Digital",
    titleLines: ["Creative Direction &", "Digital Transformation"],
    clientLogo: "/images/logos/logo7.png",
    clientLogoAlt: "Client 7",
    clientName: "CLIENT 7",
    clientCountry: "",
    mockupImage: "/images/page7.webp",
    mockupAlt: "Brand App Mockup",
    caseStudyUrl: "/work/client7",
  },
];

const getProjectThemes = async (projects) => {
  const entries = await Promise.all(
    projects.map(async (project) => [
      project.id,
      await getImageTheme(project.mockupImage),
    ]),
  );
  return Object.fromEntries(entries);
};

export default function ProjectsSection() {
  const [themes, setThemes] = useState({});

  useEffect(() => {
    let active = true;

    const loadThemes = async () => {
      const values = await getProjectThemes(projectsData);
      if (active) setThemes(values);
    };

    if (typeof window !== "undefined" && window.document) {
      loadThemes();
    }

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.document) return;
    const contentEls = Array.from(document.querySelectorAll(".slide-content"));
    if (!contentEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.2 },
    );

    contentEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {projectsData.map((project) => (
        <section
          key={project.id}
          id={`project-${project.id}`}
          className="project-slide"
          data-theme={themes[project.id] || "dark"}
        >
          <img
            src={project.mockupImage}
            alt={project.mockupAlt}
            className="slide-bg"
          />

          <div className="slide-content">
            <div className="slide-heading">
              <h2>
                <strong>{project.titleBold}</strong>
              </h2>
              {project.titleLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="slide-logo">
              <img
                src={project.clientLogo}
                alt={project.clientLogoAlt}
                className="client-logo"
              />
            </div>

            <span className="client-name">{project.clientName}</span>
            {project.clientCountry && (
              <span className="client-country">{project.clientCountry}</span>
            )}

            <a href={project.caseStudyUrl} className="btn-case-study">
              <span>View Case Study</span>
            </a>
          </div>

          <div className="slide-counter">
            {String(project.id).padStart(2, "0")} /{" "}
            {String(projectsData.length).padStart(2, "0")}
          </div>
        </section>
      ))}
    </>
  );
}
