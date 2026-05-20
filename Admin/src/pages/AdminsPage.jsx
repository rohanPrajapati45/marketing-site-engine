import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const AdminsPage = () => {
  const { admin } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [admin?.email]);

  useEffect(() => {
    if (admin?.isMainAdmin) {
      fetchAdmins();
    }
  }, [admin?.isMainAdmin]);

  if (!admin?.isMainAdmin) {
    return <Navigate to="/" replace />;
  }

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const res = await api.get('/api/auth/admins');
      setAdmins(res.data?.admins || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admins');
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) return toast.error('Enter an email');
    if (!password.trim()) return toast.error('Enter a password');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirmPassword) return toast.error('Passwords do not match');

    try {
      setSaving(true);
      await api.post('/api/auth/register', { email, password });
      toast.success('Admin created');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      setDeleting(true);
      await api.delete(`/api/auth/admins/${deleteTarget._id}`);
      toast.success('Admin deleted');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Admins</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Create new admins. Only main admins can add accounts.
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="new-admin@example.com"
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <UserPlus size={16} />
            {saving ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Admin Accounts</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {loadingAdmins ? 'Loading admins...' : `${admins.length} total`}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchAdmins}
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium"
            disabled={loadingAdmins}
          >
            Refresh
          </button>
        </div>

        {admins.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No admins found.</p>
        ) : (
          <div className="space-y-2">
            {admins.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {item.email}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {item.isMainAdmin ? 'Main admin' : 'Admin'}
                  </p>
                </div>
                {item.isMainAdmin && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <ShieldCheck size={14} />
                    Main
                  </div>
                )}
                {!item.isMainAdmin && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="ml-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-500"
                    disabled={deleting}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {deleteTarget && (
        <ConfirmDialog
          isOpen
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete admin"
          message={`Delete ${deleteTarget.email}? This cannot be undone.`}
          confirmText={deleting ? 'Deleting...' : 'Delete'}
          variant="danger"
        />
      )}
    </div>
  );
};

export default AdminsPage;
