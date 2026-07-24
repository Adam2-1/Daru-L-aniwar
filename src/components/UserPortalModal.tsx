import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Phone, Calendar, Clock, CheckCircle2, FileText, Database, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';

interface UserPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: () => void;
}

export const UserPortalModal: React.FC<UserPortalModalProps> = ({ isOpen, onClose, onOpenApply }) => {
  const { user, logout, myApplications, fetchMyApplications, dbStatus } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scaleUp my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#0D2647] to-[#0B1F3A] text-white p-4 sm:p-8 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {user.fullName}
                </h2>
                <span className="bg-[#D4AF37] text-[#0B1F3A] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{user.email}</span>
                {user.phone && (
                  <>
                    <span>•</span>
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{user.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Refresh Action */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-end text-xs text-slate-300">
            <button
              onClick={() => fetchMyApplications()}
              className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              Submitted Admission Applications
            </h3>
            <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full">
              {myApplications.length} Record{myApplications.length !== 1 ? 's' : ''}
            </span>
          </div>

          {myApplications.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No Applications Found in Database</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Submit an online admission form to store your candidate profile directly in our database.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenApply();
                }}
                className="bg-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs py-2.5 px-4 rounded-xl shadow hover:bg-[#F4B942]"
              >
                Apply for Admission Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app, idx) => (
                <div key={app._id || app.id || idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-[#D4AF37] transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold bg-[#0B1F3A] text-[#D4AF37] px-2 py-0.5 rounded uppercase tracking-wider">
                        {app.programme}
                      </span>
                      <h4 className="text-base font-bold text-[#0B1F3A] mt-1">
                        {app.fullName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Entry Grade: {app.entryGrade} • Type: {app.admissionType}
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      app.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {app.status === 'pending' ? 'Pending Review' : app.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200/60">
                    <p><strong className="text-slate-800">Parent/Guardian:</strong> {app.parentName} ({app.parentPhone})</p>
                    <p><strong className="text-slate-800">Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString()} at {new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {app.quranMemorizedJuz && (
                      <p><strong className="text-slate-800">Qur'an Progress:</strong> {app.quranMemorizedJuz}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="text-xs text-red-600 font-bold hover:text-red-800 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#0B1F3A] text-white font-bold text-xs py-2.5 px-5 rounded-xl hover:bg-[#163660]"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
