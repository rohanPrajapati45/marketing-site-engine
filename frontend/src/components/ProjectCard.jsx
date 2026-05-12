import React from "react";

const ProjectCard = ({ project }) => {
  const Wrapper = project.link ? "a" : "div";

  const wrapperProps = {
    className: "project-card group block cursor-pointer",
    "aria-label": project.title,
  };

  if (project.link) {
    wrapperProps.href = project.link;
  }

  return (
    <Wrapper {...wrapperProps}>
      
      {/* IMAGE SECTION */}
      <div className="relative overflow-hidden bg-[#f4f4f4]">
        <img
          src={project.image}
          alt={project.title}
          className="h-[420px] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.2]"
        />
      </div>

      {/* TITLE BELOW IMAGE */}
      <div className="mt-[12px] px-[4px]">
        <h3 className="text-[1.05rem] font-[500] tracking-[-0.02em] text-[#1d1d1d] transition-colors duration-300 group-hover:text-black">
          {project.title}
        </h3>
      </div>

    </Wrapper>
  );
};

export default ProjectCard;