const HeroVideo = ({ heroVideoRef, videoUrl }) => {
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
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroVideo;
