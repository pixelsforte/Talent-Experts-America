import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  Mail,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Database,
} from 'lucide-react';
import { authFetch, setStoredToken } from '../utils/authFetch';

interface PortalSettingsTabProps {
  adminEmail: string;
  onEmailUpdated: (newEmail: string) => void;
}

export const PortalSettingsTab: React.FC<PortalSettingsTabProps> = ({
  adminEmail,
  onEmailUpdated,
}) => {
  // Gate state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [verifyPasswordInput, setVerifyPasswordInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  // Profile and update state
  const [profile, setProfile] = useState<any>(null);

  // Email Change Flow states
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingRequestedEmail, setPendingRequestedEmail] = useState('');
  const [isRequestingChange, setIsRequestingChange] = useState(false);
  const [isConfirmingChange, setIsConfirmingChange] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');
  const [debugToken, setDebugToken] = useState('');

  // Unlock handler
  const handleUnlockSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');

    if (!verifyPasswordInput) {
      setUnlockError('Please enter your current admin password.');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await authFetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: verifyPasswordInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.verified) {
        throw new Error(data.message || 'Incorrect password. Access denied.');
      }

      setIsUnlocked(true);
      fetchProfile();
    } catch (err: any) {
      setUnlockError(err.message || 'Password verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await authFetch('/api/admin/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin profile', err);
    }
  };

  const handleRequestEmailToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');
    setDebugToken('');

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setChangeError('Please enter a valid new email address.');
      return;
    }

    setIsRequestingChange(true);

    try {
      const res = await authFetch('/api/admin/request-email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: newEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to request email change.');
      }

      setPendingRequestedEmail(newEmail.trim());
      setChangeSuccess(`Verification code sent to ${newEmail.trim()}.`);
      if (data.debugToken) {
        setDebugToken(data.debugToken);
      }
    } catch (err: any) {
      setChangeError(err.message || 'Failed to initiate email change.');
    } finally {
      setIsRequestingChange(false);
    }
  };

  const handleConfirmNewEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!verificationCode.trim()) {
      setChangeError('Please enter the verification code.');
      return;
    }

    setIsConfirmingChange(true);

    try {
      const res = await authFetch('/api/admin/verify-new-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationCode.trim(),
          newEmail: pendingRequestedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to verify new email.');
      }

      if (data.token) {
        setStoredToken(data.token);
      }

      const updatedEmail = data.admin.email;
      setChangeSuccess(`Admin email successfully changed to ${updatedEmail}!`);
      setNewEmail('');
      setVerificationCode('');
      setPendingRequestedEmail('');
      setDebugToken('');
      onEmailUpdated(updatedEmail);
      fetchProfile();
    } catch (err: any) {
      setChangeError(err.message || 'Verification failed. Token may have expired.');
    } finally {
      setIsConfirmingChange(false);
    }
  };

  // Fallback: Direct change with current password
  const [directPassword, setDirectPassword] = useState('');
  const [directEmail, setDirectEmail] = useState('');
  const [isDirectChanging, setIsDirectChanging] = useState(false);
  const [showDirectFallback, setShowDirectFallback] = useState(false);

  const handleDirectEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!directEmail.trim() || !directEmail.includes('@')) {
      setChangeError('Please enter a valid new email address.');
      return;
    }
    if (!directPassword) {
      setChangeError('Please enter your current password.');
      return;
    }

    setIsDirectChanging(true);

    try {
      const res = await authFetch('/api/admin/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: directPassword,
          newEmail: directEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update email address.');
      }

      if (data.token) {
        setStoredToken(data.token);
      }

      const updatedEmail = data.admin.email;
      setChangeSuccess(`Admin email successfully updated to ${updatedEmail}!`);
      setDirectEmail('');
      setDirectPassword('');
      setShowDirectFallback(false);
      onEmailUpdated(updatedEmail);
      fetchProfile();
    } catch (err: any) {
      setChangeError(err.message || 'Failed to update email.');
    } finally {
      setIsDirectChanging(false);
    }
  };

  // Gate behind password verification
  if (!isUnlocked) {
    return (
      <div className="p-6 sm:p-8 lg:p-10 max-w-xl mx-auto">
        <div className="border border-gray-200 bg-white p-8 rounded shadow-xs text-center">
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b91c1c]">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b91c1c] block mb-1">
            Security Checkpoint
          </span>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
            Enter Current Password
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-6 max-w-md mx-auto">
            Access to administrator settings and email modifications requires verifying
            your active admin password.
          </p>

          {unlockError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 mb-6 text-left rounded">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{unlockError}</span>
            </div>
          )}

          <form onSubmit={handleUnlockSettings} className="space-y-4 max-w-sm mx-auto">
            <div>
              <input
                type="password"
                required
                value={verifyPasswordInput}
                onChange={(e) => setVerifyPasswordInput(e.target.value)}
                placeholder="Enter current password..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider py-3 rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Password...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Settings</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // UNLOCKED SETTINGS PANEL
  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] block mb-1">
            Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Admin Settings
          </h1>
        </div>

        <button
          onClick={() => {
            setIsUnlocked(false);
            setVerifyPasswordInput('');
          }}
          className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 inline-flex items-center gap-2 transition-colors cursor-pointer rounded"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock Settings</span>
        </button>
      </div>

      {/* Admin Profile Overview Card */}
      <div className="border border-gray-200 bg-white p-6 rounded shadow-xs">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#b91c1c]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Admin Profile Overview
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-red-50 text-[#b91c1c] border border-red-200 px-2.5 py-0.5 font-bold uppercase rounded">
            {profile?.admin?.role || 'ADMIN'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              LOGIN & RECOVERY EMAIL
            </span>
            <div className="font-mono font-bold text-gray-900 text-sm break-all">
              {profile?.admin?.email || adminEmail}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              PROVISIONED ON
            </span>
            <div className="text-gray-700">
              {profile?.admin?.createdAt
                ? new Date(profile.admin.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Active'}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              DATABASE
            </span>
            <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>{profile?.dbState?.name || 'staffing_agency'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {changeError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2 rounded">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{changeError}</span>
        </div>
      )}

      {changeSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 rounded">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{changeSuccess}</span>
        </div>
      )}

      {/* Email Change Section */}
      <div className="border border-gray-200 bg-white p-6 rounded shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-gray-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            Change Admin Email
          </h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Updating your email will replace your admin login identifier
          and future password recovery destination.
        </p>

        {/* Step 1: Input New Email */}
        <form onSubmit={handleRequestEmailToken} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label
                htmlFor="settings-new-email"
                className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                New Admin Email
              </label>
              <input
                id="settings-new-email"
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="newadmin@theamericandreamstaffing.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isRequestingChange}
                className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3 rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isRequestingChange ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Request Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Step 2: Enter Verification Code */}
        {pendingRequestedEmail && (
          <div className="p-5 bg-blue-50/70 border border-blue-200 mb-6 space-y-4 rounded">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Step 2: Enter Verification Code for {pendingRequestedEmail}
              </span>
              {debugToken && (
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-300 font-bold rounded">
                  Code: {debugToken}
                </span>
              )}
            </div>

            <form onSubmit={handleConfirmNewEmail} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2">
                <label
                  htmlFor="settings-verification-code"
                  className="block text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-1.5"
                >
                  Verification Code / Token
                </label>
                <input
                  id="settings-verification-code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Paste verification token..."
                  className="w-full px-4 py-2.5 border border-blue-300 rounded font-mono text-sm text-gray-900 focus:outline-none focus:border-blue-900 bg-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isConfirmingChange}
                  className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider py-3 rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isConfirmingChange ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Confirm & Save</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fallback Option: Direct password verification if old email lost */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowDirectFallback(!showDirectFallback)}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 underline cursor-pointer"
          >
            {showDirectFallback
              ? 'Hide Direct Password Update'
              : 'Lost access to email? Update directly with verified current password →'}
          </button>

          {showDirectFallback && (
            <form onSubmit={handleDirectEmailUpdate} className="mt-4 p-5 bg-gray-50 border border-gray-200 space-y-4 rounded">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Direct Update via Verified Admin Password
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="direct-new-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5"
                  >
                    New Email Address
                  </label>
                  <input
                    id="direct-new-email"
                    type="email"
                    required
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    placeholder="newadmin@theamericandreamstaffing.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="direct-password-confirm"
                    className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5"
                  >
                    Confirm Current Password
                  </label>
                  <input
                    id="direct-password-confirm"
                    type="password"
                    required
                    value={directPassword}
                    onChange={(e) => setDirectPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isDirectChanging}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDirectChanging ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Directly Update Email</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
