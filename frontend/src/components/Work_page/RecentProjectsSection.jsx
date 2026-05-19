import React from "react";
import RecentProjectCarousel from "./RecentProjectCarousel";

const RecentProjectsSection = ({ projects = [], recentConfig = {}, activeFilter = null }) => {
  const { categories = [], maxPerCategory = 5 } = recentConfig;

  // projects prop is already filtered by WorkCategoryMenu (isRecentProject or by filter)
  // Do NOT filter again for isRecentProject here

  const buildSections = () => {
    // If a filter is active, show all matching projects as a single group
    if (activeFilter) {
      const items = projects.map((p) => ({
        title: p.title,
        image: p.image,
        link: p.projectlink || "#",
      }));
      if (items.length === 0) return [];
      return [{ category: activeFilter, projects: items }];
    }

    // If admin configured categories, group by those
    if (categories.length > 0) {
      return categories
        .map((cat) => {
          const matched = projects.filter(
            (p) =>
              p.industry === cat.name ||
              p.region === cat.name ||
              p.service === cat.name
          );
          if (matched.length === 0) return null;
          return {
            category: cat.name,
            projects: matched.slice(0, cat.max || maxPerCategory).map((p) => ({
              title: p.title,
              image: p.image,
              link: p.projectlink || "#",
            })),
          };
        })
        .filter(Boolean);
    }

    // Fallback: auto-group by industry
    const grouped = {};
    projects.forEach((p) => {
      const key = p.industry || "Other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({
        title: p.title,
        image: p.image,
        link: p.projectlink || "#",
      });
    });

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      projects: items.slice(0, maxPerCategory),
    }));
  };

  const sections = buildSections();

  if (sections.length === 0) {
    return (
      <section className="mt-[18px]">
        <p className="text-center text-[#999] text-sm py-10">No recent projects to display</p>
      </section>
    );
  }

  return (
    <section className="mt-[1px]">
      {sections.map((section, index) => (
        <RecentProjectCarousel
          key={section.category + index}
          category={section.category}
          projects={section.projects}
          autoSlideDelay={3200 + index * 900}
        />
      ))}
    </section>
  );
};

export default RecentProjectsSection;