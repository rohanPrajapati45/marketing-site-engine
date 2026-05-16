import { useRef, useEffect } from 'react';

const ctaData = {
  heading: "Let's Transform",
  paragraphs: [
    "Like What You See? Tell us about your project.",
    "We don't just build your digital business, we accelerate it!",
    "Best Web and Mobile Apps development company in Lebanon",
  ],
  buttonText: "Contact",
  buttonLink: "/contact",
};

export default function CTASection() {
  const innerRef = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
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
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .cta-section {
          width: 100%;
          min-height: 60vh;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          margin-top: 90px;
        }

        .cta-inner {
          width: 100%;
          max-width: 720px;
          text-align: center;
          margin: 0 auto;
        }

        .cta-heading {
          font-family: 'Exo', sans-serif;
          font-size: clamp(22px, 5vw, 42px);
          font-weight: 600;
          line-height: 1.15;
          color: #111;
          margin: 0 0 40px 0;
        }

        .cta-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 0;
        }

        .cta-paragraphs p {
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.75;
          color: #212529;
          margin: 0;
        }

        .btn-cta {
          display: inline-block;
          position: relative;
          padding: 14px 0;
          min-width: 180px;
          height: 58px;
          margin-top: 40px;
          text-align: center;
          text-decoration: none;
          font-family: 'Exo', sans-serif;
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 0.1px;         
          color: #efeded;
          border: 1.5px solid #111;
          background: transparent;
          overflow: hidden;
          cursor: pointer;
          transition: color 0.4s ease;
          margin-bottom: 10px;
        }

        .btn-cta::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: #111;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 0;
        }

        .btn-cta:hover::before {
          transform: scaleY(1);
        }

        .btn-cta span {
          position: relative;
          z-index: 1;
          mix-blend-mode: difference;
          color: #928f8f;
          
        }

        .cta-inner {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .cta-inner.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .cta-section {
            padding: 64px 24px;
            min-height: auto;
          }
          .cta-heading {
            font-size: clamp(28px, 6vw, 40px);
          }
        }
      `}</style>

      <section className="cta-section">
        <div className="cta-inner" ref={innerRef}>
          <h2 className="cta-heading">
            <b>{ctaData.heading}</b>
          </h2>

          <div className="cta-paragraphs">
            {ctaData.paragraphs.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <a href={ctaData.buttonLink} className="btn-cta">
            <span>{ctaData.buttonText}</span>
          </a>
        </div>
      </section>
    </>
  );
}
