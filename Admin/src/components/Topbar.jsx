import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, User } from "lucide-react";
import toast from "react-hot-toast";

const pageTitles = {
  "/": "Dashboard",
  "/pages": "Pages",
  "/services": "Services",
  "/media": "Media Library",
};

const Topbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useSelector((s) => s.auth);

  const getTitle = () => {
    if (
      location.pathname.startsWith("/pages/") &&
      location.pathname !== "/pages"
    ) {
      return "Page Builder";
    }
    return pageTitles[location.pathname] || "Admin";
  };

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)]"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--hover)]">
          <User size={14} className="text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            {admin?.email}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
