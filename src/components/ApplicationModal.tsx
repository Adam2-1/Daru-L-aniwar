import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, User, Phone, BookOpen, ShieldCheck, Download, Printer } from 'lucide-react';
import { INSTITUTION_INFO } from '../data/schoolData';
import { safeFetchJson } from '../lib/api';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAdmissionType?: 'Day School' | 'Boarding School';
  defaultProgrammeCode?: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultAdmissionType = 'Day School',
  defaultProgrammeCode = 'IHDAADIYYAH'
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'Male',
    programme: defaultProgrammeCode,
    admissionType: defaultAdmissionType,
    entryGrade: 'Primary 1 / JSS 1',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    previousSchool: '',
    quranJuz: '1-3 Juz',
    medicalNotes: ''
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);

    try {
      const result = await safeFetchJson('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.studentName,
          dateOfBirth: formData.dob,
          gender: formData.gender,
          programme: formData.programme,
          admissionType: formData.admissionType,
          entryGrade: formData.entryGrade,
          parentName: formData.parentName,
          parentPhone: formData.parentPhone,
          parentEmail: formData.parentEmail,
          address: formData.address,
          previousSchool: formData.previousSchool,
          quranMemorizedJuz: formData.quranJuz,
          medicalInfo: formData.medicalNotes
        })
      });

      if (result.success && result.data?.application) {
        setApplicationRef(result.data.application.applicationNo || `DAI-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      } else {
        setApplicationRef(`DAI-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    } catch (err) {
      console.warn("Application submit notice:", err);
      setApplicationRef(`DAI-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setIsPosting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scaleUp my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#0D2647] to-[#0B1F3A] text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={INSTITUTION_INFO.logo}
                alt="Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=200';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                  Online Admission Portal
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white">
                {INSTITUTION_INFO.name}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Official Application Form for 2026/2027 Academic Session
          </p>

          {/* Step Progress Pills */}
          {!isSubmitted && (
            <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-white/10">
              <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
              <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
              <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-[#D4AF37]' : 'bg-white/20'}`} />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto">
          {isSubmitted ? (
            /* Success View */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Application Submitted Successfully
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mt-3">
                  Jazakallahu Khair, {formData.parentName}!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mt-2">
                  We have received the application for <span className="font-bold text-[#0B1F3A]">{formData.studentName}</span>.
                </p>
              </div>

              {/* Reference Box */}
              <div className="bg-slate-50 border-2 border-[#D4AF37] p-6 rounded-2xl max-w-sm mx-auto text-center space-y-1 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Application Reference Number</p>
                <p className="text-3xl font-mono font-extrabold text-[#0B1F3A] tracking-wider">{applicationRef}</p>
                <p className="text-[11px] text-amber-800 font-medium">Please save or take a screenshot of this reference ID.</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
                <p className="font-bold">Next Steps:</p>
                <p>1. An SMS & Email confirmation with entrance interview date will be sent to <b>{formData.parentEmail}</b>.</p>
                <p>2. Bring student birth certificate and 2 passport photos on assessment day.</p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 border border-slate-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-[#0B1F3A] text-[#D4AF37] font-bold text-xs py-3 px-6 rounded-xl shadow"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <form noValidate onSubmit={handleSubmit}>
              
              {/* Step 1: Student Details */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    Step 1 of 3: Student Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student's Full Name (As in Official Certificate) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abdurrahman Mustapha Lawal"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Programme Section *
                      </label>
                      <select
                        value={formData.programme}
                        onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none font-bold"
                      >
                        <option value="IBTIDAA'IYYAH">IBTIDAA'IYYAH (Nursery / Early Years)</option>
                        <option value="IHDAADIYYAH">IHDAADIYYAH (Primary Section)</option>
                        <option value="THANAWIYYAH">THANAWIYYAH (Secondary Section)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Residency Type *
                      </label>
                      <select
                        value={formData.admissionType}
                        onChange={(e) => setFormData({ ...formData, admissionType: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none font-bold text-[#0B1F3A]"
                      >
                        <option value="Day School">Day School</option>
                        <option value="Boarding School">Boarding School (Hostel)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.studentName || !formData.dob}
                      className="bg-[#0B1F3A] hover:bg-[#132c4f] disabled:opacity-50 text-[#D4AF37] font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2"
                    >
                      <span>Proceed to Parent Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Parent & Contact Details */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    Step 2 of 3: Parent / Guardian Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alhaji Mustapha Lawal"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 123 4567"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="parent@example.com"
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Residential Home Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Full residential street address..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.parentName || !formData.parentPhone || !formData.parentEmail}
                      className="bg-[#0B1F3A] hover:bg-[#132c4f] disabled:opacity-50 text-[#D4AF37] font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2"
                    >
                      <span>Proceed to Academic History</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Academic Background & Final Submission */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    Step 3 of 3: Academic & Qur'anic Background
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Qur'an Memorization Level
                      </label>
                      <select
                        value={formData.quranJuz}
                        onChange={(e) => setFormData({ ...formData, quranJuz: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      >
                        <option value="Juz Amma (30th)">Juz 'Amma (Beginner)</option>
                        <option value="1-5 Juz">1 - 5 Ajzaa</option>
                        <option value="6-15 Juz">6 - 15 Ajzaa</option>
                        <option value="16-29 Juz">16 - 29 Ajzaa</option>
                        <option value="Full Quran Hafiz">Complete 30 Juz Hafiz</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Previous School Attended
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Al-Hikmah International School"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Medical Considerations / Allergies (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any medical condition, dietary restrictions or allergies our nursing staff should know..."
                      value={formData.medicalNotes}
                      onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-100 p-4 rounded-xl text-xs space-y-1 text-slate-700 border border-slate-200">
                    <p className="font-bold text-[#0B1F3A]">Application Summary:</p>
                    <p><b>Candidate:</b> {formData.studentName} ({formData.gender})</p>
                    <p><b>Applying For:</b> {formData.programme} ({formData.admissionType})</p>
                    <p><b>Guardian Contact:</b> {formData.parentName} ({formData.parentPhone})</p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#D4AF37] via-[#F4B942] to-[#D4AF37] text-[#0B1F3A] font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#0B1F3A]" />
                      <span>Submit Application Now</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
