import React, { useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { KeyRound, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface PortalForgotPasswordProps {
  onGoToLogin: () => void;
  onGoToReset: (email?: string, token?: string) => void;
}

export const PortalForgotPassword: React.FC<PortalForgotPasswordProps> = ({
  onGoToLogin,
  onGoToReset,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{
    message: string;
    debugToken?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessData(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid administrator email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to process recovery request.');
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during password recovery.');
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
            Recover Administrator Password
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Enter the email address currently associated with your Super Admin account.
            A secure recovery verification token will be dispatched.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successData ? (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recovery Token Dispatched</span>
              </div>
              <p>{successData.message}</p>
            </div>

            {successData.debugToken && (
              <div className="p-3 bg-[#0c1630] border border-[#22355b] text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Active Recovery Token:
                </span>
                <code className="font-mono text-amber-300 break-all text-[11px]">
                  {successData.debugToken}
                </code>
              </div>
            )}

            <button
              type="button"
              onClick={() => onGoToReset(email, successData.debugToken)}
              className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Reset Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="recovery-email"
                className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5"
              >
                Current Administrator Email
              </label>
              <input
                id="recovery-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theamericandreamstaffing.com"
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
                    <span>Dispatching Token...</span>
                  </>
                ) : (
                  <>
                    <span>Send Password Recovery Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-[#1b2b4d] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Login
          </button>
          <button
            type="button"
            onClick={() => onGoToReset()}
            className="text-gray-400 hover:text-white transition-colors underline cursor-pointer"
          >
            Have a Token? Reset Here
          </button>
        </div>
      </div>
    </div>
  );
};
