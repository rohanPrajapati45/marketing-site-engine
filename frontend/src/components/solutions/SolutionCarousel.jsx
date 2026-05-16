import { useState, useEffect } from 'react';

const SolutionCarousel = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="solution-carousel">
      <div className="carousel-track-wrapper">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${activeImage * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="carousel-slide">
              <img src={img} alt={`${title} ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`carousel-dot ${i === activeImage ? 'dot-active' : ''}`}
            onClick={() => setActiveImage(i)}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SolutionCarousel;
