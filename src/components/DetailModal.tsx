import React from 'react';
import { AcademicProgramme } from '../types';
import { X, CheckCircle2, Clock, Users, BookOpen, GraduationCap, Baby, ArrowRight } from 'lucide-react';

interface DetailModalProps {
  programme: AcademicProgramme | null;
  onClose: () => void;
  onOpenApply: (code?: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ programme, onClose, onOpenApply }) => {
  if (!programme) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scaleUp my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#0D2647] to-[#0B1F3A] text-white p-4 sm:p-8 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="bg-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            {programme.code}
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
            {programme.title}
          </h2>
          <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
            {programme.section}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              Age: {programme.ageGroup}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              Duration: {programme.duration}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 space-y-6 overflow-y-auto">
          
          <div>
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">Programme Overview</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{programme.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-3">Curriculum Pillars</h3>
            <div className="space-y-2">
              {programme.curriculumHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-3">Core Subjects Covered</h3>
            <div className="flex flex-wrap gap-2">
              {programme.keySubjects.map((sub, idx) => (
                <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 font-medium text-xs px-3 py-1.5 rounded-lg">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="bg-slate-100 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl hover:bg-slate-200"
            >
              Close Overview
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenApply(programme.code);
              }}
              className="bg-gradient-to-r from-[#D4AF37] via-[#F4B942] to-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs py-3.5 px-6 rounded-xl shadow flex items-center gap-2"
            >
              <span>Apply for {programme.code}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
