import { useEffect, useState } from "react";
 
import { getImageTheme } from "../../hooks/useMediaTheme";
 
import "../../styles/ProjectsSection.css";
 
export default function ProjectsSection({ section }) {
  const {
    titleBold,
    titleLines,
    clientLogo,
    clientLogoAlt,
    clientName,
    clientCountry,
    mockupImage,
    mockupAlt,
    caseStudyUrl,
  } = section.data;
 
  const [theme, setTheme] = useState("dark");
 
  // DYNAMIC THEME
  useEffect(() => {
    let active = true;
 
    async function loadTheme() {
      const result = await getImageTheme(mockupImage);
 
      if (active) {
        setTheme(result);
      }
    }
 
    loadTheme();
 
    return () => {
      active = false;
    };
  }, [mockupImage]);
 
  // CONTENT ANIMATION
  // CONTENT ANIMATION
  useEffect(() => {
    const sectionEl = document.getElementById(section.id);
 
    if (!sectionEl) return;
 
    const contentEl = sectionEl.querySelector(".slide-content");
 
    if (!contentEl) return;
 
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          contentEl.classList.add("in-view");
        } else {
          contentEl.classList.remove("in-view");
        }
      },
      {
        threshold: 0.2,
      },
    );
 
    observer.observe(contentEl);
 
    return () => observer.disconnect();
  }, [section.id]);
 
  return (
    <section className="project-slide" data-theme={theme}>
      {/* BG IMAGE */}
 
      <img src={mockupImage} alt={mockupAlt} className="slide-bg" />
 
      {/* CONTENT */}
 
      <div className="slide-content">
        {/* HEADING */}
 
        <div className="slide-heading">
          <h2>
            <strong>{titleBold}</strong>
          </h2>
 
          {titleLines?.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
 
        {/* LOGO */}
 
        <div className="slide-logo">
          <img src={clientLogo} alt={clientLogoAlt} className="client-logo" />
        </div>
 
        {/* CLIENT */}
 
        <span className="client-name">{clientName}</span>
 
        {clientCountry && (
          <span className="client-country">{clientCountry}</span>
        )}
 
        {/* BUTTON */}
 
        <a href={caseStudyUrl} className="btn-case-study">
          <span>View Case Study</span>
        </a>
      </div>
    </section>
  );
}
 