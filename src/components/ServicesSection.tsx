import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/websiteData';

interface ServicesSectionProps {
  onSelectService?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
}) => {
  const topServices = SERVICES.slice(0, 2);
  const bottomServices = SERVICES.slice(2, 5);

  const handleCardClick = (serviceTitle: string) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    } else {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const msgEl = document.querySelector('#contact-message') as HTMLTextAreaElement;
        if (msgEl) {
          msgEl.value = `I am interested in learning more about your ${serviceTitle} services.`;
        }
      }
    }
  };

  return (
    <section id="services" className="py-20 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-4">
          <span className="text-[#b91c1c] text-xs font-bold uppercase tracking-[0.2em]">
            OUR SERVICES
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-14">
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-gray-900 tracking-tight leading-[1.12]">
              Workforce Solutions <br />
              Built Around <br />
              Your Business.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              From finding exceptional talent to supporting workforce
              operations, our services are designed around the specific
              requirements of organizations and candidates.
            </p>
          </div>
        </div>

        {/* Top Row - Card 01 is larger (7 cols), Card 02 is 5 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {/* Card 01 - Largest */}
          <div
            id={`service-card-${topServices[0].number}`}
            className="lg:col-span-7 border border-gray-200 p-8 sm:p-10 bg-white hover:bg-white hover:border-gray-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 flex flex-col justify-between min-h-[280px] group cursor-pointer"
            onClick={() => handleCardClick(topServices[0].title)}
          >
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs font-bold text-[#b91c1c] tracking-widest">
                  {topServices[0].number}
                </span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                {topServices[0].title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                {topServices[0].description}
              </p>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-[#b91c1c] group-hover:text-[#991b1b] inline-flex items-center gap-1.5 transition-colors">
                <span>{topServices[0].linkText.replace(' →', '')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>

          {/* Card 02 */}
          <div
            id={`service-card-${topServices[1].number}`}
            className="lg:col-span-5 border border-gray-200 p-8 sm:p-10 bg-white hover:bg-white hover:border-gray-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 flex flex-col justify-between min-h-[280px] group cursor-pointer"
            onClick={() => handleCardClick(topServices[1].title)}
          >
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs font-bold text-[#b91c1c] tracking-widest">
                  {topServices[1].number}
                </span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                {topServices[1].title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                {topServices[1].description}
              </p>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-[#b91c1c] group-hover:text-[#991b1b] inline-flex items-center gap-1.5 transition-colors">
                <span>{topServices[1].linkText.replace(' →', '')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row - 3 Cards of same size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {bottomServices.map((card) => (
            <div
              key={card.number}
              id={`service-card-${card.number}`}
              className="border border-gray-200 p-8 sm:p-9 bg-white hover:bg-white hover:border-gray-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 flex flex-col justify-between min-h-[280px] group cursor-pointer"
              onClick={() => handleCardClick(card.title)}
            >
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs font-bold text-[#b91c1c] tracking-widest">
                    {card.number}
                  </span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-[#b91c1c] group-hover:text-[#991b1b] inline-flex items-center gap-1.5 transition-colors">
                  <span>{card.linkText.replace(' →', '')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
