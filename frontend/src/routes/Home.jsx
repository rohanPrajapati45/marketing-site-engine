// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import { getPageBySlug } from "../redux/slices/pageSlice";

import { componentMap } from "../utils/componentMap";

import SectionScrollBar from "../components/homepage/SectionScrollBar";

import { useTypingAnimation } from "../hooks/useTypingAnimation";
import { useVideoTheme } from "../hooks/useMediaTheme";

// eslint-disable-next-line no-unused-vars
const typingPrefix = "For";

function Home() {
  const dispatch = useDispatch();

  const { page, loading, error } = useSelector((state) => state.page);

  // FETCH PAGE
  useEffect(() => {
    dispatch(getPageBySlug("home"));
  }, [dispatch]);

  const pageSections = page?.sections || [];
  const sections = pageSections.map((section, index) => ({
    ...section,
    id:
      section.type === "hero-section" || section.type === "hero"
        ? "hero"
        : section.type === "cta-section" || section.type === "cta"
        ? "cta"
        : `project-${index}`,
    label:
      section.type === "hero-section" || section.type === "hero"
        ? "Hero"
        : section.type === "cta-section" || section.type === "cta"
        ? section.data?.heading || "Call To Action"
        : section.data?.clientName || `Project ${index}`,
  }));

  const [popupPhase, setPopupPhase] = useState("closed");

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const [themeTick, setThemeTick] = useState(0);

  const currentTheme = useMemo(() => {
    if (themeTick) {
      // `themeTick` is intentionally included so this memo re-evaluates when the theme attribute changes.
    }

    const sectionId = sections[activeSectionIndex]?.id;
    const sectionEl =
      typeof document !== "undefined"
        ? document.getElementById(sectionId)
        : null;

    return sectionEl?.dataset?.theme || sections[activeSectionIndex]?.theme || "dark";
  }, [activeSectionIndex, themeTick, sections]);

  const { typingRef, showHeroText } = useTypingAnimation();

  const gifRef = useRef(null);

  const heroVideoRef = useRef(null);

  const isSnapping = useRef(false);

  const sectionEls = useRef([]);

  const popupTimerRef = useRef(null);

  const heroTheme = useVideoTheme(heroVideoRef, {
    threshold: 145,
    sampleIntervalMs: 650,
    sampleSize: 32,
    intersectionThreshold: 0.6,
  });

  const outletContext = useOutletContext();

  // POPUP FUNCTIONS
  const openPopup = () => {
    if (popupPhase !== "closed") return;

    setPopupPhase("opening");

    popupTimerRef.current = window.setTimeout(() => {
      setPopupPhase("open");
    }, 600);
  };

  const closePopup = () => {
    if (popupPhase !== "open") return;

    setPopupPhase("closing");

    popupTimerRef.current = window.setTimeout(() => {
      setPopupPhase("closed");
    }, 600);
  };

  // NAV HIDE
  useEffect(() => {
    const setHideNav = outletContext?.setHideNav ?? (() => {});
    setHideNav(popupPhase !== "closed");

    return () => {
      setHideNav(false);
    };
  }, [popupPhase, outletContext]);

  // THEME OBSERVER
  useEffect(() => {
    const sectionId = sections[activeSectionIndex]?.id;

    const sectionEl =
      typeof document !== "undefined"
        ? document.getElementById(sectionId)
        : null;

    if (!sectionEl) return;

    const observer = new MutationObserver(() => {
      setThemeTick((tick) => tick + 1);
    });

    observer.observe(sectionEl, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [activeSectionIndex, sections]);

  // HTML DATA THEME
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.homeTheme = currentTheme;
  }, [currentTheme]);

  // HIDE DEFAULT BROWSER SCROLLBAR ON HOME
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");

    return () => {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  // CLEANUP
  useEffect(() => {
    return () => {
      if (popupTimerRef.current) {
        window.clearTimeout(popupTimerRef.current);
      }
    };
  }, []);

  // SCROLLBAR CLICK
  const handleSectionClick = (index) => {
    setActiveSectionIndex(index);

    document.getElementById(sections[index]?.id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // ACTIVE SECTION OBSERVER
  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex(
              (section) => section.id === entry.target.id,
            );

            if (index !== -1) {
              setActiveSectionIndex(index);
            }
          }
        });
      },
      {
        threshold: 0.55,
      },
    );

    const observed = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    observed.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  // SNAP SCROLL
  useEffect(() => {
    if (!sections.length) return;

    let rafId = null;

    function collectSections() {
      sectionEls.current = sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean);
    }

    collectSections();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animatedScrollTo(targetY, duration) {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      const startY = window.scrollY;

      const distance = targetY - startY;

      if (Math.abs(distance) < 1) {
        isSnapping.current = false;
        return;
      }

      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const eased = easeOutCubic(progress);

        window.scrollTo(0, startY + distance * eased);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          isSnapping.current = false;
          rafId = null;
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function snapToSlide(index) {
      collectSections();

      const els = sectionEls.current;

      if (index < 0 || index >= els.length) return;

      isSnapping.current = true;

      const targetY = els[index].offsetTop;

      animatedScrollTo(targetY, 1200);
    }

    function getCurrentIndex() {
      collectSections();

      const els = sectionEls.current;
      if (!els.length) return 0;

      let closestIndex = 0;
      let closestDistance = Math.abs(els[0].getBoundingClientRect().top);

      for (let i = 1; i < els.length; i++) {
        const distance = Math.abs(els[i].getBoundingClientRect().top);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      return closestIndex;
    }

    const navigateToSection = (direction) => {
      if (isSnapping.current) return;

      const currentIndex = getCurrentIndex();

      const targetIndex = Math.min(
        sectionEls.current.length - 1,
        Math.max(0, currentIndex + direction),
      );

      if (targetIndex === currentIndex) return;

      snapToSlide(targetIndex);
    };

    function onWheel(event) {
      if (isSnapping.current) {
        event.preventDefault();
        return;
      }

      let delta = event.deltaY;
      if (event.deltaMode === 1) {
        delta *= 10;
      }

      if (Math.abs(delta) < 4) return;

      event.preventDefault();
      event.stopPropagation();
      navigateToSection(delta > 0 ? 1 : -1);
    }

    function onKeyDown(event) {
      const key = event.key;
      const code = event.code;

      if (
        key === "ArrowDown" ||
        key === "ArrowRight" ||
        key === "PageDown" ||
        key === " " ||
        key === "Spacebar" ||
        code === "Space"
      ) {
        event.preventDefault();
        event.stopPropagation();
        navigateToSection(1);
      } else if (
        key === "ArrowUp" ||
        key === "ArrowLeft" ||
        key === "PageUp"
      ) {
        event.preventDefault();
        event.stopPropagation();
        navigateToSection(-1);
      } else if (key === "Home") {
        event.preventDefault();
        event.stopPropagation();

        if (!isSnapping.current) {
          snapToSlide(0);
        }
      } else if (key === "End") {
        event.preventDefault();
        event.stopPropagation();

        if (!isSnapping.current) {
          snapToSlide(sectionEls.current.length - 1);
        }
      }
    }

    let touchStartY = 0;

    let touchStartTime = 0;

    function onTouchStart(event) {
      touchStartY = event.touches[0].clientY;

      touchStartTime = Date.now();
    }

    function onTouchMove(event) {
      if (isSnapping.current) {
        event.preventDefault();
      }
    }

    function onTouchEnd(event) {
      if (isSnapping.current) return;

      const touchEndY = event.changedTouches[0].clientY;

      const diff = touchStartY - touchEndY;

      const elapsed = Date.now() - touchStartTime;

      if (Math.abs(diff) > 40 && elapsed < 600) {
        navigateToSection(diff > 0 ? 1 : -1);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    window.addEventListener("keydown", onKeyDown);

    window.addEventListener("touchstart", onTouchStart, { passive: true });

    window.addEventListener("touchmove", onTouchMove, { passive: false });

    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);

      window.removeEventListener("keydown", onKeyDown);

      window.removeEventListener("touchstart", onTouchStart);

      window.removeEventListener("touchmove", onTouchMove);

      window.removeEventListener("touchend", onTouchEnd);

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [sections]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // NO PAGE
  if (!page) {
    return null;
  }

  return (
    <div className="home-page">
      {/* SCROLL BAR */}
      <SectionScrollBar
        sections={sections}
        activeIndex={activeSectionIndex}
        onDotClick={handleSectionClick}
        theme={currentTheme}
      />

      {/* DYNAMIC SECTIONS */}
      {sections.map((section) => {
        const Component = section.data?.cardType
          ? componentMap[section.data.cardType]
          : componentMap[section.type];

        if (!Component) {
          console.warn(
            `No component found for ${section.data?.cardType || section.type}`,
          );

          return null;
        }

        return (
          <Component
            section={section}
            heroTheme={heroTheme}
            showHeroText={showHeroText}
            typingRef={typingRef}
            popupPhase={popupPhase}
            openPopup={openPopup}
            closePopup={closePopup}
            gifRef={gifRef}
            heroVideoRef={heroVideoRef}
          />
        );
      })}
    </div>
  );
}

export default Home;
