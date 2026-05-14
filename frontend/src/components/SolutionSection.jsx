import { useEffect, useState, useRef } from 'react';

/*
Each solution object shape:
{
  id: 1,
  theme: 'dark',               ← 'dark' or 'light' — alternates
  title: 'E-COMMERCE SOLUTIONS',
  description: 'As a full-service agency...',
  inquiryLabel: 'For more inquiry fill the below',
  images: [
    '/images/solutions/ecom-1.jpg',
    '/images/solutions/ecom-2.jpg',
    '/images/solutions/ecom-3.jpg',
    '/images/solutions/ecom-4.jpg',
  ],
  tags: ['Stripe', 'MasterCard MPGS', 'VISA Cybersource', ...],
  buttonText: 'Request Demo',
  buttonLink: '/contact',
}
*/

const SolutionSection = ({ solution }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % solution.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [solution.images.length]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Demo requested for ${solution.title}`);
  };

  return (
    <>
      <style>{`
        .solution-section {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .solution-section.theme-dark {
          background: #1a1a1a;
          color: #fff;
        }

        .solution-section.theme-light {
          background: #f5f5f5;
          color: #111;
        }

        .solution-bg-icons {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .solution-bg-icon {
          position: absolute;
          opacity: 0.06;
          width: 120px;
          height: 120px;
        }

        .theme-dark .solution-bg-icon {
          opacity: 0.07;
          filter: invert(1);
        }

        .solution-content-row {
          display: flex;
          align-items: flex-start;
          width: 100%;
          flex: 1;
          position: relative;
          z-index: 1;
          padding: 80px 52px 40px;
          box-sizing: border-box;
          gap: 60px;
        }

        .solution-left {
          width: 45%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding-top: 40px;
        }

        .solution-title {
          font-family: 'Exo', sans-serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 28px 0;
          color: inherit;
        }

        .solution-description {
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.8;
          color: inherit;
          opacity: 0.85;
          margin: 0 0 36px 0;
          max-width: 520px;
        }

        .solution-inquiry-label {
          font-family: 'Exo', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: inherit;
          opacity: 0.75;
          margin-bottom: 16px;
        }

        .solution-input {
          width: 100%;
          max-width: 460px;
          padding: 16px 20px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-family: 'Exo', sans-serif;
          font-size: 14px;
          color: #fff;
          outline: none;
          margin-bottom: 12px;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .theme-light .solution-input {
          border-color: rgba(0, 0, 0, 0.25);
          color: #111;
        }

        .solution-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        .theme-light .solution-input::placeholder {
          color: rgba(0, 0, 0, 0.4);
        }

        .solution-input:focus {
          border-color: rgba(255, 255, 255, 0.8);
        }

        .theme-light .solution-input:focus {
          border-color: rgba(0, 0, 0, 0.7);
        }

        .btn-request-demo {
          display: inline-block;
          margin-top: 24px;
          padding: 16px 0;
          min-width: 200px;
          max-width: 200px;
          height: 62px;
          width: 100%;
          text-align: center;
          text-decoration: none;
          font-family: 'Exo', sans-serif;
          font-size: 17px;
          font-weight: -1000;
          letter-spacing: 1px;
          text-transform: none;
          color: #fff;
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          background: transparent;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.4s ease;
        }

        .theme-light .btn-request-demo {
          color: #111;
          border-color: rgba(0, 0, 0, 0.4);
        }

        .btn-request-demo::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 0;
        }

        .theme-light .btn-request-demo::before {
          background: #111;
        }

        .btn-request-demo:hover::before {
          transform: scaleY(1);
        }

        .btn-request-demo span {
          position: relative;
          z-index: 1;
          mix-blend-mode: difference;
          color: #fff;
        }

        .solution-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-top: 20px;
        }

        .solution-carousel {
          position: relative;
          width: 100%;
          background: #2d3748;
          overflow: hidden;
          border-radius: 2px;
        }

        .carousel-track-wrapper {
          overflow: hidden;
          width: 100%;
        }

        .carousel-track {
          display: flex;
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .carousel-slide {
          flex: 0 0 100%;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }

        .carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 14px 0 0;
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          border: none;
          padding: 0;
          transition: background 0.3s ease;
        }

        .carousel-dot.dot-active {
          background: #fff;
        }

        .solution-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 24px;
        }

        .solution-tag {
          font-family: 'Exo', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: default;
          transition: background 0.2s ease;
        }

        .theme-dark .solution-tag {
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: rgba(255, 255, 255, 0.85);
          background: transparent;
        }

        .theme-dark .solution-tag:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .theme-light .solution-tag {
          border: 1px solid rgba(0, 0, 0, 0.25);
          color: rgba(0, 0, 0, 0.75);
          background: transparent;
        }

        .theme-light .solution-tag:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .solution-left,
        .solution-right {
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .solution-right {
          transition-delay: 0.15s;
        }

        .solution-section.in-view .solution-left,
        .solution-section.in-view .solution-right {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .solution-content-row {
            padding: 60px 32px 32px;
            gap: 32px;
          }
          .solution-left {
            width: 48%;
          }
        }

        @media (max-width: 768px) {
          .solution-content-row {
            flex-direction: column;
            padding: 48px 24px 32px;
          }
          .solution-left {
            width: 100%;
            padding-top: 0;
          }
          .solution-input,
          .btn-request-demo {
            max-width: 100%;
          }
        }
      `}</style>

      <section ref={sectionRef} className={`solution-section theme-${solution.theme}`}>
        <div className="solution-bg-icons">
          <div
            className="solution-bg-icon"
            style={{ top: '10%', left: '8%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 58%)' }}
          />
          <div
            className="solution-bg-icon"
            style={{ top: '22%', right: '12%', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
          />
          <div
            className="solution-bg-icon"
            style={{ bottom: '12%', left: '18%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 58%)' }}
          />
          <div
            className="solution-bg-icon"
            style={{ bottom: '8%', right: '14%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 58%)' }}
          />
        </div>

        <div className="solution-content-row">
          <div className="solution-left">
            <h2 className="solution-title">{solution.title}</h2>
            <p className="solution-description">{solution.description}</p>
            <p className="solution-inquiry-label">{solution.inquiryLabel}</p>
            <form onSubmit={handleSubmit}>
              <input
                type="tel"
                placeholder="Phone Number"
                className="solution-input"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="solution-input"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
              <button type="submit" className="btn-request-demo">
                <span>{solution.buttonText}</span>
              </button>
            </form>
          </div>

          <div className="solution-right">
            <div className="solution-carousel">
              <div className="carousel-track-wrapper">
                <div className="carousel-track" style={{ transform: `translateX(-${activeImage * 100}%)` }}>
                  {solution.images.map((img, i) => (
                    <div key={i} className="carousel-slide">
                      <img src={img} alt={`${solution.title} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="carousel-dots">
                {solution.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`carousel-dot ${i === activeImage ? 'dot-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="solution-tags">
              {solution.tags.map((tag, i) => (
                <span key={i} className="solution-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SolutionSection;
