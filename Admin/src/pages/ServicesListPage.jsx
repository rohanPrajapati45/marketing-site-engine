import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, createService, updateService, deleteService } from '../redux/slices/serviceSlice';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const ServiceFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    title: initialData?.title || '', navTitle: initialData?.navTitle || '',
    image: initialData?.image || '', description: initialData?.description || '',
    items: initialData?.items || [],
  });
  const [itemInput, setItemInput] = useState('');
  const inputCls = "w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Service' : 'Create Service'} size="md">
      <form onSubmit={(e) => { e.preventDefault(); if (!form.title.trim()) return toast.error('Title required'); onSubmit(form); }} className="space-y-4">
        <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Title *</label><input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Service title" className={inputCls} /></div>
        <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Nav Title *</label><input type="text" value={form.navTitle} onChange={e => setForm(p => ({ ...p, navTitle: e.target.value }))} placeholder="Short nav title" className={inputCls} /></div>
        <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Image URL *</label><ImageUploader value={form.image} onChange={(url) => setForm(p => ({ ...p, image: url }))} folder="general" label="" /></div>
        <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description *</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Service description" className={`${inputCls} resize-none`} /></div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Items</label>
          <div className="flex gap-2 mb-2"><input type="text" value={itemInput} onChange={e => setItemInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (itemInput.trim()) { setForm(p => ({ ...p, items: [...p.items, itemInput.trim()] })); setItemInput(''); } } }} placeholder="Add item" className={`flex-1 ${inputCls}`} /><button type="button" onClick={() => { if (itemInput.trim()) { setForm(p => ({ ...p, items: [...p.items, itemInput.trim()] })); setItemInput(''); } }} className="px-3 py-2 bg-[var(--accent)] text-white rounded-xl text-sm">Add</button></div>
          <div className="space-y-1">{form.items.map((item, i) => (<div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg)] rounded-lg"><span className="flex-1 text-sm text-[var(--text-secondary)]">{item}</span><button type="button" onClick={() => setForm(p => ({ ...p, items: p.items.filter((_, j) => j !== i) }))} className="text-[var(--text-muted)] hover:text-red-400"><Trash2 size={13} /></button></div>))}</div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium text-sm">Cancel</button>
          <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium text-sm">{isEdit ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </Modal>
  );
};

const ServicesListPage = () => {
  const dispatch = useDispatch();
  const { services, loading } = useSelector((s) => s.services);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editService, setEditService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

  const filtered = services?.filter(s => s.title?.toLowerCase().includes(search.toLowerCase())) || [];

  const handleCreate = async (data) => {
    const res = await dispatch(createService(data));
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Service created'); setShowCreate(false); }
    else toast.error(res.payload || 'Failed');
  };
  const handleUpdate = async (data) => {
    const res = await dispatch(updateService({ id: editService._id, data }));
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Service updated'); setEditService(null); }
    else toast.error(res.payload || 'Failed');
  };
  const handleDelete = async (id) => {
    const res = await dispatch(deleteService(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-[var(--text-primary)]">Services</h2><p className="text-sm text-[var(--text-muted)]">{services?.length || 0} services</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium text-sm shadow-lg shadow-[var(--accent)]/15"><Plus size={16} /> New Service</button>
      </div>
      <div className="relative"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" /></div>
      {filtered.length === 0 ? <EmptyState title="No services" action={() => setShowCreate(true)} actionLabel="Create Service" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(s => (
            <div key={s._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent)]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="text-sm font-semibold text-[var(--text-primary)]">{s.title}</h3><p className="text-xs text-[var(--text-muted)]">{s.navTitle}</p></div>
                <div className="flex gap-1"><button onClick={() => setEditService(s)} className="p-1.5 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit2 size={14} /></button><button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={14} /></button></div>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{s.description}</p>
              {s.items?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{s.items.slice(0, 3).map((item, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-[var(--hover)] rounded text-[var(--text-muted)]">{item}</span>)}{s.items.length > 3 && <span className="text-[10px] text-[var(--text-muted)]">+{s.items.length - 3}</span>}</div>}
            </div>
          ))}
        </div>
      )}
      {showCreate && <ServiceFormModal isOpen onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {editService && <ServiceFormModal isOpen onClose={() => setEditService(null)} onSubmit={handleUpdate} initialData={editService} />}
      {deleteTarget && <ConfirmDialog isOpen onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget._id)} title="Delete Service" message={`Delete "${deleteTarget.title}"?`} />}
    </div>
  );
};

export default ServicesListPage;
