import "../../styles/contactInfo.css";
import "../../styles/branch.css";

import resolveImageUrl from "../../utils/resolveImageUrl";

const ContactInfo = ({
  section,
  activeCityIndex,
  branchTheme,
}) => {

  const contactData =
    section.data?.contactInfo ||
    section.data ||
    {};

  const branchesData =
    section.data?.branchesData ||
    contactData?.branchesData ||
    [];

  const getAddressLines = (branch) => {

    if (Array.isArray(branch.addressLines)) {
      return branch.addressLines;
    }

    if (typeof branch.address === "string") {

      return branch.address
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (

    <div data-theme={branchTheme || "dark"}>

      {/* HERO SECTION */}

      <section className="contact-hero">

        {branchesData?.map((branch, index) => {

          if (!branch?.cityImage) return null;

          return (

            <div
              key={branch.id || branch.city || index}
              className={`hero-slide ${
                index === activeCityIndex
                  ? "is-active"
                  : ""
              }`}
            >

              <img
                src={resolveImageUrl(branch.cityImage)}
                alt={branch.city}
                className=" w-[70%]
    mx-auto

    h-[50vh]
    sm:h-[55vh]
    md:h-[65vh]

    object-cover
    object-center"
              />

            </div>

          );

        })}

        <div className="hero-overlay" />

        <div className="hero-content">

          <h1 className="hero-heading">
            {contactData.heading}
          </h1>

          <div className="hero-emails">

            {contactData.emails?.map((email, i) => (

              <p
                key={i}
                className="hero-email-row"
              >

                {email.label}:{" "}

                <a href={`mailto:${email.value}`}>
                  {email.value}
                </a>

              </p>

            ))}

          </div>

          {contactData.phones?.map((phone, i) => (

            <div
              key={i}
              className="hero-phone-row"
            >

              <span className="hero-phone-icon">

                {phone.icon === "phone"
                  ? "📞"
                  : "📱"}

              </span>

              <a href={`tel:${phone.value}`}>
                {phone.value}
              </a>

            </div>

          ))}

        </div>

      </section>

      {/* BRANCH SECTION */}

      <div className="branches-section">

        <div className="branches-slider-wrapper">

          <div
            className="branches-grid"
            style={{
              transform:
                window.innerWidth <= 768
                  ? `translateX(-${activeCityIndex * 100}%)`
                  : "translateX(0)",
            }}
          >

            {branchesData?.map((branch, index) => {

              const addressLines =
                getAddressLines(branch);

              return (

                <div
                  key={branch.id || branch.city || index}
                  className="branch-slide"
                >

                  <div
                    className={`branch-card ${
                      index === activeCityIndex
                        ? "card-active"
                        : ""
                    }`}
                  >

                    <p className="branch-city">
                      {branch.city}
                    </p>

                    <div className="branch-address">

                      {addressLines.map(
                        (line, lineIndex) => (

                          <p key={lineIndex}>
                            {line}
                          </p>

                        )
                      )}

                    </div>

                    {branch.phone && (
                      <hr className="branch-divider" />
                    )}

                    {branch.phone && (

                      <a
                        href={`tel:${branch.phone}`}
                        className="branch-phone"
                      >
                        {branch.phone}
                      </a>

                    )}

                    {branch.mapsUrl && (

                      <a
                        href={branch.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-directions"
                      >

                        <span>
                          Directions
                        </span>

                      </a>

                    )}

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        {/* MOBILE DOTS */}

        <div className="branch-slider-dots">

          {branchesData.map((_, index) => (

            <span
              key={index}
              className={`branch-dot ${
                activeCityIndex === index
                  ? "active"
                  : ""
              }`}
            />

          ))}

        </div>

      </div>

    </div>

  );
};

export default ContactInfo;