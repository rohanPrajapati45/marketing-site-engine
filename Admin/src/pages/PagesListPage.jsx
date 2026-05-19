import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPages, createPage, updatePage, deletePage } from '../redux/slices/pageSlice';
import { Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PageFormModal from '../components/PageFormModal';
import Toggle from '../components/ui/Toggle';
import toast from 'react-hot-toast';

const PagesListPage = () => {
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((s) => s.pages);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editPage, setEditPage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPages());
  }, [dispatch]);

  const filtered = pages?.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleCreate = async (data) => {
    const res = await dispatch(createPage(data));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Page created');
      setShowCreate(false);
    } else {
      toast.error(res.payload || 'Failed to create page');
    }
  };

  const handleUpdate = async (data) => {
    const res = await dispatch(updatePage({ pageId: editPage._id, data }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Page updated');
      setEditPage(null);
    } else {
      toast.error(res.payload || 'Failed to update page');
    }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deletePage(id));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Page deleted');
    }
  };

  const handleTogglePublish = async (page) => {
    await dispatch(updatePage({ pageId: page._id, data: { isPublished: !page.isPublished } }));
    toast.success(page.isPublished ? 'Unpublished' : 'Published');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Pages</h2>
          <p className="text-sm text-[var(--text-muted)]">{pages?.length || 0} total pages</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium transition-colors text-sm shadow-lg shadow-[var(--accent)]/15">
          <Plus size={16} />
          New Page
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState title="No pages found" description="Create your first page to get started" action={() => setShowCreate(true)} actionLabel="Create Page" />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Page</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Slug</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Published</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((page) => (
                  <tr key={page._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/pages/${page._id}`} className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                        {page.title || 'Untitled'}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="text-xs text-[var(--text-muted)] bg-[var(--bg)] px-2 py-1 rounded-md">/{page.slug}</code>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={page.isPublished ? 'success' : 'warning'}>{page.isPublished ? 'Published' : 'Draft'}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Toggle enabled={page.isPublished} onChange={() => handleTogglePublish(page)} size="sm" />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/pages/${page._id}`} className="p-2 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" title="Page Builder">
                          <ExternalLink size={15} />
                        </Link>
                        <button onClick={() => setEditPage(page)} className="p-2 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(page)} className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreate && <PageFormModal isOpen onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {editPage && <PageFormModal isOpen onClose={() => setEditPage(null)} onSubmit={handleUpdate} initialData={editPage} />}
      {deleteTarget && (
        <ConfirmDialog isOpen onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget._id)} title="Delete Page" message={`Delete "${deleteTarget.title || deleteTarget.slug}"? This will also delete all sections and cards.`} />
      )}
    </div>
  );
};

export default PagesListPage;
