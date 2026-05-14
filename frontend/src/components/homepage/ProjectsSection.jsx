import { useEffect, useState } from 'react';
import { getImageTheme } from '../../hooks/useMediaTheme';

const projectsData = [
  {
    id: 1,
    titleBold: 'Fintech Solutions',
    titleLines: ['E-Wallet & Omnichannel', 'Digital Banking'],
    clientLogo: '/images/logos/logo1.png',
    clientLogoAlt: 'OMT Pay',
    clientName: 'OMT',
    clientCountry: '',
    mockupImage: '/images/page1.webp',
    mockupAlt: 'OMT Pay App Mockup',
    caseStudyUrl: '/work/omt',
  },
  {
    id: 2,
    titleBold: 'Telecom Solutions',
    titleLines: ['Web & Mobile App Solutions', 'For Telecom Operators'],
    clientLogo: '/images/logos/logo2.png',
    clientLogoAlt: 'Zain',
    clientName: 'ZAIN',
    clientCountry: 'SAUDI ARABIA',
    mockupImage: '/images/page2.webp',
    mockupAlt: 'Zain App Mockup',
    caseStudyUrl: '/work/zain',
  },
  {
    id: 3,
    titleBold: 'E-Commerce Solutions',
    titleLines: ['Custom E-Commerce', 'Websites & Mobile Apps'],
    clientLogo: '/images/logos/logo3.png',
    clientLogoAlt: 'Z&V',
    clientName: 'Z&V',
    clientCountry: '',
    mockupImage: '/images/page3.jpg',
    mockupAlt: 'Z&V App Mockup',
    caseStudyUrl: '/work/zv',
  },
  {
    id: 4,
    titleBold: 'Mobile Banking',
    titleLines: ['Full-Featured Digital', 'Banking Platform'],
    clientLogo: '/images/logos/logo4.png',
    clientLogoAlt: 'Bokra',
    clientName: 'BOKRA',
    clientCountry: 'MENA REGION',
    mockupImage: '/images/page4.jpg',
    mockupAlt: 'Bokra App Mockup',
    caseStudyUrl: '/work/bokra',
  },
  {
    id: 5,
    titleBold: 'Healthcare Technology',
    titleLines: ['Smart Digital Health', 'Solutions & Platforms'],
    clientLogo: '/images/logos/logo5.png',
    clientLogoAlt: 'Client 5',
    clientName: 'CLIENT 5',
    clientCountry: '',
    mockupImage: '/images/page5.jpg',
    mockupAlt: 'Healthcare App Mockup',
    caseStudyUrl: '/work/client5',
  },
  {
    id: 6,
    titleBold: 'Entertainment Platform',
    titleLines: ['Music & Media Streaming', 'for the MENA Region'],
    clientLogo: '/images/logos/logo6.png',
    clientLogoAlt: 'Client 6',
    clientName: 'CLIENT 6',
    clientCountry: '',
    mockupImage: '/images/page6.jpg',
    mockupAlt: 'Entertainment App Mockup',
    caseStudyUrl: '/work/client6',
  },
  {
    id: 7,
    titleBold: 'Brand & Digital',
    titleLines: ['Creative Direction &', 'Digital Transformation'],
    clientLogo: '/images/logos/logo7.png',
    clientLogoAlt: 'Client 7',
    clientName: 'CLIENT 7',
    clientCountry: '',
    mockupImage: '/images/page7.webp',
    mockupAlt: 'Brand App Mockup',
    caseStudyUrl: '/work/client7',
  },
];

const getProjectThemes = async (projects) => {
  const entries = await Promise.all(
    projects.map(async (project) => [project.id, await getImageTheme(project.mockupImage)])
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

    if (typeof window !== 'undefined' && window.document) {
      loadThemes();
    }

    return () => {
      active = false;
    };
  }, []);

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
  }, []);

  return (
    <>
      <style>{`
        .project-slide {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          scroll-snap-align: start;
        }

        .slide-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
        }

        .slide-content {
          position: relative;
          z-index: 2;
          width: 42%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 0 52px;
          min-height: 100vh;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(42px);
          transition: opacity 3.4s cubic-bezier(0.22, 1, 0.36, 1), transform 3.4s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        .slide-content.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-heading {
          margin-bottom: 32px;
        }

        .slide-heading h2 {
          font-family: 'Exo', sans-serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 12px 0;
          color: #fff;
        }

        .slide-heading p {
          font-family: 'Exo', sans-serif;
          font-size: clamp(18px, 2vw, 28px);
          font-weight: 400;
          line-height: 1.35;
          margin: 0;
          color: #fff;
        }

        .slide-logo {
          margin-bottom: 22px;
        }

        .client-logo {
          height: 40px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .client-name {
          font-family: 'Exo', sans-serif;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #fff;
          display: block;
          margin-bottom: 6px;
        }

        .client-country {
          font-family: 'Exo', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.82);
          display: block;
          margin-bottom: 18px;
        }

        .btn-case-study {
          display: inline-block;
          margin-top: 22px;
          padding: 6px 0;
          min-width: 110px;
          text-align: center;
          border: 1.5px solid rgba(255,255,255,0.92);
          font-family: 'Exo', sans-serif;
          font-size: 12px;
          font-weight: 200;
          letter-spacing: 0.5px;
          text-decoration: none;
          color: #fff;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease;
        }

        .project-slide[data-theme="light"] .btn-case-study {
          border-color: rgba(0,0,0,0.92);
          color: #111;
        }

        .btn-case-study::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.08);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.35s ease, background 0.35s ease;
          z-index: 0;
        }

        .project-slide[data-theme="light"] .btn-case-study::before {
          background: rgba(0,0,0,0.08);
        }

        .btn-case-study:hover::before {
          transform: scaleY(1);
        }

        .btn-case-study:hover {
          color: inherit;
        }

        .project-slide[data-theme="dark"] .btn-case-study:hover {
          color: #111 !important;
        }

        .project-slide[data-theme="light"] .btn-case-study:hover {
          color: #fff !important;
        }

        .project-slide[data-theme="dark"] .btn-case-study:hover::before {
          background: rgba(255,255,255,0.92) !important;
        }

        .project-slide[data-theme="light"] .btn-case-study:hover::before {
          background: rgba(0,0,0,0.92) !important;
        }

        .btn-case-study span {
          position: relative;
          z-index: 1;
        }

        .slide-counter {
          position: absolute;
          bottom: 32px;
          right: 48px;
          z-index: 2;
          font-family: 'Exo', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.9);
        }

        @media (max-width: 1024px) {
          .slide-content {
            width: 100%;
            padding: 40px 32px;
          }

          .slide-heading h2 {
            font-size: clamp(28px, 5vw, 36px);
          }
        }

        @media (max-width: 768px) {
          .slide-content {
            justify-content: flex-end;
            padding: 40px 24px 60px;
          }

          .slide-counter {
            right: 24px;
            bottom: 18px;
          }
        }
      `}</style>

      {projectsData.map((project) => (
        <section key={project.id} id={`project-${project.id}`} className="project-slide" data-theme={themes[project.id] || 'dark'}>
          <img src={project.mockupImage} alt={project.mockupAlt} className="slide-bg" />

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
              <img src={project.clientLogo} alt={project.clientLogoAlt} className="client-logo" />
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
            {String(project.id).padStart(2, '0')} / {String(projectsData.length).padStart(2, '0')}
          </div>
        </section>
      ))}
    </>
  );
}
