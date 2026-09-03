import React from 'react';
import { HIGHLIGHTS_BAR } from '../data/websiteData';

export const KeyHighlightsBar: React.FC = () => {
  return (
    <section className="bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {HIGHLIGHTS_BAR.map((item, index) => (
            <div
              key={index}
              id={`highlight-card-${index}`}
              className="py-6 px-6 lg:px-8 flex flex-col justify-center"
            >
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-1.5">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
