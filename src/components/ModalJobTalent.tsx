import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, Building2, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface ModalJobTalentProps {
  isOpen: boolean;
  type: 'talent' | 'job' | 'veteran';
  onClose: () => void;
}

export const ModalJobTalent: React.FC<ModalJobTalentProps> = ({
  isOpen,
  type,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleOrRequirement: '',
  });

  if (!isOpen) return null;

  const getInterest = () => {
    switch (type) {
      case 'talent':
        return 'Hiring Talent';
      case 'job':
        return 'Finding a Job';
      case 'veteran':
        return 'Veteran Opportunities';
      default:
        return 'Staffing Solutions';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          interest: getInterest(),
          message: formData.roleOrRequirement.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit request.');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        roleOrRequirement: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const titles = {
    talent: {
      title: 'Find Top U.S. Talent',
      subtitle: 'Tell us about your organizational staffing requirements.',
      icon: Building2,
      badge: 'EMPLOYER INQUIRY',
    },
    job: {
      title: 'Find Your Next Career Opportunity',
      subtitle: 'Connect your skills with top American employers.',
      icon: User,
      badge: 'CANDIDATE APPLICATION',
    },
    veteran: {
      title: 'Veteran Workforce Integration',
      subtitle: 'Transition your military leadership into high-impact civilian roles.',
      icon: ShieldCheck,
      badge: 'VETERAN OPPORTUNITIES',
    },
  };

  const current = titles[type];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Request Received
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your information has been securely recorded. Our staffing specialists will reach out to you within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-gray-900 text-white text-xs font-semibold px-6 py-3 hover:bg-black cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-[#b91c1c] uppercase mb-2">
              <Icon className="w-4 h-4" />
              <span>{current.badge}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
              {current.title}
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {current.subtitle}
            </p>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  {type === 'talent'
                    ? 'Target Roles / Positions'
                    : 'Desired Industry or Skillset'}
                </label>
                <input
                  type="text"
                  value={formData.roleOrRequirement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roleOrRequirement: e.target.value,
                    })
                  }
                  placeholder={
                    type === 'talent'
                      ? 'e.g. Software Engineers, Project Managers...'
                      : 'e.g. Healthcare, IT, Logistics...'
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-900 bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold py-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Quick Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
