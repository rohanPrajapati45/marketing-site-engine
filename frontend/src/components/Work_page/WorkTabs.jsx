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

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    
    const width = activeRect.width;
    const left = activeRect.left - containerRect.left + container.scrollLeft;

    setGliderStyle({
      width: `${width}px`,
      transform: `translateX(${left}px)`,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateGlider();

    const resizeObserver = new ResizeObserver(() => {
      updateGlider();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateGlider);

    return () => {
      resizeObserver.disconnect();
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
          title={tab}
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