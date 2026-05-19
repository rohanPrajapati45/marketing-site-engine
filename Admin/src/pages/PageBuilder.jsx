import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance";
import {
  SECTION_TYPES,
  SECTIONS_WITH_CARDS,
  CARD_TYPE_OPTIONS,
  FIXED_CARD_TYPES,
  sectionFieldSchemas,
  cardTypeExtraFields,
} from "../schemas/sectionSchemas";
import DynamicForm from "../forms/DynamicForm";
import CardManagerModal from "../forms/CardManagerModal";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layers,
  AlertTriangle,
} from "lucide-react";

const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [managingCardsSection, setManagingCardsSection] = useState(null);

  // Section form state
  const [editingSection, setEditingSection] = useState(null);
  const [sectionType, setSectionType] = useState("tagline");
  const [sectionData, setSectionData] = useState({});
  const [selectedCardType, setSelectedCardType] = useState("");

  // CardType switch confirmation
  const [showCardTypeSwitchConfirm, setShowCardTypeSwitchConfirm] = useState(false);
  const [pendingCardType, setPendingCardType] = useState("");

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/admin/pages/${pageId}`);
      const pageData = res.data.data || res.data;
      setPage(pageData);
    } catch (err) {
      console.error(err);
      alert("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  // ─── Optimistic helpers: update page.sections in local state ───
  const updateSectionInState = (sectionId, updater) => {
    setPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s._id === sectionId ? (typeof updater === "function" ? updater(s) : { ...s, ...updater }) : s
        ),
      };
    });
  };

  const removeSectionFromState = (sectionId) => {
    setPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.filter((s) => s._id !== sectionId),
      };
    });
  };

  const addSectionToState = (section) => {
    setPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: [...(prev.sections || []), section],
      };
    });
  };

  // ─── Determine the effective cardType for a given section ───
  const getEffectiveCardType = (type, data) => {
    const cardSupport = SECTIONS_WITH_CARDS[type];
    if (!cardSupport) return null;
    if (cardSupport === "fixed") return FIXED_CARD_TYPES[type];
    return data?.cardType || null;
  };

  const sectionHasCards = (type, data) => {
    return !!getEffectiveCardType(type, data);
  };

  const getSectionFields = (type, cardType) => {
    const base = sectionFieldSchemas[type] || [];
    if (type === "standard" && cardType && cardTypeExtraFields[cardType]) {
      return [...base, ...cardTypeExtraFields[cardType]];
    }
    return base;
  };

  // ─── Save section (create or update) ───
  const handleSaveSection = async (e) => {
    e.preventDefault();
    try {
      const payloadData = { ...sectionData };

      if (sectionType === "standard" && selectedCardType) {
        payloadData.cardType = selectedCardType;
      }

      const fixedType = FIXED_CARD_TYPES[sectionType];
      if (fixedType) {
        payloadData.cardType = fixedType;
      }

      if (editingSection) {
        const res = await axiosInstance.put(`/admin/sections/${editingSection._id}`, {
          type: sectionType,
          data: payloadData,
          enabled: editingSection.enabled,
        });
        // Optimistic: update the section in local state with response data
        const updatedSection = res.data.data || res.data;
        updateSectionInState(editingSection._id, updatedSection);
      } else {
        const res = await axiosInstance.post(`/admin/pages/${pageId}/sections`, {
          type: sectionType,
          data: payloadData,
          enabled: true,
        });
        // Optimistic: append new section to local state
        const newSection = res.data.data || res.data;
        addSectionToState(newSection);
      }
      setShowSectionModal(false);
      resetModalState();
    } catch (err) {
      console.error(err);
      alert("Failed to save section");
    }
  };

  // ─── Delete section ───
  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Delete this section?")) return;
    // Optimistic: remove immediately
    removeSectionFromState(sectionId);
    try {
      await axiosInstance.delete(`/admin/sections/${sectionId}`);
    } catch (err) {
      // Rollback on failure
      alert("Failed to delete section");
      fetchPage();
    }
  };

  // ─── Toggle enabled ───
  const handleToggleEnable = async (section) => {
    const newEnabled = !section.enabled;
    // Optimistic update
    updateSectionInState(section._id, { enabled: newEnabled });
    try {
      await axiosInstance.put(`/admin/sections/${section._id}`, {
        enabled: newEnabled,
      });
    } catch (err) {
      // Rollback
      updateSectionInState(section._id, { enabled: section.enabled });
      alert("Failed to toggle section");
    }
  };

  // ─── Reorder sections ───
  const handleReorder = async (index, direction) => {
    const sections = [...page.sections].sort((a, b) => a.order - b.order);
    let targetIndex;
    if (direction === "up" && index > 0) targetIndex = index - 1;
    else if (direction === "down" && index < sections.length - 1) targetIndex = index + 1;
    else return;

    const current = sections[index];
    const target = sections[targetIndex];

    // Optimistic: swap orders locally
    updateSectionInState(current._id, { order: target.order });
    updateSectionInState(target._id, { order: current.order });

    try {
      await Promise.all([
        axiosInstance.put(`/admin/sections/${current._id}`, { order: target.order }),
        axiosInstance.put(`/admin/sections/${target._id}`, { order: current.order }),
      ]);
    } catch (e) {
      alert("Reorder failed");
      fetchPage();
    }
  };

  // ─── Modal state management ───
  const resetModalState = () => {
    setEditingSection(null);
    setSectionType("tagline");
    setSectionData({});
    setSelectedCardType("");
  };

  const openCreateModal = () => {
    resetModalState();
    setShowSectionModal(true);
  };

  const openEditModal = (section) => {
    setEditingSection(section);
    setSectionType(section.type);
    const { cardType, cards, cardId, ...restData } = section.data || {};
    setSectionData(restData);
    setSelectedCardType(cardType || "");
    setShowSectionModal(true);
  };

  const handleSectionTypeChange = (newType) => {
    setSectionType(newType);
    setSectionData({});
    setSelectedCardType("");
  };

  // ─── CardType change with confirmation ───
  const handleCardTypeChange = (newCardType) => {
    // If editing an existing section that already has cards, show confirmation
    if (
      editingSection &&
      selectedCardType &&
      selectedCardType !== newCardType &&
      editingSection.data?.cards?.length > 0
    ) {
      setPendingCardType(newCardType);
      setShowCardTypeSwitchConfirm(true);
      return;
    }

    // No existing cards or creating new — just switch
    applyCardTypeSwitch(newCardType);
  };

  const applyCardTypeSwitch = (newCardType) => {
    // Keep base section fields, clear cardType-specific extras
    const baseFields = sectionFieldSchemas["standard"] || [];
    const baseKeys = baseFields.map((f) => f.name);
    const cleaned = {};
    baseKeys.forEach((key) => {
      if (sectionData[key] !== undefined) cleaned[key] = sectionData[key];
    });
    setSectionData(cleaned);
    setSelectedCardType(newCardType);
  };

  const confirmCardTypeSwitch = async () => {
    const newCardType = pendingCardType;
    setShowCardTypeSwitchConfirm(false);
    setPendingCardType("");

    // Calculate cleaned data
    const baseFields = sectionFieldSchemas["standard"] || [];
    const baseKeys = baseFields.map((f) => f.name);
    const cleaned = {};
    baseKeys.forEach((key) => {
      if (sectionData[key] !== undefined) cleaned[key] = sectionData[key];
    });

    setSectionData(cleaned);
    setSelectedCardType(newCardType);

    // Automatically save to backend immediately after confirmation
    try {
      const payloadData = { ...cleaned };
      if (sectionType === "standard") {
        payloadData.cardType = newCardType;
      }

      if (editingSection) {
        const res = await axiosInstance.put(`/admin/sections/${editingSection._id}`, {
          type: sectionType,
          data: payloadData,
          enabled: editingSection.enabled,
        });
        const updatedSection = res.data.data || res.data;
        updateSectionInState(editingSection._id, updatedSection);
        
        // Update editing state and close edit modal to reflect changes
        setShowSectionModal(false);
        resetModalState();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to switch card type");
    }
  };

  const cancelCardTypeSwitch = () => {
    setShowCardTypeSwitchConfirm(false);
    setPendingCardType("");
  };

  // ─── Callback for CardManagerModal to update section in parent state ───
  // Only updates the section list (for card count badge etc.)
  // Does NOT re-set managingCardsSection — the modal owns its own cards state.
  const handleCardsUpdated = (sectionId, updatedSection) => {
    updateSectionInState(sectionId, updatedSection);
  };

  // ─── Display helpers ───
  const getSectionDisplayInfo = (section) => {
    const type = section.type;
    const cardType = section.data?.cardType;
    let label = type;
    if (cardType) label += ` → ${cardType}`;
    const title = section.data?.title;
    const cardCount = section.data?.cards?.length;
    return { label, title, cardCount };
  };

  if (loading && !page) return <div className="p-6">Loading builder...</div>;
  if (!page) return <div className="p-6 text-red-500">Page not found</div>;

  const currentFields = getSectionFields(sectionType, selectedCardType);
  const showCardTypeSelector = SECTIONS_WITH_CARDS[sectionType] === "selectable";

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/pages")}
            className="p-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Builder: {page.title}
            </h1>
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

      {/* ─── Section List ─── */}
      <div className="space-y-4">
        {page.sections && page.sections.length > 0 ? (
          [...page.sections]
            .sort((a, b) => a.order - b.order)
            .map((section, index) => {
              const info = getSectionDisplayInfo(section);
              const hasCards = sectionHasCards(section.type, section.data);

              return (
                <div
                  key={section._id}
                  className={`bg-white border rounded-lg shadow-sm p-4 flex items-center justify-between transition-opacity ${!section.enabled ? "opacity-60 bg-gray-50" : "border-gray-200"}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleReorder(index, "up")}
                        disabled={index === 0}
                        className={`hover:text-gray-700 ${index === 0 ? "text-gray-200" : "text-gray-400"}`}
                        title="Move Up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleReorder(index, "down")}
                        disabled={index === page.sections.length - 1}
                        className={`hover:text-gray-700 ${index === page.sections.length - 1 ? "text-gray-200" : "text-gray-400"}`}
                        title="Move Down"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-mono rounded text-gray-600">
                          {info.label}
                        </span>
                        {info.cardCount > 0 && (
                          <span className="inline-block px-2 py-0.5 bg-indigo-50 text-xs font-medium rounded text-indigo-600">
                            {info.cardCount} cards
                          </span>
                        )}
                      </div>
                      {info.title && (
                        <div className="text-sm text-gray-500 max-w-xl truncate">
                          {info.title}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleEnable(section)}
                      className={`p-2 rounded-md transition-colors ${section.enabled ? "text-green-600 hover:bg-green-50" : "text-gray-500 hover:bg-gray-200"}`}
                      title={section.enabled ? "Disable Section" : "Enable Section"}
                    >
                      {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    {hasCards && (
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
              );
            })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
            <p className="text-gray-500 mb-4">No sections found for this page.</p>
            <button onClick={openCreateModal} className="text-blue-600 font-medium hover:underline">
              Add your first section
            </button>
          </div>
        )}
      </div>

      {/* ─── Section Create/Edit Modal ─── */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingSection ? "Edit Section" : "Add New Section"}
            </h3>
            <form onSubmit={handleSaveSection} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
                <select
                  value={sectionType}
                  onChange={(e) => handleSectionTypeChange(e.target.value)}
                  disabled={!!editingSection}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {SECTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {currentFields.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Section Content</h4>
                  <DynamicForm schema={currentFields} data={sectionData} onChange={setSectionData} />
                </div>
              )}

              {showCardTypeSelector && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                  <select
                    value={selectedCardType}
                    onChange={(e) => handleCardTypeChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">-- Select Card Type --</option>
                    {CARD_TYPE_OPTIONS.map((ct) => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </select>
                  {selectedCardType && (
                    <p className="mt-2 text-xs text-gray-500">
                      Cards will be managed separately after saving using the <Layers size={12} className="inline" /> button.
                    </p>
                  )}
                </div>
              )}

              {SECTIONS_WITH_CARDS[sectionType] === "fixed" && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    This section type has built-in card support. Manage cards after saving using the <Layers size={14} className="inline" /> button.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowSectionModal(false); resetModalState(); }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex justify-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CardType Switch Confirmation Modal ─── */}
      {showCardTypeSwitchConfirm && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0 p-2 bg-red-100 rounded-full">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Change Card Type?</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Changing the card type from <strong>{selectedCardType}</strong> to{" "}
                  <strong>{pendingCardType}</strong> will{" "}
                  <span className="text-red-600 font-semibold">permanently delete all existing cards</span>{" "}
                  in this section because the data structure is incompatible.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={cancelCardTypeSwitch}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep Current
              </button>
              <button
                onClick={confirmCardTypeSwitch}
                className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Cards & Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Card Manager Modal ─── */}
      {managingCardsSection && (
        <CardManagerModal
          key={managingCardsSection._id + "-" + (managingCardsSection.data?.cardType || "")}
          section={managingCardsSection}
          onClose={() => setManagingCardsSection(null)}
          onSectionUpdated={handleCardsUpdated}
        />
      )}
    </div>
  );
};

export default PageBuilder;
