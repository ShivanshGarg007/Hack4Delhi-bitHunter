import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Building2, 
  UserSearch,
  Link2,
  ScanLine,
  LogOut,
  ChevronRight
} from 'lucide-react';

const SIDEBAR_SECTIONS = [
  {
    section: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/official/dashboard" }
    ]
  },
  {
    section: "Contract Intelligence",
    items: [
      { icon: FileText, label: "Contracts", path: "/official/contracts" },
      { icon: Building2, label: "Vendors", path: "/official/vendors" }
    ]
  },
  {
    section: "Fraud Detection",
    items: [
      { icon: UserSearch, label: "Welfare Fraud", path: "/official/welfare" },
      { icon: Link2, label: "PDS Ledger", path: "/official/ledger" },
      { icon: ScanLine, label: "Lifestyle Scan", path: "/official/lifestyle" }
    ]
  }
];

const OfficialLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#E3FDFD] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-[#71C9CE]" strokeWidth={1.5} />
            <div>
              <span className="text-xl font-bold text-slate-900">bitHunter</span>
              <span className="block text-xs text-slate-500">Official Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.section}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#E3FDFD] text-[#71C9CE] font-medium'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#71C9CE] rounded-full flex items-center justify-center text-white font-medium">
                {user?.full_name?.charAt(0) || 'O'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.full_name || 'Official'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default OfficialLayout;
