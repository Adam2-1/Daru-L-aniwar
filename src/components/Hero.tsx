import React from 'react';
import { Sparkles, ArrowRight, BookOpen, ShieldCheck, Award, GraduationCap, ChevronDown } from 'lucide-react';
import { HERO_DATA, INSTITUTION_INFO } from '../data/schoolData';

interface HeroProps {
  onOpenApplyModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenApplyModal }) => {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-[#0B1F3A]">
      {/* Background Image with Navy Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_DATA.heroImage}
          alt="Daru L An'war Mosque and Campus"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-slow filter brightness-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1200';
          }}
        />
        {/* Navy Gradient Overlay for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/80 to-[#071326]/95" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0B1F3A]/40 to-[#0B1F3A]" />
        
        {/* Geometric Arabesque Pattern Overlay (Subtle CSS) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-12 flex flex-col items-center">
        
        {/* Arabic Motto Pill */}
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 px-4 py-1.5 rounded-full mb-6 text-[#D4AF37] shadow-xl animate-bounce-slow">
          <Sparkles className="w-4 h-4 text-[#F4B942]" />
          <span className="font-serif text-sm sm:text-base font-semibold tracking-wide" dir="rtl">
            نُورٌ عَلَى نُورٍ • مَنَارَةُ العِلْمِ وَالأَخْلَاقِ
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight leading-tight max-w-5xl mb-6 drop-shadow-lg">
          <span className="block text-[#D4AF37] text-[#F4B942] bg-gradient-to-r from-[#F4B942] via-[#D4AF37] to-[#FFF3B0] bg-clip-text text-transparent">
            {INSTITUTION_INFO.name}
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-xl md:text-2xl text-slate-200 font-light max-w-3xl mb-10 leading-relaxed italic drop-shadow">
          "{INSTITUTION_INFO.motto}"
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={onOpenApplyModal}
            className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#F4B942] to-[#D4AF37] text-[#0B1F3A] font-extrabold text-base px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-[#0B1F3A]" />
            <span>Apply Online</span>
            <ArrowRight className="w-5 h-5 text-[#0B1F3A]" />
          </button>

          <a
            href="#programmes"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:border-[#D4AF37]"
          >
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            <span>Explore Our Programmes</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-6 text-left text-slate-200 shadow-2xl">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-slate-300">Qur'an Tahfeez</p>
              <p className="text-sm font-bold text-white">Full Tajweed & Ijazah</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-slate-300">Academic Rigor</p>
              <p className="text-sm font-bold text-white">STEM & Modern ICT</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-slate-300">Environment</p>
              <p className="text-sm font-bold text-white">Day & Boarding Hostel</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-slate-300">Legacy</p>
              <p className="text-sm font-bold text-white">25+ Yrs Excellence</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a href="#about" className="mt-10 text-slate-400 hover:text-[#D4AF37] transition-colors flex flex-col items-center gap-1">
          <span className="text-xs font-medium tracking-wider uppercase">Scroll to Discover</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-[#D4AF37]" />
        </a>

      </div>
    </section>
  );
};
