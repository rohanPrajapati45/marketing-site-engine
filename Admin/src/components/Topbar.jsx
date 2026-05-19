import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router';
import { LogOut, User } from 'lucide-react';

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 flex h-16 w-full items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        {/* Mobile menu button could go here */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User size={16} />
          </div>
          <span>Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
