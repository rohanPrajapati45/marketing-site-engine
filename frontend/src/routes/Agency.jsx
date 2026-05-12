import React from "react";
import AgencyTagLine from "../components/agency_components/AgencyTagLine";
import Statistics from "../components/agency_components/Statistics";

function Agency() {
  return (
    <div>
      <AgencyTagLine />
      <div className="h-screen w-full"></div>
      <Statistics />
    </div>
  );
}

export default Agency;
