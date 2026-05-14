import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { caseStudiesData, getCaseStudyBySlug } from '../hooks/caseStudiesData';

function CaseStudy() {
  const { slug } = useParams();
  const caseStudy = getCaseStudyBySlug(slug);
  const sectionRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!caseStudy) return;

    const observers = [];

    sectionRefs.current.forEach((el) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [caseStudy]);

  if (!caseStudy) {
    return (
      <div className="casestudy-page">
        <div className="cs-not-found">
          <h2>Case Study Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .casestudy-page {
          background: #f5f5f5;
          font-family: 'Exo', sans-serif;
          color: #212529;
          min-height: 100vh;
        }

        .cs-hero {
          width: 100%;
          height: 60vh;
          min-height: 400px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .cs-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .cs-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.75) 0%,
            rgba(0,0,0,0.3) 50%,
            transparent 100%
          );
          z-index: 1;
        }

        .cs-hero-content {
          position: relative;
          z-index: 2;
          padding: 0 52px 48px;
          color: #fff;
        }

        .cs-hero-category {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cs-hero-category::before {
          content: '';
          width: 24px;
          height: 1px;
          background: rgba(255,255,255,0.4);
        }

        .cs-hero-title {
          font-family: 'Exo', sans-serif;
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 700;
          line-height: 1.15;
          color: #fff;
          margin: 0 0 16px 0;
        }

        .cs-hero-overview {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(255,255,255,0.75);
          max-width: 640px;
          margin: 0;
        }

        .cs-accent-line {
          height: 4px;
          width: 100%;
        }

        .cs-section {
          width: 100%;
          min-height: 100vh;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          padding: 80px 0;
          box-sizing: border-box;
          overflow: hidden;
        }

        .cs-section-row {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 100%;
          gap: 0;
        }

        .cs-section.image-right .cs-section-row {
          flex-direction: row;
        }

        .cs-section.image-left .cs-section-row {
          flex-direction: row-reverse;
        }

        .cs-section-image {
          width: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 52px;
          box-sizing: border-box;
        }

        .cs-section-image img {
          width: 100%;
          max-width: 480px;
          height: auto;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 24px 48px rgba(0,0,0,0.15));
          transition: transform 0.4s ease;
        }

        .cs-section-image img:hover {
          transform: translateY(-8px);
        }

        .cs-section-text {
          width: 50%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 80px 40px 40px;
          box-sizing: border-box;
        }

        .cs-section.image-left .cs-section-text {
          padding: 40px 40px 40px 80px;
        }

        .cs-section-label {
          font-family: 'Exo', sans-serif;
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 700;
          letter-spacing: 2px;
          color: #111;
          margin: 0 0 36px 0;
          text-transform: uppercase;
        }

        .cs-section-points {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .cs-section-point {
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.6;
          color: #555;
          text-align: center;
          padding: 0 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .cs-section-point:nth-child(1) { transition-delay: 0ms; }
        .cs-section-point:nth-child(2) { transition-delay: 100ms; }
        .cs-section-point:nth-child(3) { transition-delay: 200ms; }
        .cs-section-point:nth-child(4) { transition-delay: 300ms; }
        .cs-section-point:nth-child(5) { transition-delay: 400ms; }

        .cs-section.in-view .cs-section-point {
          opacity: 1;
          transform: translateY(0);
        }

        .cs-section-image {
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }

        .cs-section.image-left .cs-section-image {
          transform: translateX(30px);
        }

        .cs-section.in-view .cs-section-image {
          opacity: 1;
          transform: translateX(0);
        }

        .cs-not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 40px;
        }

        .cs-not-found h2 {
          font-family: 'Exo', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #111;
          margin-bottom: 16px;
        }

        .cs-not-found p {
          color: #666;
          font-size: 16px;
        }

        .cs-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Exo', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #111;
          text-decoration: none;
          padding: 20px 52px;
          transition: opacity 0.2s ease;
          position: relative;
          z-index: 10;
        }

        .cs-back-btn:hover {
          opacity: 0.55;
        }

        .cs-back-btn::before {
          content: '←';
          font-size: 16px;
        }

        @media (max-width: 992px) {
          .cs-section-row {
            flex-direction: column !important;
          }
          .cs-section-image,
          .cs-section-text {
            width: 100%;
          }
          .cs-section-text {
            padding: 32px 32px 0 !important;
          }
          .cs-section-image {
            padding: 32px;
          }
          .cs-hero-content {
            padding: 0 24px 40px;
          }
        }

        @media (max-width: 768px) {
          .cs-hero { height: 50vh; }
        }
      `}</style>

      <div className="casestudy-page">
        <div className="cs-hero">
          <img src={caseStudy.heroImage} alt={caseStudy.clientName} className="cs-hero-img" />
          <div className="cs-hero-overlay" />
          <div className="cs-hero-content">
            <p className="cs-hero-category">{caseStudy.category}</p>
            <h1 className="cs-hero-title">{caseStudy.projectTitle}</h1>
            <p className="cs-hero-overview">{caseStudy.overview}</p>
          </div>
        </div>

        <div className="cs-accent-line" style={{ background: caseStudy.accentColor }} />

        <a href="/work" className="cs-back-btn">Back to Work</a>

        {caseStudy.sections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={`cs-section ${section.type}`}
          >
            <div className="cs-section-row">
              <div className="cs-section-image">
                <img src={section.image} alt={section.label} />
              </div>
              <div className="cs-section-text">
                <h2 className="cs-section-label">{section.label}</h2>
                <ul className="cs-section-points">
                  {section.points.map((point, i) => (
                    <li key={i} className="cs-section-point">{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CaseStudy;
