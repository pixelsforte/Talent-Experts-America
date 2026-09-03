import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onFindTalentClick?: () => void;
  onFindJobClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFindTalentClick,
  onFindJobClick,
}) => {
  const scrollToContact = (roleType?: string) => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      if (roleType) {
        const selectEl = document.querySelector(
          '#contact-interest-select'
        ) as HTMLSelectElement;
        if (selectEl) {
          selectEl.value = roleType;
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  };

  return (
    <section className="relative bg-white pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="mb-5">
              <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em]">
                AMERICAN TALENT. EXCEPTIONAL OPPORTUNITIES.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] xl:text-[68px] font-bold text-gray-900 tracking-tight leading-[1.05] mb-6">
              Connecting <br />
              American <br />
              Talent With the <br />
              Future of Work.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mb-8">
              We connect exceptional U.S.-based professionals with businesses
              that need the right people, the right skills, and the right
              workforce solutions to grow.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <button
                type="button"
                id="hero-find-talent-btn"
                onClick={
                  onFindTalentClick ||
                  (() => scrollToContact('Hiring Talent'))
                }
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold px-7 py-3.5 inline-flex items-center gap-2.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <span>Find Talent</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="hero-find-job-btn"
                onClick={
                  onFindJobClick ||
                  (() => scrollToContact('Finding a Job'))
                }
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 text-sm font-semibold px-6 py-3.5 inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>Find Your Dream Job</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-6 relative pt-6 pl-6">
            {/* 90-degree Angle Accent: Top-Left half-frame (Only top and left lines, no right or bottom) */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 w-44 sm:w-56 h-40 sm:h-52 border-t border-l border-[#f87171] pointer-events-none z-0"
            />

            {/* Image Container with Floating Overlaid Metric Cards */}
            <div className="relative z-10">
              <div className="bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"
                  alt="Professional executive businesswoman in modern corporate office"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[540px] object-cover object-top block"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* 3 Overlapping Floating Metric Cards sitting over the bottom of the image */}
              <div className="absolute -bottom-5 right-0 sm:right-4 left-4 sm:left-auto sm:w-[86%] bg-white shadow-xl border border-gray-200/80 z-20">
                <div className="grid grid-cols-3 divide-x divide-gray-200 py-3.5 px-1 sm:px-2">
                  <div className="px-2 sm:px-4 text-left">
                    <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-900">
                      TALENT
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-1 leading-tight">
                      U.S.-based professionals
                    </div>
                  </div>
                  <div className="px-2 sm:px-4 text-left">
                    <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-900">
                      BUSINESS
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-1 leading-tight">
                      Workforce solutions
                    </div>
                  </div>
                  <div className="px-2 sm:px-4 text-left">
                    <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-900">
                      OPPORTUNITY
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-1 leading-tight">
                      Careers with impact
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
