// ONLY CHANGE: accept projects as prop instead of hardcoded array
// Everything else — CSS, animations, themes, JSX — stays identical

import { useEffect, useState } from 'react';
import { getImageTheme } from '../../hooks/useMediaTheme';
import '../../styles/ProjectsSection.css';

// ── projects comes as prop from Home.jsx ──
// ── no hardcoded projectsData inside this file anymore ──
export default function ProjectsSection({ projects = [] }) {
  const [themes, setThemes] = useState({});

  // ── getProjectThemes uses _id from MongoDB (or id for fallback) ──
  useEffect(() => {
    if (!projects.length) return;
    let active = true;

    const loadThemes = async () => {
      const entries = await Promise.all(
        projects.map(async (project) => {
          const key = project._id || project.id;
          const theme = await getImageTheme(project.mockupImage);
          return [key, theme];
        })
      );
      if (active) setThemes(Object.fromEntries(entries));
    };

    if (typeof window !== 'undefined' && window.document) {
      loadThemes();
    }

    return () => { active = false; };
  }, [projects]); // re-run if projects change

  // ── IntersectionObserver for slide-content animation ──
  useEffect(() => {
    if (typeof window === 'undefined' || !window.document) return;
    const contentEls = Array.from(document.querySelectorAll('.slide-content'));
    if (!contentEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.2 }
    );

    contentEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects]); // re-run if projects change

  // ── Empty state ──
  if (!projects.length) return null;

  return (
    <>
      {projects.map((project, index) => {
        // Use _id for MongoDB data, id for fallback data
        const key = project._id || project.id;
        const sectionId = `project-${index + 1}`;
        // Counter uses index position — not project.id
        // This ensures 1/2, 2/2 with 2 projects
        // or 1/7, 2/7 ... 7/7 with 7 projects

        return (
          <section
            key={key}
            id={sectionId}
            className="project-slide"
            data-theme={themes[key] || 'dark'}
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

            {/* Counter uses index+1 and total length — always correct */}
            <div className="slide-counter">
              {String(index + 1).padStart(2, '0')} /{' '}
              {String(projects.length).padStart(2, '0')}
            </div>
          </section>
        );
      })}
    </>
  );
}