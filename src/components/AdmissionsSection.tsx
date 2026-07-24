import React, { useState } from 'react';
import { ADMISSION_TYPES } from '../data/schoolData';
import { Sun, Moon, CheckCircle, Sparkles, ArrowRight, ShieldCheck, FileText, CalendarCheck, UserCheck } from 'lucide-react';

interface AdmissionsSectionProps {
  onOpenApplyModal: (type?: 'Day School' | 'Boarding School') => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({ onOpenApplyModal }) => {
  const [selectedCalcType, setSelectedCalcType] = useState<'Day' | 'Boarding'>('Boarding');

  const steps = [
    { num: "01", title: "Online Application", desc: "Fill out the online application form with student details and section preference." },
    { num: "02", title: "Entrance Assessment", desc: "Interactive evaluation of Qur'an reading level, Mathematics, and English aptitude." },
    { num: "03", title: "Parent Interview", desc: "Brief orientation meeting with the Mudeer and Admissions board." },
    { num: "04", title: "Official Enrollment", desc: "Admission offer letter issued, fee payment, and boarding or day orientation." }
  ];

  return (
    <section id="admissions" className="py-20 bg-[#F7F8FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Join Our Academic Community</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Admissions & <span className="text-[#D4AF37]">Enrollment</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We welcome male and female candidates committed to spiritual growth and academic distinction. Choose the pathway that best suits your family.
          </p>
        </div>

        {/* Two Admission Cards (Day vs Boarding) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Day School Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200/80 hover:border-[#0B1F3A] shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shadow-md">
                  <Sun className="w-7 h-7" />
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-300">
                  {ADMISSION_TYPES[0].badge}
                </span>
              </div>

              <h3 className="text-3xl font-serif font-bold text-[#0B1F3A] mb-2">
                {ADMISSION_TYPES[0].type}
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                {ADMISSION_TYPES[0].tagline}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {ADMISSION_TYPES[0].description}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">Key Highlights</p>
                {ADMISSION_TYPES[0].features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => onOpenApplyModal('Day School')}
              className="w-full bg-[#0B1F3A] hover:bg-[#132c4f] text-[#D4AF37] font-bold text-sm py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
            >
              <span>{ADMISSION_TYPES[0].ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Boarding School Card */}
          <div className="bg-gradient-to-br from-[#0B1F3A] via-[#0D2647] to-[#071326] text-white rounded-3xl p-8 border-2 border-[#D4AF37] shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center shadow-md">
                  <Moon className="w-7 h-7" />
                </div>
                <span className="bg-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {ADMISSION_TYPES[1].badge}
                </span>
              </div>

              <h3 className="text-3xl font-serif font-bold text-white mb-2">
                {ADMISSION_TYPES[1].type}
              </h3>
              <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
                {ADMISSION_TYPES[1].tagline}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {ADMISSION_TYPES[1].description}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8 pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Residency Benefits</p>
                {ADMISSION_TYPES[1].features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => onOpenApplyModal('Boarding School')}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F4B942] to-[#D4AF37] text-[#0B1F3A] font-extrabold text-sm py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <span>{ADMISSION_TYPES[1].ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
            </button>
          </div>

        </div>

        {/* Admission Process Timeline */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mb-2">
              Simple 4-Step Admission Journey
            </h3>
            <p className="text-slate-500 text-sm">
              We ensure a smooth, transparent, and encouraging admission experience for every student and parent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 relative">
                <span className="text-3xl font-serif font-extrabold text-[#D4AF37] block mb-2">
                  {step.num}
                </span>
                <h4 className="font-bold text-[#0B1F3A] text-base mb-2">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
