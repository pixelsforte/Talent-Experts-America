import React from 'react';
import { ArrowRight } from 'lucide-react';

export const WhoWeAre: React.FC = () => {
  const scrollToProcess = () => {
    const processSection = document.querySelector('#process');
    if (processSection) {
      processSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image with Bottom-Right Accent Line */}
          <div className="lg:col-span-6 relative pb-6 pr-6">
            {/* 90-degree Angle Accent: Bottom-Right half-frame (Only bottom and right lines) */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-44 sm:w-56 h-40 sm:h-52 border-b border-r border-[#f87171] pointer-events-none z-0"
            />

            <div className="relative z-10">
              <div className="bg-gray-100 overflow-hidden shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop"
                  alt="Business professionals collaborating in an office consultation"
                  className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover object-center block"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Text & Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="mb-4">
              <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em]">
                Who We Are
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12] mb-6">
              Empowering American <br className="hidden sm:inline" />
              Talent. Enabling <br className="hidden sm:inline" />
              Business Success.
            </h2>

            {/* Body paragraphs */}
            <p className="text-base text-gray-600 leading-relaxed mb-5">
              At The Talent Experts of America, we bridge the gap between
              exceptional American talent and thriving businesses. Our mission is
              to deliver staffing solutions that prioritize placing highly
              skilled U.S.-based professionals in roles where they can excel and
              make an impact.
            </p>

            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Our approach is built around understanding the specific needs of
              clients and candidates, creating meaningful connections and
              supporting successful placements from recruitment through
              onboarding.
            </p>

            {/* Button */}
            <div>
              <button
                type="button"
                id="about-discover-approach-btn"
                onClick={scrollToProcess}
                className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Discover Our Approach</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
