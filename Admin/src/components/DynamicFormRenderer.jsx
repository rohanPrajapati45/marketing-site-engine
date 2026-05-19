import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import ImageUploader from './ImageUploader';
import WorkCategoryEditor from './WorkCategoryEditor';
import StickyServicesEditor from './StickyServicesEditor';

// Helper: get nested value via dot path (e.g. "contactInfo.heading")
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

// Helper: set nested value via dot path
const setNestedValue = (obj, path, value) => {
  const clone = JSON.parse(JSON.stringify(obj || {}));
  const keys = path.split('.');
  let curr = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!curr[keys[i]] || typeof curr[keys[i]] !== 'object') curr[keys[i]] = {};
    curr = curr[keys[i]];
  }
  curr[keys[keys.length - 1]] = value;
  return clone;
};

// ── Sub-Categories Editor (for work-category-menu) ──
const SubCategoriesEditor = ({ data, onChange }) => {
  const subCats = data?.subCategories || {};
  const [newGroupName, setNewGroupName] = useState('');
  const [newItemInputs, setNewItemInputs] = useState({});

  const addGroup = () => {
    if (!newGroupName.trim()) return;
    const updated = { ...subCats, [newGroupName.trim()]: [] };
    onChange(setNestedValue(data || {}, 'subCategories', updated));
    setNewGroupName('');
  };

  const removeGroup = (key) => {
    const updated = { ...subCats };
    delete updated[key];
    onChange(setNestedValue(data || {}, 'subCategories', updated));
  };

  const addItem = (groupKey) => {
    const val = newItemInputs[groupKey]?.trim();
    if (!val) return;
    const updated = { ...subCats, [groupKey]: [...(subCats[groupKey] || []), val] };
    onChange(setNestedValue(data || {}, 'subCategories', updated));
    setNewItemInputs(p => ({ ...p, [groupKey]: '' }));
  };

  const removeItem = (groupKey, idx) => {
    const updated = { ...subCats, [groupKey]: subCats[groupKey].filter((_, i) => i !== idx) };
    onChange(setNestedValue(data || {}, 'subCategories', updated));
  };

  return (
    <div className="space-y-3">
      {Object.entries(subCats).map(([groupKey, items]) => (
        <div key={groupKey} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">{groupKey}</span>
            <button type="button" onClick={() => removeGroup(groupKey)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400">
              <Trash2 size={13} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded-md text-xs text-[var(--text-secondary)]">
                {item}
                <button type="button" onClick={() => removeItem(groupKey, idx)} className="hover:text-red-400 ml-0.5">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input type="text" value={newItemInputs[groupKey] || ''} onChange={(e) => setNewItemInputs(p => ({ ...p, [groupKey]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(groupKey))} placeholder="Add option..." className="flex-1 px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
            <button type="button" onClick={() => addItem(groupKey)} className="px-2.5 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium">Add</button>
          </div>
        </div>
      ))}
      <div className="flex gap-1.5">
        <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGroup())} placeholder="New filter group name (e.g. By Industry)" className="flex-1 px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
        <button type="button" onClick={addGroup} className="px-3 py-2 bg-[var(--accent)] text-white rounded-lg text-xs font-medium">Add Group</button>
      </div>
    </div>
  );
};

// ── Object Array Editor (e.g. emails, phones, projects) ──
const ObjectArrayEditor = ({ items, subFields, onChange, label }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [collapsed, setCollapsed] = useState({});

  const addItem = () => {
    const defaults = {};
    subFields.forEach(f => {
      defaults[f.name] = f.type === 'toggle' ? false : f.type === 'number' ? 0 : '';
    });
    setEditData(defaults);
    setEditIdx(-1);
  };

  const saveItem = () => {
    const newItems = [...(items || [])];
    if (editIdx === -1) newItems.push(editData);
    else newItems[editIdx] = editData;
    onChange(newItems);
    setEditIdx(null);
    setEditData({});
  };

  const removeItem = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const moveItem = (idx, dir) => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= items.length) return;
    const newItems = [...items];
    [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
    onChange(newItems);
  };

  const getItemLabel = (item) => {
    return item.title || item.label || item.name || item.city || item.value || `Item`;
  };

  if (editIdx !== null) {
    return (
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 space-y-3">
        <p className="text-xs font-medium text-[var(--text-primary)]">{editIdx === -1 ? `New ${label}` : `Edit ${label} #${editIdx + 1}`}</p>
        {subFields.map((sf) => (
          <div key={sf.name}>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">{sf.label}{sf.required && <span className="text-red-400">*</span>}</label>
            {sf.type === 'toggle' ? (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <div onClick={() => setEditData(p => ({ ...p, [sf.name]: !p[sf.name] }))} className={`w-9 h-5 rounded-full relative cursor-pointer ${editData[sf.name] ? 'bg-emerald-500' : 'bg-[var(--border)]'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${editData[sf.name] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-[var(--text-secondary)]">{editData[sf.name] ? 'Yes' : 'No'}</span>
              </label>
            ) : sf.type === 'select' ? (
              <select value={editData[sf.name] || ''} onChange={(e) => setEditData(p => ({ ...p, [sf.name]: e.target.value }))} className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]">
                <option value="">Select...</option>
                {(sf.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : sf.type === 'image' ? (
              <ImageUploader value={editData[sf.name] || ''} onChange={(url) => setEditData(p => ({ ...p, [sf.name]: url }))} label="" />
            ) : (
              <input type={sf.type === 'number' ? 'number' : 'text'} value={editData[sf.name] ?? ''} onChange={(e) => setEditData(p => ({ ...p, [sf.name]: sf.type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={sf.placeholder || ''} className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
            )}
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={() => setEditIdx(null)} className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">Cancel</button>
          <button type="button" onClick={saveItem} className="flex-1 px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-medium">{editIdx === -1 ? 'Add' : 'Save'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {(items || []).map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg group">
          <GripVertical size={13} className="text-[var(--text-muted)] opacity-40 flex-shrink-0" />
          <span className="text-xs font-mono text-[var(--text-muted)] w-5 flex-shrink-0">{idx + 1}</span>
          <span className="flex-1 text-xs text-[var(--text-primary)] truncate">{getItemLabel(item)}</span>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="p-0.5 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronUp size={12} /></button>
            <button type="button" onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1} className="p-0.5 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronDown size={12} /></button>
            <button type="button" onClick={() => { setEditData({ ...item }); setEditIdx(idx); }} className="px-1.5 py-0.5 rounded text-[10px] text-[var(--accent)] hover:bg-[var(--accent)]/10 font-medium">Edit</button>
            <button type="button" onClick={() => removeItem(idx)} className="p-0.5 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addItem} className="flex items-center gap-1.5 px-3 py-2 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg font-medium w-full justify-center border border-dashed border-[var(--border)] hover:border-[var(--accent)]">
        <Plus size={13} /> Add {label}
      </button>
    </div>
  );
};

// ── MAIN COMPONENT ──
const DynamicFormRenderer = ({ schema, data, onChange }) => {
  if (!schema || !Array.isArray(schema)) return null;

  const handleFieldChange = (fieldPath, value) => {
    onChange(setNestedValue(data, fieldPath, value));
  };

  const renderField = (field) => {
    const value = getNestedValue(data, field.name) ?? (field.type === 'array' ? [] : '');

    switch (field.type) {
      case 'text':
        return (
          <input type="text" value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} placeholder={field.placeholder || ''} required={field.required} className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all" />
        );

      case 'textarea':
        return (
          <textarea value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} placeholder={field.placeholder || ''} required={field.required} rows={3} className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all resize-none" />
        );

      case 'number':
        return (
          <input type="number" value={value} onChange={(e) => handleFieldChange(field.name, Number(e.target.value))} placeholder={field.placeholder || ''} className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all" />
        );

      case 'image':
        return <ImageUploader value={value} onChange={(url) => handleFieldChange(field.name, url)} label="" />;

      case 'select':
        return (
          <select value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all">
            <option value="">Select...</option>
            {(field.options || []).map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        );

      case 'toggle':
        return (
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <div onClick={() => handleFieldChange(field.name, !value)} className={`w-10 h-5 rounded-full relative cursor-pointer ${value ? 'bg-emerald-500' : 'bg-[var(--border)]'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">{value ? 'Yes' : 'No'}</span>
          </label>
        );

      case 'array': {
        const items = Array.isArray(value) ? value : [];
        const maxItems = field.max || Infinity;
        return (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={item} onChange={(e) => { const n = [...items]; n[idx] = e.target.value; handleFieldChange(field.name, n); }} placeholder={field.placeholder || `Item ${idx + 1}`} className="flex-1 px-3.5 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all" />
                <button type="button" onClick={() => handleFieldChange(field.name, items.filter((_, i) => i !== idx))} className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
            {items.length < maxItems && (
              <button type="button" onClick={() => handleFieldChange(field.name, [...items, ''])} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg font-medium">
                <Plus size={14} /> Add {field.label || 'Item'}
              </button>
            )}
          </div>
        );
      }

      case 'objectArray':
        return (
          <ObjectArrayEditor
            items={Array.isArray(value) ? value : []}
            subFields={field.subFields || []}
            onChange={(newItems) => handleFieldChange(field.name, newItems)}
            label={field.label || 'Item'}
          />
        );

      case 'info':
        return (
          <div className="px-4 py-3 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl">
            <p className="text-xs text-[var(--accent)]">ℹ️ {field.description}</p>
          </div>
        );

      case 'subcategories':
        return <SubCategoriesEditor data={data} onChange={onChange} />;

      case 'workCategoryEditor':
        return <WorkCategoryEditor data={data} onChange={onChange} />;

      case 'stickyServicesEditor':
        return <StickyServicesEditor data={data} onChange={onChange} />;

      default:
        return (
          <input type="text" value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all" />
        );
    }
  };

  return (
    <div className="space-y-5">
      {schema.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            {field.label}
            {field.required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
          {field.description && <p className="text-xs text-[var(--text-muted)] mb-2">{field.description}</p>}
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

export default DynamicFormRenderer;
