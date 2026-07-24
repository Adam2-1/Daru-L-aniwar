import React from 'react';
import { Sparkles, ArrowRight, Phone, Mail, BookOpen } from 'lucide-react';
import { INSTITUTION_INFO } from '../data/schoolData';

interface CallToActionProps {
  onOpenApplyModal: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onOpenApplyModal }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0B1F3A] via-[#0D2647] to-[#071326] text-white relative overflow-hidden border-y-2 border-[#D4AF37]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Calligraphy Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#F4B942]" />
          <span>Admissions Open for New Session</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Begin Your Journey With <br />
          <span className="text-[#D4AF37]">{INSTITUTION_INFO.name}</span>
        </h2>

        {/* Subtext */}
        <p className="text-slate-200 text-base sm:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Invest in your child's eternal success through authentic Islamic knowledge, memorization of the Holy Qur'an, and top-tier Western academic preparation.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenApplyModal}
            className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#F4B942] to-[#D4AF37] text-[#0B1F3A] font-extrabold text-base px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span>Apply Online Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#contact"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-base px-8 py-4 rounded-xl border border-white/30 hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5 text-[#D4AF37]" />
            <span>Contact Admissions Team</span>
          </a>
        </div>

      </div>
    </section>
  );
};
