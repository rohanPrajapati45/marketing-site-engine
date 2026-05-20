import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  ImageIcon,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pages', icon: FileText, label: 'Pages' },
  { to: '/blogs', icon: PenSquare, label: 'Blogs' },
  { to: '/media', icon: ImageIcon, label: 'Media' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { admin } = useSelector((state) => state.auth);
  const items = admin?.isMainAdmin
    ? [...navItems, { to: '/activity', icon: Activity, label: 'Activity' }, { to: '/admins', icon: Users, label: 'Admins' }]
    : navItems;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`fixed top-0 left-0 h-full z-40 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-60'}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-[var(--border)] ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-[var(--accent)]/15">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-sm font-bold text-[var(--text-primary)] whitespace-nowrap">SrashtaSoft</span>
            <span className="block text-[10px] text-[var(--text-muted)] -mt-0.5">CMS Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(to)
              ? 'bg-[var(--accent)]/10 text-[var(--accent)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:bg-[var(--hover)] hover:text-[var(--text-primary)]'
              } ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <Icon size={20} className={`flex-shrink-0 transition-colors ${isActive(to) ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}`} />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-[var(--border)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text-secondary)] transition-colors text-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
