import React from 'react';
import { INDUSTRIES } from '../data/websiteData';

export const IndustriesSection: React.FC = () => {
  return (
    <section id="industries" className="py-20 lg:py-28 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Industries We Serve
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12]">
            Connecting Talent Across <br className="hidden sm:inline" />
            Critical Industries.
          </h2>
        </div>

        {/* 10-Item Grid (5 columns on desktop, 2-3 on tablet, 1-2 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.number}
              id={`industry-card-${ind.number}`}
              className="border border-gray-200 p-6 sm:p-7 bg-white hover:border-[#b91c1c] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-start min-h-[230px] group cursor-default"
            >
              {/* Outline Box Icon that rotates 45deg and turns red on hover */}
              <div className="w-5 h-5 border border-gray-300 group-hover:border-[#b91c1c] transition-all duration-300 group-hover:rotate-45 mb-4 origin-center" />

              <span className="text-xs font-bold text-gray-500 group-hover:text-[#b91c1c] tracking-widest block mb-2 transition-colors">
                {ind.number}
              </span>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug tracking-tight">
                {ind.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed mt-auto">
                {ind.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
