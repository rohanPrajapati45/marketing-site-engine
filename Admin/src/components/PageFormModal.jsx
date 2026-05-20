import React, { useState } from "react";
import Modal from "./ui/Modal";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";

const PageFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    navTitle: initialData?.navTitle || initialData?.title || "",
    seo: {
      metaTitle: initialData?.seo?.metaTitle || "",
      metaDescription: initialData?.seo?.metaDescription || "",
      ogImage: initialData?.seo?.ogImage || "",
    },
    isPublished: initialData?.isPublished ?? true,
  });

  const handleChange = (field, value) => {
    if (field.startsWith("seo.")) {
      const seoField = field.split(".")[1];
      setForm((prev) => ({ ...prev, seo: { ...prev.seo, [seoField]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.slug.trim()) return toast.error("Slug is required");
    if (!form.title.trim()) return toast.error("Title is required");
    onSubmit(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Page" : "Create Page"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              handleChange("title", e.target.value);
              if (!isEdit)
                handleChange(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, ""),
                );
            }}
            placeholder="Page title"
            className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Slug *
          </label>
          <div className="flex items-center">
            <span className="text-sm text-[var(--text-muted)] mr-1">/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                handleChange(
                  "slug",
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                )
              }
              placeholder="page-slug"
              className="flex-1 px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Nav Title *
          </label>
          <input
            type="text"
            value={form.navTitle}
            onChange={(e) => handleChange("navTitle", e.target.value)}
            placeholder="Navbar title"
            className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        <div className="border-t border-[var(--border)] pt-4">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
            SEO Settings
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={form.seo.metaTitle}
                onChange={(e) => handleChange("seo.metaTitle", e.target.value)}
                placeholder="SEO title"
                className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Meta Description
              </label>
              <textarea
                value={form.seo.metaDescription}
                onChange={(e) =>
                  handleChange("seo.metaDescription", e.target.value)
                }
                placeholder="SEO description"
                rows={2}
                className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
              />
            </div>
            <div>
              <ImageUploader
                value={form.seo.ogImage}
                onChange={(url) => handleChange("seo.ogImage", url)}
                label="OG Image"
                folder="general"
              />
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                OG Image URL
              </label>
              <input
                type="text"
                value={form.seo.ogImage}
                onChange={(e) => handleChange("seo.ogImage", e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => handleChange("isPublished", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors relative ${form.isPublished ? "bg-emerald-500" : "bg-[var(--border)]"}`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${form.isPublished ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {form.isPublished ? "Published" : "Draft"}
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)] transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors text-sm"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PageFormModal;
