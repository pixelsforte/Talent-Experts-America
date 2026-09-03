import React from 'react';
import { PROCESS_STEPS } from '../data/websiteData';

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="py-20 lg:py-28 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12]">
            From Search to Onboarding.
          </h2>
        </div>

        {/* 6 Step Horizontal Process Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 relative">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              id={`process-step-${step.number}`}
              className="flex flex-col relative"
            >
              {/* Line with red dot at the start */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] shrink-0" />
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* Larger Gray Number */}
              <span className="text-2xl sm:text-[26px] font-bold text-gray-300 tracking-tight block mb-2">
                {step.number}
              </span>

              {/* Step Title */}
              <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
