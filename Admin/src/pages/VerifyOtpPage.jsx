import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, forgotPassword, clearError } from '../redux/slices/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { loading, error, otpVerified } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (otpVerified) {
      toast.success('OTP verified! Set your new password');
      navigate('/reset-password', { state: { email } });
    }
  }, [otpVerified, navigate, email]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      if (newOtp.every(d => d !== '')) {
        dispatch(verifyOtp({ email, otp: newOtp.join('') }));
      }
      return;
    }
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every(d => d !== '')) {
      dispatch(verifyOtp({ email, otp: newOtp.join('') }));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    dispatch(forgotPassword(email));
    setTimer(300);
    setOtp(['', '', '', '', '', '']);
    toast.success('New OTP sent');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Verify OTP</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            Enter the 6-digit code sent to <span className="text-[var(--text-secondary)] font-medium">{email}</span>
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl shadow-black/5">
          <div className="flex justify-center gap-2.5 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                autoFocus={i === 0}
              />
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
              <span className="text-sm text-[var(--text-muted)]">Verifying...</span>
            </div>
          )}

          <div className="text-center space-y-3">
            {timer > 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                Expires in <span className="text-[var(--text-secondary)] font-mono font-medium">{formatTime(timer)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-400">OTP expired</p>
            )}
            <button onClick={handleResend} disabled={loading} className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors disabled:opacity-50">
              Resend OTP
            </button>
          </div>
        </div>

        <Link to="/forgot-password" className="flex items-center gap-1.5 mx-auto mt-6 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors w-fit">
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
