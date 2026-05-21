import "../../styles/contactForm.css";
import "../../styles/contactSubmission.css";

import ContactSubmission from "./ContactSubmission";

const ContactForm = ({ formData, formRef, headingRef, handleSubmit }) => {
  return (
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

        <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
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

          <ContactSubmission submitText={formData.submitText} />
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
