import React from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, FileText, Image, Settings, FileEdit, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Pages', path: '/admin/pages', icon: <FileText size={20} /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <FileEdit size={20} /> },
    { name: 'Services', path: '/admin/services', icon: <Briefcase size={20} /> },
    { name: 'Media', path: '/admin/media', icon: <Image size={20} /> },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 bg-gray-900 w-64 text-white flex flex-col hidden md:flex z-40">
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6 font-bold text-xl tracking-wider">
        CMS<span className="text-blue-500">ADMIN</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <a href="/" target="_blank" className="flex items-center space-x-3 px-4 py-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <Settings size={20} />
          <span className="font-medium">View Site</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
