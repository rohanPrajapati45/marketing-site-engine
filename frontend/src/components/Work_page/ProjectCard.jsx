import React, { useEffect, useRef, useState } from "react";

const ProjectCard = ({ project }) => {
  const projectHref = project.projectlink || project.link;
  const Wrapper = projectHref ? "a" : "div";

  const [visible, setVisible] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
      },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const wrapperProps = {
    className: "project-card group block cursor-pointer",
    "aria-label": project.title,
  };

  if (projectHref) {
    wrapperProps.href = projectHref;
    wrapperProps.target = "_blank";
    wrapperProps.rel = "noreferrer";
  }

  return (
    <Wrapper {...wrapperProps}>
      {/* IMAGE SECTION */}

      <div
        ref={cardRef}
        className={`
          relative
          overflow-hidden
          bg-[#f4f4f4]

          transition-all
          duration-[1400ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${
            visible
              ? "opacity-100 translate-y-0 scale-y-100"
              : "opacity-0 translate-y-[80px] scale-y-[0.88]"
          }
        `}
        style={{
          transformOrigin: "bottom",
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="
            h-[420px]
            w-full

            object-cover

            transition-transform
            duration-[1400ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover:scale-[1.2]
          "
        />
      </div>

      {/* TITLE */}

      <div
        className={`
          mt-[12px]
          px-[4px]

          transition-all
          duration-[1200ms]

          ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[24px]"
          }
        `}
      >
        <h3
          className="
            text-[1.05rem]

            font-[500]

            tracking-[-0.02em]

            text-[#1d1d1d]

            transition-colors
            duration-300

            group-hover:text-black
          "
        >
          {project.title}
        </h3>
      </div>
    </Wrapper>
  );
};

export default ProjectCard;
