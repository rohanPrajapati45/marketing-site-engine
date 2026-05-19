import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Plus, Upload, Check } from 'lucide-react';

const Media = () => {
  const [media, setMedia] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    // Simulated media loading from local storage
    const storedMedia = JSON.parse(localStorage.getItem('admin_media') || '[]');
    setMedia(storedMedia);
  }, []);

  const saveMedia = (newMedia) => {
    setMedia(newMedia);
    localStorage.setItem('admin_media', JSON.stringify(newMedia));
  };

  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    const newImage = {
      id: Date.now().toString(),
      url: imageUrl,
      createdAt: new Date().toISOString()
    };
    saveMedia([newImage, ...media]);
    setImageUrl('');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this image?')) {
      saveMedia(media.filter(m => m.id !== id));
    }
  };

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Media Library</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm text-sm font-medium"
        >
          <Upload size={18} className="mr-2" />
          Add Media
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div key={item.id} className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm aspect-square flex items-center justify-center">
            <img src={item.url} alt="Media item" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex flex-col justify-center items-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleCopy(item.id, item.url)}
                  className="p-2 bg-white text-gray-800 rounded hover:bg-gray-100"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-gray-200 border-dashed rounded-lg">
            <p className="text-gray-500">No media found. Upload some images to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Media</h3>
            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input 
                  type="url" 
                  required 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)} 
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 sm:text-sm" 
                />
              </div>
              <div className="text-xs text-gray-500 text-center py-2">
                (Alternatively, you can integrate Cloudinary or AWS S3 here)
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 flex justify-center text-sm font-medium text-white hover:bg-blue-700">Add Image</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
