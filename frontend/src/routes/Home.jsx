import { useEffect, useRef, useState } from "react";

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

function Home() {
  const [showHeroText, setShowHeroText] = useState(false);
  const [popupPhase, setPopupPhase] = useState("closed");
  const typingRef = useRef(null);
  const gifRef = useRef(null);
  const timerRef = useRef(null);
  const popupTimerRef = useRef(null);

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

  return (
    <section id="hero">
      <style>{`
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

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: transparent;
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
        .popup-fill {
          position: fixed;
          inset: 0;
          background: #ffffff;
          clip-path: circle(0% at calc(100% - 55px) calc(100% - 55px));
          transition: clip-path 2s cubic-bezier(0.76, 0, 0.24, 1);
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
          width: 100vw;
          max-width: 960px;
          background: #000;
          z-index: 9999;
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 0.99s ease 0.95s, transform 0.3s ease 0.35s;
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
        <video autoPlay muted loop playsInline preload="auto" aria-label="Hero background video">
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-gradient" />

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
          ${(popupPhase === "opening" || popupPhase === "open") ? "expanding" : ""}
          ${popupPhase === "closing" ? "collapsing" : ""}
        `}
      />

      {/* ── OVERLAY + VIDEO CONTENT ── */}
      {popupPhase !== "closed" && (
        <div
          className={`video-popup-overlay ${popupPhase !== "closed" ? "is-active" : ""}`}
          onClick={closePopup}
        >
          <div
            className={`video-popup-content
              ${popupPhase === "open" ? "visible" : ""}
              ${popupPhase === "closing" ? "hiding" : ""}
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
  );
}

export default Home;
