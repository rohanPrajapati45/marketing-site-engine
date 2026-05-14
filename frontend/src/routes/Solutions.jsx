import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

const solutionsHeaderData = {
  heading: 'Some Ready Solutions for your Business',
  subtext: 'We help clients solve business problems by fusing creativity, innovation, strategy, and craft.',
};

function Solutions() {
  // eslint-disable-next-line no-unused-vars
  const theme = useOutletContext();
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
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
        .solutions-page {
          background: #fafafa;
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          color: #212529;
        }

        /* ── PAGE HEADER — white section top of page ── */
        .page-header {
          background: #fafafa;
          padding-top: 100px;
          padding-bottom: 75px;
          width: 100%;
          box-sizing: border-box;
        }

        .page-header-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        /* Left half only — matches col-lg-6 from original */
        .page-header-content {
          width: 100%;
          max-width: 50%;
        }

        /* Heading — bold, large, black */
        .page-header-heading {
          font-family: 'Exo', sans-serif;
          font-size: clamp(24px, 3vw, 40px);
          font-weight: 700;
          line-height: 1.2;

          color: #111;
          margin: 0 0 16px -130px;
        }

        /* Subtext paragraph */
        .page-header-subtext {
          font-family: 'Exo', sans-serif;
          font-size: 22px;
          font-weight: 400;
          line-height: 1.75;
          color: #212529;
          margin: 0 0 24px -130px;
          max-width: 560px;
        }

        /* Scroll reveal */
        .page-header-content {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .page-header-content.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 992px) {
          .page-header-content {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            padding-top: 80px;
            padding-bottom: 48px;
          }
          .page-header-container {
            padding: 0 20px;
          }
        }
      `}</style>

      <div className="solutions-page">
        {/* ── PAGE HEADER ── */}
        <div className="page-header">
          <div className="page-header-container">
            <div className="page-header-content" ref={headerRef}>
              <h1 className="page-header-heading">
                <strong>{solutionsHeaderData.heading}</strong>
              </h1>

              <p className="page-header-subtext">
                {solutionsHeaderData.subtext}
              </p>
            </div>
          </div>
        </div>

        {/* More sections will be added below here */}
      </div>
    </>
  );
}

export default Solutions;
