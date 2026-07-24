import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { INSTITUTION_INFO, PROGRAMMES } from '../data/schoolData';
import { StoredApplication } from '../types';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Upload,
  Printer,
  ChevronRight,
  Sparkles,
  School,
  Home,
  BookOpen,
  Award,
  AlertCircle,
  Database,
  Search,
  Download,
  ShieldCheck,
  Check,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

interface ApplicantDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: ApplicantTab;
}

export type ApplicantTab =
  | 'register'
  | 'login'
  | 'form'
  | 'type'
  | 'level'
  | 'documents'
  | 'submit'
  | 'track'
  | 'slip';

export const ApplicantDashboardModal: React.FC<ApplicantDashboardModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'form'
}) => {
  const { user, login, register, logout, myApplications, fetchMyApplications, dbStatus } = useAuth();
  
  const [activeTab, setActiveTab] = useState<ApplicantTab>(defaultTab);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isRegLoading, setIsRegLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Admission Form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [parentName, setParentName] = useState(user?.fullName || '');
  const [parentPhone, setParentPhone] = useState(user?.phone || '');
  const [parentEmail, setParentEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [quranMemorizedJuz, setQuranMemorizedJuz] = useState('1-5 Juz');
  const [medicalInfo, setMedicalInfo] = useState('');

  // Choose Day/Boarding state
  const [admissionType, setAdmissionType] = useState<'Day School' | 'Boarding School'>('Boarding School');

  // Select Level state
  const [programme, setProgramme] = useState('Tahfeez Intensive College');
  const [entryGrade, setEntryGrade] = useState('Primary 1 / JSS 1');

  // Upload Documents state
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string>('');
  const [uploadedDocNames, setUploadedDocNames] = useState<string[]>([]);
  const [declaration, setDeclaration] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<StoredApplication | null>(null);
  const [submitError, setSubmitError] = useState('');

  // Track & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<StoredApplication | null>(null);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName);
      if (!parentName) setParentName(user.fullName);
      if (!parentEmail) setParentEmail(user.email);
      if (user.phone && !parentPhone) setParentPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (myApplications.length > 0 && !selectedAppForSlip) {
      setSelectedAppForSlip(myApplications[0]);
    }
  }, [myApplications]);

  if (!isOpen) return null;

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setIsRegLoading(true);

    const res = await register(regName, regEmail, regPassword, regPhone, 'applicant');
    setIsRegLoading(false);

    if (res.success) {
      setRegSuccess('Account created successfully! You are now logged in.');
      setTimeout(() => {
        setActiveTab('form');
      }, 1200);
    } else {
      setRegError(res.error || 'Failed to register account');
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginLoading(true);

    const res = await login(loginEmail, loginPassword);
    setIsLoginLoading(false);

    if (res.success) {
      setActiveTab('form');
    } else {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  // Handle Passport Upload Simulation
  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Document Toggle/Upload
  const handleDocToggle = (docTitle: string) => {
    if (uploadedDocNames.includes(docTitle)) {
      setUploadedDocNames(uploadedDocNames.filter(d => d !== docTitle));
    } else {
      setUploadedDocNames([...uploadedDocNames, docTitle]);
    }
  };

  // Handle Final Submission
  const handleSubmitApplication = async () => {
    setSubmitError('');
    if (!fullName || !parentName || !parentPhone || !parentEmail || !address) {
      setSubmitError('Please complete all required fields in the "Fill Admission Form" tab first.');
      setActiveTab('form');
      return;
    }

    if (!declaration) {
      setSubmitError('Please accept the declaration terms before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          dateOfBirth: dateOfBirth || '2016-01-01',
          gender,
          programme,
          admissionType,
          entryGrade: entryGrade || 'Primary 1 / JSS 1',
          parentName,
          parentPhone,
          parentEmail,
          address,
          previousSchool,
          quranMemorizedJuz,
          medicalInfo,
          passportPhotoUrl: passportPhotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
          uploadedDocuments: uploadedDocNames
        })
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setSubmitSuccess(data.application);
        setSelectedAppForSlip(data.application);
        fetchMyApplications();
      } else {
        setSubmitError(data.error || 'Failed to submit application to database.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError('Network error: ' + (err.message || 'Could not connect to server'));
    }
  };

  // Trigger Print Window
  const handlePrint = () => {
    window.print();
  };

  const navItems = [
    { id: 'register', label: '1. Register', icon: User, desc: 'Create applicant account' },
    { id: 'login', label: '2. Login', icon: Lock, desc: 'Authenticate profile' },
    { id: 'form', label: '3. Fill Form', icon: FileText, desc: 'Candidate & guardian info' },
    { id: 'type', label: '4. Day / Boarding', icon: Home, desc: 'Choose residency mode' },
    { id: 'level', label: '5. Select Level', icon: School, desc: 'Target grade & programme' },
    { id: 'documents', label: '6. Documents', icon: Upload, desc: 'Upload passport & files' },
    { id: 'submit', label: '7. Submit', icon: CheckCircle2, desc: 'Final review & save' },
    { id: 'track', label: '8. Track Admission', icon: Clock, desc: 'Status & progress updates' },
    { id: 'slip', label: '9. Print Slip', icon: Printer, desc: 'Exam photocard slip' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scaleUp my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#0D2647] to-[#0B1F3A] text-white p-4 sm:p-6 relative shrink-0 border-b border-[#D4AF37]/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-12 h-12 rounded-xl bg-white p-1 border border-[#D4AF37] shadow flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={INSTITUTION_INFO.logo}
                alt={`${INSTITUTION_INFO.name} Logo`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=200';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                  Online Admission Portal
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight">
                Applicant Admission Dashboard
              </h2>
            </div>
          </div>

          {/* User status banner */}
          {user && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-black/30 border border-white/10 px-3 py-1 rounded-xl">
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Logged in as: <strong className="text-white">{user.fullName}</strong> ({user.email})</span>
              </div>

              <button
                onClick={logout}
                className="text-xs text-red-300 hover:text-white underline ml-2"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Main Grid: Navigation Tabs Sidebar + Content Panel */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[500px]">
          
          {/* Navigation Tabs (Sidebar on MD, Scrollable Topbar on Mobile) */}
          <div className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-thin">
            <div className="hidden md:block px-3 py-2 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider border-b border-slate-800 mb-1">
              Applicant Workflow Steps
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              // Highlight submission status if submitted
              let badge = null;
              if (item.id === 'track' && myApplications.length > 0) {
                badge = myApplications.length;
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ApplicantTab)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left whitespace-nowrap md:whitespace-normal shrink-0 ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#0B1F3A] font-bold shadow-md'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B1F3A]' : 'text-[#D4AF37]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.label}</div>
                    <div className={`text-[10px] hidden md:block truncate ${isActive ? 'text-amber-950/80 font-normal' : 'text-slate-400 font-normal'}`}>
                      {item.desc}
                    </div>
                  </div>
                  {badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#0B1F3A] text-white' : 'bg-[#D4AF37] text-[#0B1F3A]'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-50">
            
            {/* 1. REGISTER TAB */}
            {activeTab === 'register' && (
              <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 1 of 9</span>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Register Applicant Account</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Create your account to save application progress and manage candidate admission records.
                  </p>
                </div>

                {regError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (Parent / Guardian / Candidate)</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Alhaji Ibrahim Olanrewaju"
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. ibrahim@example.com"
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+234 803 123 4567"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegLoading}
                    className="w-full bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    {isRegLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    ) : (
                      <>
                        <span>Create Applicant Account</span>
                        <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-600">
                    Already registered?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-[#0B1F3A] font-bold hover:underline"
                    >
                      Login to your account
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* 2. LOGIN TAB */}
            {activeTab === 'login' && (
              <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 2 of 9</span>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Login to Applicant Portal</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Enter your email and password to access your application draft or check status.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {user ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-900 text-base">You are logged in!</h4>
                    <p className="text-xs text-emerald-700">
                      Welcome back, <strong>{user.fullName}</strong> ({user.email}). You can now fill out and manage your admission applications.
                    </p>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="bg-[#0B1F3A] text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-[#163660] transition-colors"
                    >
                      Continue to Admission Form
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Your registered email"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Your password"
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoginLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      ) : (
                        <>
                          <span>Login to Applicant Portal</span>
                          <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="pt-4 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-600">
                    Need a new account?{' '}
                    <button
                      onClick={() => setActiveTab('register')}
                      className="text-[#0B1F3A] font-bold hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* 3. FILL ADMISSION FORM TAB */}
            {activeTab === 'form' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 3 of 9</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Fill Candidate Admission Form</h3>
                    <p className="text-xs text-slate-600 mt-1">Provide accurate personal, guardian, and academic history for the applicant.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('type')}
                    className="bg-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs py-2 px-4 rounded-xl hover:bg-[#F4B942] transition-colors flex items-center gap-1"
                  >
                    <span>Next: Day/Boarding</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Candidate Info Box */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      Candidate Personal Details
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Muhammad Al-Farooq Ibrahim"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        >
                          <option value="Male">Male (Male Section)</option>
                          <option value="Female">Female (Female Section)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Previous School Attended</label>
                      <input
                        type="text"
                        value={previousSchool}
                        onChange={(e) => setPreviousSchool(e.target.value)}
                        placeholder="e.g. Al-Ansar International Model School"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Qur’an Memorization Progress</label>
                      <select
                        value={quranMemorizedJuz}
                        onChange={(e) => setQuranMemorizedJuz(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      >
                        <option value="None / Beginner Recitation">None / Beginner Recitation</option>
                        <option value="1-5 Juz">1 - 5 Juz</option>
                        <option value="6-15 Juz">6 - 15 Juz</option>
                        <option value="16-29 Juz">16 - 29 Juz</option>
                        <option value="Full Hafiz (30 Juz)">Full Hafiz (Complete 30 Juz)</option>
                      </select>
                    </div>
                  </div>

                  {/* Parent & Guardian Info Box */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      Parent / Guardian Details
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Guardian Name *</label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. Dr. Abdul-Lateef Olanrewaju"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Guardian Phone *</label>
                        <input
                          type="tel"
                          required
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          placeholder="+234 803 000 0000"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Guardian Email *</label>
                        <input
                          type="email"
                          required
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          placeholder="parent@example.com"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address *</label>
                      <textarea
                        rows={2}
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House address, City, State"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Medical / Special Dietary Notes</label>
                      <input
                        type="text"
                        value={medicalInfo}
                        onChange={(e) => setMedicalInfo(e.target.value)}
                        placeholder="e.g. Asthma, allergies, or none"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-end pt-3">
                  <button
                    onClick={() => setActiveTab('type')}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Choose Day/Boarding</span>
                    <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. CHOOSE DAY / BOARDING TAB */}
            {activeTab === 'type' && (
              <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
                <div className="border-b border-slate-200 pb-4 text-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 4 of 9</span>
                  <h3 className="text-2xl font-serif font-bold text-[#0B1F3A]">Choose Residency Option</h3>
                  <p className="text-xs text-slate-600 mt-1">Select whether the candidate will attend as a Day Student or Full Boarding Resident.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Day School Card */}
                  <div
                    onClick={() => setAdmissionType('Day School')}
                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${
                      admissionType === 'Day School'
                        ? 'border-[#D4AF37] bg-white shadow-xl ring-2 ring-[#D4AF37]/20 scale-102'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {admissionType === 'Day School' && (
                      <span className="absolute top-4 right-4 bg-[#D4AF37] text-[#0B1F3A] p-1 rounded-full">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}

                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#0B1F3A] flex items-center justify-center mb-4">
                      <School className="w-6 h-6 text-[#D4AF37]" />
                    </div>

                    <h4 className="text-lg font-bold text-[#0B1F3A]">Day School Option</h4>
                    <p className="text-xs text-slate-600 mt-1 mb-4">
                      Ideal for local students commuting daily from home within Ilorin / Lagos environs.
                    </p>

                    <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Morning & Afternoon academic classes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>School bus pickup & drop-off options</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Nutritious campus lunch facility</span>
                      </li>
                    </ul>
                  </div>

                  {/* Boarding School Card */}
                  <div
                    onClick={() => setAdmissionType('Boarding School')}
                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${
                      admissionType === 'Boarding School'
                        ? 'border-[#D4AF37] bg-white shadow-xl ring-2 ring-[#D4AF37]/20 scale-102'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {admissionType === 'Boarding School' && (
                      <span className="absolute top-4 right-4 bg-[#D4AF37] text-[#0B1F3A] p-1 rounded-full">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}

                    <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center mb-4">
                      <Home className="w-6 h-6 text-[#D4AF37]" />
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-[#0B1F3A]">Boarding School Option</h4>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 mb-4">
                      Full residential hostel accommodation with round-the-clock spiritual & academic mentorship.
                    </p>

                    <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Airy residential hostels with 24/7 security</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>3 Balanced halal meals & evening snacks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Night Tahfeez & supervised prep sessions</span>
                      </li>
                    </ul>
                  </div>

                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                  >
                    Back to Form
                  </button>

                  <button
                    onClick={() => setActiveTab('level')}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Select Level</span>
                    <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            )}

            {/* 5. SELECT LEVEL TAB */}
            {activeTab === 'level' && (
              <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
                <div className="border-b border-slate-200 pb-4 text-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 5 of 9</span>
                  <h3 className="text-2xl font-serif font-bold text-[#0B1F3A]">Select Academic Level</h3>
                  <p className="text-xs text-slate-600 mt-1">Choose the specific programme and entry grade for the candidate.</p>
                </div>

                <div className="space-y-3">
                  {PROGRAMMES.map((prog) => (
                    <div
                      key={prog.id}
                      onClick={() => setProgramme(prog.title)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        programme === prog.title
                          ? 'border-[#D4AF37] bg-white shadow-md ring-2 ring-[#D4AF37]/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          programme === prog.title ? 'bg-[#0B1F3A] text-[#D4AF37]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#0B1F3A]">{prog.title}</h4>
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                              {prog.section}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{prog.summary}</p>
                        </div>
                      </div>

                      {programme === prog.title && (
                        <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Entry Grade Specific Input */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Entry Grade / Class</label>
                  <select
                    value={entryGrade}
                    onChange={(e) => setEntryGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                  >
                    <option value="Nursery / Kindergarten">Nursery / Kindergarten</option>
                    <option value="Primary Grade 1 - 3">Primary Grade 1 - 3</option>
                    <option value="Primary Grade 4 - 6">Primary Grade 4 - 6</option>
                    <option value="Tahfeez Intensive (1-Year Memory Track)">Tahfeez Intensive (1-Year Memory Track)</option>
                    <option value="Junior Secondary (JSS 1 - JSS 3)">Junior Secondary (JSS 1 - JSS 3)</option>
                    <option value="Senior Secondary Science (SSS 1 - SSS 3)">Senior Secondary Science (SSS 1 - SSS 3)</option>
                    <option value="Senior Secondary Arts & Humanities (SSS 1 - SSS 3)">Senior Secondary Arts & Humanities (SSS 1 - SSS 3)</option>
                    <option value="Higher Diploma / I'dad Level">Higher Diploma / I'dad Level</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setActiveTab('type')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setActiveTab('documents')}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Upload Documents</span>
                    <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            )}

            {/* 6. UPLOAD DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
                <div className="border-b border-slate-200 pb-4 text-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 6 of 9</span>
                  <h3 className="text-2xl font-serif font-bold text-[#0B1F3A]">Upload Candidate Documents</h3>
                  <p className="text-xs text-slate-600 mt-1">Upload candidate passport photograph and supporting certificates for verification.</p>
                </div>

                {/* Passport Photograph Section */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    Candidate Passport Photograph *
                  </h4>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="w-24 h-28 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 relative">
                      {passportPhotoUrl ? (
                        <img src={passportPhotoUrl} alt="Passport Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2">
                          <User className="w-8 h-8 text-slate-400 mx-auto" />
                          <span className="text-[10px] text-slate-400">Photo Box</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <p className="text-xs text-slate-600">
                        Upload a clear front-facing passport photograph with white or light background.
                      </p>
                      <label className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#163660] cursor-pointer shadow">
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Select Photo Image</span>
                        <input type="file" accept="image/*" onChange={handlePassportUpload} className="hidden" />
                      </label>
                      {passportPhotoUrl && (
                        <span className="text-xs text-emerald-600 font-bold block">✓ Passport uploaded!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document Checklist */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    Required Certificates & Credentials
                  </h4>

                  <p className="text-xs text-slate-500">
                    Click on the documents below to mark them as attached/verified for submission.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Birth Certificate / Declaration of Age',
                      'Previous School Report Card / Transcript',
                      'Qur’an Competency / Hafiz Certificate',
                      'Medical Fitness Clearance',
                      'Guarantor / Recommendation Letter'
                    ].map((docName) => {
                      const isAttached = uploadedDocNames.includes(docName);
                      return (
                        <div
                          key={docName}
                          onClick={() => handleDocToggle(docName)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                            isAttached
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Upload className={`w-3.5 h-3.5 ${isAttached ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="truncate">{docName}</span>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isAttached ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isAttached ? 'Attached' : 'Click to Attach'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setActiveTab('level')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setActiveTab('submit')}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Review & Submit</span>
                    <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            )}

            {/* 7. SUBMIT APPLICATION TAB */}
            {activeTab === 'submit' && (
              <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
                <div className="border-b border-slate-200 pb-4 text-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 7 of 9</span>
                  <h3 className="text-2xl font-serif font-bold text-[#0B1F3A]">Submit Admission Application</h3>
                  <p className="text-xs text-slate-600 mt-1">Review candidate information and confirm submission to the school database.</p>
                </div>

                {submitSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-8 rounded-3xl text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-emerald-950">Application Successfully Submitted!</h4>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto">
                      Your candidate record has been saved to the school database.
                    </p>

                    <div className="bg-white p-4 rounded-2xl border border-emerald-200 max-w-sm mx-auto text-left text-xs space-y-1">
                      <p><strong className="text-slate-800">Application Ref:</strong> <span className="font-extrabold text-[#0B1F3A]">{submitSuccess.applicationNo}</span></p>
                      <p><strong className="text-slate-800">Candidate:</strong> {submitSuccess.fullName}</p>
                      <p><strong className="text-slate-800">Programme:</strong> {submitSuccess.programme} ({submitSuccess.admissionType})</p>
                      <p><strong className="text-slate-800">Status:</strong> <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded uppercase text-[10px]">Pending Screening</span></p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('track')}
                        className="bg-[#0B1F3A] text-white font-bold text-xs py-2.5 px-5 rounded-xl hover:bg-[#163660]"
                      >
                        Track Admission Status
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppForSlip(submitSuccess);
                          setActiveTab('slip');
                        }}
                        className="bg-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs py-2.5 px-5 rounded-xl hover:bg-[#F4B942]"
                      >
                        Print Exam Photocard Slip
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Summary Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-[#0B1F3A] text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#D4AF37]" />
                          Application Summary Review
                        </h4>
                        <span className="text-xs bg-[#0B1F3A] text-[#D4AF37] font-extrabold px-3 py-1 rounded-full">
                          {admissionType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400">Candidate Name:</p>
                          <p className="font-bold text-slate-800 text-sm">{fullName || 'Not specified'}</p>
                        </div>

                        <div>
                          <p className="text-slate-400">Selected Programme & Level:</p>
                          <p className="font-bold text-slate-800 text-sm">{programme} ({entryGrade})</p>
                        </div>

                        <div>
                          <p className="text-slate-400">Parent / Guardian:</p>
                          <p className="font-bold text-slate-800">{parentName} ({parentPhone})</p>
                        </div>

                        <div>
                          <p className="text-slate-400">Parent Email:</p>
                          <p className="font-bold text-slate-800">{parentEmail}</p>
                        </div>

                        <div>
                          <p className="text-slate-400">Residential Address:</p>
                          <p className="font-bold text-slate-800">{address || 'Not specified'}</p>
                        </div>

                        <div>
                          <p className="text-slate-400">Qur’an Progress:</p>
                          <p className="font-bold text-slate-800">{quranMemorizedJuz}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Attached Documents:</span>
                        <span className="font-bold text-[#0B1F3A]">
                          {uploadedDocNames.length} Certificate(s) + Passport Photo
                        </span>
                      </div>
                    </div>

                    {/* Declaration Terms */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declaration}
                          onChange={(e) => setDeclaration(e.target.checked)}
                          className="mt-0.5 rounded border-amber-300 text-[#0B1F3A] focus:ring-[#D4AF37]"
                        />
                        <span>
                          <strong>Solemn Oath & Declaration:</strong> I hereby certify that all information provided in this admission form is true, correct, and complete. I agree to abide by the rules and Islamic ethos of Darul Anwar & Is'ad Schools.
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                      >
                        Back
                      </button>

                      <button
                        onClick={handleSubmitApplication}
                        disabled={isSubmitting}
                        className="bg-[#D4AF37] hover:bg-[#F4B942] text-[#0B1F3A] font-extrabold text-xs py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-[#0B1F3A]" />
                        ) : (
                          <>
                            <span>Submit Application to Database</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 8. TRACK ADMISSION TAB */}
            {activeTab === 'track' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 8 of 9</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Track Admission Status</h3>
                    <p className="text-xs text-slate-600 mt-1">Monitor candidate application timeline and assessment updates.</p>
                  </div>

                  <button
                    onClick={fetchMyApplications}
                    className="text-xs text-[#0B1F3A] font-bold bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Refresh Status</span>
                  </button>
                </div>

                {myApplications.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h4 className="font-bold text-slate-700 text-base">No Applications Found</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      Submit an application form to view real-time tracking updates.
                    </p>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="bg-[#D4AF37] text-[#0B1F3A] font-extrabold text-xs py-2.5 px-5 rounded-xl shadow hover:bg-[#F4B942]"
                    >
                      Fill Admission Form Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myApplications.map((app) => (
                      <div key={app.id || app._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        
                        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold bg-[#0B1F3A] text-[#D4AF37] px-2.5 py-0.5 rounded uppercase tracking-wider">
                                Ref: {app.applicationNo || app.id}
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                Submitted {new Date(app.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-[#0B1F3A] mt-1">
                              {app.fullName}
                            </h4>
                            <p className="text-xs text-slate-600">
                              {app.programme} • {app.admissionType} ({app.entryGrade})
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                              {app.status === 'pending' ? 'Pending Review' : app.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedAppForSlip(app);
                                setActiveTab('slip');
                              }}
                              className="bg-[#0B1F3A] text-[#D4AF37] hover:bg-[#163660] text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print Slip</span>
                            </button>
                          </div>
                        </div>

                        {/* Status Progress Timeline */}
                        <div className="pt-2">
                          <h5 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Admission Progress Milestone</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                              <p className="text-[11px] font-bold text-emerald-900">1. Form Submitted</p>
                              <p className="text-[9px] text-emerald-700">Database Record Active</p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center">
                              <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1 animate-pulse" />
                              <p className="text-[11px] font-bold text-amber-900">2. Credential Verification</p>
                              <p className="text-[9px] text-amber-700">In Progress</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center opacity-70">
                              <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                              <p className="text-[11px] font-bold text-slate-700">3. Entrance Exam</p>
                              <p className="text-[9px] text-slate-500">Sat 15th Aug 2026</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center opacity-70">
                              <Award className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                              <p className="text-[11px] font-bold text-slate-700">4. Admission Offer</p>
                              <p className="text-[9px] text-slate-500">Awaiting Assessment</p>
                            </div>

                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. PRINT SLIP TAB */}
            {activeTab === 'slip' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Step 9 of 9</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Print Examination & Application Slip</h3>
                    <p className="text-xs text-slate-600 mt-1">Official candidate photocard pass for screening and entrance assessment.</p>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="bg-[#D4AF37] hover:bg-[#F4B942] text-[#0B1F3A] font-extrabold text-xs py-2 px-4 rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Slip</span>
                  </button>
                </div>

                {/* Printable Slip Container */}
                <div id="printable-slip" className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#0B1F3A] shadow-xl space-y-6 relative overflow-hidden">
                  
                  {/* Slip Header */}
                  <div className="flex items-center justify-between border-b-2 border-[#0B1F3A] pb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white p-1 border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={INSTITUTION_INFO.logo}
                          alt="School Logo"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-serif font-extrabold text-[#0B1F3A] uppercase tracking-tight">
                          {INSTITUTION_INFO.name}
                        </h2>
                        <p className="text-xs font-serif text-[#D4AF37] font-bold" dir="rtl">
                          مدرسة دار الأنوار والإسعاد للتعليم الإسلامي
                        </p>
                        <p className="text-[10px] text-slate-600">
                          {INSTITUTION_INFO.address} • Tel: {INSTITUTION_INFO.phonePrimary}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-extrabold bg-[#0B1F3A] text-white px-3 py-1 rounded uppercase tracking-wider block mb-1">
                        ADMISSION SLIP 2026/2027
                      </span>
                      <p className="text-xs font-mono font-extrabold text-[#0B1F3A]">
                        REF: {selectedAppForSlip?.applicationNo || 'DAI-2026-8912'}
                      </p>
                    </div>
                  </div>

                  {/* Body Grid: Passport & Candidate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* Candidate Photo */}
                    <div className="md:col-span-1 text-center space-y-2">
                      <div className="w-32 h-36 rounded-2xl border-2 border-[#0B1F3A] bg-slate-100 mx-auto overflow-hidden shadow-inner flex items-center justify-center">
                        {selectedAppForSlip?.passportPhotoUrl || passportPhotoUrl ? (
                          <img
                            src={selectedAppForSlip?.passportPhotoUrl || passportPhotoUrl}
                            alt="Candidate Passport"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-3 text-center">
                            <User className="w-10 h-10 text-slate-400 mx-auto mb-1" />
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Affix Passport Photo</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                        OFFICIAL STAMP VALIDATED
                      </span>
                    </div>

                    {/* Candidate Specs Table */}
                    <div className="md:col-span-3 space-y-3 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold">Candidate Full Name</p>
                          <p className="font-extrabold text-[#0B1F3A] text-sm">{selectedAppForSlip?.fullName || fullName || 'Muhammad Ibrahim'}</p>
                        </div>

                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold">Programme & Class</p>
                          <p className="font-bold text-slate-800">{selectedAppForSlip?.programme || programme}</p>
                        </div>

                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold">Residency Mode</p>
                          <p className="font-bold text-[#D4AF37]">{selectedAppForSlip?.admissionType || admissionType}</p>
                        </div>

                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold">Date of Birth & Gender</p>
                          <p className="font-bold text-slate-800">{selectedAppForSlip?.dateOfBirth || dateOfBirth || '2016-01-01'} ({selectedAppForSlip?.gender || gender})</p>
                        </div>

                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold">Guardian Contact</p>
                          <p className="font-bold text-slate-800">{selectedAppForSlip?.parentName || parentName} ({selectedAppForSlip?.parentPhone || parentPhone})</p>
                        </div>

                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold">Qur’an Progress</p>
                          <p className="font-bold text-slate-800">{selectedAppForSlip?.quranMemorizedJuz || quranMemorizedJuz}</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Entrance Examination Details Box */}
                  <div className="bg-[#0B1F3A] text-white p-4 sm:p-5 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Entrance Examination & Screening Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-white/10">
                      <div>
                        <span className="text-slate-300 block text-[10px]">Date & Time:</span>
                        <strong className="text-white text-xs">Saturday, 15th August 2026 @ 09:00 AM WAT</strong>
                      </div>

                      <div>
                        <span className="text-slate-300 block text-[10px]">Venue & Hall:</span>
                        <strong className="text-white text-xs">Main Auditorium, Knowledge Expressway Campus (Seat AUD-H2-042)</strong>
                      </div>

                      <div>
                        <span className="text-slate-300 block text-[10px]">Examination Subjects:</span>
                        <strong className="text-white text-xs">English, Mathematics, Arabic & Qur’an Recitation</strong>
                      </div>
                    </div>
                  </div>

                  {/* Requirements & Signature */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p className="font-bold text-[#0B1F3A] mb-1">Instructions to Candidate:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                        <li>Come with this printed slip and 2 recent passport photographs.</li>
                        <li>Bring original credentials and birth certificate copy for verification.</li>
                        <li>Arrive at the examination hall at least 30 minutes before schedule.</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
                      <div className="w-24 border-b border-slate-400 mb-1"></div>
                      <span className="font-serif text-[11px] font-bold text-[#0B1F3A]">Office of the School Registrar</span>
                      <span className="text-[9px] text-slate-500">Darul Anwar & Is'ad Schools Admission Board</span>
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('track')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
                  >
                    Back to Track Status
                  </button>

                  <button
                    onClick={handlePrint}
                    className="bg-[#0B1F3A] text-[#D4AF37] font-bold text-xs py-3 px-8 rounded-xl shadow-lg hover:bg-[#163660] flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Admission Slip Now</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
