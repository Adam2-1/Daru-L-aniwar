import React, { useState, useEffect } from 'react';
import { LATEST_NEWS } from '../data/schoolData';
import { NewsArticle } from '../types';
import { Sparkles, Calendar, Clock, ArrowRight, User, X } from 'lucide-react';

export const LatestNews: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articlesList, setArticlesList] = useState<NewsArticle[]>(LATEST_NEWS);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setArticlesList(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch news articles:", err);
      });
  }, []);

  return (
    <section id="news" className="py-20 bg-[#F7F8FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Campus Updates & Events</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Latest News & <span className="text-[#D4AF37]">Announcements</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Stay informed on institutional milestones, admissions schedules, academic victories, and upcoming events.
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articlesList.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#D4AF37] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#0B1F3A] text-[#D4AF37] font-bold text-[10px] px-3 py-1 rounded-full border border-[#D4AF37]/30 uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A] mb-3 line-clamp-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Read More Footer */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full bg-slate-50 hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-[#D4AF37] font-bold text-xs py-3 px-4 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* News Reader Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col animate-scaleUp">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 shrink-0">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="bg-[#D4AF37] text-[#0B1F3A] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                    {selectedArticle.category}
                  </span>
                  <h3 className="text-2xl font-serif font-bold">{selectedArticle.title}</h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-1 font-semibold text-[#0B1F3A]">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {selectedArticle.author}
                  </span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                </div>

                <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                  {selectedArticle.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-[#0B1F3A] text-[#D4AF37] font-bold text-xs px-6 py-2.5 rounded-xl"
                  >
                    Close Article
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
