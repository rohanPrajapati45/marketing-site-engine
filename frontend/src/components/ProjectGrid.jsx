import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectGrid = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={`${project.title}-${index}`} project={project} />
      ))}
    </div>
  );
};

export default ProjectGrid;
