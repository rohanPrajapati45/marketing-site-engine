import '../../../styles/hero.css';
import HeroVideo from './HeroVideo';
import HeroText from './HeroText';
import HeroScrollHint from './HeroScrollHint';
import ShowreelButton from './ShowreelButton';

const HeroSection = ({
  heroTheme,
  showHeroText,
  typingPrefix,
  typingRef,
  popupPhase,
  openPopup,
  closePopup,
  gifRef,
  heroVideoRef,
}) => {
  return (
    <section id="hero" data-theme={heroTheme}>
      <HeroVideo heroVideoRef={heroVideoRef} />
      <HeroText showHeroText={showHeroText} typingPrefix={typingPrefix} typingRef={typingRef} />
      <HeroScrollHint />
      <ShowreelButton
        popupPhase={popupPhase}
        openPopup={openPopup}
        closePopup={closePopup}
        gifRef={gifRef}
      />
    </section>
  );
};

export default HeroSection;
