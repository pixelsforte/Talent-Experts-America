import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Settings,
  UserCheck,
  LogOut,
  Globe,
  Shield,
  Database,
} from 'lucide-react';

interface PortalSidebarProps {
  activeTab: 'dashboard' | 'submissions' | 'settings';
  onSelectTab: (tab: 'dashboard' | 'submissions' | 'settings') => void;
  adminEmail: string;
  onLogout: () => void;
  dbConnected?: boolean;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeTab,
  onSelectTab,
  adminEmail,
  onLogout,
  dbConnected = false,
}) => {
  return (
    <aside className="w-64 bg-[#091124] text-white border-r border-[#141f38] flex flex-col shrink-0 h-screen sticky top-0">
      {/* Branding Header */}
      <div className="p-6 border-b border-[#141f38]">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full shrink-0" />
          <h1 className="font-black text-base tracking-wider uppercase text-white">
            The American Dream
          </h1>
        </div>
        <div className="flex items-center justify-between pl-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Admin Portal</span>
          </div>
          <div
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
              dbConnected
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-amber-950/60 border-amber-800 text-amber-300'
            }`}
            title={dbConnected ? 'MongoDB Connected' : 'MongoDB Offline'}
          >
            <Database className="w-2.5 h-2.5 shrink-0" />
            <span>{dbConnected ? 'MongoDB Live' : 'DB Offline'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors text-left cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#b91c1c] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onSelectTab('submissions')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors text-left cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-[#b91c1c] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Inbox className="w-4 h-4 shrink-0" />
          <span>Form Submissions</span>
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors text-left cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#b91c1c] text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Admin Account & Action Footer */}
      <div className="p-4 border-t border-[#141f38] space-y-3 bg-[#060d1f]/60">
        {/* Admin identity */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
              Admin Account
            </span>
            <span className="font-mono text-[11px] text-white truncate block">
              {adminEmail}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <a
            href="/"
            className="flex-1 py-2 px-2.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </a>

          <button
            onClick={onLogout}
            className="py-2 px-3 text-xs font-bold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Logout of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
