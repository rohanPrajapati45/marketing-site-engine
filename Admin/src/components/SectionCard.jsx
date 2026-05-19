import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Layers, GripVertical, Check } from 'lucide-react';
import Badge from './ui/Badge';
import { sectionTypeInfo, resolveCardType } from '../schemas/sectionSchemas';

const SectionCard = ({ section, index, total, onEdit, onDelete, onToggle, onMoveUp, onMoveDown, onManageCards, highlight }) => {
  const effectiveCardType = resolveCardType(section);
  const hasCards = !!effectiveCardType;
  const cardCount = section.data?.cards?.length || 0;
  const info = sectionTypeInfo[section.type];
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (highlight) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 800);
      return () => clearTimeout(timer);
    }
  }, [highlight]);

  return (
    <div
      className={`bg-[var(--surface)] border rounded-xl transition-all duration-300 hover:border-[var(--accent)]/30 ${section.enabled ? 'border-[var(--border)]' : 'border-[var(--border)] opacity-60'} ${flash ? 'section-reorder-flash' : ''}`}
      style={{
        transform: flash ? 'scale(1.008)' : 'scale(1)',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Drag handle + Order */}
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <GripVertical size={16} className="opacity-40" />
          <span
            className={`text-xs font-mono font-medium w-5 text-center transition-all duration-300 ${flash ? 'text-[var(--accent)] scale-125' : ''}`}
          >
            {section.order}
          </span>
        </div>

        {/* Icon */}
        <span className={`text-base flex-shrink-0 transition-transform duration-300 ${flash ? 'scale-110' : ''}`}>{info?.icon || '📄'}</span>

        {/* Section info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[var(--text-primary)] truncate">
              {info?.label || section.type}
            </span>
            <Badge variant={section.enabled ? 'success' : 'warning'} size="xs">
              {section.enabled ? 'Active' : 'Disabled'}
            </Badge>
            {hasCards && (
              <Badge variant="info" size="xs">
                {effectiveCardType} ({cardCount})
              </Badge>
            )}
            {flash && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 animate-fade-in">
                <Check size={10} /> Moved
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] truncate mt-0.5 hidden sm:block">
            {info?.description || section.type}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button onClick={onMoveUp} disabled={index === 0} className="p-1.5 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30 transition-all duration-200 hover:scale-110 active:scale-90" title="Move up">
            <ChevronUp size={15} />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="p-1.5 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30 transition-all duration-200 hover:scale-110 active:scale-90" title="Move down">
            <ChevronDown size={15} />
          </button>

          <div className="w-px h-5 bg-[var(--border)] mx-1" />

          <button onClick={onToggle} className={`p-1.5 rounded-lg transition-colors ${section.enabled ? 'hover:bg-amber-500/10 text-emerald-400 hover:text-amber-400' : 'hover:bg-emerald-500/10 text-[var(--text-muted)] hover:text-emerald-400'}`} title={section.enabled ? 'Disable' : 'Enable'}>
            {section.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>

          {hasCards && (
            <button onClick={onManageCards} className="p-1.5 rounded-lg hover:bg-sky-500/10 text-[var(--text-muted)] hover:text-sky-400 transition-colors" title="Manage Cards">
              <Layers size={15} />
            </button>
          )}

          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" title="Edit">
            <Edit2 size={15} />
          </button>

          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors" title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
