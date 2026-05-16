/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import ContactInfo from '../components/Contact/ContactInfo';
import Branch from '../components/Contact/Branch';
import ContactForm from '../components/Contact/ContactForm';
import '../styles/contactInfo.css';
import '../styles/branch.css';
import '../styles/contactForm.css';
import '../styles/contactSubmission.css';

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

function Contact() {
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const formRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCityIndex(prev => (prev + 1) % branchesData.length);
      setActiveDot(prev => (prev + 1) % branchesData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! Connect your backend here.');
  };

  return (
    <>
      <div className="contact-page">
        <section className="contact-hero">
          <ContactInfo
            contactInfo={contactInfo}
            branchesData={branchesData}
            activeCityIndex={activeCityIndex}
          />
        </section>

        <section className="branches-section">
          <div className="branches-grid">
            {branchesData.map((branch, index) => (
              <Branch
                key={branch.id}
                branch={branch}
                isActive={index === activeCityIndex}
              />
            ))}
          </div>
        </section>

        <ContactForm
          formData={formData}
          formRef={formRef}
          headingRef={headingRef}
          handleSubmit={handleSubmit}
        />
      </div>

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
