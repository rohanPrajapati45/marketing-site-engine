import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProjectsSection from '../components/homepage/ProjectsSection';
import CTASection from '../components/homepage/CTASection';
import SectionScrollBar from '../components/homepage/SectionScrollBar';
import Footer from '../components/Footer';
import { useVideoTheme } from '../hooks/useMediaTheme';

const typedTexts = [
  "E-Commerce Solutions",
  "Mobile Applications",
  "Fintech Platforms",
  "Brand Identity",
  "UI/UX Design",
  "Healthcare Technology",
  "AI & Data Intelligence",
];

const typingPrefix = "For";

const sections = [
  { id: 'hero', label: 'Hero', theme: 'dark' },
  { id: 'project-1', label: 'OMT', theme: 'dark' },
  { id: 'project-2', label: 'Zain', theme: 'dark' },
  { id: 'project-3', label: 'Z&V', theme: 'dark' },
  { id: 'project-4', label: 'BOKRA', theme: 'dark' },
  { id: 'project-5', label: 'CLIENT 5', theme: 'dark' },
  { id: 'project-6', label: 'CLIENT 6', theme: 'dark' },
  { id: 'project-7', label: 'CLIENT 7', theme: 'dark' },
  { id: 'cta', label: "Let's Transform", theme: 'light' },
];

function Home() {
  const [showHeroText, setShowHeroText] = useState(false);
  const [popupPhase, setPopupPhase] = useState("closed");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [themeTick, setThemeTick] = useState(0);
  const currentTheme = useMemo(() => {
    const sectionId = sections[activeSectionIndex]?.id;
    const sectionEl = typeof document !== 'undefined' ? document.getElementById(sectionId) : null;
    return sectionEl?.dataset?.theme || sections[activeSectionIndex]?.theme || 'dark';
  }, [activeSectionIndex, themeTick]);
  const typingRef = useRef(null);
  const gifRef = useRef(null);
  const timerRef = useRef(null);
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
    const words = typedTexts;
    let wordIndex = 0;
    let charIndex = 0;
    let currentText = "";
    let isDeleting = false;

    const typeEffect = () => {
      const typingEl = typingRef.current;
      if (!typingEl) return;

      const currentWord = words[wordIndex];

      if (!isDeleting) {
        currentText = currentWord.substring(0, charIndex + 1);
        charIndex += 1;
      } else {
        currentText = currentWord.substring(0, charIndex - 1);
        charIndex -= 1;
      }

      typingEl.textContent = currentText;

      let speed = isDeleting ? 60 : 120;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }

      timerRef.current = window.setTimeout(typeEffect, speed);
    };

    timerRef.current = window.setTimeout(() => {
      setShowHeroText(true);
      typeEffect();
    }, 2400);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
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
    <>
      <section id="hero" data-theme={heroTheme}>
        <style>{`
        html, body {
          min-height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        body::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        body {
          overscroll-behavior: none;
        }

        footer {
          min-height: auto;
        }

        section[id] {
          opacity: 1;
          transform: none;
          transition: none;
          will-change: auto;
        }

        .home-end-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .home-end-section .cta-section {
          flex: 1;
          min-height: auto !important;
        }



        .home-end-section footer {
          margin-top: auto;
        }

        #hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
        }

        .hero-video-wrap {
          position: absolute;
          inset: 0;
        }
        .hero-video-wrap video {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-text {
          position: absolute;
          z-index: 2;
          left: 52px;
          top: 50%;
          transform: translateY(calc(-50% + 24px));
          max-width: 620px;
          padding-top: 64px;
          opacity: 0;
          transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
        }
        .hero-text.show {
          opacity: 1;
          transform: translateY(-50%);
        }


        .hero-headline {
          font-family: 'Exo', sans-serif;
          font-size: 2.8rem;
          font-weight: 550;
          line-height: 1.2;
          color: #fff;
          margin: 0;
          text-align: left;
          outline: none;
        }

        /* ── TYPING ROW ── */
        .typing-line {
          display: flex;
          align-items: center;
          gap: 0;
          margin-top: 7px;
          margin-bottom: 28px;
          line-height: 85px;
        }

        /* "For" label — same font and size as the typed text */
        .typing-for {
          font-family: 'Exo', sans-serif;
          font-size: 2.775rem;
          font-weight: 550;
          line-height: 85px;
          color: #fff;
          margin-right:1px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* The typed word — black background, white text, exactly like tedmob */
        .typed-text {
          font-family: 'Exo', sans-serif;
          font-size: 2.775rem;
          font-weight: 600;
          line-height: 85px;
          color: #fff;
          background-color: #000000;
          padding: 0 2px;
          outline: none;
          display: inline-block;
          min-width: 4px;
        }

        /* Blinking cursor — separate span, matches tedmob typed-cursor */
        .typed-cursor {
          font-family: 'Exo', sans-serif;
          font-size: 2.775rem;
          font-weight: 600;
          line-height: 85px;
          color: #fff;
          animation: typedjsBlink 0.7s infinite;
          display: inline-block;
          margin-left: 2px;
        }

        @keyframes typedjsBlink {
          0%   { opacity: 1; }
          50%  { opacity: 0; }
          100% { opacity: 1; }
        }

        .scroll-hint {
          position: absolute;
          bottom: 28px;
          right: 48px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.4);
        }
        .scroll-hint span {
          font-family: 'Barlow', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          writing-mode: vertical-rl;
        }
        .scroll-hint::after {
          content: '';
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.35);
          animation: scrollBlink 2s ease-in-out infinite;
        }

        /* ── GIF BUTTON — bottom right of hero ── */
        .video-hover {
          position: absolute;
          bottom: 70px;
          right: 70px;
          width: 100px;
          text-align: center;
          z-index: 10;
          cursor: pointer;
        }

        .video-hover img {
          width: 205px;
          height:95px;
          object-fit: cover;
          display: block;
          margin: 0 auto 6px auto;
          filter: brightness(0.9);
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .video-hover:hover img {
          transform: scale(1.1);
          filter: brightness(1);
        }

        .video-hover small {
          font-family: 'Exo', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.5px;
          white-space: nowrap;
          display: block;
          line-height: 1.5;
        }

        html[data-home-theme="light"] .hero-headline,
        html[data-home-theme="light"] .typing-for,
        html[data-home-theme="light"] .typed-text,
        html[data-home-theme="light"] .typed-cursor,
        html[data-home-theme="light"] .video-hover small {
          color: #111 !important;
        }

        html[data-home-theme="light"] .typed-text {
          background-color: transparent !important;
        }

        html[data-home-theme="light"] .scroll-hint {
          color: rgba(0,0,0,0.7);
        }

        html[data-home-theme="light"] .scroll-hint::after {
          background: rgba(0,0,0,0.35);
        }

        html[data-home-theme="light"] .slide-heading h2,
        html[data-home-theme="light"] .slide-heading p,
        html[data-home-theme="light"] .client-name,
        html[data-home-theme="light"] .client-country,
        html[data-home-theme="light"] .slide-counter {
          color: #111 !important;
        }

        html[data-home-theme="light"] .btn-case-study {
          border-color: rgba(0,0,0,0.92) !important;
          color: #111 !important;
        }

        html[data-home-theme="light"] .btn-case-study::before {
          background: rgba(0,0,0,0.08) !important;
        }

        html[data-home-theme="light"] .btn-case-study:hover::before {
          background: rgba(0,0,0,0.15);
        }

        html[data-home-theme="light"] .section-scrollbar .scrollbar-line {
          background: rgba(0, 0, 0, 0.35) !important;
        }

        html[data-home-theme="light"] .section-scrollbar .scrollbar-item.is-active .scrollbar-line {
          background: #111 !important;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
        }

        html[data-home-theme="light"] .section-scrollbar .scrollbar-item:not(.is-active):hover .scrollbar-line {
          background: rgba(0,0,0,0.65) !important;
        }

        /* ── FULLSCREEN OVERLAY WRAPPER ── */
        .video-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .video-popup-overlay.is-active {
          pointer-events: all;
        }

        /* ── WHITE FILL LAYER — expands from GIF corner ── */
        /*
          clip-path circle() animates from a tiny circle at the
          bottom-right corner (where the GIF lives) outward to
          cover the entire screen, then back on close.

          Origin point is bottom-right: calc(100% - 55px) calc(100% - 55px)
          This matches the center of the 50px GIF at bottom:30px right:30px
          (30px from edge + 25px = center of GIF = 55px from corner)
        */
        .popup-fill {
          position: fixed;
          inset: 0;
          background: #ffffff;
          clip-path: circle(0% at calc(100% - 55px) calc(100% - 55px));
          transition: clip-path 1s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 9998;
        }

        .popup-fill.expanding {
          clip-path: circle(150% at calc(100% - 55px) calc(100% - 55px));
        }

        .popup-fill.collapsing {
          clip-path: circle(0% at calc(100% - 55px) calc(100% - 55px));
          transition: clip-path 0.55s cubic-bezier(0.76, 0, 0.24, 1);
        }

        /* ── VIDEO CONTENT BOX ── */
        .video-popup-content {
          position: relative;
          width: 90vw;
          max-width: 960px;
          background: #000;
          z-index: 9999;
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 0.3s ease 0.35s, transform 0.3s ease 0.35s;
          pointer-events: none;
        }

        .video-popup-content.visible {
          opacity: 1;
          transform: scale(1);
          pointer-events: all;
        }

        .video-popup-content.hiding {
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        /* ── VIDEO INSIDE POPUP ── */
        .video-popup-content video {
          width: 100%;
          height: auto;
          display: block;
        }

        /* ── CLOSE BUTTON ── */
        .video-popup-close {
          position: absolute;
          top: -48px;
          right: 0;
          background: transparent;
          border: none;
          color: #111;
          font-size: 36px;
          font-weight: 300;
          line-height: 1;
          cursor: pointer;
          padding: 0 4px;
          transition: transform 0.25s ease, opacity 0.25s ease;
          z-index: 10000;
        }

        .video-popup-close:hover {
          transform: rotate(90deg) scale(1.15);
          opacity: 0.5;
        }

        @keyframes scrollBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @media (max-width: 900px) {
          .hero-text {
            left: 0;
            padding: 0 24px;
            max-width: 100%;
            box-sizing: border-box;
          }
          .scroll-hint { display: none; }
        }
      `}</style>

      <div className="hero-video-wrap">
        <video
          ref={heroVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Hero background video"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={`hero-text ${showHeroText ? "show" : ""}`}>
        <h2 className="hero-headline">
          "DIGITAL TRANSFORMATION"<br />
        full-Service Technology<br />
          & Creative Agency
        </h2>

        <div className="typing-line">
          <span className="typing-for">{typingPrefix}:&nbsp;</span>
          <span className="typed-text" ref={typingRef}></span>
          <span className="typed-cursor" aria-hidden="true">|</span>
        </div>



      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
      </div>

      {/* ── GIF TRIGGER BUTTON ── */}
      <div className="video-hover" ref={gifRef} onClick={openPopup}>
        <img src="/images/tedmob-gif.gif" alt="Play Showreel" />
        <small>Play Our </small>
        <small>Showreel</small>
      </div>

      {/* ── WHITE FILL LAYER (always in DOM, animates via class) ── */}
      <div
        className={`popup-fill
          ${popupPhase === 'opening' || popupPhase === 'open' ? 'expanding' : ''}
          ${popupPhase === 'closing' ? 'collapsing' : ''}
        `}
      />

      {/* ── OVERLAY + VIDEO CONTENT ── */}
      {popupPhase !== 'closed' && (
        <div
          className={`video-popup-overlay ${popupPhase !== 'closed' ? 'is-active' : ''}`}
          onClick={closePopup}
        >
          <div
            className={`video-popup-content
              ${popupPhase === 'open' ? 'visible' : ''}
              ${popupPhase === 'closing' ? 'hiding' : ''}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-popup-close"
              onClick={closePopup}
              aria-label="Close video"
            >
              ×
            </button>
            <video
              controls
              autoPlay
              key={popupPhase}
            >
              <source src="/videos/showreel.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>

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
    </>
  );
}

export default Home;
