import { useEffect, useState } from "react";


const Branch = ({
  branchSections = [],
  activeCityIndex = 0,
}) => {
  const safeSections =
    Array.isArray(branchSections)
      ? branchSections
      : [];

 const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {

  if (window.innerWidth > 768) return;

  const interval = setInterval(() => {

    setCurrentSlide((prev) =>
      prev === safeSections.length - 1
        ? 0
        : prev + 1
    );

  }, 3000);

  return () => clearInterval(interval);

}, [safeSections.length]);

  return (

    <section className="branches-section">

      <div className="branches-slider-wrapper">

  <div
    className="branches-grid"
    style={{
      width: window.innerWidth <= 768
        ? `${safeSections.length * 100}%`
        : "100%",

      transform:
        window.innerWidth <= 768
          ? `translateX(-${currentSlide * (100 / safeSections.length)}%)`
          : "translateX(0)",

    }}
  >

        {safeSections.map(
          (section, index) => {

            const branch =
              section.data;

            return (

              <div
                key={section._id}
                className={`branch-card ${
                  activeCityIndex === index
                    ? 'card-active'
                    : ''
                }`}
              >

                <p className="branch-city">
                  {branch.city}
                </p>

                <div className="branch-address">

                  {branch.addressLines?.map(
                    (line, i) => (
                      <p key={i}>
                        {line}
                      </p>
                    )
                  )}

                </div>

                <hr className="branch-divider" />

                <a
                  href={`tel:${branch.phone}`}
                  className="branch-phone"
                >
                  {branch.phone}
                </a>

                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                 
                >
                  <span>
                    Directions
                  </span>
                </a>

              </div>

            );

          }
        )}
</div>
      </div>

    </section>

  );
};

export default Branch;