import { useState } from 'react';

const SolutionForm = ({ inquiryLabel, buttonText, title, solutionId }) => {
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneValue || !emailValue) {
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');

      const res = await fetch('/api/solutions/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solutionTitle: title,
          solutionId,
          phone: phoneValue,
          email: emailValue,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      setStatus('success');
      setPhoneValue('');
      setEmailValue('');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="solution-form">
      <p className="solution-inquiry-label">{inquiryLabel}</p>
      <input
        type="tel"
        placeholder="Phone Number"
        className="solution-input"
        value={phoneValue}
        onChange={(e) => setPhoneValue(e.target.value)}
        disabled={status === 'loading'}
      />
      <input
        type="email"
        placeholder="Email"
        className="solution-input"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        className="btn-request-demo"
        disabled={status === 'loading'}
      >
        <span>
          {status === 'loading' ? 'Sending...' : ''}
          {status === 'success' ? 'Sent!' : ''}
          {status === 'error' ? 'Try Again' : ''}
          {status === 'idle' ? buttonText : ''}
        </span>
      </button>
    </form>
  );
};

export default SolutionForm;
