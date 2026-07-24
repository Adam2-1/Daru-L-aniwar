import React from 'react';
import { PROGRAMMES } from '../data/schoolData';
import { AcademicProgramme } from '../types';
import { Baby, BookOpen, GraduationCap, ArrowRight, Sparkles, Check, Clock, Users } from 'lucide-react';

interface ProgrammesSectionProps {
  onSelectProgramme: (programme: AcademicProgramme) => void;
  onOpenApplyModal: (programmeCode?: string) => void;
}

export const ProgrammesSection: React.FC<ProgrammesSectionProps> = ({
  onSelectProgramme,
  onOpenApplyModal
}) => {
  // Helper to resolve icon component dynamically
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-8 h-8 text-[#0B1F3A]" />;
      case 'BookOpen':
        return <BookOpen className="w-8 h-8 text-[#0B1F3A]" />;
      case 'GraduationCap':
      default:
        return <GraduationCap className="w-8 h-8 text-[#0B1F3A]" />;
    }
  };

  return (
    <section id="programmes" className="py-20 bg-white relative overflow-hidden">
      {/* Background Motif */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Structured Islamic & Western Education</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Academic <span className="text-[#D4AF37]">Programmes</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Progressive educational pathways tailored from early toddlerhood to senior secondary university matriculation.
          </p>
        </div>

        {/* 3 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROGRAMMES.map((prog) => (
            <div
              key={prog.id}
              className="group relative bg-slate-50/70 hover:bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-[#D4AF37] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-8 right-8 h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Icon & Code */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F4B942] p-0.5 shadow-md group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                      {renderIcon(prog.iconName)}
                    </div>
                  </div>
                  <span className="bg-[#0B1F3A] text-[#D4AF37] font-bold text-xs px-3 py-1 rounded-full border border-[#D4AF37]/30">
                    {prog.code}
                  </span>
                </div>

                {/* Title & Section */}
                <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mb-1 group-hover:text-[#0B1F3A]">
                  {prog.code}
                </h3>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-4">
                  {prog.section}
                </p>

                {/* Key Meta Pills */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-6 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {prog.ageGroup}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {prog.duration}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {prog.summary}
                </p>

                {/* Key Subjects List Preview */}
                <div className="space-y-2 mb-8 pt-4 border-t border-slate-200/60">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum Highlights</p>
                  <ul className="space-y-1.5">
                    {prog.curriculumHighlights.slice(0, 3).map((item, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onSelectProgramme(prog)}
                  className="flex-1 bg-white hover:bg-slate-100 text-[#0B1F3A] border border-[#0B1F3A]/20 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Learn More</span>
                </button>
                <button
                  onClick={() => onOpenApplyModal(prog.code)}
                  className="bg-[#0B1F3A] hover:bg-[#132c4f] text-[#D4AF37] font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1 shadow group-hover:bg-[#D4AF37] group-hover:text-[#0B1F3A]"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
