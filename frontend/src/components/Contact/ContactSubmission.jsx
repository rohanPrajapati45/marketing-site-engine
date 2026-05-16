import Btn_slide from '../Btn_slide';

const ContactSubmission = ({ submitText }) => {
  return (
    <div className="form-submit-wrapper">
      <Btn_slide type="submit" inside={submitText} />
    </div>
  );
};

export default ContactSubmission;
