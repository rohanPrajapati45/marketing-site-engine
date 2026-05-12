import React from "react";
import AgencyTagLine from "../components/agency_components/AgencyTagLine";
import Statistics from "../components/agency_components/Statistics";
import WhatWeDo from "../components/agency_components/WhatWeDo";
import WorkWithClients from "../components/agency_components/WorkWithClients";

function Agency() {
  return (
    <div>
      <AgencyTagLine />
      <div className="h-screen w-full"></div>
      <Statistics />
      <WhatWeDo />
      <WorkWithClients />
    </div>
  );
}

export default Agency;
