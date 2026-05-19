import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, uploadMedia, deleteMedia } from '../redux/slices/mediaSlice';
import { Upload, Trash2, Copy, Loader2, ImageIcon, X } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

const MediaPage = () => {
  const dispatch = useDispatch();
  const { items, loading, uploading } = useSelector((s) => s.media);
  const fileRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => { dispatch(fetchMedia()); }, [dispatch]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);
    const res = await dispatch(uploadMedia(formData));
    if (res.meta.requestStatus === 'fulfilled') toast.success(`${files.length} file(s) uploaded`);
    else toast.error(res.payload || 'Upload failed');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteMedia(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-[var(--text-primary)]">Media Library</h2><p className="text-sm text-[var(--text-muted)]">{items?.length || 0} files</p></div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium text-sm shadow-lg shadow-[var(--accent)]/15 disabled:opacity-50">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Upload Images
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      </div>

      {/* Upload zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
      >
        {uploading ? <Loader2 size={32} className="animate-spin text-[var(--accent)]" /> : <ImageIcon size={32} className="text-[var(--text-muted)]" />}
        <p className="text-sm text-[var(--text-muted)]">{uploading ? 'Uploading...' : 'Click or drag images here (multiple supported)'}</p>
      </div>

      {/* Grid */}
      {(!items || items.length === 0) ? (
        <EmptyState title="No media" description="Upload your first image" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div key={item._id} className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden aspect-square hover:border-[var(--accent)]/30 transition-all">
              <img src={item.url} alt={item.filename} className="w-full h-full object-cover cursor-pointer" onClick={() => setPreview(item)} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleCopy(item.url)} className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30"><Copy size={14} /></button>
                <button onClick={() => setDeleteTarget(item)} className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="fixed inset-0 bg-black/80" />
          <div className="relative z-10 max-w-3xl max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-3 -right-3 p-1.5 bg-[var(--surface)] rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={16} /></button>
            <img src={preview.url} alt="" className="max-w-full max-h-[75vh] rounded-xl object-contain" />
            <div className="mt-3 flex items-center gap-2">
              <input readOnly value={preview.url} className="flex-1 px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-secondary)]" />
              <button onClick={() => handleCopy(preview.url)} className="px-3 py-2 bg-[var(--accent)] text-white rounded-lg text-xs font-medium">Copy URL</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && <ConfirmDialog isOpen onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget._id)} title="Delete Image" message="This image will be permanently deleted." />}
    </div>
  );
};

export default MediaPage;
