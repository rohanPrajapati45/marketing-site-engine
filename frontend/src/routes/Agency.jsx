import React from "react";
import AgencyTagLine from "../components/agency_components/AgencyTagLine";
import Statistics from "../components/agency_components/Statistics";
import WhatWeDo from "../components/agency_components/WhatWeDo";
import WorkWithClients from "../components/agency_components/WorkWithClients";
import HowWeDo from "../components/agency_components/HowWeDo";
import ManagementTeam from "../components/agency_components/ManagementTeam";
import JoinOurTeam from "../components/agency_components/JoinOurTeam";
import TeamActivities from "../components/agency_components/TeamActivities";

function Agency() {
  return (
    <div>
      <AgencyTagLine />
      <div className="h-screen w-full"></div>
      <Statistics />
      <WhatWeDo />
      <WorkWithClients />
      <HowWeDo />
      <ManagementTeam />
      <JoinOurTeam />
      <TeamActivities />
    </div>
  );
}

export default Agency;
