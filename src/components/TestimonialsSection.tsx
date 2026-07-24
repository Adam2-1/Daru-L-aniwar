import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/schoolData';
import { Sparkles, Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Community Reflections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Voices of Our <span className="text-[#D4AF37]">Parents & Alumni</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Hear directly from the families and scholars who have experienced the transformative education at Daru L An'war Wal Is'ad.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          <Quote className="absolute -top-4 -right-4 w-40 h-40 text-[#D4AF37]/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0B1F3A] text-[#D4AF37] font-bold text-[10px] px-3 py-1 rounded-full border border-[#D4AF37]/40 uppercase tracking-wider whitespace-nowrap shadow">
                {current.role}
              </span>
            </div>

            {/* Testimonial Body */}
            <div className="space-y-4 text-center md:text-left flex-1">
              {/* Star Rating */}
              <div className="flex items-center justify-center md:justify-start gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl font-serif text-slate-800 italic leading-relaxed">
                "{current.quote}"
              </blockquote>

              <div>
                <h3 className="text-lg font-bold text-[#0B1F3A]">{current.name}</h3>
                <p className="text-xs text-amber-700 font-semibold">{current.program}</p>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentIndex === idx ? 'w-8 bg-[#D4AF37]' : 'w-2.5 bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#0B1F3A] hover:text-[#D4AF37] transition-colors flex items-center justify-center shadow"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#0B1F3A] hover:text-[#D4AF37] transition-colors flex items-center justify-center shadow"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
