import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit2, GripVertical, X, Image } from 'lucide-react';

const inputCls = "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";
const btnPrimary = "px-3 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl text-xs font-medium transition-colors";
const btnOutline = "px-3 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-xl text-xs font-medium hover:bg-[var(--hover)] transition-colors";

const StickyServicesEditor = ({ data, onChange }) => {
  const services = data?.services || [];
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});
  const [newItem, setNewItem] = useState('');

  const update = (newServices) => onChange({ ...data, services: newServices });

  const startAdd = () => {
    setForm({ title: '', navTitle: '', image: '', description: '', items: [] });
    setEditIdx(-1);
  };

  const startEdit = (i) => {
    setForm({ ...services[i] });
    setEditIdx(i);
  };

  const save = () => {
    const n = [...services];
    if (editIdx === -1) n.push(form); else n[editIdx] = form;
    update(n);
    setEditIdx(null);
  };

  const remove = (i) => update(services.filter((_, j) => j !== i));

  const move = (i, dir) => {
    const t = dir === 'up' ? i - 1 : i + 1;
    if (t < 0 || t >= services.length) return;
    const n = [...services]; [n[i], n[t]] = [n[t], n[i]]; update(n);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setForm(f => ({ ...f, items: [...(f.items || []), newItem.trim()] }));
    setNewItem('');
  };

  const removeItem = (idx) => {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const moveItem = (idx, dir) => {
    const t = dir === 'up' ? idx - 1 : idx + 1;
    const items = [...form.items];
    if (t < 0 || t >= items.length) return;
    [items[idx], items[t]] = [items[t], items[idx]];
    setForm(f => ({ ...f, items }));
  };

  // Edit/Add form
  if (editIdx !== null) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-3 animate-fade-in">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {editIdx === -1 ? 'Add Service' : `Edit: ${form.title}`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Title (Display) *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="SOFTWARE DEVELOPMENT" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Nav Title (Menu) *</label>
            <input type="text" value={form.navTitle} onChange={e => setForm(f => ({ ...f, navTitle: e.target.value }))} placeholder="Software Development" className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Image URL *</label>
          <input type="text" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="/whatwedo/whatwedo1.webp" className={inputCls} />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this service..." rows={2} className={inputCls} />
        </div>

        {/* Service items */}
        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Service Items</label>
          <div className="space-y-1.5">
            {(form.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg group">
                <span className="text-xs font-mono text-[var(--text-muted)] w-4">{idx + 1}</span>
                <span className="flex-1 text-xs text-[var(--text-primary)]">{item}</span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="p-0.5 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronUp size={11} /></button>
                  <button type="button" onClick={() => moveItem(idx, 'down')} disabled={idx === (form.items?.length || 0) - 1} className="p-0.5 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronDown size={11} /></button>
                  <button type="button" onClick={() => removeItem(idx)} className="p-0.5 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><X size={11} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-1.5">
            <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem())} placeholder="Add item (e.g. Website development)" className={`flex-1 px-2.5 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]`} />
            <button type="button" onClick={addItem} className="px-2.5 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium">Add</button>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={() => setEditIdx(null)} className={`flex-1 ${btnOutline}`}>Cancel</button>
          <button type="button" onClick={save} disabled={!form.title?.trim()} className={`flex-1 ${btnPrimary} disabled:opacity-50`}>{editIdx === -1 ? 'Add Service' : 'Save'}</button>
        </div>
      </div>
    );
  }

  // Service list view
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">{services.length} services configured</p>
        <button type="button" onClick={startAdd} className={btnPrimary}><Plus size={14} className="inline mr-1" />Add Service</button>
      </div>

      {services.map((svc, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl group hover:border-[var(--accent)]/30 transition-all">
          {svc.image && <img src={svc.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-[var(--bg)] flex-shrink-0" />}
          {!svc.image && <div className="w-10 h-10 rounded-lg bg-[var(--bg)] flex items-center justify-center flex-shrink-0"><Image size={16} className="text-[var(--text-muted)]" /></div>}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{svc.title}</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">{svc.items?.length || 0} items · {svc.navTitle}</p>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button type="button" onClick={() => move(i, 'up')} disabled={i === 0} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30 transition-all hover:scale-110 active:scale-90"><ChevronUp size={12} /></button>
            <button type="button" onClick={() => move(i, 'down')} disabled={i === services.length - 1} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30 transition-all hover:scale-110 active:scale-90"><ChevronDown size={12} /></button>
            <div className="w-px h-4 bg-[var(--border)] mx-0.5" />
            <button type="button" onClick={() => startEdit(i)} className="p-1 rounded hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit2 size={12} /></button>
            <button type="button" onClick={() => remove(i)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className="text-center py-8 text-[var(--text-muted)]">
          <p className="text-sm">No services added yet</p>
          <p className="text-xs mt-1">Click "Add Service" to create your first service</p>
        </div>
      )}
    </div>
  );
};

export default StickyServicesEditor;
