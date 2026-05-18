import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import "./WorkCategoryMenu.css";

import WorkTabs from "./WorkTabs";

import WorkSubmenu from "./WorkSubmenu";

import ProjectGrid from "./ProjectGrid";

import RecentProjectsSection from "./RecentProjectsSection";



const WorkCategoryMenu = ({
  section,
}) => {

  const {
    tabs = [],
    subCategories = {},
    projects = [],
  } = section.data || {};



  const [activeTab, setActiveTab] =
    useState("");

  const [baseView, setBaseView] =
    useState("");

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



  const previousTab = useRef("");



  // DYNAMIC SUBMENU TABS
const submenuTabs = useMemo(
  () => Object.keys(subCategories),
  [subCategories]
);


  // SET DEFAULT TAB
  useEffect(() => {

    if (
      tabs.length > 0 &&
      !activeTab
    ) {

      setActiveTab(tabs[0]);

      setBaseView(tabs[0]);

    }

  }, [tabs, activeTab]);



  // CHECK SUBMENU
  const hasSubmenu =
    submenuTabs.includes(activeTab);



  // RESOLVE FILTER TYPE
  const resolveFilterType = (
    tab
  ) => {

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



  // HANDLE TAB CLICK
  const handleTabClick = (
    tab
  ) => {

    setActiveTab(tab);



    if (
      submenuTabs.includes(tab)
    ) {

      setFilterType(
        resolveFilterType(tab)
      );

      setSelectedFilter(null);

      return;
    }



    setFilterType(null);

    setSelectedFilter(null);

    setBaseView(tab);
  };



  // BASE PROJECTS
  const baseProjects =

    baseView ===
    "ALL Projects"

      ? projects

      : baseView ===
        "Coming Soon"

      ? projects.filter(
          (project) =>
            project.isComingSoon
        )

      : baseView ===
        "Recent Projects"

      ? projects.filter(
          (project) =>
            project.isRecentProject
        )

      : projects;



  // FILTER SELECT
  const handleFilterSelect = (
    item
  ) => {

    setSelectedFilter(item);



    if (
      baseView ===
      "Recent Projects"
    ) {

      setBaseView(
        "ALL Projects"
      );
    }
  };



  // FILTER PROJECTS
  const projectsToRender =

    selectedFilter &&
    filterType

      ? baseProjects.filter(
          (project) => {

            if (
              filterType ===
              "industry"
            ) {

              return (
                project.industry ===
                selectedFilter
              );
            }

            if (
              filterType ===
              "region"
            ) {

              return (
                project.region ===
                selectedFilter
              );
            }

            if (
              filterType ===
              "service"
            ) {

              return (
                project.service ===
                selectedFilter
              );
            }

            return true;
          }
        )

      : baseProjects;



  // MENU ANIMATION
  useEffect(() => {

    const currentTabName =
      activeTab;

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

      previousTab.current =
        activeTab;

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



    const timer =
      setTimeout(() => {

        setIsAnimating(false);

        setPreviousMenu(null);

      }, 900);



    previousTab.current =
      activeTab;



    return () =>
      clearTimeout(timer);

  }, [activeTab, submenuTabs]);



  return (

    <main id="AOS">

      <div className="max-w-[1500px] w-full px-[15px] mx-auto mt-[45px]">

        <div className="ml-[13px]">

          <WorkTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={
              handleTabClick
            }
          />



          <WorkSubmenu
            activeTab={activeTab}
            subCategories={
              subCategories
            }
            previousMenu={
              previousMenu
            }
            isAnimating={
              isAnimating
            }
            direction={direction}
            hasSubmenu={
              hasSubmenu
            }
            selectedFilter={
              selectedFilter
            }
            onSelectFilter={
              handleFilterSelect
            }
          />



          {baseView ===
          "Recent Projects" ? (

            <RecentProjectsSection
              projects={
                projectsToRender
              }
            />

          ) : (

            <section className="mt-[18px]">

              <div className="project-section-animate">

                <ProjectGrid
                  projects={
                    projectsToRender
                  }
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