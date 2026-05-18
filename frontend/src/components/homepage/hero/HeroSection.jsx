import "../../../styles/hero.css";
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
  } = section.data;
  return (
    <section data-theme={heroTheme}>
      <HeroVideo heroVideoRef={heroVideoRef} videoUrl={videoUrl} />
      <HeroText
        showHeroText={showHeroText}
        typingPrefix={typingPrefix}
        typingRef={typingRef}
        h1={headingLine1}
        h2={headingLine2}
        h3={headingLine3}
      />
      <HeroScrollHint />
      <ShowreelButton
        popupPhase={popupPhase}
        openPopup={openPopup}
        closePopup={closePopup}
        gifRef={gifRef}
        showreelVideo={showreelVideo}
        showreelGif={showreelGif}
        showreelLabelLine2={showreelLabelLine2}
        showreelLabelLine1={showreelLabelLine1}
      />
    </section>
  );
};

export default HeroSection;
