import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Menu, X, ArrowRight, Sparkles, BookOpen, User, Database } from 'lucide-react';
import { INSTITUTION_INFO } from '../data/schoolData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenApplyModal: (type?: 'Day School' | 'Boarding School') => void;
  onOpenAuthModal: () => void;
  onOpenPortalModal: () => void;
  onOpenApplicantDashboard?: (tab?: any) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApplyModal,
  onOpenAuthModal,
  onOpenPortalModal,
  onOpenApplicantDashboard,
  activeSection
}) => {
  const { user, dbStatus } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Programmes', href: '#programmes' },
    { name: 'Admissions', href: '#admissions' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'News', href: '#news' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar - Deep Navy */}
      <div className={`bg-[#071326] text-slate-200 text-xs py-2 px-4 border-b border-[#D4AF37]/20 transition-all duration-300 ${isScrolled ? 'hidden md:block opacity-90' : 'block'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Left info */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <a href={`tel:${INSTITUTION_INFO.phonePrimary}`} className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{INSTITUTION_INFO.phonePrimary}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a href={`mailto:${INSTITUTION_INFO.email}`} className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{INSTITUTION_INFO.email}</span>
            </a>
            <span className="hidden lg:inline text-slate-600">|</span>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#F4B942]" />
              <span className="truncate max-w-xs">{INSTITUTION_INFO.address}</span>
            </div>
          </div>

          {/* Right Arabic Calligraphy Bismillah */}
          <div className="flex items-center gap-4">
            <span className="font-serif text-[#D4AF37] font-semibold tracking-wider text-sm hidden sm:inline" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-slate-900/10 py-3 border-b border-[#D4AF37]/20' 
          : 'bg-white py-4 border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Institution Name */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 border border-[#D4AF37]/50 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img
                src={INSTITUTION_INFO.logo}
                alt={`${INSTITUTION_INFO.name} Logo`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif font-extrabold text-lg sm:text-xl text-[#0B1F3A] tracking-tight leading-tight block group-hover:text-[#0B1F3A]">
                DARU L AN'WAR
              </span>
              <p className="text-[11px] font-medium text-amber-700 tracking-wider uppercase font-sans">
                WAL IS'AD <span className="text-slate-400 font-normal">| Islamic Institution</span>
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#0B1F3A] font-semibold bg-[#D4AF37]/15 border border-[#D4AF37]/30'
                      : 'text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Applicant Portal Tab Button */}
            <button
              onClick={() => onOpenApplicantDashboard ? onOpenApplicantDashboard('form') : onOpenApplyModal()}
              className="bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs px-3 sm:px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/50 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Applicant Portal</span>
            </button>

            {/* User Account / Portal Button */}
            {user ? (
              <button
                onClick={onOpenPortalModal}
                className="bg-slate-100 text-[#0B1F3A] hover:text-[#0B1F3A] border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center font-bold text-[10px]">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.fullName.split(' ')[0]}</span>
                <span className="sm:hidden">Account</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="hidden sm:flex bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] font-bold text-xs px-3 py-2.5 rounded-xl border border-slate-200 transition-all items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 mt-2 space-y-3 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 mb-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 hover:text-[#0B1F3A] hover:bg-amber-50/80 border border-slate-200/80 flex items-center justify-center min-h-[44px]"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenPortalModal();
                  }}
                  className="w-full bg-slate-900 text-[#D4AF37] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37]/40 min-h-[44px]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center font-bold text-[10px]">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span>My Account ({user.fullName.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-300 min-h-[44px]"
                >
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>Student / Parent Login</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenApplyModal('Day School');
                }}
                className="w-full text-center bg-[#0B1F3A] text-[#D4AF37] font-semibold text-xs py-3 rounded-xl border border-[#D4AF37]/40 min-h-[44px]"
              >
                Apply for Day School
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenApplyModal('Boarding School');
                }}
                className="w-full text-center bg-[#D4AF37] text-[#0B1F3A] font-bold text-xs py-3 rounded-xl shadow min-h-[44px]"
              >
                Apply for Boarding School
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
