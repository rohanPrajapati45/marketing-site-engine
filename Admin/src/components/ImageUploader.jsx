import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { uploadImage, getMedia } from '../api/mediaApi';
import toast from 'react-hot-toast';

const FOLDERS = [
  { value: 'hero',         label: '🎬 Hero' },
  { value: 'projects',     label: '📁 Projects' },
  { value: 'solutions',    label: '💡 Solutions' },
  { value: 'casestudies',  label: '📖 Case Studies' },
  { value: 'contact',      label: '📍 Contact' },
  { value: 'general',      label: '🖼 General' },
];

const ImageUploader = ({
  value = '',
  onChange,
  folder = 'general',
  label = 'Image',
  required = false,
}) => {
  const [activeTab, setActiveTab]   = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [urlInput, setUrlInput]     = useState(value || '');
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaFolder, setMediaFolder]   = useState(folder);
  const inputRef = useRef(null);

  // ── Handle file upload ──
  const handleFile = useCallback(async (file) => {
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png',
                     'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Only images allowed (jpg, png, webp, gif, svg)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const result = await uploadImage(file, folder, setProgress);
      onChange(result.data.url);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder, onChange]);

  // ── Drag and drop handlers ──
  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };
  const onFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ── Load media library ──
  const loadMedia = async (selectedFolder) => {
    try {
      setMediaLoading(true);
      const result = await getMedia(selectedFolder);
      setMediaItems(result.data || []);
    } catch {
      toast.error('Failed to load media library');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'library') loadMedia(mediaFolder);
  };

  const handleFolderChange = (f) => {
    setMediaFolder(f);
    loadMedia(f);
  };

  const tabs = [
    { id: 'upload',  label: '⬆ Upload' },
    { id: 'url',     label: '🔗 URL / Path' },
    { id: 'library', label: '🖼 Media Library' },
  ];

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Current image preview */}
      {value && (
        <div className="relative group w-full h-40 rounded-xl overflow-hidden
          border border-[var(--border)] bg-[var(--bg)]">
          <img
            src={value}
            alt="Current"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
            transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg
                hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)]">
        <div className="flex border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-[var(--bg)] text-[var(--text-primary)] border-b-2 border-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">

          {/* TAB 1 — Upload */}
          {activeTab === 'upload' && (
            <div>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !uploading && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8
                  flex flex-col items-center justify-center gap-3
                  cursor-pointer transition-colors
                  ${isDragging
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                  }
                  ${uploading ? 'pointer-events-none opacity-50' : ''}`}
              >
                {uploading ? (
                  <>
                    <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
                    <p className="text-sm text-[var(--text-muted)]">
                      Uploading to Cloudinary... {progress}%
                    </p>
                    <div className="w-full bg-[var(--border)] rounded-full h-1.5">
                      <div
                        className="bg-[var(--accent)] h-1.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl">☁️</div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Drop image here or click to browse
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        JPG, PNG, WebP, GIF, SVG · Max 10MB
                      </p>
                      <p className="text-xs text-[var(--accent)] mt-1">
                        Uploads to: {folder}/ folder on Cloudinary
                      </p>
                    </div>
                  </>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onFileInput}
                className="hidden"
              />
            </div>
          )}

          {/* TAB 2 — URL / Path */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-muted)]">
                Paste a Cloudinary URL, external image URL, or a local path
                like <code className="text-[var(--accent)]">/images/page1.webp</code>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://... or /images/..."
                  className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg
                    px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                    focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (urlInput.trim()) {
                      onChange(urlInput.trim());
                      toast.success('Image URL set!');
                    }
                  }}
                  className="px-4 py-2 bg-[var(--accent)] text-white text-sm rounded-lg
                    hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Use
                </button>
              </div>
            </div>
          )}

          {/* TAB 3 — Media Library */}
          {activeTab === 'library' && (
            <div className="space-y-3">
              {/* Folder filter */}
              <div className="flex flex-wrap gap-1.5">
                {FOLDERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => handleFolderChange(f.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium
                      transition-colors
                      ${mediaFolder === f.value
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Media grid */}
              {mediaLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                  No images in this folder yet.
                  <br />Upload some images first!
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {mediaItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        onChange(item.url);
                        toast.success('Image selected!');
                      }}
                      className={`relative cursor-pointer rounded-lg overflow-hidden
                        border-2 transition-all group aspect-square
                        ${value === item.url
                          ? 'border-[var(--accent)]'
                          : 'border-transparent hover:border-[var(--accent)]/50'
                        }`}
                    >
                      <img
                        src={item.url}
                        alt={item.altText || item.originalName}
                        className="w-full h-full object-cover"
                      />
                      {value === item.url && (
                        <div className="absolute inset-0 bg-[var(--accent)]/20
                          flex items-center justify-center">
                          <span className="text-white text-xl">✓</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0
                        bg-black/70 py-1 px-1.5 opacity-0 group-hover:opacity-100
                        transition-opacity">
                        <p className="text-white text-[9px] truncate">
                          {item.originalName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
