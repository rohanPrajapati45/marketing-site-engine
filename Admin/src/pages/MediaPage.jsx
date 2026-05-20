import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Copy, Loader2, ImageIcon, X, Grid, List } from 'lucide-react';
import { getMedia, uploadImage, deleteMedia, updateAlt } from '../api/mediaApi';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

const FOLDERS = [
  { value: '',            label: 'All Images' },
  { value: 'hero',        label: '🎬 Hero' },
  { value: 'projects',    label: '📁 Projects' },
  { value: 'solutions',   label: '💡 Solutions' },
  { value: 'casestudies', label: '📖 Case Studies' },
  { value: 'contact',     label: '📍 Contact' },
  { value: 'general',     label: '🖼 General' },
];

const UPLOAD_FOLDERS = FOLDERS.filter(f => f.value !== '');

const MediaPage = () => {
  const [items, setItems]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeFolder, setActiveFolder] = useState('');
  const [uploadFolder, setUploadFolder] = useState('general');
  const [uploading, setUploading]     = useState(false);
  const [progress, setProgress]       = useState(0);
  const [isDragging, setIsDragging]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView]               = useState('grid'); // grid | list
  const inputRef = useRef(null);

  const loadMedia = async (folder = '') => {
    try {
      setLoading(true);
      const res = await getMedia(folder);
      setItems(res.data || []);
    } catch {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMedia(activeFolder); }, [activeFolder]);

  const handleFile = async (file) => {
    if (!file?.type.startsWith('image/')) {
      toast.error('Only image files allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Max file size is 10MB');
      return;
    }
    try {
      setUploading(true);
      setProgress(0);
      await uploadImage(file, uploadFolder, setProgress);
      toast.success('Uploaded successfully!');
      loadMedia(activeFolder);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMedia(deleteTarget._id);
      toast.success('Image deleted');
      if (selectedItem?._id === deleteTarget._id) setSelectedItem(null);
      setDeleteTarget(null);
      loadMedia(activeFolder);
    } catch {
      toast.error('Delete failed');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const inputCls = "w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";

  return (
    <div className="flex gap-6 h-full animate-fade-in">

      {/* LEFT — Upload + Filters */}
      <div className="w-64 flex-shrink-0 space-y-4">

        {/* Upload area */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Upload Image</h3>

          {/* Folder selector */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Upload to folder</label>
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className={inputCls}
            >
              {UPLOAD_FOLDERS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6
              flex flex-col items-center gap-2 cursor-pointer
              transition-colors text-center
              ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] hover:border-[var(--accent)]/50'}
              ${uploading ? 'pointer-events-none' : ''}`}
          >
            {uploading ? (
              <>
                <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
                <p className="text-xs text-[var(--text-muted)]">{progress}%</p>
                <div className="w-full bg-[var(--border)] rounded-full h-1">
                  <div
                    className="bg-[var(--accent)] h-1 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl">☁️</span>
                <p className="text-xs text-[var(--text-muted)]">
                  Drop or click to upload
                </p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>

        {/* Folder filters */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Folders</h3>
          {FOLDERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFolder(f.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm
                transition-colors
                ${activeFolder === f.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--text-primary)]'
                }`}
            >
              {f.label}
              {activeFolder === f.value && items.length > 0 && (
                <span className="float-right text-xs opacity-70">
                  {items.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT — Image grid */}
      <div className="flex-1 space-y-4">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Media Library</h2>
            <p className="text-sm text-[var(--text-muted)]">
              {loading ? 'Loading...' : `${items.length} image${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
            {['grid', 'list'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1
                  ${view === v ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                {v === 'grid' ? <><Grid size={12} /> Grid</> : <><List size={12} /> List</>}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-muted)]">
            <div className="text-5xl mb-4">🖼</div>
            <p>No images in this folder</p>
          </div>
        ) : view === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className={`relative group cursor-pointer rounded-xl overflow-hidden
                  border-2 transition-all aspect-square
                  ${selectedItem?._id === item._id
                    ? 'border-[var(--accent)]'
                    : 'border-transparent hover:border-[var(--border)]'
                  }`}
              >
                <img
                  src={item.url}
                  alt={item.altText || item.originalName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0
                  group-hover:opacity-100 transition-opacity
                  flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }}
                    className="px-2 py-1 bg-white/20 rounded-lg text-white text-xs
                      hover:bg-white/30 transition-colors flex items-center gap-1"
                  >
                    <Copy size={10} /> Copy URL
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
                    className="px-2 py-1 bg-red-500/80 rounded-lg text-white text-xs
                      hover:bg-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)]
                  rounded-xl p-3 hover:border-[var(--accent)]/30 transition-colors"
              >
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] font-medium truncate">
                    {item.originalName}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {item.format?.toUpperCase()} · {formatSize(item.size)} · {item.width}×{item.height}
                  </p>
                  <p className="text-xs text-[var(--accent)] truncate mt-0.5">{item.url}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)]
                      rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                      hover:border-[var(--accent)] transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/30
                      rounded-lg text-xs text-red-400 hover:bg-red-500
                      hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel for selected image */}
      {selectedItem && (
        <div className="w-56 flex-shrink-0 space-y-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg leading-none"
              >
                <X size={16} />
              </button>
            </div>
            <img
              src={selectedItem.url}
              alt={selectedItem.originalName}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="space-y-2 text-xs text-[var(--text-muted)]">
              <div>
                <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider">Name</span>
                <p className="text-[var(--text-secondary)] truncate">{selectedItem.originalName}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider">Size</span>
                <p className="text-[var(--text-secondary)]">{formatSize(selectedItem.size)}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider">Dimensions</span>
                <p className="text-[var(--text-secondary)]">{selectedItem.width} × {selectedItem.height}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider">Folder</span>
                <p className="text-[var(--text-secondary)]">{selectedItem.folder}</p>
              </div>
            </div>
            <button
              onClick={() => copyUrl(selectedItem.url)}
              className="w-full px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl text-xs font-medium transition-colors"
            >
              Copy URL
            </button>
            <button
              onClick={() => setDeleteTarget(selectedItem)}
              className="w-full px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          isOpen
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Image"
          message={`Delete "${deleteTarget?.originalName || 'this image'}"? This will remove it from Cloudinary permanently.`}
        />
      )}
    </div>
  );
};

export default MediaPage;
