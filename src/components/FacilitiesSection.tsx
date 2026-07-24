import React, { useState } from 'react';
import { FACILITIES } from '../data/schoolData';
import { Facility } from '../types';
import { Sparkles, Check, Eye, Maximize2, X } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const categories = ['All', 'Spiritual', 'Academic', 'Residential', 'Recreational', 'Admin'];

  const filteredFacilities = activeCategory === 'All'
    ? FACILITIES
    : FACILITIES.filter(f => f.category === activeCategory);

  return (
    <section id="facilities" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>World-Class Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Campus <span className="text-[#D4AF37]">Facilities</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Purpose-built spaces designed to inspire learning, foster spiritual tranquility, and nurture physical wellbeing.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#0B1F3A] text-[#D4AF37] border border-[#D4AF37] shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              onClick={() => setSelectedFacility(fac)}
              className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 hover:border-[#D4AF37] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <span className="absolute top-4 left-4 bg-[#0B1F3A]/90 backdrop-blur-md text-[#D4AF37] font-bold text-[10px] px-3 py-1 rounded-full border border-[#D4AF37]/30 uppercase tracking-wider">
                  {fac.category}
                </span>
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A] mb-2 group-hover:text-[#0B1F3A]">
                    {fac.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                    {fac.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-[#0B1F3A]">
                  <span className="text-amber-700">{fac.features.length} Key Amenities</span>
                  <span className="flex items-center gap-1 group-hover:text-[#0B1F3A]">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox for Facility Detail */}
        {selectedFacility && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scaleUp">
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-80">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="bg-[#D4AF37] text-[#0B1F3A] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                    {selectedFacility.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold">{selectedFacility.title}</h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {selectedFacility.description}
                </p>

                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-3">Key Features & Amenities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFacility.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedFacility(null)}
                    className="bg-[#0B1F3A] text-[#D4AF37] font-bold text-xs px-6 py-2.5 rounded-xl"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
