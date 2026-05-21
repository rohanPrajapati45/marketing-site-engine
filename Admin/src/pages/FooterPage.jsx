import React, { useState, useEffect, useCallback } from "react";
import {
  getFooterSettings,
  updateCopyrightText,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
} from "../api/footerApi";
import Modal from "../components/ui/Modal";
import Toggle from "../components/ui/Toggle";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";
import toast from "react-hot-toast";
import {
  GripVertical, Plus, Pencil, Trash2, Save,
  Info, Image, Type,
} from "lucide-react";

/* ─── Icon Preview ─── */
const IconPreview = ({ link, size = 24 }) => {
  const type = link.iconType || "svg-path";

  // Image / uploaded file
  if (type === "image" && link.imageUrl) {
    return (
      <img
        src={link.imageUrl}
        alt={link.platform || "icon"}
        className="object-contain"
        style={{ width: size, height: size }}
      />
    );
  }

  // svg-path: multi-path
  if (link.isMultiPath && link.multiPaths?.length > 0) {
    return (
      <svg width={size} height={size} viewBox={link.svgViewBox || "0 0 24 24"}
        fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round">
        <g transform={link.multiPaths[0]?.transform || ""}>
          {link.multiPaths.map((p, i) => (
            <path key={i} d={p.d} fill={p.fill || "none"}
              stroke={p.stroke || "currentColor"} />
          ))}
        </g>
      </svg>
    );
  }

  // svg-path: single path
  if (link.svgPath) {
    return (
      <svg width={size} height={size} viewBox={link.svgViewBox || "0 0 24 24"}
        fill="currentColor">
        <path d={link.svgPath} transform={link.svgTransform || undefined} />
      </svg>
    );
  }

  // Fallback placeholder
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <Image size={Math.max(size * 0.5, 12)} className="text-[var(--text-muted)] opacity-40" />
    </div>
  );
};

/* ─── Icon Type Options ─── */
const iconTypeOptions = [
  { value: "image", label: "Upload File", icon: Image, desc: "Upload an image or SVG file (recommended)" },
  { value: "svg-path", label: "SVG Path", icon: Type, desc: "Paste the d= attribute from an SVG file (advanced)" },
];

/* ─── Default form ─── */
const emptyForm = {
  platform: "Facebook",
  url: "",
  iconType: "image",
  svgPath: "",
  svgViewBox: "0 0 24 24",
  imageUrl: "",
};

const platforms = ["Facebook", "X", "Instagram", "LinkedIn", "YouTube", "TikTok", "Pinterest", "Custom"];

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

/* ══════════════════════════════════════════════════ */
const FooterPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Copyright & Logo general settings
  const [copyright, setCopyright] = useState("");
  const [showLogo, setShowLogo] = useState(true);
  const [savingCR, setSavingCR] = useState(false);

  // Social modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Drag state
  const [dragIdx, setDragIdx] = useState(null);

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFooterSettings();
      if (res.success) {
        setSettings(res.data);
        setCopyright(res.data.copyrightText || "");
        setShowLogo(res.data.showLogo !== false);
      }
    } catch (e) {
      toast.error("Failed to load footer settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Sorted links ── */
  const sortedLinks = (settings?.socialLinks || [])
    .slice()
    .sort((a, b) => a.order - b.order);

  /* ── Copyright save ── */
  const handleSaveCopyright = async () => {
    if (!copyright.trim()) return toast.error("Copyright text is required");
    setSavingCR(true);
    try {
      const res = await updateCopyrightText(copyright.trim(), showLogo);
      if (res.success) { setSettings(res.data); toast.success("Copyright updated"); }
    } catch { toast.error("Failed to update"); }
    finally { setSavingCR(false); }
  };

  /* ── Toggle Logo visibility ── */
  const handleToggleLogo = async (nextVal) => {
    setShowLogo(nextVal);
    try {
      const res = await updateCopyrightText(copyright.trim(), nextVal);
      if (res.success) {
        setSettings(res.data);
        toast.success(nextVal ? "Logo enabled in footer" : "Logo disabled in footer");
      }
    } catch {
      setShowLogo(!nextVal);
      toast.error("Failed to update logo visibility");
    }
  };

  /* ── Open modal for add/edit ── */
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (link) => {
    setEditingId(link._id);
    setForm({
      platform: link.platform || "Custom",
      url: link.url || "",
      iconType: link.iconType || "svg-path",
      svgPath: link.svgPath || "",
      svgViewBox: link.svgViewBox || "0 0 24 24",
      imageUrl: link.imageUrl || "",
      isMultiPath: link.isMultiPath || false,
      multiPaths: link.multiPaths || [],
      svgTransform: link.svgTransform || "",
    });
    setShowModal(true);
  };

  /* ── Save social link ── */
  const handleSaveLink = async () => {
    if (!form.platform || !form.url) return toast.error("Platform & URL required");

    if (form.iconType === "svg-path" && !form.svgPath && !form.isMultiPath) {
      return toast.error("Please paste an SVG path");
    }
    if (form.iconType === "image" && !form.imageUrl) {
      return toast.error("Please upload an icon file");
    }

    // Construct a clean, reset payload to avoid stale properties (like old transforms or multiPaths)
    const payload = {
      platform: form.platform,
      url: form.url,
      iconType: form.iconType,
    };

    if (form.iconType === "image") {
      payload.imageUrl = form.imageUrl;
      payload.svgPath = "";
      payload.svgViewBox = "0 0 24 24";
      payload.svgWidth = "28";
      payload.svgHeight = "28";
      payload.svgTransform = "";
      payload.isMultiPath = false;
      payload.multiPaths = [];
    } else {
      payload.imageUrl = "";
      payload.svgPath = form.svgPath;
      payload.svgViewBox = form.svgViewBox || "0 0 24 24";
      payload.svgWidth = "28";
      payload.svgHeight = "28";
      
      // Look up existing link to preserve transform and multiPath/multiPaths ONLY if the path hasn't changed.
      // If the path changed (or it's a new link), clear them out to prevent layout bugs.
      const existingLink = sortedLinks.find((l) => l._id === editingId);
      if (existingLink && existingLink.svgPath === form.svgPath) {
        payload.svgTransform = form.svgTransform || "";
        payload.isMultiPath = form.isMultiPath || false;
        payload.multiPaths = form.multiPaths || [];
      } else {
        payload.svgTransform = "";
        payload.isMultiPath = false;
        payload.multiPaths = [];
      }
    }

    try {
      let res;
      if (editingId) {
        res = await updateSocialLink(editingId, payload);
      } else {
        res = await addSocialLink(payload);
      }
      if (res.success) {
        setSettings(res.data);
        toast.success(editingId ? "Updated!" : "Added!");
        setShowModal(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteSocialLink(deleteTarget);
      if (res.success) { setSettings(res.data); toast.success("Deleted"); }
    } catch { toast.error("Delete failed"); }
    setDeleteTarget(null);
  };

  /* ── Toggle active ── */
  const handleToggleActive = async (link) => {
    try {
      const res = await updateSocialLink(link._id, { isActive: !link.isActive });
      if (res.success) { setSettings(res.data); toast.success("Toggled"); }
    } catch { toast.error("Toggle failed"); }
  };

  /* ── Drag & Drop reorder ── */
  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (targetIdx) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const items = [...sortedLinks];
    const [moved] = items.splice(dragIdx, 1);
    items.splice(targetIdx, 0, moved);
    const orderedIds = items.map((i) => i._id);
    try {
      const res = await reorderSocialLinks(orderedIds);
      if (res.success) { setSettings(res.data); toast.success("Reordered"); }
    } catch { toast.error("Reorder failed"); }
    setDragIdx(null);
  };

  if (loading) {
    return (
      <div className="p-8 animate-fade-in">
        <div className="h-8 w-48 bg-[var(--hover)] rounded-lg animate-pulse mb-6" />
        <div className="space-y-4">{[1,2,3].map(i => (
          <div key={i} className="h-20 bg-[var(--hover)] rounded-xl animate-pulse" />
        ))}</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Footer Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage social links, copyright text, and footer content
        </p>
      </div>

      {/* ════ PANEL 1 — Social Links ════ */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Social Links</h2>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
            <Plus size={16} /> Add Link
          </button>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {sortedLinks.length === 0 && (
            <div className="px-6 py-12 text-center text-[var(--text-muted)]">
              No social links yet. Click &quot;Add Link&quot; to get started.
            </div>
          )}
          {sortedLinks.map((link, idx) => (
            <div key={link._id}
              draggable onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver} onDrop={() => handleDrop(idx)}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-[var(--hover)] transition-colors ${
                !link.isActive ? "opacity-50" : ""
              }`}>
              <GripVertical size={18} className="text-[var(--text-muted)] cursor-grab flex-shrink-0" />
              <div className="w-10 h-10 rounded-lg bg-[var(--hover)] flex items-center justify-center flex-shrink-0 text-[var(--text-primary)]">
                <IconPreview link={link} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{link.platform}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--hover)] text-[var(--text-muted)] uppercase">
                    {(link.iconType === "image") ? "file" : "svg"}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">{link.url}</p>
              </div>
              <Toggle enabled={link.isActive} onChange={() => handleToggleActive(link)} size="sm" />
              <button onClick={() => openEdit(link)}
                className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-secondary)] transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => setDeleteTarget(link._id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ════ PANEL 2 — Logo ════ */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Footer Logo</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)] font-medium">Show Logo</span>
            <Toggle enabled={showLogo} onChange={handleToggleLogo} size="sm" />
          </div>
        </div>
        <div className="px-6 py-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
            <Info size={18} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--text-secondary)]">
              The footer logo is synced automatically from the main site logo.
              To change it, update the logo in <strong>Site Settings → Branding</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ════ PANEL 3 — Copyright ════ */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Copyright Text</h2>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div>
            <textarea value={copyright} onChange={(e) => setCopyright(e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
              placeholder="Enter copyright text..."
            />
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
              {copyright.length} characters
            </p>
          </div>
          <button onClick={handleSaveCopyright} disabled={savingCR}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50">
            <Save size={16} /> {savingCR ? "Saving..." : "Save"}
          </button>
        </div>
      </section>

      {/* ════ PANEL 4 — Nav Links (read-only) ════ */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Footer Navigation</h2>
        </div>
        <div className="px-6 py-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
            <Info size={18} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--text-secondary)]">
              Footer navigation is synced automatically from the main Navigation menu.
              To add, remove, or reorder links, go to <strong>Pages → Navigation</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ════ Social Link Modal ════ */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingId ? "Edit Social Link" : "Add Social Link"} size="lg">
        <div className="space-y-5">
          {/* Platform */}
          <div>
            <label className={labelCls}>Platform</label>
            <select value={form.platform} onChange={(e) => setForm(prev => ({ ...prev, platform: e.target.value }))}
              className={inputCls}>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className={labelCls}>Profile URL</label>
            <input type="text" value={form.url}
              onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
              className={inputCls}
              placeholder="https://www.facebook.com/yourpage" />
          </div>

          {/* ── Icon Type Selector ── */}
          <div>
            <label className={labelCls}>Icon Source</label>
            <div className="grid grid-cols-2 gap-2">
              {iconTypeOptions.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button"
                  onClick={() => setForm(prev => ({ ...prev, iconType: value }))}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    form.iconType === value
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)]"
                  }`}>
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              {iconTypeOptions.find(t => t.value === form.iconType)?.desc}
            </p>
          </div>

          {/* ── Upload File Input ── */}
          {form.iconType === "image" && (
            <ImageUploader
              value={form.imageUrl}
              onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))}
              folder="general"
              label="Icon File (PNG, JPG, SVG)"
              required
            />
          )}

          {/* ── SVG Path Input ── */}
          {form.iconType === "svg-path" && (
            <>
              <div>
                <label className={labelCls}>SVG Path (d= attribute)</label>
                <textarea value={form.svgPath} rows={3}
                  onChange={(e) => setForm(prev => ({ ...prev, svgPath: e.target.value }))}
                  className={`${inputCls} resize-none font-mono text-xs`}
                  placeholder='e.g. M19.627,20.25l1-6.515H14.375V9.507...' />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Open the SVG file in a text editor → find {'<path d="...">'} → copy the d value
                </p>
              </div>
              <div>
                <label className={labelCls}>
                  SVG ViewBox <span className="text-[var(--text-muted)] font-normal">(required for path to display correctly)</span>
                </label>
                <input type="text" value={form.svgViewBox}
                  onChange={(e) => setForm(prev => ({ ...prev, svgViewBox: e.target.value }))}
                  className={inputCls}
                  placeholder='e.g. 0 0 24 24' />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Find the viewBox value from {'<svg viewBox="...">'} in the same SVG file. Without this, the icon won&apos;t display.
                </p>
              </div>
            </>
          )}

          {/* Live Preview */}
          <div>
            <label className={labelCls}>Live Preview</label>
            <div className="w-full h-24 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] gap-8">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-lg bg-[var(--hover)] flex items-center justify-center">
                  <IconPreview link={form} size={24} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">Small</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 rounded-lg bg-[var(--hover)] flex items-center justify-center">
                  <IconPreview link={form} size={36} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">Large</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)] transition-colors font-medium text-sm">
              Cancel
            </button>
            <button onClick={handleSaveLink}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} title="Delete Social Link"
        message="Are you sure you want to delete this social link? This action cannot be undone."
        confirmText="Delete" variant="danger" />
    </div>
  );
};

export default FooterPage;
