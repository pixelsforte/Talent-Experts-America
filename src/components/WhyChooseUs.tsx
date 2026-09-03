import React from 'react';
import { WHY_CHOOSE_ITEMS } from '../data/websiteData';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12]">
            A More Focused <br />
            Approach to Staffing.
          </h2>
        </div>

        {/* 2x2 Connected Grid with No Gaps */}
        <div className="border border-gray-200 grid grid-cols-1 md:grid-cols-2 divide-y divide-gray-200 md:divide-y-0">
          {WHY_CHOOSE_ITEMS.map((item, index) => {
            const isTopRow = index < 2;
            const isLeftCol = index % 2 === 0;

            return (
              <div
                key={item.number}
                id={`why-choose-card-${item.number}`}
                className={`p-8 sm:p-12 bg-white hover:bg-gray-50/70 transition-colors flex flex-col justify-between ${
                  isTopRow ? 'md:border-b md:border-gray-200' : ''
                } ${isLeftCol ? 'md:border-r md:border-gray-200' : ''}`}
              >
                <div>
                  <span className="text-xs font-bold text-[#b91c1c] tracking-widest block mb-4">
                    {item.number}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
