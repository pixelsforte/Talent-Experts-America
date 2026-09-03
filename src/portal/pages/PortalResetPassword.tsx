import React, { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';
import { KeyRound, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface PortalResetPasswordProps {
  initialToken?: string;
  initialEmail?: string;
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export const PortalResetPassword: React.FC<PortalResetPasswordProps> = ({
  initialToken = '',
  initialEmail = '',
  onSuccess,
  onGoToLogin,
}) => {
  const [token, setToken] = useState(initialToken);
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Read from URL search params if present
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlEmail = params.get('email');
    if (urlToken && !token) setToken(urlToken);
    if (urlEmail && !email) setEmail(urlEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please provide the password reset token.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          newPassword,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired password reset token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1f] flex flex-col justify-center items-center p-4 sm:p-6 text-white selection:bg-[#b91c1c] relative overflow-hidden">
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
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#14234a] border border-[#22355b] rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6 text-[#b91c1c]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Set New Password
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Enter your verification token and your new administrator password.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs leading-relaxed text-left">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Password Reset Successfully</span>
              </div>
              <p>
                Your Super Admin password has been updated in MongoDB. The previous password is now invalid.
              </p>
            </div>

            <button
              type="button"
              onClick={onSuccess}
              className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Return to Login & Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reset-token"
                className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
              >
                Verification / Reset Token
              </label>
              <input
                id="reset-token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token received via recovery email"
                className="w-full px-4 py-3 bg-[#0c1630] border border-[#22355b] text-white text-sm font-mono focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="reset-new-password"
                className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
              >
                New Password (Min. 8 characters)
              </label>
              <input
                id="reset-new-password"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#0c1630] border border-[#22355b] text-white text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="reset-confirm-password"
                className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
              >
                Confirm New Password
              </label>
              <input
                id="reset-confirm-password"
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
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-[#1b2b4d] text-center text-xs">
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
