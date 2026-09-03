import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Menu, X } from 'lucide-react';
import { PortalSidebar } from './components/PortalSidebar';
import { PortalDashboardTab } from './pages/PortalDashboardTab';
import { PortalSubmissionsTab } from './pages/PortalSubmissionsTab';
import { PortalSettingsTab } from './pages/PortalSettingsTab';
import { PortalLogin } from './pages/PortalLogin';
import { PortalSignup } from './pages/PortalSignup';
import { PortalForgotPassword } from './pages/PortalForgotPassword';
import { PortalResetPassword } from './pages/PortalResetPassword';
import { authFetch, removeStoredToken } from './utils/authFetch';

export const PortalApp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState(false);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState<{
    id: string;
    email: string;
    role: string;
  } | null>(null);
  const [dbConnected, setDbConnected] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active tab when authenticated
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'settings'>('dashboard');

  // View state when unauthenticated
  const [unauthView, setUnauthView] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [resetParams, setResetParams] = useState<{ email?: string; token?: string }>({});

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setStatusError(null);
      const res = await authFetch('/api/auth/status');
      if (!res.ok) {
        throw new Error(`Portal API returned HTTP ${res.status}.`);
      }
      const data = await res.json();

      setAdminExists(data.adminExists ?? false);
      setDbConnected(data.dbConnected ?? false);

      if (data.authenticated && data.admin) {
        setAuthenticatedAdmin(data.admin);
      } else {
        setAuthenticatedAdmin(null);
        if (!data.adminExists) {
          setUnauthView('signup');
        } else {
          const path = window.location.pathname;
          const searchParams = new URLSearchParams(window.location.search);
          if (path.includes('reset-password') || searchParams.has('token')) {
            setUnauthView('reset-password');
            setResetParams({
              email: searchParams.get('email') || '',
              token: searchParams.get('token') || '',
            });
          } else {
            setUnauthView('login');
          }
        }
      }
    } catch (err: any) {
      console.error('[Portal] Auth status check failed:', err);
      setStatusError(
        err?.name === 'TimeoutError'
          ? 'The portal API did not respond in time. The server or database may be offline.'
          : 'Unable to reach the portal API. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('[Portal] Logout error:', err);
    }
    removeStoredToken();
    setAuthenticatedAdmin(null);
    setUnauthView('login');
  };

  const handleLoginSuccess = (admin: any) => {
    setAuthenticatedAdmin(admin);
    setActiveTab('dashboard');
  };

  const handleSignupSuccess = (admin: any) => {
    setAdminExists(true);
    setAuthenticatedAdmin(admin);
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d1f] flex flex-col items-center justify-center text-white p-6">
        <Loader2 className="w-10 h-10 text-[#b91c1c] animate-spin mb-4" />
        <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">
          Connecting to Admin Portal...
        </p>
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="min-h-screen bg-[#060d1f] flex flex-col items-center justify-center text-white p-6">
        <div className="w-full max-w-md bg-[#091124] border border-[#1b2b4d] p-8 text-center shadow-2xl">
          <AlertCircle className="w-10 h-10 text-[#b91c1c] mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Admin Portal Unavailable</h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            {statusError}
          </p>
          <button
            type="button"
            onClick={checkAuthStatus}
            className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider py-3.5 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // If Authenticated: show Sidebar + Main Content Layout
  if (authenticatedAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans selection:bg-[#b91c1c] selection:text-white">
        {/* Mobile Top bar */}
        <div className="md:hidden bg-[#091124] text-white p-4 border-b border-[#141f38] flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full" />
            <span className="font-bold text-sm tracking-wider uppercase">
              The American Dream
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-300 hover:text-white bg-white/5 rounded"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 max-w-full bg-[#091124] h-full shadow-2xl">
              <PortalSidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                adminEmail={authenticatedAdmin.email}
                onLogout={handleLogout}
                dbConnected={dbConnected}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <PortalSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            adminEmail={authenticatedAdmin.email}
            onLogout={handleLogout}
            dbConnected={dbConnected}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto min-h-screen bg-gray-50/50">
          {activeTab === 'dashboard' && (
            <PortalDashboardTab onViewSubmissions={() => setActiveTab('submissions')} />
          )}

          {activeTab === 'submissions' && <PortalSubmissionsTab />}

          {activeTab === 'settings' && (
            <PortalSettingsTab
              adminEmail={authenticatedAdmin.email}
              onEmailUpdated={(newEmail) =>
                setAuthenticatedAdmin((prev) => (prev ? { ...prev, email: newEmail } : null))
              }
            />
          )}
        </main>
      </div>
    );
  }

  // Unauthenticated Views
  if (!adminExists || unauthView === 'signup') {
    return (
      <PortalSignup
        adminExists={adminExists}
        dbConnected={dbConnected}
        onSuccess={handleSignupSuccess}
        onGoToLogin={() => setUnauthView('login')}
      />
    );
  }

  if (unauthView === 'forgot-password') {
    return (
      <PortalForgotPassword
        onGoToLogin={() => setUnauthView('login')}
        onGoToReset={(email, token) => {
          setResetParams({ email, token });
          setUnauthView('reset-password');
        }}
      />
    );
  }

  if (unauthView === 'reset-password') {
    return (
      <PortalResetPassword
        initialEmail={resetParams.email}
        initialToken={resetParams.token}
        onSuccess={() => setUnauthView('login')}
        onGoToLogin={() => setUnauthView('login')}
      />
    );
  }

  return (
    <PortalLogin
      adminExists={adminExists}
      dbConnected={dbConnected}
      onSuccess={handleLoginSuccess}
      onForgotPasswordClick={() => setUnauthView('forgot-password')}
      onGoToSignup={() => setUnauthView('signup')}
    />
  );
};
