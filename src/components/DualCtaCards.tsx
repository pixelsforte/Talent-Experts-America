import React from 'react';
import { ArrowRight } from 'lucide-react';

interface DualCtaCardsProps {
  onFindTalentClick?: () => void;
  onFindJobClick?: () => void;
}

export const DualCtaCards: React.FC<DualCtaCardsProps> = ({
  onFindTalentClick,
  onFindJobClick,
}) => {
  const scrollToContact = (interestType: string) => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const selectEl = document.querySelector(
        '#contact-interest-select'
      ) as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = interestType;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  return (
    <section className="bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Employers Column */}
          <div
            id="dual-cta-employers"
            className="py-14 sm:py-16 lg:py-20 pr-0 md:pr-12 lg:pr-16 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 block mb-4">
                FOR EMPLOYERS
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 tracking-tight leading-snug mb-4">
                Find the People Who Move <br className="hidden sm:inline" />
                Your Business Forward.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-xl">
                Tell us what your organization needs. We&apos;ll help connect you
                with qualified U.S.-based talent.
              </p>
            </div>
            <div>
              <button
                type="button"
                id="dual-cta-find-talent-btn"
                onClick={
                  onFindTalentClick ||
                  (() => scrollToContact('Hiring Talent'))
                }
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold px-6 py-3.5 inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Find Talent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Candidates Column */}
          <div
            id="dual-cta-candidates"
            className="py-14 sm:py-16 lg:py-20 pl-0 md:pl-12 lg:pl-16 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 block mb-4">
                FOR CANDIDATES
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 tracking-tight leading-snug mb-4">
                Your Next Opportunity <br className="hidden sm:inline" />
                Starts Here.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-xl">
                Connect your skills, experience and ambitions with opportunities
                where you can make an impact.
              </p>
            </div>
            <div>
              <button
                type="button"
                id="dual-cta-find-job-btn"
                onClick={
                  onFindJobClick ||
                  (() => scrollToContact('Finding a Job'))
                }
                className="border border-gray-300 text-gray-900 hover:border-gray-900 bg-white text-sm font-semibold px-6 py-3.5 inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Find a Job</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
