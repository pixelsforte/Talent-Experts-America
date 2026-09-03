/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { KeyHighlightsBar } from './components/KeyHighlightsBar';
import { WhoWeAre } from './components/WhoWeAre';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ServicesSection } from './components/ServicesSection';
import { SpecializedTechSection } from './components/SpecializedTechSection';
import { IndustriesSection } from './components/IndustriesSection';
import { VeteranSection } from './components/VeteranSection';
import { DualCtaCards } from './components/DualCtaCards';
import { ProcessSection } from './components/ProcessSection';
import { AccountabilitySection } from './components/AccountabilitySection';
import { TeamSection } from './components/TeamSection';
import { ContactSection } from './components/ContactSection';
import { PreFooterCta } from './components/PreFooterCta';
import { Footer } from './components/Footer';
import { ModalJobTalent } from './components/ModalJobTalent';
import { PortalApp } from './portal/PortalApp';

export default function App() {
  const [isPortalRoute, setIsPortalRoute] = useState(() => {
    return window.location.pathname.startsWith('/management-portal');
  });

  useEffect(() => {
    const handlePopState = () => {
      setIsPortalRoute(window.location.pathname.startsWith('/management-portal'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'talent' | 'job' | 'veteran';
  }>({
    isOpen: false,
    type: 'talent',
  });

  if (isPortalRoute) {
    return <PortalApp />;
  }

  const openModal = (type: 'talent' | 'job' | 'veteran') => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSelectService = (serviceTitle: string) => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const msgEl = document.querySelector(
        '#contact-message'
      ) as HTMLTextAreaElement;
      if (msgEl) {
        msgEl.value = `I am interested in learning more about your ${serviceTitle} services.`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col selection:bg-[#c81e1e] selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenTalentModal={() => openModal('talent')}
        onOpenJobModal={() => openModal('job')}
        onNavigateToPortal={() => {
          window.history.pushState({}, '', '/management-portal');
          setIsPortalRoute(true);
        }}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          onFindTalentClick={() => openModal('talent')}
          onFindJobClick={() => openModal('job')}
        />

        {/* 2. Key Highlights Bar */}
        <KeyHighlightsBar />

        {/* 3. Who We Are */}
        <WhoWeAre />

        {/* 4. Why Choose Us */}
        <WhyChooseUs />

        {/* 5. Workforce Solutions / Services */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 6. Specialized High-Tech Talent (Dark Navy Section) */}
        <SpecializedTechSection />

        {/* 7. Industries We Serve (10 Cards Grid) */}
        <IndustriesSection />

        {/* 8. Veteran Workforce Integration */}
        <VeteranSection onExploreVeteranClick={() => openModal('veteran')} />

        {/* 9. Dual CTA Banners (For Employers / For Candidates) */}
        <DualCtaCards
          onFindTalentClick={() => openModal('talent')}
          onFindJobClick={() => openModal('job')}
        />

        {/* 10. Our Process (01-06 Flow) */}
        <ProcessSection />

        {/* 11. Staffing With Accountability */}
        <AccountabilitySection />

        {/* 12. Meet the Team Behind the Mission */}
        <TeamSection />

        {/* 13. Contact & Conversation Form */}
        <ContactSection />

        {/* 14. Pre-Footer Dark Callout Banner */}
        <PreFooterCta
          onFindTalentClick={() => openModal('talent')}
          onFindJobClick={() => openModal('job')}
        />
      </main>

      {/* 15. Footer */}
      <Footer
        onNavigateToPortal={() => {
          window.history.pushState({}, '', '/management-portal');
          setIsPortalRoute(true);
        }}
      />

      {/* Action Dialog / Modal */}
      <ModalJobTalent
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={closeModal}
      />
    </div>
  );
}
