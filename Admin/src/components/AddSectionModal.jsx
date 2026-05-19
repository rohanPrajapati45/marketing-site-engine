import React, { useState } from 'react';
import Modal from './ui/Modal';
import DynamicFormRenderer from './DynamicFormRenderer';
import { getSectionFields, allowedSectionTypes, cardTypeOptions, sectionTypeInfo } from '../schemas/sectionSchemas';
import toast from 'react-hot-toast';

const AddSectionModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('');
  const [sectionData, setSectionData] = useState({});
  const [step, setStep] = useState(1);

  // Merge base section schema + any cardType extra fields
  const schema = getSectionFields(selectedType, selectedCardType);
  const info = sectionTypeInfo[selectedType];

  const handleNext = () => {
    if (!selectedType) return toast.error('Select a section type');
    setStep(2);
  };

  const handleSubmit = () => {
    const payload = {
      type: selectedType,
      data: {
        ...sectionData,
        ...(selectedCardType ? { cardType: selectedCardType } : {}),
      },
    };
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Section" size={step === 2 ? 'lg' : 'md'}>
      {step === 1 ? (
        <div className="space-y-5">
          {/* Section type selector with descriptions */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Choose Section Type *</label>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {allowedSectionTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all border ${
                    selectedType === t.value
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-[var(--border)] hover:border-[var(--accent)]/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{t.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${selectedType === t.value ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{t.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card type — only for "standard" sections */}
          {selectedType === 'standard' && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Card Type (optional)</label>
            <select
              value={selectedCardType}
              onChange={(e) => setSelectedCardType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            >
              {cardTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)] transition-colors font-medium text-sm">Cancel</button>
            <button onClick={handleNext} className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors text-sm">Next → Configure</button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header showing selected type */}
          <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
            <span className="text-xl">{info?.icon}</span>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{info?.label || selectedType}</p>
              <p className="text-xs text-[var(--text-muted)]">{info?.description}</p>
            </div>
            {selectedCardType && (
              <span className="ml-auto px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-md text-xs font-medium">{selectedCardType}</span>
            )}
          </div>

          {/* Dynamic form */}
          {schema.length > 0 ? (
            <DynamicFormRenderer schema={schema} data={sectionData} onChange={setSectionData} />
          ) : (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No additional data needed for this section type.</p>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)] transition-colors font-medium text-sm">← Back</button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors text-sm">Create Section</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddSectionModal;
