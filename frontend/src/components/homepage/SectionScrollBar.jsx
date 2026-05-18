const SectionScrollBar = ({ sections, activeIndex, onDotClick, theme = 'dark' }) => {
  const lineColor = theme === 'light' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.35)';
  const activeColor = theme === 'light' ? '#111' : '#ffffff';
  const hoverColor = theme === 'light' ? 'rgba(0, 0, 0, 0.65)' : 'rgba(255, 255, 255, 0.65)';
  const activeShadow = theme === 'light' ? '0 0 8px rgba(0, 0, 0, 0.25)' : '0 0 8px rgba(255, 255, 255, 0.55)';

  return (
    <>
      <style>{`
        .section-scrollbar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .scrollbar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          position: relative;
        }


        .scrollbar-line {
          height: 2px;
          background: ${lineColor};
          width: 15px;
          border-radius: 10px;
          transition:
            width 0.25s ease,
            height 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }

        .scrollbar-item.is-active .scrollbar-line {
          width: 12px;
          height: 12px;
          background: ${activeColor};
          border-radius: 3px;
          box-shadow: ${activeShadow};
        }

        .scrollbar-item:not(.is-active):hover .scrollbar-line {
          width: 26px;
          height: 5px;
          padding: 7px 7px;
          background: ${hoverColor};
        }


        @media (max-width: 768px) {
          .section-scrollbar {
            display: none;
          }
        }
      `}</style>

      <nav className="section-scrollbar" aria-label="Section navigation">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`scrollbar-item ${index === activeIndex ? 'is-active' : ''}`}
            onClick={() => onDotClick(index)}
            title={section.label}
            role="button"
            aria-label={`Go to ${section.label}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onDotClick(index);
            }}
          >
            <div className="scrollbar-line" />
          </div>
        ))}
      </nav>
    </>
  );
};

export default SectionScrollBar;
