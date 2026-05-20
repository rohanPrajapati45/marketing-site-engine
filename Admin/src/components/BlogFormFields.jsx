import React from "react";
import ImageUploader from "./ImageUploader";

export const createEmptyBlogForm = () => ({
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  content: "",
  category: "General",
  tags: [],
  isPublished: true,
  featured: false,
  seo: { metaTitle: "", metaDescription: "", ogImage: "" },
});

const BlogFormFields = ({
  form,
  onChange,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
  inputCls,
  isEdit,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Title *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => {
            onChange("title", e.target.value);
            if (!isEdit) {
              onChange(
                "slug",
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, ""),
              );
            }
          }}
          placeholder="Blog title"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Slug *
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) =>
            onChange(
              "slug",
              e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
            )
          }
          placeholder="blog-slug"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Excerpt *
        </label>
        <textarea
          value={form.excerpt}
          onChange={(e) => onChange("excerpt", e.target.value)}
          placeholder="Short description"
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      <ImageUploader
        value={form.coverImage}
        onChange={(url) => onChange("coverImage", url)}
        label="Cover Image *"
      />

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Content *
        </label>
        <textarea
          value={form.content}
          onChange={(e) => onChange("content", e.target.value)}
          placeholder="Write your blog content here... (HTML supported)"
          rows={12}
          className={`${inputCls} resize-y font-mono text-xs`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Category
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            placeholder="General"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), onAddTag())
              }
              placeholder="Add tag"
              className={`flex-1 ${inputCls}`}
            />
            <button
              type="button"
              onClick={onAddTag}
              className="px-3 py-2 bg-[var(--accent)] text-white rounded-xl text-sm font-medium"
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
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
              onChange={(e) => onChange("seo.metaTitle", e.target.value)}
              placeholder="SEO title"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Meta Description
            </label>
            <textarea
              value={form.seo.metaDescription}
              onChange={(e) => onChange("seo.metaDescription", e.target.value)}
              placeholder="SEO description"
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              OG Image URL
            </label>
            <input
              type="text"
              value={form.seo.ogImage}
              onChange={(e) => onChange("seo.ogImage", e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => onChange("isPublished", e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-10 h-5 rounded-full relative ${form.isPublished ? "bg-emerald-500" : "bg-[var(--border)]"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${form.isPublished ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </div>
          <span className="text-sm text-[var(--text-secondary)]">
            Published
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => onChange("featured", e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-10 h-5 rounded-full relative ${form.featured ? "bg-amber-500" : "bg-[var(--border)]"}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${form.featured ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </div>
          <span className="text-sm text-[var(--text-secondary)]">Featured</span>
        </label>
      </div>
    </div>
  );
};

export default BlogFormFields;
