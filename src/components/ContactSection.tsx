import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CONTACT_INFO } from '../data/websiteData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    interest: 'Finding a Job',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit your inquiry.');
      }

      setSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        interest: 'Finding a Job',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(
        err.message || 'An error occurred while connecting to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column Information */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
                Start a Conversation
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12] mb-6">
                Let&apos;s Build the <br />
                Future of American <br />
                Work Together.
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-10">
                Whether you&apos;re looking for exceptional talent or your next career
                opportunity, The Talent Experts of America is here to deliver
                tailored staffing solutions.
              </p>

              {/* Direct Contact Details */}
              <div className="space-y-6 mb-12">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    WEBSITE
                  </span>
                  <a
                    href="mailto:info@theamerciandreamstaffing.com"
                    className="text-base font-bold text-gray-900 hover:text-[#b91c1c] transition-colors"
                  >
                    info@theamerciandreamstaffing.com
                  </a>
                </div>
              </div>
            </div>

            {/* Serving footnote */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium pt-4">
              <span className="w-2 h-2 rounded-full bg-[#b91c1c] shrink-0" />
              <span>{CONTACT_INFO.footnote}</span>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="lg:col-span-7">
            <div className="bg-white">
              {submitted ? (
                <div
                  id="contact-form-success"
                  className="border border-green-200 bg-green-50 p-8 sm:p-10 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Inquiry Submitted Successfully
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                    Thank you for reaching out to The Talent Experts of America.
                    Our team will review your inquiry and respond within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="bg-gray-900 text-white text-xs font-semibold px-5 py-2.5 hover:bg-black transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  id="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        COMPANY
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 3 - Interest Select */}
                  <div>
                    <label
                      htmlFor="contact-interest-select"
                      className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2"
                    >
                      I&apos;M INTERESTED IN
                    </label>
                    <div className="relative">
                      <select
                        id="contact-interest-select"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white appearance-none pr-10 cursor-pointer"
                      >
                        <option value="Finding a Job">Finding a Job</option>
                        <option value="Hiring Talent">Hiring Talent</option>
                        <option value="Veteran Opportunities">
                          Veteran Opportunities
                        </option>
                        <option value="Staffing Solutions">
                          Staffing Solutions
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Row 4 - Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2"
                    >
                      MESSAGE
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your staffing requirements or career background..."
                      className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      id="contact-submit-btn"
                      disabled={isSubmitting}
                      className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold py-4 text-center transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Inquiry</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
