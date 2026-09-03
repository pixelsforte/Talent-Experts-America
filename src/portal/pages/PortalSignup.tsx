import React, { useState } from 'react';
import { AlertCircle, Loader2, CheckCircle2, Lock, ArrowRight, Database } from 'lucide-react';
import { authFetch, setStoredToken } from '../utils/authFetch';

interface PortalSignupProps {
  onSuccess: (admin: any) => void;
  onGoToLogin: () => void;
  adminExists: boolean;
  dbConnected?: boolean;
}

export const PortalSignup: React.FC<PortalSignupProps> = ({
  onSuccess,
  onGoToLogin,
  adminExists,
  dbConnected = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (adminExists) {
    return (
      <div className="min-h-screen bg-[#060d1f] flex flex-col justify-center items-center p-4 sm:p-6 text-white selection:bg-[#b91c1c]">
        <div className="w-full max-w-md bg-[#091124] border border-[#1b2b4d] p-8 text-center shadow-2xl">
          <div className="w-12 h-12 bg-amber-950/80 border border-amber-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-2">
            Signup is Disabled
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            An administrator account is already provisioned.
            Please log in using the administrator credentials.
          </p>
          <button
            onClick={onGoToLogin}
            className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider py-3.5 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create Admin account.');
      }

      if (data.token) {
        setStoredToken(data.token);
      }

      setSuccessMsg('Admin account created successfully! Initializing session...');
      setTimeout(() => {
        onSuccess(data.admin);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during account creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1f] flex flex-col justify-center items-center p-4 sm:p-6 text-white selection:bg-[#b91c1c] relative overflow-hidden">
      {/* Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md bg-[#091124] border border-[#1b2b4d] p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              The American Dream
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Create Admin
          </h1>
          <div className="flex items-center justify-center mt-3">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold border ${
                dbConnected
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-800 text-amber-300'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{dbConnected ? 'MongoDB Atlas Connected' : 'Database Offline'}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-medium flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signup-email"
              className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
            >
              Administrator Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theamericandreamstaffing.com"
              className="w-full px-4 py-3 bg-[#0c1630] border border-[#22355b] text-white text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
            >
              Password (Min. 8 characters)
            </label>
            <input
              id="signup-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#0c1630] border border-[#22355b] text-white text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#0c1630] border border-[#22355b] text-white text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Admin...</span>
                </>
              ) : (
                <>
                  <span>Create Admin & Open Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-[#1b2b4d] text-center">
          <a
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
