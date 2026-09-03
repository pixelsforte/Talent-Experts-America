import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PreFooterCtaProps {
  onFindTalentClick?: () => void;
  onFindJobClick?: () => void;
}

export const PreFooterCta: React.FC<PreFooterCtaProps> = ({
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
    <section className="py-24 lg:py-32 bg-[#091124] text-white relative overflow-hidden text-center border-b border-[#141f38]">
      {/* Crisp dotted matrix texture overlay matching Screenshot 8 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.12] mb-6">
          The Right Talent Can <br />
          Change Everything.
        </h2>

        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Let&apos;s create meaningful connections between American professionals and
          organizations ready to grow.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            id="pre-footer-find-talent-btn"
            onClick={
              onFindTalentClick ||
              (() => scrollToContact('Hiring Talent'))
            }
            className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold px-7 py-3.5 inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Find Talent</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="pre-footer-find-job-btn"
            onClick={
              onFindJobClick ||
              (() => scrollToContact('Finding a Job'))
            }
            className="bg-transparent border border-white/30 hover:border-white text-white hover:bg-white/10 text-sm font-semibold px-7 py-3.5 inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Find a Job</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
