const ContactInfo = ({ section, activeCityIndex }) => {

  const { contactInfo, branchesData } =
    section.data;

  return (
    <section className="contact-hero">

      {branchesData?.map((branch, index) => (
        <div
          key={branch.id}
          className={`hero-slide ${
            index === activeCityIndex
              ? 'is-active'
              : ''
          }`}
        >
          <img
            src={branch.cityImage}
            alt={branch.city}
          />
        </div>
      ))}

      <div className="hero-overlay" />

      <div className="hero-content">

        <h1 className="hero-heading">
          {contactInfo.heading}
        </h1>

        <div className="hero-emails">

          {contactInfo.emails?.map((email, i) => (
            <p
              key={i}
              className="hero-email-row"
            >
              {email.label}:{' '}

              <a href={`mailto:${email.value}`}>
                {email.value}
              </a>
            </p>
          ))}

        </div>

        {contactInfo.phones?.map((phone, i) => (
          <div
            key={i}
            className="hero-phone-row"
          >
            <span className="hero-phone-icon">
              {phone.icon === 'phone'
                ? '📞'
                : '📱'}
            </span>

            <a href={`tel:${phone.value}`}>
              {phone.value}
            </a>
          </div>
        ))}

      </div>
    </section>
  );
};

export default ContactInfo;