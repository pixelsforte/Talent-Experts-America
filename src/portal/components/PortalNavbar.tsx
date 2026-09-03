import React from 'react';
import {
  ShieldAlert,
  LogOut,
  LayoutDashboard,
  Inbox,
  Settings,
  Database,
  UserCheck,
} from 'lucide-react';

interface PortalNavbarProps {
  activeTab: 'dashboard' | 'submissions' | 'settings';
  onSelectTab: (tab: 'dashboard' | 'submissions' | 'settings') => void;
  adminEmail: string;
  onLogout: () => void;
  dbConnected: boolean;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  activeTab,
  onSelectTab,
  adminEmail,
  onLogout,
  dbConnected,
}) => {
  return (
    <header className="bg-[#091124] text-white border-b border-[#141f38] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full shrink-0" />
              <span className="font-black text-sm tracking-wider uppercase text-white">
                The American Dream
              </span>
            </div>
            <span className="text-gray-500 text-xs">/</span>
            <div className="flex items-center gap-1.5 bg-[#14234a] border border-[#22355b] px-2.5 py-0.5 rounded text-[11px] font-bold text-blue-200">
              <ShieldAlert className="w-3 h-3 text-[#b91c1c]" />
              <span>SUPER ADMIN PORTAL</span>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>1. Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('submissions')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'submissions'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>2. Form Submissions</span>
            </button>

            <button
              onClick={() => onSelectTab('settings')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>3. Settings</span>
            </button>
          </nav>

          {/* Right Profile & Logout */}
          <div className="flex items-center gap-3">
            {/* MongoDB Status Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded border ${
                dbConnected
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-800 text-amber-300'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{dbConnected ? 'MongoDB Connected' : 'DB Offline'}</span>
            </div>

            {/* Admin Email Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] truncate max-w-[160px]">
                {adminEmail}
              </span>
            </div>

            {/* Public Website Link */}
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-white hover:underline transition-colors px-2 py-1 hidden sm:block"
            >
              Public Site
            </a>

            {/* Logout Action */}
            <button
              onClick={onLogout}
              className="bg-transparent hover:bg-red-950/50 border border-red-900/60 hover:border-red-600 text-red-300 text-xs font-bold px-3 py-1.5 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Logout of Management Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden border-t border-[#141f38] py-2 gap-1 overflow-x-auto">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('submissions')}
            className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => onSelectTab('settings')}
            className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Settings
          </button>
        </div>
      </div>
    </header>
  );
};
