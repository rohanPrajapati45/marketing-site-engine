import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPages, createPage, deletePage } from '../redux/slices/pageSlice';
import { useNavigate } from 'react-router';
import { Plus, Settings, ExternalLink, Trash2 } from 'lucide-react';

const Pages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pages, loading } = useSelector(state => state.pages);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    isPublished: false,
    seo: { metaTitle: '', metaDescription: '' }
  });

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await dispatch(createPage(formData));
    if (!result.error) {
      setShowModal(false);
      setFormData({
        title: '',
        slug: '',
        isPublished: false,
        seo: { metaTitle: '', metaDescription: '' }
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      await dispatch(deletePage(id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm text-sm font-medium"
        >
          <Plus size={18} className="mr-2" />
          Create Page
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan="3" className="px-6 py-4 text-center">Loading...</td></tr>}
            {!loading && (!pages || pages.length === 0) && (
              <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No pages found.</td></tr>
            )}
            {pages && pages.map((page) => (
              <tr key={page._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  <div className="text-sm text-gray-500">/{page.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => navigate(`/admin/pages/${page._id}`)}
                    className="text-blue-600 hover:text-blue-900 mx-2 p-1 bg-blue-50 hover:bg-blue-100 rounded"
                    title="Open Builder"
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => window.open(`/${page.slug}`, '_blank')}
                    className="text-gray-500 hover:text-gray-900 mx-2 p-1 bg-gray-50 hover:bg-gray-100 rounded"
                    title="View Public Page"
                  >
                    <ExternalLink size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(page._id)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Page</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="flex items-center mt-4">
                <input id="isPublished" type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">Publish Immediately</label>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex justify-center text-sm font-medium text-white hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
