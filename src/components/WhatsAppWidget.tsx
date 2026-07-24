import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { INSTITUTION_INFO } from '../data/schoolData';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const whatsappNumber = '2348124911289';
  const defaultText = 'Hello Daru L An\'war Wal Is\'ad Admissions, I would like to enquire about student admission and programmes.';

  const handleSendWhatsApp = (msgText?: string) => {
    const textToSend = msgText || customMessage.trim() || defaultText;
    const encodedText = encodeURIComponent(textToSend);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end max-w-full">
      {/* Popover Chat Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-88 bg-white rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Admissions WhatsApp Helpdesk
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Online • +234 812 491 1289
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp widget"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-xl text-xs text-emerald-900 leading-relaxed">
              <p className="font-semibold mb-1 flex items-center gap-1 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                As-salamu Alaykum!
              </p>
              Welcome to <strong>DARU L AN'WAR WAL IS'AD</strong>. How can we help you with admissions, fees, or campus visits today?
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Enquiries:</p>
              <button
                onClick={() => handleSendWhatsApp("Hello! I want to enquire about Day & Boarding Admissions.")}
                className="w-full text-left text-xs bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 px-3 py-2 rounded-xl transition-all shadow-sm font-medium"
              >
                🎓 Enquire about Day & Boarding Admissions
              </button>
              <button
                onClick={() => handleSendWhatsApp("Hello! What are the school fees and payment structures?")}
                className="w-full text-left text-xs bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 px-3 py-2 rounded-xl transition-all shadow-sm font-medium"
              >
                💵 School Fees & Scholarship Information
              </button>
              <button
                onClick={() => handleSendWhatsApp("Hello! I would like to schedule a campus visit.")}
                className="w-full text-left text-xs bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 px-3 py-2 rounded-xl transition-all shadow-sm font-medium"
              >
                📍 Schedule a Campus Visit
              </button>
            </div>

            {/* Custom Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSendWhatsApp()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors shadow flex items-center justify-center shrink-0"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="bg-slate-100 px-4 py-2 text-[10px] text-slate-500 text-center border-t border-slate-200">
            Direct WhatsApp Chat with Admissions Helpdesk
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/20"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-6 h-6 text-white shrink-0" />
        <span className="font-bold text-xs pr-1 hidden sm:inline">
          WhatsApp Us (08124911289)
        </span>
      </button>
    </div>
  );
};
