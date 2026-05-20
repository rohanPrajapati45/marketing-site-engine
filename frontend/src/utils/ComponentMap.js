// agencyComponentMap.js

import AgencyTagLine from "../components/agency_components/AgencyTagLine";
import Empty from "../components/agency_components/Empty";
import Expertise from "../components/agency_components/Expertise";
import HowWeDo from "../components/agency_components/HowWeDo";
import Industries from "../components/agency_components/Industries";
import JoinOurTeam from "../components/agency_components/JoinOurTeam";
import LetsTransform from "../components/agency_components/LetsTransform";
import ManagementTeam from "../components/agency_components/ManagementTeam";
import Partners from "../components/agency_components/Partners";
import Statistics from "../components/agency_components/Statistics";
import TeamActivities from "../components/agency_components/TeamActivities";
import WhatWeDo from "../components/agency_components/WhatWeDo";
import WorkWithClients from "../components/agency_components/WorkWithClients";
import HeroSection from "../components/homepage/hero/HeroSection";
import ProjectsSection from "../components/homepage/ProjectsSection";
import SectionScrollBar from "../components/homepage/SectionScrollBar";
import StickySidebarSection from "../components/what-we-do/StickySidebarSection";
import WorkCategoryMenu from "../components/Work_page/WorkCategoryMenu";
import SoluctionSection from "../components/solutions/SolutionSection";
import Branch from "../components/Contact/Branch";
import ContactInfo from "../components/Contact/ContactInfo";
import BlogCards from "../components/blog_components/BlogCards";

export const componentMap = {

  // SECTION TYPES
  "slide-gallery":JoinOurTeam,
  "gallery":TeamActivities,
  "tagline":AgencyTagLine,
  "cta":LetsTransform,
  "empty":Empty,
  // CARD TYPES
  "stat-card": Statistics,
  "std-card": HowWeDo,
  "team-card": ManagementTeam,
  "small-logo-card": WorkWithClients,
  "mid-logo-card": Expertise,
  "large-logo-card": Partners,
  "max5liner-card": WhatWeDo,
  "unique-card":Industries,

  //home page
  "hero-section":HeroSection,
  "project-section":ProjectsSection,

  //what-we-do
  "sticky-services": StickySidebarSection,

  //work page
  "work-category-menu": WorkCategoryMenu,

  //solutions page
  "solution-section": SoluctionSection,

  //contact page
  "contact-hero": ContactInfo,
  "branch-section": Branch,
  "content-blog": BlogCards,
};