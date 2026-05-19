import React, { useState } from 'react';
import Modal from './ui/Modal';
import DynamicFormRenderer from './DynamicFormRenderer';
import { cardSchemas } from '../schemas/cardSchemas';
import { resolveCardType } from '../schemas/sectionSchemas';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const CardFormModal = ({ isOpen, onClose, section, onSave }) => {
  const cardType = resolveCardType(section);
  const schema = cardSchemas[cardType] || [];
  const [cards, setCards] = useState(section.data?.cards || []);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAddCard = () => {
    const defaults = {};
    schema.forEach(f => { defaults[f.name] = f.type === 'array' ? [] : f.type === 'number' ? 0 : ''; });
    defaults.order = cards.length + 1;
    defaults.active = true;
    setEditData(defaults);
    setEditIndex(-1); // -1 = new card
  };

  const handleEditCard = (idx) => {
    setEditData({ ...cards[idx] });
    setEditIndex(idx);
  };

  const handleSaveCard = () => {
    const newCards = [...cards];
    if (editIndex === -1) {
      newCards.push(editData);
    } else {
      newCards[editIndex] = editData;
    }
    setCards(newCards);
    setEditIndex(null);
    setEditData({});
  };

  const handleDeleteCard = (idx) => {
    setCards(cards.filter((_, i) => i !== idx));
  };

  const handleToggleActive = (idx) => {
    const newCards = [...cards];
    newCards[idx] = { ...newCards[idx], active: !newCards[idx].active };
    setCards(newCards);
  };

  const handleMove = (idx, dir) => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= cards.length) return;
    const newCards = [...cards];
    [newCards[idx], newCards[target]] = [newCards[target], newCards[idx]];
    newCards.forEach((c, i) => { c.order = i + 1; });
    setCards(newCards);
  };

  const handleSaveAll = () => {
    onSave(section._id, cards);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cards: ${cardType}`} size="lg">
      <div className="space-y-4">
        {editIndex !== null ? (
          <div className="space-y-4 bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--text-primary)]">{editIndex === -1 ? 'New Card' : `Edit Card #${editIndex + 1}`}</p>
            <DynamicFormRenderer schema={schema} data={editData} onChange={setEditData} />
            <div className="flex gap-3">
              <button onClick={() => setEditIndex(null)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium">Cancel</button>
              <button onClick={handleSaveCard} className="flex-1 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium">{editIndex === -1 ? 'Add' : 'Update'}</button>
            </div>
          </div>
        ) : (
          <>
            {cards.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-6">No cards yet</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {cards.map((card, idx) => (
                  <div key={idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${card.active ? 'border-[var(--border)] bg-[var(--surface)]' : 'border-[var(--border)] bg-[var(--surface)] opacity-50'}`}>
                    <span className="text-xs font-mono text-[var(--text-muted)] w-5 text-center">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{card.title || card.name || card.lines?.[0] || card.image || `Card ${idx + 1}`}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronUp size={14} /></button>
                      <button onClick={() => handleMove(idx, 'down')} disabled={idx === cards.length - 1} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronDown size={14} /></button>
                      <button onClick={() => handleToggleActive(idx)} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)]">{card.active ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                      <button onClick={() => handleEditCard(idx)} className="p-1 rounded hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]">Edit</button>
                      <button onClick={() => handleDeleteCard(idx)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleAddCard} className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-xl font-medium w-full justify-center">
              <Plus size={16} /> Add Card
            </button>
          </>
        )}

        {editIndex === null && (
          <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium">Cancel</button>
            <button onClick={handleSaveAll} className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium">Save All Cards</button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CardFormModal;
