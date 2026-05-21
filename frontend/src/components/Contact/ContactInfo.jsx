import "../../styles/contactInfo.css";
import "../../styles/branch.css";

import resolveImageUrl from "../../utils/resolveImageUrl";

const ContactInfo = ({ section, activeCityIndex }) => {
  const contactData = section.data?.contactInfo || section.data || {};
  const branchesData =
    section.data?.branchesData || contactData?.branchesData || [];

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
    <>
      <section className="contact-hero">
        {branchesData?.map((branch, index) => (
          <div
            key={branch.id || branch.city || index}
            className={`hero-slide ${
              index === activeCityIndex ? "is-active" : ""
            }`}
          >
            <img src={resolveImageUrl(branch.cityImage)} alt={branch.city} />
          </div>
        ))}

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1 className="hero-heading">{contactData.heading}</h1>

          <div className="hero-emails">
            {contactData.emails?.map((email, i) => (
              <p key={i} className="hero-email-row">
                {email.label}:{" "}
                <a href={`mailto:${email.value}`}>{email.value}</a>
              </p>
            ))}
          </div>

          {contactData.phones?.map((phone, i) => (
            <div key={i} className="hero-phone-row">
              <span className="hero-phone-icon">
                {phone.icon === "phone" ? "📞" : "📱"}
              </span>

              <a href={`tel:${phone.value}`}>{phone.value}</a>
            </div>
          ))}
        </div>
      </section>

      <div className="branches-section">
        <div className="branches-grid">
          {branchesData?.map((branch, index) => {
            const addressLines = getAddressLines(branch);

            return (
              <div
                key={branch.id || branch.city || index}
                className={`branch-card ${
                  index === activeCityIndex ? "card-active" : ""
                }`}
              >
                <p className="branch-city">{branch.city}</p>

                <div className="branch-address">
                  {addressLines.map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>

                {branch.phone && <hr className="branch-divider" />}

                {branch.phone && (
                  <a href={`tel:${branch.phone}`} className="branch-phone">
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
                    <span>Directions</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
