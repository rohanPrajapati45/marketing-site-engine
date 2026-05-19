import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosInstance from '../utils/axiosInstance';
import { sectionSchemas, sectionTypes } from '../schemas/sectionSchemas';
import DynamicForm from '../forms/DynamicForm';
import CardManagerModal from '../forms/CardManagerModal';
import { ArrowLeft, Plus, Edit, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Layers } from 'lucide-react';

const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [managingCardsSection, setManagingCardsSection] = useState(null);
  
  // Section form state
  const [editingSection, setEditingSection] = useState(null);
  const [sectionType, setSectionType] = useState(sectionTypes[0].value);
  const [sectionData, setSectionData] = useState({});

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/admin/pages/${pageId}`);
      setPage(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    try {
      const isCardType = [
        "stat-card", "std-card", "team-card", "small-logo-card", 
        "mid-logo-card", "large-logo-card", "max5liner-card", "unique-card"
      ].includes(sectionType);
      
      const payloadType = isCardType ? "standard" : sectionType;
      const payloadData = isCardType ? { ...sectionData, cardType: sectionType } : sectionData;

      if (editingSection) {
        await axiosInstance.put(`/admin/sections/${editingSection._id}`, {
          type: payloadType,
          data: payloadData,
          enabled: editingSection.enabled,
        });
      } else {
        await axiosInstance.post(`/admin/pages/${pageId}/sections`, {
          type: payloadType,
          data: payloadData,
          order: page?.sections?.length || 0,
          enabled: true,
        });
      }
      setShowSectionModal(false);
      fetchPage();
    } catch (err) {
      alert('Failed to save section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await axiosInstance.delete(`/admin/sections/${sectionId}`);
      fetchPage();
    } catch (err) {
      alert('Failed to delete section');
    }
  };

  const handleToggleEnable = async (section) => {
    try {
      await axiosInstance.put(`/admin/sections/${section._id}`, {
        ...section,
        enabled: !section.enabled,
      });
      fetchPage();
    } catch (err) {
      alert('Failed to toggle section');
    }
  };

  const handleReorder = async (index, direction) => {
    const sections = [...page.sections].sort((a,b) => a.order - b.order);
    if (direction === 'up' && index > 0) {
      const current = sections[index];
      const prev = sections[index - 1];
      try {
        await axiosInstance.put(`/admin/sections/${current._id}`, { ...current, order: prev.order });
        await axiosInstance.put(`/admin/sections/${prev._id}`, { ...prev, order: current.order });
        fetchPage();
      } catch (e) { alert('Reorder failed'); }
    } else if (direction === 'down' && index < sections.length - 1) {
      const current = sections[index];
      const next = sections[index + 1];
      try {
        await axiosInstance.put(`/admin/sections/${current._id}`, { ...current, order: next.order });
        await axiosInstance.put(`/admin/sections/${next._id}`, { ...next, order: current.order });
        fetchPage();
      } catch (e) { alert('Reorder failed'); }
    }
  };

  const openCreateModal = () => {
    setEditingSection(null);
    setSectionType(sectionTypes[0].value);
    setSectionData({});
    setShowSectionModal(true);
  };

  const openEditModal = (section) => {
    setEditingSection(section);
    // If it's a "standard" section but has a cardType, we want our dropdown to show the cardType
    const effectiveType = section.data?.cardType || section.type;
    setSectionType(effectiveType);
    setSectionData(section.data || {});
    setShowSectionModal(true);
  };

  if (loading) return <div className="p-6">Loading builder...</div>;
  if (!page) return <div className="p-6 text-red-500">Page not found</div>;

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/admin/pages')} className="p-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Builder: {page.title}</h1>
            <p className="text-sm text-gray-500">/{page.slug}</p>
          </div>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm text-sm font-medium"
        >
          <Plus size={18} className="mr-2" />
          Add Section
        </button>
      </div>

      <div className="space-y-4">
        {page.sections && page.sections.length > 0 ? (
          page.sections.sort((a,b) => a.order - b.order).map((section, index) => (
            <div key={section._id} className={`bg-white border rounded-lg shadow-sm p-4 flex items-center justify-between ${!section.enabled ? 'opacity-60 bg-gray-50' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                  <button onClick={() => handleReorder(index, 'up')} disabled={index === 0} className={`hover:text-gray-700 ${index === 0 ? 'text-gray-200' : 'text-gray-400'}`} title="Move Up"><ArrowUp size={16} /></button>
                  <button onClick={() => handleReorder(index, 'down')} disabled={index === page.sections.length - 1} className={`hover:text-gray-700 ${index === page.sections.length - 1 ? 'text-gray-200' : 'text-gray-400'}`} title="Move Down"><ArrowDown size={16} /></button>
                </div>
                <div>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-mono rounded text-gray-600 mb-1">
                    {section.type}
                  </span>
                  <div className="text-sm text-gray-500 max-w-xl truncate">
                    {JSON.stringify(section.data)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleToggleEnable(section)}
                  className={`p-2 rounded-md transition-colors ${section.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-500 hover:bg-gray-200'}`}
                  title={section.enabled ? 'Disable Section' : 'Enable Section'}
                >
                  {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {section.data?.cardType && (
                  <button 
                    onClick={() => setManagingCardsSection(section)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors flex items-center"
                    title="Manage Cards"
                  >
                    <Layers size={18} />
                  </button>
                )}
                <button 
                  onClick={() => openEditModal(section)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteSection(section._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
            <p className="text-gray-500 mb-4">No sections found for this page.</p>
            <button onClick={openCreateModal} className="text-blue-600 font-medium hover:underline">Add your first section</button>
          </div>
        )}
      </div>

      {showSectionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </h3>
            <form onSubmit={handleSaveSection} className="space-y-6">
              {!editingSection && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
                  <select 
                    value={sectionType}
                    onChange={(e) => {
                      setSectionType(e.target.value);
                      setSectionData({});
                    }}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {sectionTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Section Content</h4>
                <DynamicForm 
                  schema={sectionSchemas[sectionType]} 
                  data={sectionData} 
                  onChange={setSectionData} 
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                <button type="button" onClick={() => setShowSectionModal(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex justify-center text-sm font-medium text-white hover:bg-blue-700">Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {managingCardsSection && (
        <CardManagerModal 
          section={managingCardsSection}
          onClose={() => setManagingCardsSection(null)}
          onRefresh={fetchPage}
        />
      )}
    </div>
  );
};

export default PageBuilder;
