import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Calendar, 
  Settings,
  LogOut,
  Code,
  CodepenIcon
} from 'lucide-react';

import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as const },
    { icon: FolderKanban, label: 'Projects', view: 'projects' as const },
    { icon: Code, label: 'Add Snippet', view: 'snippets' as const },
    { icon: CodepenIcon, label: 'Saved Snippets', view: 'saved-snippets' as const },
    { icon: Users, label: 'Clients', view: 'clients' as const },
    { icon: Calendar, label: 'Calendar', view: 'calendar' as const },
    { icon: Settings, label: 'Settings', view: 'settings' as const },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 text-white p-4">
      <div className="flex items-center gap-3 mb-8">
        <FolderKanban className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl font-bold">ProjectCRM</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.view === 'dashboard' ? '/' : `/${item.view}`}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${location.pathname === (item.view === 'dashboard' ? '/' : `/${item.view}`) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      
      <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors mt-auto absolute bottom-4">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;