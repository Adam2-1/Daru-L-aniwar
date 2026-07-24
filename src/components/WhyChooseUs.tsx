import React from 'react';
import { WHY_CHOOSE_US, INSTITUTION_INFO } from '../data/schoolData';
import { Award, Users, Sparkles, Laptop, ShieldCheck, Home, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Award':
        return <Award className="w-6 h-6 text-[#D4AF37]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#D4AF37]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#D4AF37]" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-[#D4AF37]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />;
      case 'Home':
      default:
        return <Home className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <section className="py-20 bg-[#0B1F3A] text-white relative overflow-hidden">
      {/* Gold Pattern Background Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Distinction of Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white tracking-tight mb-4">
            Why Choose <span className="text-[#D4AF37]">{INSTITUTION_INFO.name}</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Built upon unwavering Islamic principles, academic rigor, and compassionate mentorship for over two decades.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f284a]/90 hover:bg-[#133058] rounded-2xl p-8 border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0B1F3A] border border-[#D4AF37]/40 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-md border border-[#D4AF37]/30">
                    {item.highlight}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Institutional Standard</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
