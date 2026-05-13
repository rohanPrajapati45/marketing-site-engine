import { useState, useEffect, useRef } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

/* ════════════════════════════════════════════
   DATA ARRAYS — Admin edits only these
   ════════════════════════════════════════════ */

const contactInfo = {
  heading: "Let's Talk",
  emails: [
    { label: 'General Inquiries', value: 'info@tedmob.com' },
    { label: 'Work with us', value: 'sales@tedmob.com' },
    { label: 'Join our Team', value: 'careers@tedmob.com' },
  ],
  phones: [
    { icon: 'phone', value: '+961 4 545 466' },
    { icon: 'mobile', value: '+961 70 727 000' },
  ],
};

const branchesData = [
  {
    id: 1,
    city: 'LEBANON',
    cityImage: '/images/contact/city1.jpg',
    addressLines: [
      'Dbayeh Highway',
      'Hotel Royal Bridge',
      'Zaidan Center',
      '1st Floor',
    ],
    phone: '+961 4 545 466',
    mapsUrl: 'https://www.google.com/maps/place/TEDMOB/@33.9493931,35.5912056',
  },
  {
    id: 2,
    city: 'KSA',
    cityImage: '/images/contact/city2.jpg',
    addressLines: [
      'Al Kindi Plaza, Diplomatic Quarter',
      'Riyadh',
      'Kingdom of Saudi Arabia',
    ],
    phone: '+966 58 333 3332',
    mapsUrl: 'https://www.google.com/maps/place/Al+Kindi+Plaza',
  },
  {
    id: 3,
    city: 'USA - EU',
    cityImage: '/images/contact/city3.jpg',
    addressLines: [
      '7101 Democracy Blvd',
      'Bethesda',
      'United States - France',
    ],
    phone: '+33 6 33 32 44 60',
    mapsUrl: 'https://www.google.com/maps/place/TEDMOB+USA',
  },
  {
    id: 4,
    city: 'UAE',
    cityImage: '/images/contact/city4.jpg',
    addressLines: [
      'Media City',
      'Representative BD',
      'UAE',
    ],
    phone: '+971 50 7247283',
    mapsUrl: 'https://www.google.com/maps/place/TEDMOB',
  },
];

const formData = {
  heading: "Let's Transform",
  paragraphs: [
    'Like What You See? Tell us about your project.',
    "We don't just build your digital business, we accelerate it!",
    'Best Web and Mobile Apps development company in Lebanon',
  ],
  fields: [
    { name: 'name', placeholder: 'Name', type: 'text', cols: 1 },
    { name: 'email', placeholder: 'Email', type: 'email', cols: 1 },
    { name: 'phone_number', placeholder: 'Phone Number', type: 'number', cols: 1 },
    { name: 'company', placeholder: 'Company', type: 'text', cols: 1 },
    { name: 'message', placeholder: 'Tell us about your project', type: 'text', cols: 2 },
  ],
  submitText: 'SUBMIT',
};

/* ════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════ */

function Contact() {
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const formRef = useRef(null);
  const headingRef = useRef(null);

  /* ── IMAGE + CARD AUTO-SLIDE ──
     City image and branch cards change together
     every 3000ms — same index controls both.
     Active card pops up continuously in sync. */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCityIndex(prev => (prev + 1) % branchesData.length);
      setActiveDot(prev => (prev + 1) % branchesData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ── SCROLL REVEAL for form section ── */
  useEffect(() => {
    const revealEls = document.querySelectorAll('.contact-page .reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealEls.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  /* ── MANUAL DOT CLICK ── */
  const handleDotClick = (index) => {
    setActiveCityIndex(index);
    setActiveDot(index);
  };

  /* ── FORM SUBMIT ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! Connect your backend here.');
  };

  return (
    <>
      <style>{`
        .contact-page {
          background: #fafafa;
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          color: #212529;
        }

        /* ── SECTION 1: HERO with sliding city images ── */
        .contact-hero {
          overlay : #2e292b1c;
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(46, 41, 43, 0.11);
          z-index: 2;
        }

        /* City image slides stack absolutely */
        .hero-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          z-index: 0;
        }

        .hero-slide.is-active {
          opacity: 1;
          z-index: 1;
        }

        .hero-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        /* Contact info text — left side, vertically centered */
        .hero-content {
          position: absolute;
          z-index: 3;
          left: 52px;
          top: 40%;
          transform: translateY(-50%);
          color: #fff;
          padding-top: 80px;
        }

        .hero-heading {
          font-family: 'Exo', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 600;
          line-height: 1.1;
          margin: 0 0 32px 0;
          color: #fff;
        }

        .hero-emails {
          margin-bottom: 24px;
        }

        .hero-email-row {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.9;
          color: #fff;
          margin: 0;
        }

        .hero-email-row a {
          color: #fff;
          font-weight: 700;
          text-decoration: none;
        }

        .hero-email-row a:hover {
          opacity: 0.75;
        }

        .hero-phone-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 18px;
          color: #fff;
          font-weight: 400;
        }

        .hero-phone-row a {
          color: #fff;
          text-decoration: none;
        }

        .hero-phone-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        /* ── SECTION 2: BRANCHES — separate section, overlaps hero by ~25% ── */
        .branches-section {
          position: relative;
          z-index: 5;
          transform: translateY(-25%);
          margin-bottom: -100px;
          padding: 0 24px;
          background: transparent;
        }

        .branches-grid {
          display: flex;
          gap: 16px;
          width: 100%;
        }

        .branch-card {
          flex: 1 1 0;
          background: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.10);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          min-height: 300px;
          font-family: 'Exo', sans-serif;
          margin: 14px;

          padding: 32px 24px;
          /* Always visible — active card pops up */
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.6s ease,
                      opacity 0.6s ease;
        }

        .branch-card.card-active {
          transform: translateY(-12px) scale(1.04);
          box-shadow: 0 18px 48px rgba(0,0,0,0.22);
          z-index: 2;
        }

        .branch-card:last-child {
          border-right: none;
        }

        .branch-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 14px 36px rgba(0,0,0,0.18);
        }

        .branch-city {
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #111;
          margin-bottom: 18px;
        }

        .branch-address {
          font-family: 'Exo', sans-serif;
          font-size: 14px;
          line-height: 1.75;
          color: #555;
          margin-bottom: 14px;
          flex: 1;
        }

        .branch-address p {
          margin: 0;
          font-family: 'Exo', sans-serif;
        }

        .branch-divider {
          width: 100%;
          border: none;
          border-top: 1px solid #e0e0e0;
          margin: 14px 0;
        }

        .branch-phone {
          font-family: 'Exo', sans-serif;
          font-size: 14px;
          color: #333;
          margin-bottom: 22px;
          text-decoration: none;
          display: block;
        }

        .branch-phone:hover {
          opacity: 0.7;
        }

        .btn-directions {
          display: inline-block;
          width: 100%;
          padding: 12px 0;
          border: 1.5px solid #111;
          background: transparent;
          font-family: 'Exo', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-align: center;
          text-decoration: none;
          color: #111;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.4s ease;
          margin-top: auto;
        }

        .btn-directions::before {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 100%; height: 100%;
          background: #111;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.45s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 0;
        }

        .btn-directions:hover::before { transform: scaleY(1); }

        .btn-directions span {
          position: relative;
          z-index: 1;
          mix-blend-mode: difference;
          color: #fff;
        }

        /* ── SECTION 3: CTA + Form ── */
        .contact-form-section {
          background: #fafafa;
          padding: 140px 24px 120px;
          border-top: 1px solid #e8e8e8;
        }

        .contact-form-inner {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .form-heading {
          font-family: 'Exo', sans-serif;
          font-size: clamp(22px, 4vw, 38px);
          font-weight: 700;
          color: #111;
          margin: 0 0 32px 0;
        }

        .form-paragraphs {
          margin-bottom: 48px;
        }

        .form-paragraphs p {
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          line-height: 1.9;
          color: #000000ff;
          margin: 0;
        }

        .contact-form {
          width: 100%;
        }

        .form-row {
          display: grid;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-row-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .form-row-2 {
          grid-template-columns: 1fr 2fr;
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background: #fff;
          font-family: 'Exo', sans-serif;
          font-size: 14px;
          color: #333;
          outline: none;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: #aaa;
          font-family: 'Exo', sans-serif;
        }

        .form-input:focus {
          border-color: #111;
        }

        .form-submit-wrapper {
          text-align: center;
          margin-top: 40px;
        }

        .btn-submit {
          display: inline-block;
          padding: 18px 0;
          min-width: 200px;
          border: 2px solid #111;
          background: transparent;
          font-family: 'Exo', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #111;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.4s ease;
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 100%; height: 100%;
          background: #111;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 0;
        }

        .btn-submit:hover::before { transform: scaleY(1); }

        .btn-submit span {
          position: relative;
          z-index: 1;
          mix-blend-mode: difference;
          color: #fff;
        }

        /* Scroll reveal animation */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .branches-grid { flex-wrap: wrap; }
          .branch-card { flex: 0 0 calc(50% - 1px); }
          .branches-section { transform: translateY(-15%); margin-bottom: -60px; }
        }

        @media (max-width: 992px) {
          .form-row-3 { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 768px) {
          .hero-content { left: 24px; padding-top: 100px; }
          .branch-card { flex: 0 0 100%; border-right: none; border-bottom: 1px solid #eee; }
          .branch-card:last-child { border-bottom: none; }
          .branches-section { transform: translateY(-10%); margin-bottom: -40px; padding: 0 16px; }
          .form-row-3 { grid-template-columns: 1fr; }
          .form-row-2 { grid-template-columns: 1fr; }
        }

        /* ── WHATSAPP FLOATING BUTTON ── */
        .whatsapp-float {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 999;
          display: block;
          line-height: 0;
          text-decoration: none;
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          transition: transform 0.3s ease;
        }

        .whatsapp-float:hover {
          transform: scale(1.08);
        }

        .whatsapp-float img {
          width: 56px;
          height: 56px;
          display: block;
        }
      `}</style>

      <div className="contact-page">

        {/* ══ SECTION 1 — HERO ══ */}
        <section className="contact-hero">

          {/* Sliding city images — one per branch */}
          {branchesData.map((branch, index) => (
            <div
              key={branch.id}
              className={`hero-slide ${index === activeCityIndex ? 'is-active' : ''}`}
            >
              <img src={branch.cityImage} alt={branch.city} />
            </div>
          ))}

          {/* Dark overlay */}
          <div className="hero-overlay" />

          {/* Contact info — left side */}
          <div className="hero-content">
            <h1 className="hero-heading">{contactInfo.heading}</h1>

            <div className="hero-emails">
              {contactInfo.emails.map((email, i) => (
                <p key={i} className="hero-email-row">
                  {email.label}:{' '}
                  <a href={`mailto:${email.value}`}>{email.value}</a>
                </p>
              ))}
            </div>

            {contactInfo.phones.map((phone, i) => (
              <div key={i} className="hero-phone-row">
                <span className="hero-phone-icon">
                  {phone.icon === 'phone' ? '📞' : '📱'}
                </span>
                <a href={`tel:${phone.value}`}>{phone.value}</a>
              </div>
            ))}
          </div>

        </section>

        {/* ══ SECTION 2 — BRANCHES (overlaps hero by ~10%) ══ */}
        <section className="branches-section">
          <div className="branches-grid">
            {branchesData.map((branch, index) => (
              <div
                key={branch.id}
                className={`branch-card${index === activeCityIndex ? ' card-active' : ''}`}
              >
                <p className="branch-city">{branch.city}</p>
                <div className="branch-address">
                  {branch.addressLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <hr className="branch-divider" />
                <a href={`tel:${branch.phone}`} className="branch-phone">
                  {branch.phone}
                </a>
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-directions"
                >
                  <span>Directions</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SECTION 2 — CTA + FORM ══ */}
        <section className="contact-form-section">
          <div className="contact-form-inner">

            <h2 className="form-heading" ref={headingRef}>
              <b>{formData.heading}</b>
            </h2>

            <div className="form-paragraphs">
              {formData.paragraphs.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
              
            <form
              className="contact-form"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              {/* Row 1 — Name, Email, Phone (3 columns) */}
              <div className="form-row form-row-3">
                {formData.fields.slice(0, 3).map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="form-input"
                  />
                ))}
              </div>

              {/* Row 2 — Company (1/3) + Message (2/3) */}
              <div className="form-row form-row-2">
                {formData.fields.slice(3).map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="form-input"
                  />
                ))}
              </div>

              {/* Submit button */}
              <div className="form-submit-wrapper">
                <button type="submit" className="btn-submit">
                  <span>{formData.submitText}</span>
                </button>
              </div>
            </form>

          </div>
        </section>

      </div>

      {/* ══ WHATSAPP FLOATING BUTTON ══ */}
      <a
        href="https://wa.me/96170727000"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <img src="/images/contact/whatsapp.svg" alt="WhatsApp" />
      </a>
    </>
  );
}

export default Contact;
