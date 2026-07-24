import React from 'react';
import { VISION_MISSION_VALUES, INSTITUTION_INFO, HERO_DATA } from '../data/schoolData';
import { Eye, Target, HeartHandshake, CheckCircle2, Award, Quote, Sparkles, BookOpen } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#F7F8FA] relative overflow-hidden">
      {/* Decorative Gold Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0B1F3A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>About The Citadel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Welcome to <span className="text-[#D4AF37]">{INSTITUTION_INFO.name}</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Revered across generations for educational distinction, our institution is dedicated to raising visionary Muslim scholars, scientists, leaders, and upright citizens.
          </p>
        </div>

        {/* Two-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Left Column: Image Stack with Gold Architectural Frame */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-slate-900/10 relative z-10">
                <img
                  src={HERO_DATA.campusImage}
                  alt="Daru L An'war Campus Building"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">Main Campus</p>
                  <p className="text-lg font-serif font-bold">Serene Environment Tailored for Learning</p>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="relative sm:absolute mt-4 sm:mt-0 sm:-bottom-6 right-0 sm:right-6 bg-[#0B1F3A] text-white p-4 sm:p-5 rounded-2xl border-2 border-[#D4AF37] shadow-xl z-20 flex items-center gap-3 sm:gap-4 max-w-xs mx-auto sm:mx-0">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#D4AF37] font-serif">25+ Years</p>
                  <p className="text-xs text-slate-300">Of Unbroken Excellence in Islamic & Western Education</p>
                </div>
              </div>

              {/* Secondary Inset Image */}
              <div className="hidden sm:block absolute -top-8 -left-8 w-44 h-44 rounded-2xl overflow-hidden border-4 border-white shadow-lg z-0">
                <img
                  src={HERO_DATA.quranClassImage}
                  alt="Quran memorization session"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Vision, Mission & Values */}
          <div className="space-y-8">
            
            {/* Vision Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md hover:border-[#D4AF37]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A] mb-2 flex items-center gap-2">
                    Our Vision
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {VISION_MISSION_VALUES.vision}
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md hover:border-[#D4AF37]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center shrink-0 shadow-md">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A] mb-2">
                    Our Mission
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {VISION_MISSION_VALUES.mission}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                <span>Our Pillars & Core Values</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VISION_MISSION_VALUES.coreValues.map((val, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#0B1F3A]">{val.title}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Proprietor's Address (Unboxed Layout) */}
        <div className="mt-20 pt-12 border-t border-slate-200/80 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Photo Column - Larger, prominent portrait picture */}
            <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#0B1F3A] to-[#D4AF37] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white shrink-0">
                  <img
                    src={VISION_MISSION_VALUES.mudeerWelcome.avatar}
                    alt={VISION_MISSION_VALUES.mudeerWelcome.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Text Column - Open, unboxed typography */}
            <div className="md:col-span-7 lg:col-span-8 space-y-5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/40 text-[#0B1F3A] text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Proprietor's Address</span>
              </div>

              <div className="relative">
                <Quote className="hidden sm:block absolute -top-4 -left-6 w-12 h-12 text-[#D4AF37]/20 pointer-events-none" />
                <p className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#0B1F3A] leading-relaxed">
                  "{VISION_MISSION_VALUES.mudeerWelcome.quote}"
                </p>
              </div>

              <div className="pt-2 border-l-4 border-[#D4AF37] pl-4 inline-block text-left">
                <h4 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                  {VISION_MISSION_VALUES.mudeerWelcome.name}
                </h4>
                <p className="text-sm font-semibold text-[#D4AF37]">
                  {VISION_MISSION_VALUES.mudeerWelcome.role}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
