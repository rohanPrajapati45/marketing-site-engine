import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { cardSchemas } from '../schemas/cardSchemas';
import DynamicForm from './DynamicForm';
import { X, Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const CardManagerModal = ({ section, onClose, onRefresh }) => {
  const [cards, setCards] = useState(section.data.cards || []);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [cardData, setCardData] = useState({});
  const cardType = section.data.cardType;
  const schema = cardSchemas[cardType];

  const handleSaveCards = async (updatedCards) => {
    try {
      await axiosInstance.put(`/admin/sections/${section._id}`, {
        data: {
          ...section.data,
          cards: updatedCards
        }
      });
      setCards(updatedCards);
      onRefresh();
    } catch (err) {
      alert('Failed to update cards');
    }
  };

  const handleSaveSingleCard = async (e) => {
    e.preventDefault();
    let updatedCards = [...cards];
    if (editingCardIndex !== null) {
      updatedCards[editingCardIndex] = { ...updatedCards[editingCardIndex], ...cardData };
    } else {
      updatedCards.push({ ...cardData, order: updatedCards.length, active: true });
    }
    await handleSaveCards(updatedCards);
    setEditingCardIndex(null);
    setCardData({});
  };

  const handleDeleteCard = async (index) => {
    if(!window.confirm('Delete this card?')) return;
    const updatedCards = cards.filter((_, i) => i !== index);
    await handleSaveCards(updatedCards);
  };

  const handleReorder = async (index, direction) => {
    let updatedCards = [...cards];
    if (direction === 'up' && index > 0) {
      const temp = updatedCards[index];
      updatedCards[index] = updatedCards[index - 1];
      updatedCards[index - 1] = temp;
    } else if (direction === 'down' && index < updatedCards.length - 1) {
      const temp = updatedCards[index];
      updatedCards[index] = updatedCards[index + 1];
      updatedCards[index + 1] = temp;
    }
    // Update order property
    updatedCards = updatedCards.map((c, i) => ({ ...c, order: i }));
    await handleSaveCards(updatedCards);
  };

  const openEdit = (card, index) => {
    setEditingCardIndex(index);
    setCardData(card);
  };

  const openCreate = () => {
    setEditingCardIndex(null);
    setCardData({});
  };

  if (!schema) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-medium text-gray-900">Manage Cards ({cardType})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500"><X size={20} /></button>
        </div>

        <div className="flex flex-1 overflow-hidden space-x-6">
          {/* Card List */}
          <div className="w-1/2 flex flex-col border-r pr-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-700">Cards</h4>
              <button onClick={openCreate} className="text-sm text-blue-600 flex items-center hover:underline">
                <Plus size={16} className="mr-1" /> Add Card
              </button>
            </div>
            
            <div className="space-y-3">
              {cards.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No cards found.</p>
              ) : (
                cards.map((card, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col space-y-1">
                        <button onClick={() => handleReorder(index, 'up')} disabled={index===0} className={index===0?'text-gray-300':'text-gray-500 hover:text-gray-800'}><ArrowUp size={14}/></button>
                        <button onClick={() => handleReorder(index, 'down')} disabled={index===cards.length-1} className={index===cards.length-1?'text-gray-300':'text-gray-500 hover:text-gray-800'}><ArrowDown size={14}/></button>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate w-32">{card.title || card.name || `Card ${index+1}`}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => openEdit(card, index)} className="text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                      <button onClick={() => handleDeleteCard(index)} className="text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="w-1/2 flex flex-col overflow-y-auto pl-2 pr-2">
            <h4 className="font-medium text-gray-700 mb-4">
              {editingCardIndex !== null ? 'Edit Card' : 'Add New Card'}
            </h4>
            <form onSubmit={handleSaveSingleCard} className="space-y-4">
              <DynamicForm schema={schema} data={cardData} onChange={setCardData} />
              
              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
                  Save Card
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
