import React, { useEffect, useRef, useState } from "react";

function StrechHero() {
  const sectionRef = useRef(null);
  const [height, setHeight] = useState(200);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)),
      );

      // overlay stretches upward
      setHeight(200 + progress * 260);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[62vh] overflow-hidden">
      {/* Background Image */}
      <img
        src="https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/blogs/950877162.png"
        alt="TEDMOB Ranked Number 1 Web and App Development Company in Lebanon"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Full Dark Overlay */}
      <div className="absolute h-full inset-0 bg-black/15 z-[1]" />

      {/* Stretching Overlay Box */}
      <div
        style={{
          transition: "height 0.12s linear",
        }}
        className="
          absolute bottom-0 left-0
          w-full h-full
          bg-black/25
          backdrop-blur-[2px]
          z-[2]
          flex items-end
        "
      >
        <div className="w-full px-5 md:px-10 lg:px-16 pb-8 md:pb-12 flex justify-center items-center">
          <div className="max-w-5xl">
            <h1 className="text-white text-3xl md:text-5xl lg:text-5xl leading-tight font-[300]">
              TEDMOB Ranked Number 1 Web and App Development Company in Lebanon
            </h1>

            <p className="text-gray-300 mt-5 text-sm md:text-lg font-[300]">
              TEDMOB Ranked Number 1 Web and App Development Company in Lebanon
              | 09, Apr 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StrechHero;
