import React from "react";
import ProjectGrid from "./ProjectGrid";
import RecentProjectsSection from "./RecentProjectsSection";

const ProjectSection = ({
  activeTab,
  tabs,
  projects,
  selectedFilter,
}) => {
  const tabName = tabs[activeTab];
  const isFilterTab =
    tabName === "By Industry" ||
    tabName === "By Region" ||
    tabName === "By Service";

  const filteredProjects = projects.filter((project) => {
    if (!isFilterTab || !selectedFilter) {
      return true;
    }

    if (tabName === "By Industry") {
      return project.industry === selectedFilter;
    }

    if (tabName === "By Region") {
      return project.region === selectedFilter;
    }

    if (tabName === "By Service") {
      return project.service === selectedFilter;
    }

    return true;
  });

  const viewKey = `${tabName}-${selectedFilter || "all"}`;

  if (tabName === "Recent Projects") {
    return <RecentProjectsSection />;
  }

  if (tabName === "Coming Soon") {
    return (
      <section className="mt-[18px]">
        <div key={viewKey} className="project-section-animate">
          <ProjectGrid
            projects={projects.filter((project) => project.isComingSoon)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-[18px]">
      <div key={viewKey} className="project-section-animate">
        <ProjectGrid
          projects={isFilterTab ? filteredProjects : projects}
        />
      </div>
    </section>
  );
};

export default ProjectSection;
