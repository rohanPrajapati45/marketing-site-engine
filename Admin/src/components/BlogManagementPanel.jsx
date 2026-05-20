import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  deleteBlog,
  fetchAllBlogs,
  updateBlog,
} from "../redux/slices/blogSlice";
import { createEmptyBlogForm } from "./BlogFormFields";
import BlogFormFields from "./BlogFormFields";
import Modal from "./ui/Modal";
import ConfirmDialog from "./ui/ConfirmDialog";
import EmptyState from "./ui/EmptyState";
import Badge from "./ui/Badge";
import Toggle from "./ui/Toggle";
import { Plus, Search, Edit2, Trash2, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const BlogManagementPanel = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(createEmptyBlogForm());
  const [tagInput, setTagInput] = useState("");
  const [localBlogs, setLocalBlogs] = useState([]);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    setLocalBlogs(blogs || []);
  }, [blogs]);

  useEffect(() => {
    if (showForm) {
      if (editingBlog) {
        setForm({
          title: editingBlog.title || "",
          slug: editingBlog.slug || "",
          excerpt: editingBlog.excerpt || "",
          coverImage: editingBlog.coverImage || "",
          content: editingBlog.content || "",
          category: editingBlog.category || "General",
          tags: editingBlog.tags || [],
          isPublished: editingBlog.isPublished ?? true,
          featured: editingBlog.featured ?? false,
          seo: editingBlog.seo || {
            metaTitle: "",
            metaDescription: "",
            ogImage: "",
          },
        });
      } else {
        setForm(createEmptyBlogForm());
      }
      setTagInput("");
    }
  }, [editingBlog, showForm]);

  const filteredBlogs = useMemo(() => {
    const term = search.toLowerCase();
    return (localBlogs || []).filter(
      (blog) =>
        blog.title?.toLowerCase().includes(term) ||
        blog.slug?.toLowerCase().includes(term) ||
        blog.category?.toLowerCase().includes(term),
    );
  }, [localBlogs, search]);

  const handleChange = (field, value) => {
    if (field.startsWith("seo.")) {
      const seoField = field.split(".")[1];
      setForm((prev) => ({ ...prev, seo: { ...prev.seo, [seoField]: value } }));
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || form.tags.includes(value)) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  const openCreate = () => {
    setEditingBlog(null);
    setShowForm(true);
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.slug.trim()) return toast.error("Slug is required");
    if (!form.content.trim()) return toast.error("Content is required");

    const action = editingBlog
      ? updateBlog({ blogId: editingBlog._id, data: form })
      : createBlog(form);

    const res = await dispatch(action);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success(editingBlog ? "Blog updated" : "Blog created");
      setShowForm(false);
      setEditingBlog(null);
      setForm(createEmptyBlogForm());
      setTagInput("");
    } else {
      toast.error(res.payload || "Failed to save blog");
    }
  };

  const handleTogglePublish = async (blog) => {
    setLocalBlogs((prev) =>
      prev.map((item) =>
        item._id === blog._id
          ? { ...item, isPublished: !item.isPublished }
          : item,
      ),
    );
    const res = await dispatch(
      updateBlog({
        blogId: blog._id,
        data: { isPublished: !blog.isPublished },
      }),
    );
    if (res.meta.requestStatus !== "fulfilled") {
      setLocalBlogs(blogs || []);
      toast.error(res.payload || "Failed to update publish state");
      return;
    }
    toast.success(blog.isPublished ? "Unpublished" : "Published");
  };

  const handleToggleFeatured = async (blog) => {
    setLocalBlogs((prev) =>
      prev.map((item) =>
        item._id === blog._id ? { ...item, featured: !item.featured } : item,
      ),
    );
    const res = await dispatch(
      updateBlog({ blogId: blog._id, data: { featured: !blog.featured } }),
    );
    if (res.meta.requestStatus !== "fulfilled") {
      setLocalBlogs(blogs || []);
      toast.error(res.payload || "Failed to update featured state");
      return;
    }
    toast.success(blog.featured ? "Unfeatured" : "Featured");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const snapshot = localBlogs;
    setLocalBlogs((prev) =>
      prev.filter((item) => item._id !== deleteTarget._id),
    );

    const res = await dispatch(deleteBlog(deleteTarget._id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Blog deleted");
      setDeleteTarget(null);
      return;
    }

    setLocalBlogs(snapshot);
    toast.error(res.payload || "Failed to delete blog");
  };

  const inputCls =
    "w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Blog Management
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Manage existing blog posts inside this section.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium text-sm shadow-lg shadow-[var(--accent)]/15"
        >
          <Plus size={16} /> New Blog
        </button>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {loading && !localBlogs.length ? (
        <div className="flex items-center justify-center py-10 text-[var(--text-muted)]">
          <Loader2 size={18} className="animate-spin mr-2" /> Loading blogs
        </div>
      ) : filteredBlogs.length === 0 ? (
        <EmptyState
          title="No blogs found"
          description="Create the first blog from this section."
          action={openCreate}
          actionLabel="Create Blog"
        />
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--hover)]"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {blog.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        /{blog.slug}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="default">
                        {blog.category || "General"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Toggle
                        enabled={blog.isPublished}
                        onChange={() => handleTogglePublish(blog)}
                        size="sm"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleFeatured(blog)}
                        className={`p-1.5 rounded-lg transition-colors ${blog.featured ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400"}`}
                      >
                        <Star
                          size={16}
                          fill={blog.featured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(blog)}
                          className="p-2 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--accent)]"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(blog)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <Modal
          isOpen
          onClose={() => {
            setShowForm(false);
            setEditingBlog(null);
          }}
          title={editingBlog ? "Edit Blog" : "New Blog"}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <BlogFormFields
              form={form}
              onChange={handleChange}
              tagInput={tagInput}
              setTagInput={setTagInput}
              onAddTag={addTag}
              onRemoveTag={removeTag}
              inputCls={inputCls}
              isEdit={!!editingBlog}
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBlog(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)] transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors text-sm disabled:opacity-60"
              >
                {editingBlog ? "Update Blog" : "Create Blog"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          isOpen
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Blog"
          message={`Delete "${deleteTarget.title}"?`}
        />
      )}
    </div>
  );
};

export default BlogManagementPanel;
