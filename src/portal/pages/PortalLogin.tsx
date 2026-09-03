import React, { useState } from 'react';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { authFetch, setStoredToken } from '../utils/authFetch';

interface PortalLoginProps {
  onSuccess: (admin: any) => void;
  onForgotPasswordClick: () => void;
  onGoToSignup?: () => void;
  adminExists: boolean;
  dbConnected?: boolean;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({
  onSuccess,
  onForgotPasswordClick,
  onGoToSignup,
  adminExists,
  dbConnected = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your administrator email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      if (data.token) {
        setStoredToken(data.token);
      }

      onSuccess(data.admin);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the authentication service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1f] flex flex-col justify-center items-center p-4 sm:p-6 text-white selection:bg-[#b91c1c] relative overflow-hidden">
      {/* Crisp texture overlay */}
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
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-[#b91c1c] rounded-full" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-300">
              The American Dream Staffing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Management Portal
          </h1>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
            >
              Administrator Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theamericandreamstaffing.com"
              className="w-full px-4 py-3 bg-[#0c1630] border border-[#22355b] text-white text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="text-[11px] font-bold uppercase tracking-wider text-gray-300"
              >
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-[11px] text-gray-400 hover:text-white transition-colors underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Management Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Database setup notice if no admin exists */}
        {!adminExists && onGoToSignup && (
          <div className="mt-6 pt-6 border-t border-[#1b2b4d] text-center">
            <p className="text-xs text-amber-300/90 mb-2">
              No Super Admin found in this database.
            </p>
            <button
              type="button"
              onClick={onGoToSignup}
              className="text-xs font-bold uppercase tracking-wider text-white underline hover:text-gray-200 cursor-pointer"
            >
              Initialize First Super Admin →
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-[#1b2b4d] flex items-center justify-between text-xs text-gray-400">
          <a
            href="/"
            className="hover:text-white transition-colors"
          >
            ← Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
