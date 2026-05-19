import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBlogs, deleteBlog, updateBlog } from '../redux/slices/blogSlice';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Star } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Toggle from '../components/ui/Toggle';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

const BlogsListPage = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((s) => s.blogs);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { dispatch(fetchAllBlogs()); }, [dispatch]);

  const filtered = blogs?.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.slug?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleTogglePublish = async (blog) => {
    await dispatch(updateBlog({ blogId: blog._id, data: { isPublished: !blog.isPublished } }));
    toast.success(blog.isPublished ? 'Unpublished' : 'Published');
  };

  const handleToggleFeatured = async (blog) => {
    await dispatch(updateBlog({ blogId: blog._id, data: { featured: !blog.featured } }));
    toast.success(blog.featured ? 'Unfeatured' : 'Featured');
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteBlog(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Blog deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Blog Posts</h2>
          <p className="text-sm text-[var(--text-muted)]">{blogs?.length || 0} posts</p>
        </div>
        <Link to="/blogs/new" className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium text-sm shadow-lg shadow-[var(--accent)]/15">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search blogs..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No blogs found" description="Write your first blog post" />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Featured</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((blog) => (
                  <tr key={blog._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)]">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{blog.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">/{blog.slug}</p>
                    </td>
                    <td className="px-5 py-3.5"><Badge variant="default">{blog.category || 'General'}</Badge></td>
                    <td className="px-5 py-3.5"><Toggle enabled={blog.isPublished} onChange={() => handleTogglePublish(blog)} size="sm" /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleToggleFeatured(blog)} className={`p-1.5 rounded-lg transition-colors ${blog.featured ? 'text-amber-400' : 'text-[var(--text-muted)] hover:text-amber-400'}`}>
                        <Star size={16} fill={blog.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/blogs/${blog._id}/edit`} className="p-2 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"><Edit2 size={15} /></Link>
                        <button onClick={() => setDeleteTarget(blog)} className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && <ConfirmDialog isOpen onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget._id)} title="Delete Blog" message={`Delete "${deleteTarget.title}"?`} />}
    </div>
  );
};

export default BlogsListPage;
