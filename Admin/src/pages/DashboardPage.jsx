import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPages } from "../redux/slices/pageSlice";
import { fetchAllBlogs } from "../redux/slices/blogSlice";
import { fetchServices } from "../redux/slices/serviceSlice";
import {
  FileText,
  PenSquare,
  Wrench,
  ImageIcon,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link
    to={to}
    className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--accent)]/30 transition-all group"
  >
    <div className="flex items-start justify-between">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <ArrowUpRight
        size={16}
        className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors"
      />
    </div>
    <p className="text-2xl font-bold text-[var(--text-primary)] mt-3">
      {value}
    </p>
    <p className="text-sm text-[var(--text-muted)] mt-0.5">{label}</p>
  </Link>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { pages } = useSelector((s) => s.pages);
  const { blogs } = useSelector((s) => s.blogs);
  const { services } = useSelector((s) => s.services);

  useEffect(() => {
    dispatch(fetchAllPages());
    dispatch(fetchAllBlogs());
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back 👋
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          Here's what's happening with your CMS today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Pages"
          value={pages?.length || 0}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          to="/pages"
        />
        <StatCard
          icon={PenSquare}
          label="Blog Posts"
          value={blogs?.length || 0}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          to="/pages"
        />
        <StatCard
          icon={Wrench}
          label="Services"
          value={services?.length || 0}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          to="/services"
        />
        <StatCard
          icon={TrendingUp}
          label="Published Pages"
          value={pages?.filter((p) => p.isPublished)?.length || 0}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
          to="/pages"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/pages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <FileText size={18} className="text-blue-400" />
            Manage Pages
          </Link>
          <Link
            to="/pages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <PenSquare size={18} className="text-purple-400" />
            Manage Blog Sections
          </Link>
          <Link
            to="/media"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ImageIcon size={18} className="text-emerald-400" />
            Upload Media
          </Link>
        </div>
      </div>

      {/* Recent pages */}
      {pages?.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Recent Pages
          </h3>
          <div className="space-y-2">
            {pages.slice(0, 5).map((page) => (
              <Link
                key={page._id}
                to={`/pages/${page._id}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--hover)] transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {page.title || page.slug}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    /{page.slug}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${page.isPublished ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}
                >
                  {page.isPublished ? "Published" : "Draft"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
