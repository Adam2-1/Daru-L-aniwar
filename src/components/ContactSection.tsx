import React, { useState } from 'react';
import { INSTITUTION_INFO, FAQS } from '../data/schoolData';
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle2, ChevronDown, ChevronUp, MessageSquare, MessageCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Send message directly to user's Formspree endpoint
      const formspreeRes = await fetch('https://formspree.io/f/mqergkjn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // 2. Also log in local database / MongoDB for admin dashboard records
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.warn("Local DB contact backup fallback:", err));

      if (formspreeRes.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        let errText = "Failed to submit message. Please try again.";
        try {
          const errorData = await formspreeRes.json();
          errText = errorData?.errors?.map((e: any) => e.message).join(', ') || errText;
        } catch {
          // Non-JSON Formspree error
        }
        setErrorMessage(errText);
      }
    } catch (err: any) {
      console.error("Formspree submission error:", err);
      // Fallback: save to local database if Formspree fetch fails due to network/adblocker
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } catch (localErr) {
        setErrorMessage("Network error occurred while sending your message. Please check your internet connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#D4AF37]/30 text-[#0B1F3A] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Reach Out To Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0B1F3A] tracking-tight mb-4">
            Contact & <span className="text-[#D4AF37]">Campus Location</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Have questions about admissions, fees, or visiting the campus? Our administrative office is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Column: Contact Cards & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1F3A] text-base mb-1">Campus Address</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{INSTITUTION_INFO.address}</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0B1F3A] text-base mb-1">Telephone & WhatsApp</h3>
                <p className="text-slate-600 text-sm font-semibold">{INSTITUTION_INFO.phonePrimary}</p>
                <p className="text-slate-500 text-xs mb-3">{INSTITUTION_INFO.phoneSecondary}</p>
                
                <a
                  href={INSTITUTION_INFO.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Chat on WhatsApp (08124911289)</span>
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1F3A] text-base mb-1">Email Enquiries</h3>
                <p className="text-slate-600 text-sm">{INSTITUTION_INFO.email}</p>
                <p className="text-slate-500 text-xs">{INSTITUTION_INFO.infoEmail}</p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1F3A] text-base mb-1">Visiting Hours</h3>
                <p className="text-slate-600 text-sm">{INSTITUTION_INFO.workingHours}</p>
              </div>
            </div>

            {/* Google Maps Preview Embed */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-52 relative">
              <iframe
                title="Daru L An'war Campus Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.002829283723!2d4.5518451!3d8.4891234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10364d0000000000%3A0x123456789abcdef!2sIlorin!5e0!3m2!1sen!2sng!4v1650000000000!5m2!1sen!2sng"
                className="w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all"
                loading="lazy"
              />
            </div>

          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50/80 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg relative">
            <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mb-2 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
              Send Us a Direct Message
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6">
              Fill out the form below and an admissions officer will reply within 24 business hours.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-800 p-6 rounded-2xl flex items-center gap-4 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-base">Jazakallahu Khair! Message Received</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you for reaching out to Daru L An'war Wal Is'ad. Our administrative team will respond to your email promptly.
                  </p>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alhaji Mustapha Lawal"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0B1F3A] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0B1F3A] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0B1F3A] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase tracking-wider">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0B1F3A] outline-none transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Admissions & Fees">Admissions & Fees</option>
                      <option value="Boarding Facilities">Boarding Facilities</option>
                      <option value="Scholarship Query">Scholarship Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase tracking-wider">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your query or message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0B1F3A] outline-none transition-all resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-300 text-red-800 p-3.5 rounded-xl text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0B1F3A] hover:bg-[#132c4f] text-[#D4AF37] font-bold text-sm py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message Now'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQs Accordion Section */}
        <div className="max-w-4xl mx-auto bg-slate-50/60 p-8 sm:p-10 rounded-3xl border border-slate-200">
          <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] text-center mb-8">
            Frequently Asked Questions (FAQs)
          </h3>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-[#0B1F3A] text-sm sm:text-base hover:text-[#D4AF37]"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
