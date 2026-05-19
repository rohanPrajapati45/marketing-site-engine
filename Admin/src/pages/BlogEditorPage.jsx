import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createBlog, updateBlog, fetchSingleBlog, clearCurrentBlog } from '../redux/slices/blogSlice';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';

const BlogEditorPage = () => {
  const { blogId } = useParams();
  const isEdit = !!blogId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, loading } = useSelector((s) => s.blogs);

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', coverImage: '', content: '',
    category: 'General', tags: [], isPublished: true, featured: false,
    seo: { metaTitle: '', metaDescription: '', ogImage: '' },
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit) dispatch(fetchSingleBlog(blogId));
    return () => dispatch(clearCurrentBlog());
  }, [dispatch, blogId, isEdit]);

  useEffect(() => {
    if (currentBlog && isEdit) {
      setForm({
        title: currentBlog.title || '',
        slug: currentBlog.slug || '',
        excerpt: currentBlog.excerpt || '',
        coverImage: currentBlog.coverImage || '',
        content: currentBlog.content || '',
        category: currentBlog.category || 'General',
        tags: currentBlog.tags || [],
        isPublished: currentBlog.isPublished ?? true,
        featured: currentBlog.featured ?? false,
        seo: currentBlog.seo || { metaTitle: '', metaDescription: '', ogImage: '' },
      });
    }
  }, [currentBlog, isEdit]);

  const handleChange = (field, value) => {
    if (field.startsWith('seo.')) {
      setForm(p => ({ ...p, seo: { ...p.seo, [field.split('.')[1]]: value } }));
    } else {
      setForm(p => ({ ...p, [field]: value }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (t) => setForm(p => ({ ...p, tags: p.tags.filter(x => x !== t) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.slug.trim()) return toast.error('Slug is required');
    if (!form.content.trim()) return toast.error('Content is required');

    const res = isEdit
      ? await dispatch(updateBlog({ blogId, data: form }))
      : await dispatch(createBlog(form));

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(isEdit ? 'Blog updated' : 'Blog created');
      navigate('/blogs');
    } else {
      toast.error(res.payload || 'Failed');
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/blogs')} className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)]"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{isEdit ? 'Edit Blog' : 'New Blog'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={(e) => { handleChange('title', e.target.value); if (!isEdit) handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')); }} placeholder="Blog title" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="blog-slug" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Excerpt *</label>
            <textarea value={form.excerpt} onChange={(e) => handleChange('excerpt', e.target.value)} placeholder="Short description" rows={2} className={`${inputCls} resize-none`} />
          </div>
          <ImageUploader value={form.coverImage} onChange={(url) => handleChange('coverImage', url)} label="Cover Image *" />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Content *</label>
          <textarea value={form.content} onChange={(e) => handleChange('content', e.target.value)} placeholder="Write your blog content here... (HTML supported)" rows={12} className={`${inputCls} resize-y font-mono text-xs`} />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Category</label>
              <input type="text" value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="General" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Tags</label>
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag" className={`flex-1 ${inputCls}`} />
                <button type="button" onClick={addTag} className="px-3 py-2 bg-[var(--accent)] text-white rounded-xl text-sm font-medium">Add</button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => handleChange('isPublished', e.target.checked)} className="sr-only" />
              <div className={`w-10 h-5 rounded-full relative ${form.isPublished ? 'bg-emerald-500' : 'bg-[var(--border)]'}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${form.isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} /></div>
              <span className="text-sm text-[var(--text-secondary)]">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => handleChange('featured', e.target.checked)} className="sr-only" />
              <div className={`w-10 h-5 rounded-full relative ${form.featured ? 'bg-amber-500' : 'bg-[var(--border)]'}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} /></div>
              <span className="text-sm text-[var(--text-secondary)]">Featured</span>
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/15 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} /> {isEdit ? 'Update Blog' : 'Create Blog'}</>}
        </button>
      </form>
    </div>
  );
};

export default BlogEditorPage;
