import { useEffect, useRef } from "react";

import SolutionCarousel from "./SolutionCarousel";
import SolutionTags from "./SolutionTags";
import SolutionForm from "./SolutionForm";

const SolutionSection = ({ section }) => {
  // BACKEND DATA
  const solution = section.data || {};

  const sectionRef = useRef(null);

  // INTERSECTION ANIMATION
  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");

          observer.disconnect();
        }
      },

      {
        threshold: 0.15,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`solution-section theme-${solution.theme}`}
    >
      {/* BACKGROUND ICONS */}

      <div className="solution-bg-icons">
        <div
          className="solution-bg-icon"
          style={{
            top: "10%",
            left: "8%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 58%)",
          }}
        />

        <div
          className="solution-bg-icon"
          style={{
            top: "22%",
            right: "12%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)",
          }}
        />

        <div
          className="solution-bg-icon"
          style={{
            bottom: "12%",
            left: "18%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 58%)",
          }}
        />

        <div
          className="solution-bg-icon"
          style={{
            bottom: "8%",
            right: "14%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 58%)",
          }}
        />
      </div>

      {/* CONTENT */}

      <div className="solution-content-row">
        {/* LEFT SIDE */}

        <div className="solution-left">
          <h2 className="solution-title">{solution.title}</h2>

          <p className="solution-description">{solution.description}</p>

          <SolutionForm
            inquiryLabel={solution.inquiryLabel}
            buttonText={solution.buttonText}
            title={solution.title}
            solutionId={solution.id}
          />
        </div>

        {/* RIGHT SIDE */}

        <div className="solution-right">
          <SolutionCarousel
            images={solution.images || []}
            title={solution.title}
          />

          <SolutionTags tags={solution.tags || []} />
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
