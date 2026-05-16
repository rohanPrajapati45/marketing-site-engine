import { useEffect, useRef } from 'react';

const SolutionsPageHeader = ({ header }) => {
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
    <section className="page-header">
      <div className="page-header-container">
        <div className="page-header-content" ref={headerRef}>
          <h1 className="page-header-heading">
            <strong>{header?.heading}</strong>
          </h1>
          <p className="page-header-subtext">{header?.subtext}</p>
        </div>
      </div>
    </section>
  );
};

export default SolutionsPageHeader;
