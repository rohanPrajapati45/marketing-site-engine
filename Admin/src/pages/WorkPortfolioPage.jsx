import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchSubcategories, createSubcategory, updateSubcategory, deleteSubcategory,
  fetchProjects, createProject, updateProject, deleteProject,
} from '../redux/slices/workSlice';
import { Plus, Edit2, Trash2, FolderOpen, Tag, Briefcase, Search, Eye, EyeOff, Star, StarOff } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

const inputCls = "w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";
const TAB_KEYS = ['categories', 'subcategories', 'projects'];
const TAB_LABELS = { categories: 'Categories', subcategories: 'Subcategories', projects: 'Projects' };
const TAB_ICONS = { categories: FolderOpen, subcategories: Tag, projects: Briefcase };

const WorkPortfolioPage = () => {
  const dispatch = useDispatch();
  const { categories, subcategories, projects, loading } = useSelector((s) => s.work);
  const [tab, setTab] = useState('categories');
  const [search, setSearch] = useState('');
  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubcategories());
    dispatch(fetchProjects());
  }, [dispatch]);

  // ── CATEGORIES TAB ──
  const renderCategories = () => {
    const filtered = categories?.filter(c => c.name?.toLowerCase().includes(search.toLowerCase())) || [];
    return (
      <>
        {filtered.length === 0 ? (
          <EmptyState title="No categories" description="Create categories like 'By Industry', 'By Region'" action={() => setShowCreate(true)} actionLabel="Add Category" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(cat => (
              <div key={cat._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)]/30 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={16} className="text-[var(--accent)]" />
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{cat.name}</h3>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditItem({ ...cat, _type: 'category' })} className="p-1.5 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit2 size={13} /></button>
                    <button onClick={() => setDeleteTarget({ ...cat, _type: 'category' })} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cat.subcategory?.map(sc => (
                    <span key={sc._id || sc} className="text-[10px] px-1.5 py-0.5 bg-[var(--hover)] rounded text-[var(--text-muted)]">
                      {sc.name || sc}
                    </span>
                  ))}
                  {(!cat.subcategory || cat.subcategory.length === 0) && <span className="text-[10px] text-[var(--text-muted)]">No subcategories</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  // ── SUBCATEGORIES TAB ──
  const renderSubcategories = () => {
    const filtered = subcategories?.filter(sc => sc.name?.toLowerCase().includes(search.toLowerCase())) || [];
    return (
      <>
        {filtered.length === 0 ? (
          <EmptyState title="No subcategories" description="Create subcategories under categories (e.g. 'Fintech' under 'By Industry')" action={() => setShowCreate(true)} actionLabel="Add Subcategory" />
        ) : (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sc => (
                  <tr key={sc._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)]">
                    <td className="px-5 py-3"><span className="text-sm font-medium text-[var(--text-primary)]">{sc.name}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {sc.category?.map(c => <Badge key={c._id || c} variant="accent">{c.name || c}</Badge>)}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditItem({ ...sc, _type: 'subcategory' })} className="p-1.5 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteTarget({ ...sc, _type: 'subcategory' })} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  // ── PROJECTS TAB ──
  const renderProjects = () => {
    const filtered = projects?.filter(p => p.title?.toLowerCase().includes(search.toLowerCase())) || [];
    return (
      <>
        {filtered.length === 0 ? (
          <EmptyState title="No projects" description="Add portfolio projects and assign them to categories" action={() => setShowCreate(true)} actionLabel="Add Project" />
        ) : (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Project</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Subcategories</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Recent</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Coming Soon</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(proj => (
                    <tr key={proj._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {proj.image && <img src={proj.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-[var(--bg)]" />}
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{proj.title}</p>
                            <p className="text-xs text-[var(--text-muted)]">{proj.projectlink}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {proj.subcategories?.map(sc => <Badge key={sc._id || sc} variant="info">{sc.name || sc}</Badge>)}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => handleToggleProjectField(proj, 'isRecentProject')} className={`p-1.5 rounded-lg ${proj.isRecentProject ? 'text-amber-400' : 'text-[var(--text-muted)]'}`}>
                          {proj.isRecentProject ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => handleToggleProjectField(proj, 'isComingSoon')} className={`p-1.5 rounded-lg ${proj.isComingSoon ? 'text-purple-400' : 'text-[var(--text-muted)]'}`}>
                          {proj.isComingSoon ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditItem({ ...proj, _type: 'project' })} className="p-1.5 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteTarget({ ...proj, _type: 'project' })} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleToggleProjectField = async (proj, field) => {
    await dispatch(updateProject({ id: proj._id, data: { [field]: !proj[field] } }));
    toast.success(`${field === 'isRecentProject' ? 'Recent' : 'Coming Soon'} toggled`);
  };

  // ── CRUD HANDLERS ──
  const handleCreate = async (data) => {
    let res;
    if (tab === 'categories') res = await dispatch(createCategory(data));
    else if (tab === 'subcategories') res = await dispatch(createSubcategory(data));
    else res = await dispatch(createProject(data));
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Created!'); setShowCreate(false); dispatch(fetchCategories()); dispatch(fetchSubcategories()); }
    else toast.error(res.payload || 'Failed');
  };

  const handleUpdate = async (data) => {
    let res;
    if (editItem._type === 'category') res = await dispatch(updateCategory({ id: editItem._id, data }));
    else if (editItem._type === 'subcategory') res = await dispatch(updateSubcategory({ id: editItem._id, data }));
    else res = await dispatch(updateProject({ id: editItem._id, data }));
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Updated!'); setEditItem(null); dispatch(fetchCategories()); dispatch(fetchSubcategories()); }
    else toast.error(res.payload || 'Failed');
  };

  const handleDelete = async () => {
    let res;
    if (deleteTarget._type === 'category') res = await dispatch(deleteCategory(deleteTarget._id));
    else if (deleteTarget._type === 'subcategory') res = await dispatch(deleteSubcategory(deleteTarget._id));
    else res = await dispatch(deleteProject(deleteTarget._id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Deleted!');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Work Portfolio</h2>
          <p className="text-sm text-[var(--text-muted)]">Manage categories, subcategories & projects</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium text-sm shadow-lg shadow-[var(--accent)]/15">
          <Plus size={16} /> Add {TAB_LABELS[tab].slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
        {TAB_KEYS.map(t => {
          const Icon = TAB_ICONS[t];
          return (
            <button key={t} onClick={() => { setTab(t); setSearch(''); }} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--hover)]'}`}>
              <Icon size={16} /> {TAB_LABELS[t]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-white/20' : 'bg-[var(--hover)]'}`}>
                {t === 'categories' ? categories?.length || 0 : t === 'subcategories' ? subcategories?.length || 0 : projects?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${TAB_LABELS[tab].toLowerCase()}...`} className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
      </div>

      {/* Content */}
      {tab === 'categories' && renderCategories()}
      {tab === 'subcategories' && renderSubcategories()}
      {tab === 'projects' && renderProjects()}

      {/* Create/Edit Modals */}
      {(showCreate || editItem) && (
        <FormModal
          isOpen
          onClose={() => { setShowCreate(false); setEditItem(null); }}
          onSubmit={editItem ? handleUpdate : handleCreate}
          type={editItem?._type || tab.slice(0, -3) + (tab === 'categories' ? 'y' : tab === 'subcategories' ? 'y' : '')}
          tab={tab}
          initialData={editItem}
          categories={categories}
          subcategories={subcategories}
        />
      )}

      {/* Delete */}
      {deleteTarget && <ConfirmDialog isOpen onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title={`Delete ${deleteTarget._type}`} message={`Delete "${deleteTarget.name || deleteTarget.title}"?`} />}
    </div>
  );
};

// ── FORM MODAL ──
const FormModal = ({ isOpen, onClose, onSubmit, tab, initialData, categories, subcategories }) => {
  const isEdit = !!initialData;
  const activeTab = initialData?._type ? initialData._type.replace('y', 'ies').replace('ie', 'y') + (initialData._type.endsWith('y') ? '' : 's') : tab;

  // Category form
  const [catName, setCatName] = useState(initialData?.name || '');
  // Subcategory form
  const [subName, setSubName] = useState(initialData?.name || '');
  const [selectedCats, setSelectedCats] = useState(initialData?.category?.map(c => c._id || c) || []);
  // Project form
  const [projForm, setProjForm] = useState({
    title: initialData?.title || '',
    image: initialData?.image || '',
    projectlink: initialData?.projectlink || '',
    isComingSoon: initialData?.isComingSoon || false,
    isRecentProject: initialData?.isRecentProject || false,
    subcategories: initialData?.subcategories?.map(sc => sc._id || sc) || [],
  });

  const toggleCat = (id) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSubcat = (id) => {
    setProjForm(p => ({ ...p, subcategories: p.subcategories.includes(id) ? p.subcategories.filter(x => x !== id) : [...p.subcategories, id] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'categories' || initialData?._type === 'category') {
      if (!catName.trim()) return toast.error('Name required');
      onSubmit({ name: catName });
    } else if (tab === 'subcategories' || initialData?._type === 'subcategory') {
      if (!subName.trim()) return toast.error('Name required');
      if (selectedCats.length === 0) return toast.error('Select at least 1 category');
      onSubmit({ name: subName, category: selectedCats });
    } else {
      if (!projForm.title.trim()) return toast.error('Title required');
      if (!projForm.image.trim()) return toast.error('Image required');
      if (!projForm.projectlink.trim()) return toast.error('Link required');
      onSubmit(projForm);
    }
  };

  const isCat = tab === 'categories' || initialData?._type === 'category';
  const isSub = tab === 'subcategories' || initialData?._type === 'subcategory';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isEdit ? 'Edit' : 'Create'} ${isCat ? 'Category' : isSub ? 'Subcategory' : 'Project'}`} size={isCat ? 'sm' : 'md'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isCat && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Category Name *</label>
            <input type="text" value={catName} onChange={e => setCatName(e.target.value)} placeholder="e.g. By Industry" className={inputCls} autoFocus />
          </div>
        )}

        {isSub && (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Subcategory Name *</label>
              <input type="text" value={subName} onChange={e => setSubName(e.target.value)} placeholder="e.g. Fintech & Banking" className={inputCls} autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Belongs to Categories *</label>
              <div className="flex flex-wrap gap-2">
                {categories?.map(c => (
                  <button key={c._id} type="button" onClick={() => toggleCat(c._id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedCats.includes(c._id) ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {!isCat && !isSub && (
          <>
            <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Title *</label><input type="text" value={projForm.title} onChange={e => setProjForm(p => ({ ...p, title: e.target.value }))} placeholder="Project name" className={inputCls} autoFocus /></div>
            <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Image URL *</label><input type="text" value={projForm.image} onChange={e => setProjForm(p => ({ ...p, image: e.target.value }))} placeholder="/images/project.webp" className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Project Link *</label><input type="text" value={projForm.projectlink} onChange={e => setProjForm(p => ({ ...p, projectlink: e.target.value }))} placeholder="/work/project-slug" className={inputCls} /></div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Subcategories</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {subcategories?.map(sc => (
                  <button key={sc._id} type="button" onClick={() => toggleSubcat(sc._id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${projForm.subcategories.includes(sc._id) ? 'border-sky-400 bg-sky-500/10 text-sky-400' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-sky-400/30'}`}>
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setProjForm(p => ({ ...p, isRecentProject: !p.isRecentProject }))} className={`w-10 h-5 rounded-full relative cursor-pointer ${projForm.isRecentProject ? 'bg-amber-500' : 'bg-[var(--border)]'}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${projForm.isRecentProject ? 'translate-x-5' : 'translate-x-0.5'}`} /></div>
                <span className="text-sm text-[var(--text-secondary)]">Recent Project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setProjForm(p => ({ ...p, isComingSoon: !p.isComingSoon }))} className={`w-10 h-5 rounded-full relative cursor-pointer ${projForm.isComingSoon ? 'bg-purple-500' : 'bg-[var(--border)]'}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${projForm.isComingSoon ? 'translate-x-5' : 'translate-x-0.5'}`} /></div>
                <span className="text-sm text-[var(--text-secondary)]">Coming Soon</span>
              </label>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium text-sm">Cancel</button>
          <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium text-sm">{isEdit ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkPortfolioPage;
