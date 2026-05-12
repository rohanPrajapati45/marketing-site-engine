import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./WorkCategoryMenu.css";

import WorkTabs from "../WorkTabs";
import WorkSubmenu from "../WorkSubmenu";
import ProjectGrid from "./ProjectGrid";
import RecentProjectsSection from "./RecentProjectsSection";

const WorkCategoryMenu = () => {

  const tabs = [
    "Recent Projects",
    "ALL Projects",
    "By Industry",
    "By Region",
    "By Service",
    "Coming Soon",
  ];

  const subCategories = {

    "By Industry": [
      "Real Estate",
      "Logistics",
      "Ecommerce, Retail & QSR",
      "Fintech & Banking",
      "Insurance",
      "Government & NGO",
      "Telecom",
      "Healthcare & Wellness",
      "Media & Entertainment",
      "B2B & Employee WorkForce",
      "Corporate & Enterprise",
      "Transportation & Logistics",
      "Startups",
      "Travel",
      "FINTECH",
    ],

    "By Region": [
      "Libya",
      "USA",
      "UK",
      "FRANCE",
      "Tehran",
      "LEBANON",
      "SAUDI ARABIA",
      "UAE",
      "KUWAIT",
      "QATAR",
      "USA | UK | EU",
      "AFRICA",
      "IRAQ",
      "JORDAN",
    ],

    "By Service": [
      "E-Commerce Services",
      "Website Development",
      "Mobile App Development",
      "Fintech Solutions",
      "Loyalty Program Services",
      "Games & Digital Activations",
      "Emerging Tech & Innovation",
      "UI/UX",
      "AI & Data Intelligence",
      "FINTECH",
    ],
  };

  const projects = [
    {
      title: "NEO Digital Payment",
      image: "/fintech-imgs/fintech1.webp",
      industry: "Fintech & Banking",
      region: "LEBANON",
      service: "Fintech Solutions",
      isComingSoon: false,
    },
    {
      title: "CASH UNITED - Agent POS",
      image: "/fintech-imgs/fintech2.webp",
      industry: "Fintech & Banking",
      region: "UAE",
      service: "Fintech Solutions",
      isComingSoon: false,
    },
    {
      title: "EVO Wallet Lebanon",
      image: "/fintech-imgs/fintech3.webp",
      industry: "Fintech & Banking",
      region: "LEBANON",
      service: "Mobile App Development",
      isComingSoon: false,
    },
    {
      title: "AFRICELL Mobile Money",
      image: "/fintech-imgs/fintech4.webp",
      industry: "Telecom",
      region: "AFRICA",
      service: "Fintech Solutions",
      isComingSoon: false,
    },
    {
      title: "Patchi Sales App",
      image: "/appdev-imgs/appdev3.webp",
      industry: "Ecommerce, Retail & QSR",
      region: "LEBANON",
      service: "Mobile App Development",
      isComingSoon: false,
    },
    {
      title: "Debbas",
      image: "/appdev-imgs/appdev1.webp",
      industry: "Corporate & Enterprise",
      region: "SAUDI ARABIA",
      service: "Website Development",
      isComingSoon: false,
    },
    {
      title: "Life App",
      image: "/appdev-imgs/appdev2.webp",
      industry: "Healthcare & Wellness",
      region: "UK",
      service: "Mobile App Development",
      isComingSoon: false,
    },
    {
      title: "Enterprise Insights",
      image: "/appdev-imgs/appdev4.webp",
      industry: "Corporate & Enterprise",
      region: "USA",
      service: "AI & Data Intelligence",
      isComingSoon: false,
    },
    {
      title: "Courier Network",
      image: "/appdev-imgs/appdev5.webp",
      industry: "Transportation & Logistics",
      region: "UAE",
      service: "Mobile App Development",
      isComingSoon: false,
    },
    {
      title: "QSR Loyalty",
      image: "/appdev-imgs/appdev6.webp",
      industry: "Ecommerce, Retail & QSR",
      region: "KUWAIT",
      service: "Loyalty Program Services",
      isComingSoon: false,
    },
    {
      title: "Civic Portal",
      image: "/appdev-imgs/appdev7.webp",
      industry: "Government & NGO",
      region: "QATAR",
      service: "Website Development",
      isComingSoon: false,
    },
    {
      title: "Media Room",
      image: "/appdev-imgs/appdev8.webp",
      industry: "Media & Entertainment",
      region: "FRANCE",
      service: "UI/UX",
      isComingSoon: true,
    },
    {
      title: "Travel Concierge",
      image: "/fintech-imgs/fintech5.webp",
      industry: "Travel",
      region: "USA | UK | EU",
      service: "Emerging Tech & Innovation",
      isComingSoon: true,
    },
  ];

  const [activeTab, setActiveTab] =
    useState("Recent Projects");

  const [baseView, setBaseView] =
    useState("Recent Projects");

  const [direction, setDirection] =
    useState("down");

  const [previousMenu, setPreviousMenu] =
    useState(null);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [selectedFilter, setSelectedFilter] =
    useState(null);

  const [filterType, setFilterType] =
    useState(null);

  const previousTab = useRef(
    "Recent Projects"
  );

  const submenuTabs = [
    "By Industry",
    "By Region",
    "By Service",
  ];

  const hasSubmenu =
    submenuTabs.includes(activeTab);

  const resolveFilterType = (tab) => {
    if (tab === "By Industry") {
      return "industry";
    }

    if (tab === "By Region") {
      return "region";
    }

    if (tab === "By Service") {
      return "service";
    }

    return null;
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (submenuTabs.includes(tab)) {
      setFilterType(resolveFilterType(tab));
      setSelectedFilter(null);
      return;
    }

    setFilterType(null);
    setSelectedFilter(null);
    setBaseView(tab);
  };

  const baseProjects =
    baseView === "ALL Projects"
      ? projects
      : baseView === "Coming Soon"
      ? projects.filter(
          (project) => project.isComingSoon
        )
      : projects;

  const handleFilterSelect = (item) => {
    setSelectedFilter(item);

    if (baseView === "Recent Projects") {
      setBaseView("ALL Projects");
    }
  };

  const projectsToRender =
    selectedFilter && filterType
      ? baseProjects.filter((project) => {
          if (filterType === "industry") {
            return project.industry === selectedFilter;
          }

          if (filterType === "region") {
            return project.region === selectedFilter;
          }

          if (filterType === "service") {
            return project.service === selectedFilter;
          }

          return true;
        })
      : baseProjects;

  useEffect(() => {

    const currentTabName = activeTab;

    const previousTabName =
      previousTab.current;

    const currentIndex =
      submenuTabs.indexOf(
        currentTabName
      );

    const previousIndex =
      submenuTabs.indexOf(
        previousTabName
      );

    const currentHasSubmenu =
      currentIndex !== -1;

    const previousHasSubmenu =
      previousIndex !== -1;

    if (!currentHasSubmenu) {
      previousTab.current = activeTab;
      return;
    }

    if (previousHasSubmenu) {

      setPreviousMenu(
        previousTabName
      );

      if (
        currentIndex >
        previousIndex
      ) {
        setDirection("up");
      }

      else {
        setDirection("down");
      }
    }

    else {
      setPreviousMenu(null);
      setDirection("down");
    }

    setIsAnimating(true);

    const timer = setTimeout(() => {

      setIsAnimating(false);

      setPreviousMenu(null);

    }, 900);

    previousTab.current = activeTab;

    return () =>
      clearTimeout(timer);

  }, [activeTab]);

  return (
    <main id="AOS">

      <div className="max-w-[1500px] w-full px-[15px] mx-auto mt-[45px]">

        <div className="ml-[13px]">

          <WorkTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabClick}
          />

          <WorkSubmenu
            activeTab={activeTab}
            subCategories={subCategories}
            previousMenu={previousMenu}
            isAnimating={isAnimating}
            direction={direction}
            hasSubmenu={hasSubmenu}
            selectedFilter={selectedFilter}
            onSelectFilter={handleFilterSelect}
          />

          {baseView ===
          "Recent Projects" ? (
            <RecentProjectsSection />
          ) : (
            <section className="mt-[18px]">
              <div className="project-section-animate">
                <ProjectGrid
                  projects={projectsToRender}
                />
              </div>
            </section>
          )}

        </div>

      </div>

    </main>
  );
};

export default WorkCategoryMenu;