import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./WorkTabs.css";

const WorkTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  const activeIndex = useMemo(
    () => Math.max(tabs.indexOf(activeTab), 0),
    [tabs, activeTab],
  );

  const containerRef = useRef(null);
  const tabRefs = useRef([]);
  const [gliderStyle, setGliderStyle] = useState({
    width: "0px",
    transform: "translateX(0px)",
  });

  const updateGlider = useCallback(() => {
    const container = containerRef.current;
    const activeEl = tabRefs.current[activeIndex];

    if (!container || !activeEl) return;

    const width = activeEl.offsetWidth;
    const left = activeEl.offsetLeft;

    setGliderStyle({
      width: `${width}px`,
      transform: `translateX(${left}px)`,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateGlider();

    window.addEventListener("resize", updateGlider);

    return () => {
      window.removeEventListener("resize", updateGlider);
    };
  }, [updateGlider]);

  return (
    <div className="tabs" ref={containerRef}>

      {tabs.map((tab, index) => (

        <button
          key={index}
          onClick={() => setActiveTab(tab)}
          className={`tab-label ${
            activeTab === tab
              ? "active"
              : ""
          }`}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
        >
          {tab}
        </button>

      ))}

      {/* GLIDER */}
      <div className="glider" style={gliderStyle} />

    </div>
  );
};

export default WorkTabs;