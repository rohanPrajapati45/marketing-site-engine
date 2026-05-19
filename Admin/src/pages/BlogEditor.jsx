import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

const BlogEditor = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const isNew = blogId === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    content: '',
    category: 'General',
    tags: '',
    isPublished: true,
    featured: false,
  });

  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const res = await axiosInstance.get(`/admin/blogs/${blogId}`);
      const blog = res.data.data || res.data;
      setFormData({
        ...blog,
        tags: blog.tags ? blog.tags.join(', ') : '',
      });
    } catch (err) {
      alert('Failed to load blog');
      navigate('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (isNew) {
        await axiosInstance.post('/admin/blogs', payload);
      } else {
        await axiosInstance.put(`/admin/blogs/${blogId}`, payload);
      }
      navigate('/admin/blogs');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save blog');
    }
  };

  if (loading) return <div className="p-6">Loading editor...</div>;

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/admin/blogs')} className="p-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{isNew ? 'Create Blog' : 'Edit Blog'}</h1>
        </div>
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm text-sm font-medium">
          Save Blog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
            <input required type="url" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="tech, news, general" />
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center">
            <input id="isPublished" type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">Published</label>
          </div>
          <div className="flex items-center">
            <input id="featured" type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Featured Blog</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <RichTextEditor content={formData.content} onChange={val => setFormData({...formData, content: val})} />
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
