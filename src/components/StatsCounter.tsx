import React, { useEffect, useState, useRef } from 'react';
import { STATS_DATA } from '../data/schoolData';
import { GraduationCap, Users, Award, ShieldCheck, Sparkles } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasAnimated || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85) {
        setHasAnimated(true);
        animateCounters();
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger check on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts(
        STATS_DATA.map((item) => Math.min(Math.floor(item.value * progress), item.value))
      );

      if (step >= steps) {
        clearInterval(timer);
        setCounts(STATS_DATA.map((item) => item.value));
      }
    }, intervalTime);
  };

  const icons = [
    <GraduationCap key="1" className="w-8 h-8 text-[#D4AF37]" />,
    <Users key="2" className="w-8 h-8 text-[#D4AF37]" />,
    <Award key="3" className="w-8 h-8 text-[#D4AF37]" />,
    <ShieldCheck key="4" className="w-8 h-8 text-[#D4AF37]" />
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-r from-[#0B1F3A] via-[#0D2647] to-[#0B1F3A] text-white relative overflow-hidden border-y-2 border-[#D4AF37]/40">
      {/* Background Arabesque Accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 text-center">
          {STATS_DATA.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 hover:border-[#D4AF37]/60 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                {icons[idx]}
              </div>
              
              <p className="text-4xl sm:text-5xl font-serif font-extrabold text-[#D4AF37] tracking-tight mb-2">
                {counts[idx].toLocaleString()}{stat.suffix}
              </p>
              
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {stat.label}
              </h3>
              
              <p className="text-xs text-slate-300 font-light">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
