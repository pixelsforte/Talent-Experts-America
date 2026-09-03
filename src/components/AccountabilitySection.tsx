import React from 'react';
import { ACCOUNTABILITY_ITEMS } from '../data/websiteData';

export const AccountabilitySection: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Headline */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12]">
              Staffing With <br />
              Accountability.
            </h2>
          </div>

          {/* Right 2x2 Grid with Center Cross/Plus Dividers */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {ACCOUNTABILITY_ITEMS.map((item, idx) => {
                const isTop = idx < 2;
                const isLeft = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    id={`accountability-item-${idx}`}
                    className={`p-6 sm:p-10 flex flex-col justify-start ${
                      isTop ? 'border-b border-gray-200' : ''
                    } ${isLeft ? 'sm:border-r sm:border-gray-200' : ''}`}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                      {item.stat}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
