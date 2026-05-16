const HeroVideo = ({ heroVideoRef }) => {
  return (
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
  );
};

export default HeroVideo;
