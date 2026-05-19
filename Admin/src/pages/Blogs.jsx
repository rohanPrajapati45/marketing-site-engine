import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router';
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/blogs');
      setBlogs(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await axiosInstance.delete(`/admin/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const handleToggle = async (blog, field) => {
    try {
      await axiosInstance.put(`/admin/blogs/${blog._id}`, {
        [field]: !blog[field]
      });
      fetchBlogs();
    } catch (err) {
      alert(`Failed to update ${field}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Blogs</h1>
        <button 
          onClick={() => navigate('/admin/blogs/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm text-sm font-medium"
        >
          <Plus size={18} className="mr-2" />
          Create Blog
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>}
            {!loading && blogs.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No blogs found.</td></tr>
            )}
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {blog.coverImage && (
                      <img src={blog.coverImage} alt="" className="h-10 w-10 rounded object-cover mr-3" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      <div className="text-sm text-gray-500">/{blog.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.category || 'General'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleToggle(blog, 'isPublished')}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 cursor-pointer transition-colors ${blog.isPublished ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </button>
                  <button 
                    onClick={() => handleToggle(blog, 'featured')}
                    className={`p-1 rounded-full inline-flex transition-colors ${blog.featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-200'}`}
                    title="Toggle Featured"
                  >
                    <Star size={14} fill={blog.featured ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => navigate(`/admin/blogs/${blog._id}`)}
                    className="text-blue-600 hover:text-blue-900 mx-2 p-1 bg-blue-50 hover:bg-blue-100 rounded"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:text-red-900 mx-2 p-1 bg-red-50 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
