import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const actionOptions = [
  { value: '', label: 'All types' },
  { value: 'auth.login', label: 'Login' },
  { value: 'auth.logout', label: 'Logout' },
  { value: 'admin', label: 'Admins' },
  { value: 'page', label: 'Pages' },
  { value: 'section', label: 'Sections' },
  { value: 'blog', label: 'Blogs' },
  { value: 'media', label: 'Media' },
  { value: 'service', label: 'Services' },
  { value: 'work', label: 'Work portfolio' },
];

const ActivityPage = () => {
  const { admin } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    email: '',
    action: '',
  });

  const limit = 25;

  if (!admin?.isMainAdmin) {
    return <Navigate to="/" replace />;
  }

  const fetchActivity = async (pageOverride = page) => {
    try {
      setLoading(true);
      const params = {
        page: pageOverride,
        limit,
        ...filters,
      };
      const res = await api.get('/api/auth/activity', { params });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || pageOverride);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity(1);
  }, []);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchActivity(1);
  };

  const handleResetFilters = () => {
    setFilters({ email: '', action: '' });
    fetchActivity(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Admin Activity</h2>
        <p className="text-sm text-[var(--text-muted)]">A simple history of who did what in the last 30 days.</p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Filter size={16} /> Filters
        </div>
        <p className="text-xs text-[var(--text-muted)]">Tip: Type an email or pick a type like Login to narrow the list.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={filters.email}
            onChange={(event) => handleFilterChange('email', event.target.value)}
            placeholder="Admin email"
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <select
            value={filters.action}
            onChange={(event) => handleFilterChange('action', event.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {actionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-xl text-sm font-medium transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 border border-[var(--border)] rounded-xl text-sm text-[var(--text-secondary)] transition hover:border-[var(--text-secondary)] active:scale-[0.98] disabled:opacity-60"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => fetchActivity(page)}
            className="ml-auto flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-[var(--text-muted)]">Getting the latest activity...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-[var(--text-muted)]">
            No activity yet. Once admins log in or make changes, it will show here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Time</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Admin</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Summary</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-5 py-3.5 text-xs text-[var(--text-muted)]">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-primary)]">{item.adminEmail}</td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{item.action}</td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-primary)]">{item.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>Page {page} of {totalPages} · {total} total</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fetchActivity(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 border border-[var(--border)] rounded-lg transition hover:border-[var(--text-secondary)] disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => fetchActivity(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 border border-[var(--border)] rounded-lg transition hover:border-[var(--text-secondary)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
