import React from 'react';
import { INSTITUTION_INFO, PRAYER_TIMES_DATA } from '../data/schoolData';
import { BookOpen, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Send, Sparkles, Heart, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onOpenApplyModal: () => void;
  onOpenAdminDashboard?: (tab?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApplyModal, onOpenAdminDashboard }) => {
  return (
    <footer className="bg-[#050e1c] text-white pt-16 pb-8 border-t-4 border-[#D4AF37] relative overflow-hidden">
      {/* Background Motif */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Prayer Times Ticker Bar */}
        <div className="bg-[#0B1F3A] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 mb-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">Campus Jama'ah Schedule</p>
              <p className="text-sm font-serif font-bold text-white">Daily Congregational Prayer Times</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            {PRAYER_TIMES_DATA.map((p, i) => (
              <div key={i} className="bg-black/30 border border-white/10 px-3 py-1.5 rounded-xl text-center min-w-[75px]">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">{p.name}</p>
                <p className="text-xs font-bold text-[#D4AF37]">{p.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Bismillah (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 border border-[#D4AF37] shadow flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={INSTITUTION_INFO.logo}
                  alt={`${INSTITUTION_INFO.name} Logo`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-xl text-white tracking-tight">
                  {INSTITUTION_INFO.name}
                </h3>
              </div>
            </div>

            <p className="text-xs font-serif text-[#D4AF37] tracking-wider" dir="rtl">
              رَبِّ زِدْنِي عِلْمًا • وَاحْفَظْنَا بِالإِسْلَامِ
            </p>

            <p className="text-slate-300 text-xs leading-relaxed">
              {INSTITUTION_INFO.motto}. Established in {INSTITUTION_INFO.foundedYear} to nurture leaders grounded in Islamic morality and academic distinction.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={INSTITUTION_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B1F3A] border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={INSTITUTION_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B1F3A] border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={INSTITUTION_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B1F3A] border border-white/10 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={INSTITUTION_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B1F3A] border border-white/10 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider font-serif">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#home" className="hover:text-[#D4AF37] transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-[#D4AF37] transition-colors">About Institution</a></li>
              <li><a href="#programmes" className="hover:text-[#D4AF37] transition-colors">Academic Programmes</a></li>
              <li><a href="#admissions" className="hover:text-[#D4AF37] transition-colors">Admissions & Day/Boarding</a></li>
              <li><a href="#facilities" className="hover:text-[#D4AF37] transition-colors">Campus Facilities</a></li>
              <li><a href="#gallery" className="hover:text-[#D4AF37] transition-colors">Student Gallery</a></li>
              <li><a href="#news" className="hover:text-[#D4AF37] transition-colors">Latest News</a></li>
              <li><a href="#contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3: Academic Sections (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider font-serif">Academic Sections</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <p className="font-bold text-white">IBTIDAA'IYYAH</p>
                <p className="text-[11px] text-slate-400">Nursery & Early Childhood Section</p>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <p className="font-bold text-white">IHDAADIYYAH</p>
                <p className="text-[11px] text-slate-400">Primary & Tahfeez Foundation</p>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <p className="font-bold text-white">THANAWIYYAH</p>
                <p className="text-[11px] text-slate-400">Senior Secondary & Ijazah Scholarship</p>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Apply (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider font-serif">Admissions Helpdesk</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{INSTITUTION_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{INSTITUTION_INFO.phonePrimary}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{INSTITUTION_INFO.email}</span>
              </p>
            </div>

            <button
              onClick={onOpenApplyModal}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F4B942] to-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#0B1F3A]" />
              <span>Apply Online For Admission</span>
            </button>

            {/* Administrator Console Footer Button */}
            <button
              onClick={() => onOpenAdminDashboard && onOpenAdminDashboard('login')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-[#D4AF37]/40 font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 group"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Administrator Portal / Control Dashboard</span>
            </button>
          </div>

        </div>

        {/* Bottom Copyright & Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {INSTITUTION_INFO.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenAdminDashboard && onOpenAdminDashboard('login')}
              className="text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
            >
              <Lock className="w-3 h-3" />
              <span>Administrator Dashboard</span>
            </button>
            <span className="text-slate-600">•</span>
            <span>Crafted with honor for Islamic Educational Advancement</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
