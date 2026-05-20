import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit2, GripVertical, X, Star, Eye, EyeOff } from 'lucide-react';
import ImageUploader from './ImageUploader';

const inputCls = "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";
const btnPrimary = "px-3 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl text-xs font-medium transition-colors";
const btnOutline = "px-3 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-xl text-xs font-medium hover:bg-[var(--hover)] transition-colors";

const WorkCategoryEditor = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState('tabs');
  const tabs = data?.tabs || [];
  const subCategories = data?.subCategories || {};
  const projects = data?.projects || [];
  const recentConfig = data?.recentProjectsConfig || { categories: [], maxPerCategory: 3 };

  const update = (key, value) => onChange({ ...data, [key]: value });

  const allIndustries = subCategories['By Industry'] || [];
  const allRegions = subCategories['By Region'] || [];
  const allServices = subCategories['By Service'] || [];

  // All subcategory options from all groups for Recent Config
  const allSubcatOptions = Object.entries(subCategories).flatMap(([group, items]) =>
    items.map(item => ({ name: item, group }))
  );

  const editorTabs = [
    { key: 'tabs', label: 'Menu Tabs', count: tabs.length },
    { key: 'subcats', label: 'Sub-Categories', count: Object.keys(subCategories).length },
    { key: 'projects', label: 'Projects', count: projects.length },
    { key: 'recent', label: 'Recent Config', count: recentConfig.categories?.length || 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-1">
        {editorTabs.map(t => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === t.key ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--hover)]'}`}>
            {t.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === t.key ? 'bg-white/20' : 'bg-[var(--hover)]'}`}>{t.count}</span>
          </button>
        ))}
      </div>
      {activeTab === 'tabs' && <TabsManager tabs={tabs} onChange={(v) => update('tabs', v)} />}
      {activeTab === 'subcats' && <SubCatsManager subCategories={subCategories} onChange={(v) => update('subCategories', v)} />}
      {activeTab === 'projects' && <ProjectsManager projects={projects} onChange={(v) => update('projects', v)} subCategories={subCategories} />}
      {activeTab === 'recent' && <RecentConfig config={recentConfig} onChange={(v) => update('recentProjectsConfig', v)} allOptions={allSubcatOptions} />}
    </div>
  );
};

// ── TABS MANAGER ──
const TabsManager = ({ tabs, onChange }) => {
  const [newTab, setNewTab] = useState('');
  const add = () => { if (newTab.trim()) { onChange([...tabs, newTab.trim()]); setNewTab(''); } };
  const remove = (i) => onChange(tabs.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const t = dir === 'up' ? i - 1 : i + 1;
    if (t < 0 || t >= tabs.length) return;
    const n = [...tabs]; [n[i], n[t]] = [n[t], n[i]]; onChange(n);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--text-muted)]">These tabs appear in the work page menu bar. Drag to reorder.</p>
      {tabs.map((tab, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl group">
          <GripVertical size={14} className="text-[var(--text-muted)] opacity-40" />
          <span className="text-xs font-mono text-[var(--text-muted)] w-4">{i + 1}</span>
          <span className="flex-1 text-sm text-[var(--text-primary)]">{tab}</span>
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => move(i, 'up')} disabled={i === 0} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronUp size={12} /></button>
            <button type="button" onClick={() => move(i, 'down')} disabled={i === tabs.length - 1} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronDown size={12} /></button>
            <button type="button" onClick={() => remove(i)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <input type="text" value={newTab} onChange={e => setNewTab(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} placeholder="New tab name..." className={inputCls} />
        <button type="button" onClick={add} className={btnPrimary}>Add Tab</button>
      </div>
    </div>
  );
};

// ── SUBCATEGORIES MANAGER ──
const SubCatsManager = ({ subCategories, onChange }) => {
  const [newGroup, setNewGroup] = useState('');
  const [newItems, setNewItems] = useState({});

  const addGroup = () => { if (newGroup.trim()) { onChange({ ...subCategories, [newGroup.trim()]: [] }); setNewGroup(''); } };
  const removeGroup = (key) => { const c = { ...subCategories }; delete c[key]; onChange(c); };
  const addItem = (key) => {
    const val = newItems[key]?.trim();
    if (!val) return;
    onChange({ ...subCategories, [key]: [...(subCategories[key] || []), val] });
    setNewItems(p => ({ ...p, [key]: '' }));
  };
  const removeItem = (key, idx) => {
    onChange({ ...subCategories, [key]: subCategories[key].filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--text-muted)]">Define filter categories and their options. These appear as filter buttons when a tab is selected.</p>
      {Object.entries(subCategories).map(([key, items]) => (
        <div key={key} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text-primary)]">{key}</span>
            <button type="button" onClick={() => removeGroup(key)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={13} /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-secondary)]">
                {item}
                <button type="button" onClick={() => removeItem(key, idx)} className="hover:text-red-400 ml-0.5 text-[var(--text-muted)]">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input type="text" value={newItems[key] || ''} onChange={e => setNewItems(p => ({ ...p, [key]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(key))} placeholder="Add option..." className="flex-1 px-2.5 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
            <button type="button" onClick={() => addItem(key)} className="px-2.5 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium">Add</button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <input type="text" value={newGroup} onChange={e => setNewGroup(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGroup())} placeholder="New group (e.g. By Industry)" className={inputCls} />
        <button type="button" onClick={addGroup} className={btnPrimary}>Add Group</button>
      </div>
    </div>
  );
};

// ── PROJECTS MANAGER ──
const ProjectsManager = ({ projects, onChange, subCategories = {} }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');

  // Build dynamic category fields from subcategories
  // e.g. "By Industry" → key: "industry", "By Region" → key: "region", "By Custom" → key: "custom"
  const catFields = Object.entries(subCategories).map(([group, options]) => {
    const key = group.replace(/^By\s+/i, '').toLowerCase().replace(/\s+/g, '_');
    return { key, label: group, options };
  });

  const buildDefaults = () => {
    const defaults = { title: '', image: '', projectlink: '', isComingSoon: false, isRecentProject: false };
    catFields.forEach(f => { defaults[f.key] = ''; });
    return defaults;
  };

  const startAdd = () => { setForm(buildDefaults()); setEditIdx(-1); };
  const startEdit = (i) => { setForm({ ...projects[i] }); setEditIdx(i); };
  const save = () => {
    const n = [...projects];
    if (editIdx === -1) n.push(form); else n[editIdx] = form;
    onChange(n); setEditIdx(null);
  };
  const remove = (i) => onChange(projects.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const t = dir === 'up' ? i - 1 : i + 1;
    if (t < 0 || t >= projects.length) return;
    const n = [...projects]; [n[i], n[t]] = [n[t], n[i]]; onChange(n);
  };
  const toggleField = (i, field) => {
    const n = [...projects]; n[i] = { ...n[i], [field]: !n[i][field] }; onChange(n);
  };

  const filtered = projects.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  if (editIdx !== null) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-3 animate-fade-in">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{editIdx === -1 ? 'Add Project' : `Edit: ${form.title}`}</p>
        <div><label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Title *</label><input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Project name" className={inputCls} /></div>
        <ImageUploader label="Image" value={form.image} onChange={(url) => setForm(p => ({ ...p, image: url }))} folder="projects" required />
        <div><label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Project Link *</label><input type="text" value={form.projectlink} onChange={e => setForm(p => ({ ...p, projectlink: e.target.value }))} placeholder="/work/project-slug" className={inputCls} /></div>

        <div className={`grid grid-cols-1 gap-3 ${catFields.length >= 3 ? 'sm:grid-cols-3' : catFields.length === 2 ? 'sm:grid-cols-2' : ''}`}>
          {catFields.map(({ key, label, options }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">{label}</label>
              <select value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className={inputCls}>
                <option value="">Select {label.replace(/^By\s+/i, '').toLowerCase()}...</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm(p => ({ ...p, isRecentProject: !p.isRecentProject }))} className={`w-10 h-5 rounded-full relative cursor-pointer ${form.isRecentProject ? 'bg-amber-500' : 'bg-[var(--border)]'}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${form.isRecentProject ? 'translate-x-5' : 'translate-x-0.5'}`} /></div>
            <span className="text-xs text-[var(--text-secondary)]">Show in Recent</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm(p => ({ ...p, isComingSoon: !p.isComingSoon }))} className={`w-10 h-5 rounded-full relative cursor-pointer ${form.isComingSoon ? 'bg-purple-500' : 'bg-[var(--border)]'}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${form.isComingSoon ? 'translate-x-5' : 'translate-x-0.5'}`} /></div>
            <span className="text-xs text-[var(--text-secondary)]">Coming Soon</span>
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={() => setEditIdx(null)} className={`flex-1 ${btnOutline}`}>Cancel</button>
          <button type="button" onClick={save} className={`flex-1 ${btnPrimary}`}>{editIdx === -1 ? 'Add Project' : 'Save'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className={`flex-1 ${inputCls}`} />
        <button type="button" onClick={startAdd} className={btnPrimary}><Plus size={14} className="inline mr-1" />Add Project</button>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{projects.length} projects · Click ⭐ to toggle Recent · 👁 to toggle Coming Soon</p>
      {filtered.map((proj, realIdx) => {
        const i = projects.indexOf(proj);
        return (
          <div key={i} className="flex items-center gap-2 px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl group hover:border-[var(--accent)]/30 transition-all">
            {proj.image && <img src={proj.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-[var(--bg)] flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{proj.title}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{[proj.industry, proj.region, proj.service].filter(Boolean).join(' · ')}</p>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button type="button" onClick={() => toggleField(i, 'isRecentProject')} className={`p-1.5 rounded-lg transition-colors ${proj.isRecentProject ? 'text-amber-400' : 'text-[var(--text-muted)] hover:text-amber-400'}`} title="Recent"><Star size={14} fill={proj.isRecentProject ? 'currentColor' : 'none'} /></button>
              <button type="button" onClick={() => toggleField(i, 'isComingSoon')} className={`p-1.5 rounded-lg transition-colors ${proj.isComingSoon ? 'text-purple-400' : 'text-[var(--text-muted)] hover:text-purple-400'}`} title="Coming Soon">{proj.isComingSoon ? <Eye size={14} /> : <EyeOff size={14} />}</button>
              <div className="w-px h-4 bg-[var(--border)] mx-0.5" />
              <button type="button" onClick={() => move(i, 'up')} disabled={i === 0} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronUp size={12} /></button>
              <button type="button" onClick={() => move(i, 'down')} disabled={i === projects.length - 1} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronDown size={12} /></button>
              <button type="button" onClick={() => startEdit(i)} className="p-1 rounded hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit2 size={12} /></button>
              <button type="button" onClick={() => remove(i)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── RECENT PROJECTS CONFIG ──
const RecentConfig = ({ config, onChange, allOptions }) => {
  const selected = config?.categories || [];
  const maxDefault = config?.maxPerCategory || 3;

  const toggle = (name) => {
    const exists = selected.find(c => c.name === name);
    if (exists) onChange({ ...config, categories: selected.filter(c => c.name !== name) });
    else onChange({ ...config, categories: [...selected, { name, max: maxDefault }] });
  };

  const updateMax = (i, val) => {
    const n = [...selected]; n[i] = { ...n[i], max: val === '' ? '' : (parseInt(val) || '') };
    onChange({ ...config, categories: n });
  };
  const blurMax = (i) => {
    const n = [...selected]; if (!n[i].max) n[i] = { ...n[i], max: maxDefault };
    onChange({ ...config, categories: n });
  };

  const move = (i, dir) => {
    const t = dir === 'up' ? i - 1 : i + 1;
    if (t < 0 || t >= selected.length) return;
    const n = [...selected]; [n[i], n[t]] = [n[t], n[i]];
    onChange({ ...config, categories: n });
  };

  // Group allOptions by their parent group
  const grouped = {};
  allOptions.forEach(o => { if (!grouped[o.group]) grouped[o.group] = []; grouped[o.group].push(o.name); });

  return (
    <div className="space-y-4">
      <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl px-4 py-3">
        <p className="text-xs text-[var(--accent)]">ℹ️ Select which categories to show in "Recent Projects". Pick from any group (Industry, Region, Service, etc). Only projects marked as "Recent" will appear.</p>
      </div>
      <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Default Max Projects Per Category</label><input type="text" inputMode="numeric" value={maxDefault} onFocus={e => e.target.select()} onChange={e => { const v = e.target.value.replace(/\D/g, ''); onChange({ ...config, maxPerCategory: v === '' ? '' : parseInt(v) }); }} onBlur={e => { if (!e.target.value) onChange({ ...config, maxPerCategory: 3 }); }} className={`w-32 ${inputCls}`} /></div>
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group}>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{group}</label>
          <div className="flex flex-wrap gap-2">
            {items.map(name => {
              const isSelected = selected.some(c => c.name === name);
              return (<button key={name} type="button" onClick={() => toggle(name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isSelected ? 'border-amber-400 bg-amber-500/10 text-amber-400' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-amber-400/30'}`}>{name}</button>);
            })}
          </div>
        </div>
      ))}
      {allOptions.length === 0 && <p className="text-xs text-[var(--text-muted)]">No subcategories defined yet. Add them in the Sub-Categories tab first.</p>}
      {selected.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Display Order & Max per Category</label>
          <div className="space-y-1.5">
            {selected.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl group">
                <span className="text-xs font-mono text-[var(--text-muted)] w-4">{i + 1}</span>
                <span className="flex-1 text-sm text-[var(--text-primary)]">{cat.name}</span>
                <input type="text" inputMode="numeric" value={cat.max || maxDefault} onFocus={e => e.target.select()} onChange={e => updateMax(i, e.target.value.replace(/\D/g, ''))} onBlur={() => blurMax(i)} className="w-14 px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-center text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" title="Max projects" />
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => move(i, 'up')} disabled={i === 0} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronUp size={12} /></button>
                  <button type="button" onClick={() => move(i, 'down')} disabled={i === selected.length - 1} className="p-1 rounded hover:bg-[var(--hover)] text-[var(--text-muted)] disabled:opacity-30"><ChevronDown size={12} /></button>
                  <button type="button" onClick={() => toggle(cat.name)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><X size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkCategoryEditor;
