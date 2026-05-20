import React from 'react';

const Toggle = ({ enabled, onChange, label, size = 'md' }) => {
  const sizes = {
    sm: { track: 'w-8 h-4', dot: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', dot: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', dot: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const s = sizes[size];

  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`${s.track} relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] ${enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
          }`}
      >
        <span className={`${s.dot} inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 ${enabled ? s.translate : 'translate-x-0.5'
          }`} />
      </button>
      {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
    </label>
  );
};

export default Toggle;
