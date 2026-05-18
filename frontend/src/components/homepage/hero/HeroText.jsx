const HeroText = ({ showHeroText, typingPrefix, typingRef, h1, h2, h3 }) => {
  return (
    <div className={`hero-text ${showHeroText ? "show" : ""}`}>
      <h2 className="hero-headline">
        "{h1}"<br />
        {h2}
        <br />
        {h3}
      </h2>

      <div className="typing-line">
        <span className="typing-for">{typingPrefix}:&nbsp;</span>
        <span className="typed-text" ref={typingRef}></span>
        <span className="typed-cursor" aria-hidden="true">
          |
        </span>
      </div>
    </div>
  );
};

export default HeroText;
