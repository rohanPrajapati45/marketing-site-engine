const HeroText = ({ showHeroText, typingPrefix, typingRef }) => {
  return (
    <div className={`hero-text ${showHeroText ? 'show' : ''}`}>
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
  );
};

export default HeroText;
