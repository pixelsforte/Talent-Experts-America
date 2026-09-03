import React from 'react';
import { TECH_CARDS, TECH_BADGES } from '../data/websiteData';

export const SpecializedTechSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#060c1d] text-white relative overflow-hidden">
      {/* Tech Graph & Celestial Orbital Line Vector in Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden opacity-30"
      >
        <svg
          className="w-[1200px] h-[1200px] absolute -right-40 -top-40 text-blue-500/20"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric subtle orbit rings */}
          <circle cx="500" cy="500" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          <circle cx="500" cy="500" r="320" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="500" cy="500" r="460" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" opacity="0.25" />
          <circle cx="500" cy="500" r="600" stroke="currentColor" strokeWidth="1" opacity="0.15" />
          
          {/* Subtle connecting node lines */}
          <line x1="180" y1="500" x2="820" y2="500" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
          <line x1="500" y1="180" x2="500" y2="820" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
          <line x1="270" y1="270" x2="730" y2="730" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />

          {/* Small glowing dots */}
          <circle cx="500" cy="180" r="3" fill="#60a5fa" opacity="0.6" />
          <circle cx="680" cy="500" r="2.5" fill="#60a5fa" opacity="0.7" />
          <circle cx="270" cy="270" r="2" fill="#60a5fa" opacity="0.5" />
          <circle cx="820" cy="500" r="3.5" fill="#60a5fa" opacity="0.6" />
        </svg>

        {/* Light dot grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #60a5fa 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with generous spacing */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em] block mb-4">
            SPECIALIZED TALENT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.12] mb-6">
            Talent for the Technologies <br />
            Shaping Tomorrow.
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
            Our staffing focus extends into emerging and high-technology fields
            where specialized talent is essential for innovation and growth.
          </p>
        </div>

        {/* 3 Connected Dark Cards with 0 Gap */}
        <div className="border border-[#162344] bg-[#0c1630]/90 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#162344] mb-14 shadow-2xl">
          {TECH_CARDS.map((card, index) => (
            <div
              key={index}
              id={`tech-card-${index}`}
              className="p-8 sm:p-10 hover:bg-[#121f44] transition-colors flex flex-col justify-start group cursor-default"
            >
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white mb-4">
                {card.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Also Supporting Badges with rounded pill design */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mr-2">
            ALSO SUPPORTING
          </span>
          {TECH_BADGES.map((badge, idx) => (
            <span
              key={idx}
              className="rounded-full border border-[#22355b] bg-transparent text-gray-200 text-xs sm:text-sm font-medium px-5 py-2 hover:border-[#3b558c] hover:text-white transition-colors"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
