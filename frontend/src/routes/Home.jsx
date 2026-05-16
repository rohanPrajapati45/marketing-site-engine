import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProjectsSection from '../components/homepage/ProjectsSection';
import CTASection from '../components/homepage/CTASection';
import SectionScrollBar from '../components/homepage/SectionScrollBar';
import Footer from '../components/Footer';
import HeroSection from '../components/homepage/hero/HeroSection';
import { useTypingAnimation } from '../hooks/useTypingAnimation';
import { sections } from '../hooks/homeData';
import { useVideoTheme } from '../hooks/useMediaTheme';

const typingPrefix = "For";

function Home() {
  const [popupPhase, setPopupPhase] = useState("closed");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [themeTick, setThemeTick] = useState(0);
  const currentTheme = useMemo(() => {
    const sectionId = sections[activeSectionIndex]?.id;
    const sectionEl = typeof document !== 'undefined' ? document.getElementById(sectionId) : null;
    return sectionEl?.dataset?.theme || sections[activeSectionIndex]?.theme || 'dark';
  }, [activeSectionIndex, themeTick]);
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
  const setHideNav = outletContext?.setHideNav ?? (() => {});

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

  useEffect(() => {
    setHideNav(popupPhase !== "closed");
    return () => {
      setHideNav(false);
    };
  }, [popupPhase, setHideNav]);

  useEffect(() => {
    const sectionId = sections[activeSectionIndex]?.id;
    const sectionEl = typeof document !== 'undefined' ? document.getElementById(sectionId) : null;
    if (!sectionEl) return;

    const observer = new MutationObserver(() => {
      setThemeTick((tick) => tick + 1);
    });
    observer.observe(sectionEl, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [activeSectionIndex]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.homeTheme = currentTheme;
  }, [currentTheme]);

  useEffect(() => {
    return () => {
      if (typeof document === 'undefined') return;
      delete document.documentElement.dataset.homeTheme;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) window.clearTimeout(popupTimerRef.current);
    };
  }, []);

  const handleSectionClick = (index) => {
    setActiveSectionIndex(index);
    document.getElementById(sections[index]?.id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((section) => section.id === entry.target.id);
            if (index !== -1) setActiveSectionIndex(index);
          }
        });
      },
      { threshold: 0.55 }
    );

    const observed = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rafId = null;

    /* ── re-collect section elements (handles async renders) ── */
    function collectSections() {
      sectionEls.current = sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean);
    }
    collectSections();

    /* ── easeOutCubic — same as reference ── */
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    /* ── animated scroll with easing (cancelable) ── */
    function animatedScrollTo(targetY, duration) {
      if (rafId) cancelAnimationFrame(rafId);
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

    /* ── snap to a specific section index ── */
    function snapToSlide(index) {
      collectSections();
      const els = sectionEls.current;
      if (index < 0 || index >= els.length) return;
      isSnapping.current = true;
      const targetY = els[index].offsetTop;
      animatedScrollTo(targetY, 1200);
    }

    /* ── find which section is currently in view ── */
    function getCurrentIndex() {
      collectSections();
      const scrollY = window.scrollY;
      const els = sectionEls.current;
      if (!els.length) return 0;
      let idx = 0;
      for (let i = els.length - 1; i >= 0; i--) {
        if (scrollY >= els[i].offsetTop - window.innerHeight / 3) {
          idx = i;
          break;
        }
      }
      return idx;
    }

    /* ── shared navigation helper ── */
    function navigateToSection(direction) {
      if (isSnapping.current) return false;
      const currentIndex = getCurrentIndex();
      const targetIndex = Math.min(
        sectionEls.current.length - 1,
        Math.max(0, direction > 0 ? currentIndex + 1 : currentIndex - 1)
      );
      if (targetIndex !== currentIndex) {
        snapToSlide(targetIndex);
        return true;
      }
      return false;
    }

    /* ── WHEEL handler (mouse wheel + trackpad) ── */
    function onWheel(event) {
      event.preventDefault();
      if (isSnapping.current) return;

      const delta = event.deltaY;
      if (Math.abs(delta) < 2) return;

      navigateToSection(delta > 0 ? 1 : -1);
    }

    /* ── KEYBOARD handler (arrows, PageUp/Down, Space, Home/End) ── */
    function onKeyDown(event) {
      const key = event.key;

      if (key === 'ArrowDown' || key === 'ArrowRight' || key === 'PageDown' || key === ' ') {
        event.preventDefault();
        navigateToSection(1);
      } else if (key === 'ArrowUp' || key === 'ArrowLeft' || key === 'PageUp') {
        event.preventDefault();
        navigateToSection(-1);
      } else if (key === 'Home') {
        event.preventDefault();
        if (!isSnapping.current) snapToSlide(0);
      } else if (key === 'End') {
        event.preventDefault();
        if (!isSnapping.current) snapToSlide(sectionEls.current.length - 1);
      }
    }

    /* ── TOUCH handlers (swipe gestures for mobile / trackpad) ── */
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

      /* require a meaningful swipe: >40px within 600ms */
      if (Math.abs(diff) > 40 && elapsed < 600) {
        navigateToSection(diff > 0 ? 1 : -1);
      }
    }

    /* ── attach all events ── */
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    /* ── cleanup on unmount ── */
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="home-page">
      <HeroSection
        heroTheme={heroTheme}
        showHeroText={showHeroText}
        typingPrefix={typingPrefix}
        typingRef={typingRef}
        popupPhase={popupPhase}
        openPopup={openPopup}
        closePopup={closePopup}
        gifRef={gifRef}
        heroVideoRef={heroVideoRef}
      />

      <SectionScrollBar
        sections={sections}
        activeIndex={activeSectionIndex}
        onDotClick={handleSectionClick}
        theme={currentTheme}
      />

      <ProjectsSection />

      <section className="home-end-section" id="cta" data-theme="light">
        <CTASection />
        <Footer />
      </section>
    </div>
  );
}

export default Home;
