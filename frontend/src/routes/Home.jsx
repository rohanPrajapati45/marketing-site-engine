import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProjectsSection from '../components/homepage/ProjectsSection';
import CTASection      from '../components/homepage/CTASection';
import SectionScrollBar from '../components/homepage/SectionScrollBar';
import Footer          from '../components/Footer';
import HeroSection     from '../components/homepage/hero/HeroSection';
import { useTypingAnimation } from '../hooks/useTypingAnimation';
import { useHomeData }        from '../hooks/useHomeData';    // ← NEW
import { useVideoTheme }      from '../hooks/useMediaTheme';

const typingPrefix = "For";

function Home() {
  const [popupPhase, setPopupPhase]               = useState("closed");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [themeTick, setThemeTick]                 = useState(0);

  // ── FETCH PROJECTS FROM API (or fallback) ──
  const { projects, loading } = useHomeData();

  // ── BUILD sections[] DYNAMICALLY from projects ──
  // hero is always first, cta is always last
  // project sections are built from API data
  // If 2 projects → sections has 4 items
  // If 7 projects → sections has 9 items
  // SectionScrollBar, scroll snap, keyboard nav
  // all automatically adjust — no other changes needed
  const sections = useMemo(() => {
    const projectSections = projects.map((project, index) => ({
      id: `project-${index + 1}`,       // matches section id in ProjectsSection
      label: project.clientName,         // shown in scrollbar tooltip
      theme: 'dark',                     // runtime detected by useVideoTheme
    }));

    return [
      { id: 'hero', label: 'Hero',            theme: 'dark'  },
      ...projectSections,
      { id: 'cta',  label: "Let's Transform", theme: 'light' },
    ];
  }, [projects]);

  // ── currentTheme logic unchanged — uses dynamic sections ──
  const currentTheme = useMemo(() => {
    const sectionId = sections[activeSectionIndex]?.id;
    const sectionEl = typeof document !== 'undefined'
      ? document.getElementById(sectionId)
      : null;
    return sectionEl?.dataset?.theme
      || sections[activeSectionIndex]?.theme
      || 'dark';
  }, [activeSectionIndex, themeTick, sections]);

  const { typingRef, showHeroText } = useTypingAnimation();
  const gifRef        = useRef(null);
  const heroVideoRef  = useRef(null);
  const isSnapping    = useRef(false);
  const sectionEls    = useRef([]);
  const popupTimerRef = useRef(null);

  const heroTheme = useVideoTheme(heroVideoRef, {
    threshold: 145,
    sampleIntervalMs: 650,
    sampleSize: 32,
    intersectionThreshold: 0.6,
  });

  const outletContext = useOutletContext();
  const setHideNav    = outletContext?.setHideNav ?? (() => {});

  const openPopup = () => {
    if (popupPhase !== "closed") return;
    setPopupPhase("opening");
    popupTimerRef.current = window.setTimeout(() => setPopupPhase("open"), 600);
  };

  const closePopup = () => {
    if (popupPhase !== "open") return;
    setPopupPhase("closing");
    popupTimerRef.current = window.setTimeout(() => setPopupPhase("closed"), 600);
  };

  useEffect(() => {
    setHideNav(popupPhase !== "closed");
    return () => setHideNav(false);
  }, [popupPhase, setHideNav]);

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) window.clearTimeout(popupTimerRef.current);
    };
  }, []);

  // ── Theme mutation observer ──
  useEffect(() => {
    const sectionId = sections[activeSectionIndex]?.id;
    const sectionEl = document.getElementById(sectionId);
    if (!sectionEl) return;
    const observer = new MutationObserver(() => setThemeTick(t => t + 1));
    observer.observe(sectionEl, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [activeSectionIndex, sections]);

  useEffect(() => {
    document.documentElement.dataset.homeTheme = currentTheme;
  }, [currentTheme]);

  useEffect(() => {
    return () => { delete document.documentElement.dataset.homeTheme; };
  }, []);

  const handleSectionClick = (index) => {
    setActiveSectionIndex(index);
    document.getElementById(sections[index]?.id)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── IntersectionObserver re-runs when sections changes ──
  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex(s => s.id === entry.target.id);
            if (index !== -1) setActiveSectionIndex(index);
          }
        });
      },
      { threshold: 0.55 }
    );

    const observed = sections
      .map(s => document.getElementById(s.id))
      .filter(Boolean);

    observed.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]); // ← re-run when sections changes (i.e. after projects load)

  // ── Scroll snap logic — re-runs when sections changes ──
  useEffect(() => {
    if (!sections.length) return;
    let rafId = null;

    function collectSections() {
      sectionEls.current = sections
        .map(s => document.getElementById(s.id))
        .filter(Boolean);
    }
    collectSections();

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function animatedScrollTo(targetY, duration) {
      if (rafId) cancelAnimationFrame(rafId);
      const startY   = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 1) { isSnapping.current = false; return; }
      const startTime = performance.now();

      function step(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeOutCubic(progress));
        if (progress < 1) { rafId = requestAnimationFrame(step); }
        else { isSnapping.current = false; rafId = null; }
      }
      rafId = requestAnimationFrame(step);
    }

    function snapToSlide(index) {
      collectSections();
      const els = sectionEls.current;
      if (index < 0 || index >= els.length) return;
      isSnapping.current = true;
      animatedScrollTo(els[index].offsetTop, 1200);
    }

    function getCurrentIndex() {
      collectSections();
      const scrollY = window.scrollY;
      const els     = sectionEls.current;
      if (!els.length) return 0;
      let idx = 0;
      for (let i = els.length - 1; i >= 0; i--) {
        if (scrollY >= els[i].offsetTop - window.innerHeight / 3) {
          idx = i; break;
        }
      }
      return idx;
    }

    function navigateToSection(direction) {
      if (isSnapping.current) return;
      const cur    = getCurrentIndex();
      const target = Math.min(
        sectionEls.current.length - 1,
        Math.max(0, cur + direction)
      );
      if (target !== cur) snapToSlide(target);
    }

    function onWheel(e) {
      e.preventDefault();
      if (isSnapping.current) return;
      if (Math.abs(e.deltaY) < 2) return;
      navigateToSection(e.deltaY > 0 ? 1 : -1);
    }

    function onKeyDown(e) {
      if (['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)) {
        e.preventDefault(); navigateToSection(1);
      } else if (['ArrowUp','ArrowLeft','PageUp'].includes(e.key)) {
        e.preventDefault(); navigateToSection(-1);
      } else if (e.key === 'Home') {
        e.preventDefault(); if (!isSnapping.current) snapToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        if (!isSnapping.current) snapToSlide(sectionEls.current.length - 1);
      }
    }

    let touchStartY = 0, touchStartTime = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };
    const onTouchMove = (e) => {
      if (isSnapping.current) e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (isSnapping.current) return;
      const diff    = touchStartY - e.changedTouches[0].clientY;
      const elapsed = Date.now() - touchStartTime;
      if (Math.abs(diff) > 40 && elapsed < 600)
        navigateToSection(diff > 0 ? 1 : -1);
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('keydown',    onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('keydown',    onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onTouchEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sections]); // ← re-run when sections changes

  // ── Show loading state while fetching ──
  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #333',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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

      {/* sections is now dynamic — auto-adjusts to project count */}
      <SectionScrollBar
        sections={sections}
        activeIndex={activeSectionIndex}
        onDotClick={handleSectionClick}
        theme={currentTheme}
      />

      {/* projects passed as prop — no hardcoded data inside */}
      <ProjectsSection projects={projects} />

      <section className="home-end-section" id="cta" data-theme="light">
        <CTASection />
        <Footer />
      </section>
    </div>
  );
}

export default Home;