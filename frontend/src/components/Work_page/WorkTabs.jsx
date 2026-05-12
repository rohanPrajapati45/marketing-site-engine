import React from "react";
import "./WorkTabs.css";

const WorkTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  const activeIndex = Math.max(
    tabs.indexOf(activeTab),
    0
  );

  return (
    <div className="tabs">

      {tabs.map((tab, index) => (

        <button
          key={index}
          onClick={() => setActiveTab(tab)}
          className={`tab-label ${
            activeTab === tab
              ? "active"
              : ""
          }`}
        >
          {tab}
        </button>

      ))}

      {/* GLIDER */}
      <div
        className="glider"
        style={{
          transform: `translateX(${activeIndex * 135}px)`,
        }}
      />

    </div>
  );
};

export default WorkTabs;