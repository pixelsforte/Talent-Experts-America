import React from 'react';
import { TEAM_MEMBERS } from '../data/websiteData';

export const TeamSection: React.FC = () => {
  return (
    <section id="team" className="py-20 lg:py-28 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Our Team
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12]">
            Meet the Team <br />
            Behind the Mission.
          </h2>
        </div>

        {/* Team Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              id={`team-member-card-${index}`}
              className="border border-gray-200 bg-white hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 flex flex-col group cursor-default"
            >
              {/* Portrait Image / Monogram Box */}
              <div className="w-full aspect-[4/5] bg-[#edf0f5] flex items-center justify-center border-b border-gray-200 overflow-hidden transition-colors group-hover:bg-[#e4e8ef] relative">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-gray-400 tracking-wider select-none">
                    {member.initials}
                  </span>
                )}
              </div>

              {/* Info Area inside the card */}
              <div className="p-5 sm:p-6 bg-white flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 tracking-tight">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="text-xs sm:text-sm font-semibold text-[#b91c1c] mb-1">
                    {member.role}
                  </p>
                )}
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 leading-snug">
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
