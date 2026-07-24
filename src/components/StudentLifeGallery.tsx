import React, { useState, useEffect } from 'react';
import { GALLERY_ITEMS } from '../data/schoolData';
import { GalleryItem } from '../types';
import { Sparkles, Maximize2, Calendar, Tag, X } from 'lucide-react';

export const StudentLifeGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(GALLERY_ITEMS);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryList(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch gallery items:", err);
      });
  }, []);

  const defaultCategories = ['All', 'Quran', 'Classroom', 'Graduation', 'Lectures', 'Sports', 'Events'];
  const dynamicCategories = Array.from(new Set(['All', ...galleryList.map(g => g.category)]));
  const categories = dynamicCategories.length > 1 ? dynamicCategories : defaultCategories;

  const filteredItems = activeTab === 'All'
    ? galleryList
    : galleryList.filter(item => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 bg-[#F7F8FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Vibrant Student Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Student Life & <span className="text-[#D4AF37]">Gallery</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Capturing sacred memorization circles, academic discoveries, sporting endeavors, and joyful graduation moments.
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === cat
                  ? 'bg-[#0B1F3A] text-[#D4AF37] border border-[#D4AF37] shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                {/* Badge & Date */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-[#D4AF37] text-[#0B1F3A] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    {item.date}
                  </span>
                </div>

                {/* Bottom Title overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{item.caption}</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1F3A]/40 backdrop-blur-xs">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {activeImage && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#0B1F3A] text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/40 relative animate-scaleUp">
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative max-h-[70vh] overflow-hidden">
                <img
                  src={activeImage.image}
                  alt={activeImage.title}
                  className="w-full h-full object-contain max-h-[70vh] mx-auto bg-black"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </div>

              <div className="p-6 sm:p-8 space-y-2 border-t border-[#D4AF37]/20 bg-[#071326]">
                <div className="flex items-center gap-3">
                  <span className="bg-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    {activeImage.category}
                  </span>
                  <span className="text-xs text-slate-400">{activeImage.date}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">{activeImage.title}</h3>
                <p className="text-slate-300 text-sm">{activeImage.caption}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
