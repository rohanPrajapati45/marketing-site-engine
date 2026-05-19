import React, { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { cardSchemas } from "../schemas/cardSchemas";
import { FIXED_CARD_TYPES } from "../schemas/sectionSchemas";
import DynamicForm from "./DynamicForm";
import { X, Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const CardManagerModal = ({ section, onClose, onSectionUpdated }) => {
  // Cards state is owned entirely by this modal.
  // Initialized from section prop on mount only (via useState initializer).
  // NO useEffect to re-sync — this modal is the source of truth while open.
  const [cards, setCards] = useState(section.data?.cards || []);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [cardData, setCardData] = useState({});
  const [saving, setSaving] = useState(false);

  // Keep a ref to the latest cards so rollback always uses current state
  const cardsBeforeSaveRef = useRef(cards);

  // Resolve the effective cardType for this section
  const resolveCardType = () => {
    const fixedType = FIXED_CARD_TYPES[section.type];
    if (fixedType) return fixedType;
    return section.data?.cardType || null;
  };

  const cardType = resolveCardType();
  const schema = cardSchemas[cardType];

  // ─── Save all cards to backend ───
  const handleSaveCards = async (updatedCards) => {
    // Snapshot current cards for rollback
    cardsBeforeSaveRef.current = cards;

    // Optimistic: update local state immediately
    setCards(updatedCards);

    try {
      setSaving(true);
      const res = await axiosInstance.put(`/admin/sections/${section._id}`, {
        data: {
          ...section.data,
          cards: updatedCards,
        },
      });

      // Server responded successfully.
      // Check if server returned populated cards, otherwise trust our local copy.
      const serverSection = res.data.data || res.data;
      const serverCards = serverSection.data?.cards;
      const finalCards = (serverCards && serverCards.length > 0) ? serverCards : updatedCards;
      setCards(finalCards);

      // Notify parent with cards included so section list stays in sync
      if (onSectionUpdated) {
        const sectionForParent = {
          ...serverSection,
          data: {
            ...(serverSection.data || section.data),
            cards: finalCards,
          },
        };
        onSectionUpdated(section._id, sectionForParent);
      }
    } catch (err) {
      // Rollback to pre-save state
      setCards(cardsBeforeSaveRef.current);
      alert("Failed to update cards");
    } finally {
      setSaving(false);
    }
  };

  // ─── Save a single card (add or edit) ───
  const handleSaveSingleCard = async (e) => {
    e.preventDefault();

    const currentSchema = cardSchemas[cardType] || [];
    const transformed = { ...cardData };

    currentSchema.forEach((f) => {
      const val = transformed[f.name];
      if (f.name === "lines" && typeof val === "string") {
        transformed.lines = val
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === "number" && val !== undefined && val !== "") {
        const n = Number(val);
        transformed[f.name] = Number.isNaN(n) ? val : n;
      }
    });

    let updatedCards = [...cards];

    if (editingCardIndex !== null) {
      const existing = updatedCards[editingCardIndex] || {};
      updatedCards[editingCardIndex] = {
        ...existing,
        ...transformed,
      };
    } else {
      const maxOrder = updatedCards.reduce(
        (max, c) => Math.max(max, Number(c.order || 0)),
        0,
      );
      updatedCards.push({
        ...transformed,
        order: maxOrder + 1,
        active: true,
      });
    }

    await handleSaveCards(updatedCards);
    setEditingCardIndex(null);
    setCardData({});
  };

  // ─── Delete a card ───
  const handleDeleteCard = async (index) => {
    if (!window.confirm("Delete this card?")) return;
    const updatedCards = cards.filter((_, i) => i !== index);
    const reordered = updatedCards.map((c, i) => ({ ...c, order: i + 1 }));

    // Adjust editing state
    if (editingCardIndex === index) {
      setEditingCardIndex(null);
      setCardData({});
    } else if (editingCardIndex !== null && editingCardIndex > index) {
      setEditingCardIndex(editingCardIndex - 1);
    }

    await handleSaveCards(reordered);
  };

  // ─── Reorder cards ───
  const handleReorder = async (index, direction) => {
    let updatedCards = [...cards];
    if (direction === "up" && index > 0) {
      [updatedCards[index], updatedCards[index - 1]] = [
        updatedCards[index - 1],
        updatedCards[index],
      ];
    } else if (direction === "down" && index < updatedCards.length - 1) {
      [updatedCards[index], updatedCards[index + 1]] = [
        updatedCards[index + 1],
        updatedCards[index],
      ];
    }
    updatedCards = updatedCards.map((c, i) => ({ ...c, order: i + 1 }));
    await handleSaveCards(updatedCards);
  };

  // ─── Open edit form for a card ───
  const openEdit = (card, index) => {
    const currentSchema = cardSchemas[cardType] || [];
    const editable = { ...card };
    currentSchema.forEach((f) => {
      if (f.name === "lines" && Array.isArray(card.lines)) {
        editable.lines = card.lines.join("\n");
      }
    });
    setEditingCardIndex(index);
    setCardData(editable);
  };

  // ─── Open fresh "Add New Card" form ───
  const openCreate = () => {
    setEditingCardIndex(null);
    setCardData({});
  };

  const getCardLabel = (card, index) => {
    return card.title || card.name || card.text || `Card ${index + 1}`;
  };

  // ─── When closing, push final cards state to parent ───
  const handleClose = () => {
    // Ensure parent has the latest cards state before closing
    if (onSectionUpdated) {
      onSectionUpdated(section._id, {
        ...section,
        data: {
          ...section.data,
          cards: cards,
        },
      });
    }
    onClose();
  };

  if (!cardType || !schema) {
    return (
      <div className="fixed inset-0 z-[60] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl text-center">
          <p className="text-gray-600 mb-4">
            No card type is configured for this section.
          </p>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Manage Cards
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({cardType})
            </span>
            {saving && (
              <span className="ml-2 text-xs font-normal text-blue-500 animate-pulse">
                Saving...
              </span>
            )}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden space-x-6">
          {/* Card List */}
          <div className="w-1/2 flex flex-col border-r pr-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-700">
                Cards ({cards.length})
              </h4>
              <button
                onClick={openCreate}
                className="text-sm text-blue-600 flex items-center hover:underline"
              >
                <Plus size={16} className="mr-1" /> Add Card
              </button>
            </div>

            <div className="space-y-3">
              {cards.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No cards yet. Add one to get started.
                </p>
              ) : (
                cards.map((card, index) => (
                  <div
                    key={card._id || `card-${index}`}
                    className={`flex justify-between items-center p-3 rounded border transition-colors ${editingCardIndex === index ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleReorder(index, "up")}
                          disabled={index === 0}
                          className={
                            index === 0
                              ? "text-gray-300"
                              : "text-gray-500 hover:text-gray-800"
                          }
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleReorder(index, "down")}
                          disabled={index === cards.length - 1}
                          className={
                            index === cards.length - 1
                              ? "text-gray-300"
                              : "text-gray-500 hover:text-gray-800"
                          }
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate w-32">
                          {getCardLabel(card, index)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEdit(card, index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="w-1/2 flex flex-col overflow-y-auto pl-2 pr-2">
            <h4 className="font-medium text-gray-700 mb-4">
              {editingCardIndex !== null ? "Edit Card" : "Add New Card"}
            </h4>
            <form onSubmit={handleSaveSingleCard} className="space-y-4">
              <DynamicForm
                schema={schema}
                data={cardData}
                onChange={setCardData}
              />

              <div className="pt-4 flex justify-end space-x-2">
                {editingCardIndex !== null && (
                  <button
                    type="button"
                    onClick={openCreate}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {editingCardIndex !== null ? "Update Card" : "Add Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardManagerModal;
