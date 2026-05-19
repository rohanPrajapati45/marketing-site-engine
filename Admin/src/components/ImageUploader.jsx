import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ImageUploader = ({ value, onChange, label = 'Image', accept = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('images', file);
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = Array.isArray(res.data.data) ? res.data.data[0]?.url : res.data.data?.url;
      if (url) {
        setPreview(url);
        onChange(url);
        toast.success('Image uploaded');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</label>}

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
          <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button onClick={handleRemove} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all text-[var(--text-muted)] disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          ) : (
            <>
              <ImageIcon size={24} />
              <span className="text-xs">Click to upload</span>
            </>
          )}
        </button>
      )}

      <input ref={fileRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />

      {/* URL input fallback */}
      <input
        type="text"
        value={preview}
        onChange={(e) => { setPreview(e.target.value); onChange(e.target.value); }}
        placeholder="Or paste image URL"
        className="w-full mt-2 px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      />
    </div>
  );
};

export default ImageUploader;
