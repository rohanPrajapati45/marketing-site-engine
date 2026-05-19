import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 bg-[var(--surface)] px-8 py-6 rounded-2xl border border-[var(--border)] shadow-xl">
        <Loader2 size={28} className="text-[var(--accent)] animate-spin" />
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
