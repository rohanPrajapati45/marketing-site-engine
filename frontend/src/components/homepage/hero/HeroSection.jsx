import { useEffect, useRef, useState } from "react";

import "../../../styles/hero.css";
import { useTypingAnimation } from "../../../hooks/useTypingAnimation";
import { useVideoTheme } from "../../../hooks/useMediaTheme";
import HeroVideo from "./HeroVideo";
import HeroText from "./HeroText";
import HeroScrollHint from "./HeroScrollHint";
import ShowreelButton from "./ShowreelButton";

const HeroSection = ({
  heroTheme,
  showHeroText,
  typingRef,
  popupPhase,
  openPopup,
  closePopup,
  gifRef,
  heroVideoRef,
  section,
}) => {
  const internalGifRef = useRef(null);
  const internalHeroVideoRef = useRef(null);

  const hasExternalTyping =
    typeof showHeroText === "boolean" || Boolean(typingRef);
  const { typingRef: internalTypingRef, showHeroText: internalShowHeroText } =
    useTypingAnimation(!hasExternalTyping);

  const resolvedTypingRef = typingRef ?? internalTypingRef;
  const resolvedShowHeroText =
    typeof showHeroText === "boolean" ? showHeroText : internalShowHeroText;

  const resolvedGifRef = gifRef ?? internalGifRef;
  const resolvedHeroVideoRef = heroVideoRef ?? internalHeroVideoRef;

  const fallbackHeroTheme = useVideoTheme(resolvedHeroVideoRef, {
    enabled: heroTheme == null,
    threshold: 145,
    sampleIntervalMs: 650,
    sampleWidth: 32,
    intersectionThreshold: 0.6,
  });

  const resolvedHeroTheme = heroTheme ?? fallbackHeroTheme ?? "dark";

  const [internalPopupPhase, setInternalPopupPhase] = useState("closed");
  const popupTimerRef = useRef(null);

  const resolvedPopupPhase = popupPhase ?? internalPopupPhase;

  const openPopupHandler =
    openPopup ??
    (() => {
      if (resolvedPopupPhase !== "closed") return;

      setInternalPopupPhase("opening");

      popupTimerRef.current = window.setTimeout(() => {
        setInternalPopupPhase("open");
      }, 600);
    });

  const closePopupHandler =
    closePopup ??
    (() => {
      if (resolvedPopupPhase !== "open") return;

      setInternalPopupPhase("closing");

      popupTimerRef.current = window.setTimeout(() => {
        setInternalPopupPhase("closed");
      }, 600);
    });

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) {
        window.clearTimeout(popupTimerRef.current);
      }
    };
  }, []);

  const {
    headingLine1,
    headingLine2,
    headingLine3,
    typingPrefix,
    videoUrl,
    showreelGif,
    showreelVideo,
    showreelLabelLine1,
    showreelLabelLine2,
  } = section?.data || {};
  return (
    <section className="hero-section" data-theme={resolvedHeroTheme}>
      <HeroVideo heroVideoRef={resolvedHeroVideoRef} videoUrl={videoUrl} />
      <HeroText
        showHeroText={resolvedShowHeroText}
        typingPrefix={typingPrefix}
        typingRef={resolvedTypingRef}
        h1={headingLine1}
        h2={headingLine2}
        h3={headingLine3}
      />
      <HeroScrollHint />
      <ShowreelButton
        popupPhase={resolvedPopupPhase}
        openPopup={openPopupHandler}
        closePopup={closePopupHandler}
        gifRef={resolvedGifRef}
        showreelVideo={showreelVideo}
        showreelGif={showreelGif}
        showreelLabelLine2={showreelLabelLine2}
        showreelLabelLine1={showreelLabelLine1}
      />
    </section>
  );
};

export default HeroSection;
