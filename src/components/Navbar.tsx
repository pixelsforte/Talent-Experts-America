import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../data/websiteData';

interface NavbarProps {
  onOpenTalentModal?: () => void;
  onOpenJobModal?: () => void;
  onNavigateToPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTalentModal,
  onOpenJobModal,
  onNavigateToPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('');

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setActiveNav(href);
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 py-2">
          {/* Logo */}
          <a
            href="#"
            id="brand-logo-link"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img
              src="/logo-main-1.png"
              alt="The Talent Experts of America"
              className="h-16 sm:h-20 max-h-20 w-auto max-w-[280px] sm:max-w-[340px] object-contain shrink-0 transition-transform duration-200 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-[14px] font-medium transition-colors py-1.5 border-b-2 ${
                    isActive
                      ? 'text-gray-900 border-[#b91c1c]'
                      : 'text-gray-600 border-transparent hover:text-[#b91c1c] hover:border-[#b91c1c]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <button
              type="button"
              id="header-find-job-btn"
              onClick={onOpenJobModal || (() => {
                const el = document.querySelector('#contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              })}
              className="text-[14px] font-semibold text-gray-800 hover:text-[#b91c1c] transition-colors cursor-pointer"
            >
              Find a Job
            </button>
            <button
              type="button"
              id="header-find-talent-btn"
              onClick={onOpenTalentModal || (() => {
                const el = document.querySelector('#contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              })}
              className="bg-[#0a1128] hover:bg-[#111827] text-white text-[13px] font-semibold px-5 py-2.5 tracking-wide transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Find Talent
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenJobModal) onOpenJobModal();
                else document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 text-center text-sm font-semibold border border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              Find a Job
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenTalentModal) onOpenTalentModal();
                else document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 text-center text-sm font-semibold bg-[#0a1128] text-white hover:bg-black"
            >
              Find Talent
            </button>
          </div>
          {onNavigateToPortal && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToPortal();
                }}
                className="text-xs text-gray-500 hover:text-gray-900 font-medium py-1 inline-flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]" />
                <span>Admin Portal</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
