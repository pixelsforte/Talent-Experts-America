import React from 'react';
import { ArrowRight } from 'lucide-react';
import { VETERAN_STEPS } from '../data/websiteData';

interface VeteranSectionProps {
  onExploreVeteranClick?: () => void;
}

export const VeteranSection: React.FC<VeteranSectionProps> = ({
  onExploreVeteranClick,
}) => {
  const handleVeteranCta = () => {
    if (onExploreVeteranClick) {
      onExploreVeteranClick();
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const selectEl = document.querySelector(
          '#contact-interest-select'
        ) as HTMLSelectElement;
        if (selectEl) {
          selectEl.value = 'Veteran Opportunities';
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  };

  return (
    <section id="veterans" className="py-20 lg:py-28 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="mb-4">
              <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em]">
                Veteran Workforce Integration
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12] mb-6">
              Experience That <br />
              Deserves a New Mission.
            </h2>

            {/* Paragraph */}
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              We recognize the unique skills, discipline and leadership qualities
              U.S. veterans bring to the workforce. Our goal is to help veterans
              transition into civilian careers where their experience can create
              meaningful impact.
            </p>

            {/* 3 Steps */}
            <div className="space-y-6 mb-10">
              {VETERAN_STEPS.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="flex items-center gap-2.5 pt-0.5 shrink-0">
                    <span className="w-3 h-px bg-gray-300 inline-block" />
                    <span className="text-xs font-bold text-[#b91c1c] tracking-widest">
                      {step.number}
                    </span>
                    <span className="w-3 h-px bg-gray-300 inline-block" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <button
                type="button"
                id="veterans-explore-btn"
                onClick={handleVeteranCta}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold px-6 py-3.5 inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Explore Veteran Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="bg-gray-100 overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
                  alt="Dignified U.S. veteran professional in sharp suit"
                  className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover object-top"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
