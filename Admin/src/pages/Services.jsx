import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Services = () => {
  // Mock data since backend API for services is not yet implemented
  const [services, setServices] = useState([
    { id: 1, title: 'Web Development', description: 'Full stack web applications', icon: 'Globe' },
    { id: 2, title: 'Mobile Apps', description: 'iOS and Android native apps', icon: 'Smartphone' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
    } else {
      setServices([...services, { id: Date.now(), ...formData }]);
    }
    setShowModal(false);
    setEditingService(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const openEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || '',
    });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingService(null);
    setFormData({ title: '', description: '', icon: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
        <button 
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm text-sm font-medium"
        >
          <Plus size={18} className="mr-2" />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {service.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {service.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openEdit(service)}
                    className="text-blue-600 hover:text-blue-900 mx-2 p-1 bg-blue-50 hover:bg-blue-100 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-900 mx-2 p-1 bg-red-50 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No services found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingService ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon Name / URL</label>
                <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex justify-center text-sm font-medium text-white hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
