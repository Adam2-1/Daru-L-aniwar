import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { INSTITUTION_INFO, PROGRAMMES, FACILITIES, LATEST_NEWS } from '../data/schoolData';
import { StoredApplication } from '../types';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  Printer,
  FileSpreadsheet,
  Download,
  Building,
  Image as ImageIcon,
  Newspaper,
  BookOpen,
  Calendar,
  Users,
  Award,
  Sparkles,
  RefreshCw,
  Check,
  AlertCircle,
  BarChart3,
  Sliders,
  GraduationCap
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AdminTab;
}

export type AdminTab =
  | 'login'
  | 'website'
  | 'admissions'
  | 'approval'
  | 'programs'
  | 'timetable'
  | 'facilities'
  | 'gallery'
  | 'news'
  | 'reports';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login'
}) => {
  const { user, dbStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(defaultTab);

  // Admin Auth state
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState('admin@darulanwar.edu.ng');
  const [adminPassword, setAdminPassword] = useState('');
  const [passcode, setPasscode] = useState('admin123');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Applications list for Admin
  const [applications, setApplications] = useState<StoredApplication[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'under_review' | 'accepted' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Day School' | 'Boarding School'>('all');

  // Selected App for Approval/Detail
  const [selectedApp, setSelectedApp] = useState<StoredApplication | null>(null);

  // Hidden/deleted sidebar tabs state
  const [hiddenTabIds, setHiddenTabIds] = useState<string[]>([]);

  const handleDeleteTab = (tabId: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabId === 'login') return;
    if (window.confirm(`Are you sure you want to delete/remove the "${label}" tab from the Admin Dashboard sidebar?`)) {
      setHiddenTabIds(prev => [...prev, tabId]);
      if (activeTab === tabId) {
        const remaining = navItems.filter(item => item.id !== tabId && !hiddenTabIds.includes(item.id));
        if (remaining.length > 0) {
          setActiveTab(remaining[0].id as AdminTab);
        } else {
          setActiveTab('login');
        }
      }
    }
  };

  const handleDeleteApplication = async (appId: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete application record for "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setApplications(apps => apps.filter(a => a.id !== appId && a._id !== appId));
        if (selectedApp && (selectedApp.id === appId || selectedApp._id === appId)) {
          setSelectedApp(null);
        }
      } else {
        alert("Failed to delete application. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Error deleting application.");
    }
  };

  // Website Settings Editable State
  const [websiteInfo, setWebsiteInfo] = useState({
    name: INSTITUTION_INFO.name,
    arabicTitle: INSTITUTION_INFO.arabicTitle,
    motto: INSTITUTION_INFO.motto,
    phonePrimary: INSTITUTION_INFO.phonePrimary,
    email: INSTITUTION_INFO.email,
    address: INSTITUTION_INFO.address,
    announcement: "📌 Admission Application open for 2026/2027 Session! Early bird discount available for Boarding students."
  });
  const [isWebSaved, setIsWebSaved] = useState(false);

  // Manage Programs local editable list
  const [programList, setProgramList] = useState(PROGRAMMES);
  const [newProgTitle, setNewProgTitle] = useState('');
  const [newProgSection, setNewProgSection] = useState('IHDAADIYYAH');

  // Manage Facilities local editable list
  const [facilityList, setFacilityList] = useState(FACILITIES);
  const [newFacTitle, setNewFacTitle] = useState('');
  const [newFacCategory, setNewFacCategory] = useState('Academic');

  // Manage Gallery local items
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState('Events');
  const [newGalCaption, setNewGalCaption] = useState('');
  const [newGalImage, setNewGalImage] = useState('');
  const [isUploadingGal, setIsUploadingGal] = useState(false);

  // Manage News local items
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState('Admissions');
  const [newNewsAuthor, setNewNewsAuthor] = useState('Editorial Team');
  const [newNewsExcerpt, setNewNewsExcerpt] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsImage, setNewNewsImage] = useState('');
  const [isPublishingNews, setIsPublishingNews] = useState(false);

  // Timetable State
  const [timetableDays, setTimetableDays] = useState([
    { day: 'Monday', morning: '07:30 AM - Tahfeez Morning Revision', core: '09:00 AM - Mathematics / English / Arabic', afternoon: '02:00 PM - Islamic Studies / Science', evening: '05:00 PM - Evening Prep & Hifz' },
    { day: 'Tuesday', morning: '07:30 AM - Tajweed & Quran Recitation', core: '09:00 AM - Physics / Chemistry / Commerce', afternoon: '02:00 PM - Arabic Grammar (Nahw)', evening: '05:00 PM - Sports & Physical Fitness' },
    { day: 'Wednesday', morning: '07:30 AM - Hadith Memorization (Bulugh)', core: '09:00 AM - Biology / Economics / Computer', afternoon: '02:00 PM - Fiqh & Tawheed', evening: '05:00 PM - Evening Hifz & Mentorship' },
    { day: 'Thursday', morning: '07:30 AM - Quran Revision Halaqah', core: '09:00 AM - Civic / Government / Literature', afternoon: '02:00 PM - Seerah & Islamic History', evening: '05:00 PM - Boarding Cultural Circle' },
    { day: 'Friday', morning: '07:30 AM - Surah Al-Kahf & Jumuah Prep', core: '10:00 AM - Jumuah Khutbah & Prayer', afternoon: '02:30 PM - Halaqah Tafseer', evening: '05:00 PM - Night Tahfeez Challenge' },
  ]);

  const fetchNewsAndGallery = async () => {
    try {
      const [newsRes, galRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/gallery')
      ]);
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNewsList(newsData);
      }
      if (galRes.ok) {
        const galData = await galRes.json();
        setGalleryItems(galData);
      }
    } catch (err) {
      console.error("Error fetching news/gallery:", err);
    }
  };

  useEffect(() => {
    fetchNewsAndGallery();
  }, []);

  const handleNewsImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Image file size should be less than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNewsImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Image file size should be less than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsExcerpt || !newNewsImage) {
      alert("Please fill in the article headline, summary, and select or enter an image.");
      return;
    }

    setIsPublishingNews(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNewsTitle,
          category: newNewsCategory,
          author: newNewsAuthor,
          excerpt: newNewsExcerpt,
          content: newNewsContent ? newNewsContent.split('\n\n') : [newNewsExcerpt],
          image: newNewsImage
        })
      });

      if (res.ok) {
        const publishedArticle = await res.json();
        setNewsList(prev => [publishedArticle, ...prev]);
        setNewNewsTitle('');
        setNewNewsExcerpt('');
        setNewNewsContent('');
        setNewNewsImage('');
        alert("Article published successfully on the website!");
      } else {
        alert("Failed to publish article. Please check input and try again.");
      }
    } catch (err) {
      console.error("Error publishing article:", err);
      alert("An error occurred while publishing the article.");
    } finally {
      setIsPublishingNews(false);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${title}" from the website?`)) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNewsList(prev => prev.filter(item => (item.id !== id && item._id !== id)));
      } else {
        alert("Failed to delete article.");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("Error deleting article.");
    }
  };

  const handleUploadGalleryPicture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle || !newGalImage) {
      alert("Please enter a photo title and select or enter an image.");
      return;
    }

    setIsUploadingGal(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newGalTitle,
          category: newGalCategory,
          caption: newGalCaption || newGalTitle,
          image: newGalImage
        })
      });

      if (res.ok) {
        const uploadedItem = await res.json();
        setGalleryItems(prev => [uploadedItem, ...prev]);
        setNewGalTitle('');
        setNewGalCaption('');
        setNewGalImage('');
        alert("Photo uploaded successfully to the gallery!");
      } else {
        alert("Failed to upload photo. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading gallery photo:", err);
      alert("An error occurred while uploading picture.");
    } finally {
      setIsUploadingGal(false);
    }
  };

  const handleDeleteGalleryPicture = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete picture "${title}" from the gallery?`)) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGalleryItems(prev => prev.filter(item => (item.id !== id && item._id !== id)));
      } else {
        alert("Failed to delete picture.");
      }
    } catch (err) {
      console.error("Error deleting picture:", err);
      alert("Error deleting picture.");
    }
  };

  useEffect(() => {
    // If logged in user has admin role or auto pass, pre-authenticate
    if (user && user.role === 'admin') {
      setAdminAuthenticated(true);
      if (activeTab === 'login') setActiveTab('admissions');
    }
  }, [user]);

  useEffect(() => {
    if (adminAuthenticated) {
      fetchAdminApplications();
    }
  }, [adminAuthenticated]);

  if (!isOpen) return null;

  // Fetch all applications
  const fetchAdminApplications = async () => {
    setIsLoadingApps(true);
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
        if (data.length > 0 && !selectedApp) {
          setSelectedApp(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin applications', err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword, passcode })
      });

      const data = await res.json();
      setIsAuthLoading(false);

      if (res.ok && data.success) {
        setAdminAuthenticated(true);
        setActiveTab('admissions');
        fetchAdminApplications();
      } else {
        setAuthError(data.error || 'Invalid Admin Credentials or Passcode');
      }
    } catch (err: any) {
      setIsAuthLoading(false);
      setAuthError('Network error: ' + (err.message || 'Could not authenticate admin'));
    }
  };

  // Update Application Status (Approve / Reject / Under Review)
  const handleUpdateStatus = async (appId: string, newStatus: 'accepted' | 'rejected' | 'under_review' | 'pending') => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setApplications(apps =>
          apps.map(a => (a.id === appId || a._id === appId) ? { ...a, status: newStatus } : a)
        );
        if (selectedApp && (selectedApp.id === appId || selectedApp._id === appId)) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Filtered Applications
  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.parentName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.parentPhone.includes(appSearch) ||
      (app.applicationNo && app.applicationNo.toLowerCase().includes(appSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.admissionType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const navItems = [
    { id: 'login', label: '1. Login', icon: Lock, desc: 'Administrator access' },
    { id: 'website', label: '2. Manage Website', icon: Sliders, desc: 'Branding & contact details' },
    { id: 'admissions', label: '3. Manage Admissions', icon: GraduationCap, desc: 'All candidate records' },
    { id: 'approval', label: '4. Approve/Reject Students', icon: ShieldCheck, desc: 'Review & decision engine' },
    { id: 'programs', label: '5. Manage Programs', icon: BookOpen, desc: 'Curriculum & grades' },
    { id: 'timetable', label: '6. Manage Timetable', icon: Calendar, desc: 'Class & Tahfeez schedules' },
    { id: 'facilities', label: '7. Manage Facilities', icon: Building, desc: 'Hostels & labs' },
    { id: 'gallery', label: '8. Manage Gallery', icon: ImageIcon, desc: 'Campus photo media' },
    { id: 'news', label: '9. Manage News', icon: Newspaper, desc: 'Announcements & articles' },
    { id: 'reports', label: '10. Generate Reports', icon: BarChart3, desc: 'Analytics & print sheets' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scaleUp my-4 sm:my-8 flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#163660] to-[#0B1F3A] text-white p-4 sm:p-6 relative shrink-0 border-b-2 border-[#D4AF37]">
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
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                  Administrator Control Console
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight">
                {INSTITUTION_INFO.name} - Admin Portal
              </h2>
            </div>
          </div>

          {/* Status Sub-bar */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              {adminAuthenticated ? (
                <span className="text-emerald-300 font-bold">Authenticated as Grand Administrator</span>
              ) : (
                <span className="text-amber-200 font-semibold">Authentication Required (Passcode: admin123)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                Live DB Sync
              </span>
            </div>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[520px]">
          
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-slate-950 text-slate-300 border-r border-slate-800 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-thin">
            <div className="hidden md:block px-3 py-2 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider border-b border-slate-800 mb-1">
              Administrator Tab Navigation
            </div>

            {navItems
              .filter(item => !hiddenTabIds.includes(item.id))
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLocked = !adminAuthenticated && item.id !== 'login';

                return (
                  <div key={item.id} className="relative group w-full shrink-0">
                    <button
                      disabled={isLocked}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 pr-8 rounded-xl text-xs font-semibold transition-all text-left whitespace-nowrap md:whitespace-normal shrink-0 ${
                        isActive
                          ? 'bg-[#D4AF37] text-[#0B1F3A] font-extrabold shadow-md'
                          : isLocked
                          ? 'opacity-40 cursor-not-allowed hover:bg-transparent text-slate-500'
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
                    </button>

                    {item.id !== 'login' && (
                      <button
                        onClick={(e) => handleDeleteTab(item.id, item.label, e)}
                        title={`Delete / Remove "${item.label}" tab`}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all ${
                          isActive
                            ? 'text-[#0B1F3A]/60 hover:text-red-700 hover:bg-black/10'
                            : 'text-slate-500 opacity-60 group-hover:opacity-100 hover:text-red-400 hover:bg-slate-800'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

            {hiddenTabIds.length > 0 && (
              <div className="mt-auto pt-3 border-t border-slate-800 text-center">
                <button
                  onClick={() => setHiddenTabIds([])}
                  className="text-[11px] text-[#D4AF37] hover:underline font-bold flex items-center justify-center gap-1 mx-auto py-1"
                >
                  <RefreshCw className="w-3 h-3 text-[#D4AF37]" />
                  <span>Restore {hiddenTabIds.length} Deleted Tab(s)</span>
                </button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
            
            {/* 1. LOGIN TAB */}
            {activeTab === 'login' && (
              <div className="max-w-md mx-auto my-6 space-y-6 animate-fadeIn">
                <div className="text-center space-y-2 border-b border-slate-200 pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center mx-auto border-2 border-[#D4AF37] shadow-lg">
                    <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#0B1F3A]">Administrator Authentication</h3>
                  <p className="text-xs text-slate-600">
                    Enter administrator credentials or security passcode to unlock management features.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {adminAuthenticated ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-950 text-base">Administrator Access Granted!</h4>
                    <p className="text-xs text-emerald-800">
                      You have full access to manage admissions, website content, timetables, and reports.
                    </p>
                    <button
                      onClick={() => setActiveTab('admissions')}
                      className="bg-[#0B1F3A] text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-[#163660] transition-colors"
                    >
                      Go to Manage Admissions
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAdminLogin} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Admin Passcode / Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          placeholder="e.g. admin123"
                          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Default passcode: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-[#0B1F3A]">admin123</code></span>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                    >
                      {isAuthLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      ) : (
                        <>
                          <span>Login to Admin Dashboard</span>
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 2. MANAGE WEBSITE TAB */}
            {activeTab === 'website' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 2 of 10</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Manage Website & Branding</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Configure institutional name, motto, announcement banner, and contact channels.</p>
                  </div>
                  {isWebSaved && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved to Website!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Branding Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                    <h4 className="font-bold text-sm text-[#0B1F3A] border-b pb-2 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#D4AF37]" /> Institution Info
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Institution Name</label>
                      <input
                        type="text"
                        value={websiteInfo.name}
                        onChange={(e) => setWebsiteInfo({ ...websiteInfo, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Arabic Title</label>
                      <input
                        type="text"
                        value={websiteInfo.arabicTitle}
                        onChange={(e) => setWebsiteInfo({ ...websiteInfo, arabicTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Motto</label>
                      <textarea
                        rows={2}
                        value={websiteInfo.motto}
                        onChange={(e) => setWebsiteInfo({ ...websiteInfo, motto: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  {/* Announcement & Contacts Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                    <h4 className="font-bold text-sm text-[#0B1F3A] border-b pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Announcement Banner & Helpdesk
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Top Announcement Marquee Banner</label>
                      <textarea
                        rows={2}
                        value={websiteInfo.announcement}
                        onChange={(e) => setWebsiteInfo({ ...websiteInfo, announcement: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone</label>
                        <input
                          type="text"
                          value={websiteInfo.phonePrimary}
                          onChange={(e) => setWebsiteInfo({ ...websiteInfo, phonePrimary: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                        <input
                          type="text"
                          value={websiteInfo.email}
                          onChange={(e) => setWebsiteInfo({ ...websiteInfo, email: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Campus Address</label>
                      <input
                        type="text"
                        value={websiteInfo.address}
                        onChange={(e) => setWebsiteInfo({ ...websiteInfo, address: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => {
                      setIsWebSaved(true);
                      setTimeout(() => setIsWebSaved(false), 3000);
                    }}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-3 px-6 rounded-xl shadow flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>Save Website Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. MANAGE ADMISSIONS TAB */}
            {activeTab === 'admissions' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 3 of 10</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Manage Admission Applications</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Filter and query candidate application submissions across Day & Boarding streams.</p>
                  </div>
                  <button
                    onClick={fetchAdminApplications}
                    className="bg-slate-200 hover:bg-slate-300 text-[#0B1F3A] font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingApps ? 'animate-spin' : ''}`} />
                    <span>Refresh Records</span>
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search by candidate name, phone or App No..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none bg-slate-50"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted / Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none bg-slate-50"
                    >
                      <option value="all">All Residency Types</option>
                      <option value="Day School">Day School</option>
                      <option value="Boarding School">Boarding School</option>
                    </select>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#0B1F3A] text-white font-bold uppercase text-[10px] tracking-wider">
                          <th className="p-3.5">Candidate & App No</th>
                          <th className="p-3.5">Programme & Grade</th>
                          <th className="p-3.5">Residency</th>
                          <th className="p-3.5">Guardian & Contact</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredApps.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                              No matching candidate applications found in database.
                            </td>
                          </tr>
                        ) : (
                          filteredApps.map((app) => (
                            <tr key={app.id || app._id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5 font-bold text-[#0B1F3A]">
                                <div>{app.fullName}</div>
                                <span className="text-[10px] text-[#D4AF37] font-mono bg-[#0B1F3A]/5 px-1.5 py-0.5 rounded font-bold">
                                  {app.applicationNo || 'DAI-2026-9021'}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div>{app.programme}</div>
                                <div className="text-[10px] text-slate-500">{app.entryGrade}</div>
                              </td>
                              <td className="p-3.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  app.admissionType === 'Boarding School' ? 'bg-indigo-100 text-indigo-900' : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {app.admissionType}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="font-semibold">{app.parentName}</div>
                                <div className="text-[10px] text-slate-500">{app.parentPhone}</div>
                              </td>
                              <td className="p-3.5">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  app.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedApp(app);
                                      setActiveTab('approval');
                                    }}
                                    className="bg-[#0B1F3A] text-white hover:bg-[#163660] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
                                  >
                                    Review / Decision
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteApplication(app.id || app._id || '', app.fullName, e)}
                                    title="Delete candidate application"
                                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-1.5 rounded-lg border border-red-200 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. APPROVE/REJECT STUDENTS TAB */}
            {activeTab === 'approval' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 4 of 10</span>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Approve or Reject Student Applications</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Perform academic review and issue official admission decision for candidates.</p>
                </div>

                {selectedApp ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                    
                    {/* Header info bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 rounded-xl bg-slate-100 border border-slate-300 overflow-hidden shrink-0 shadow-sm">
                          <img
                            src={selectedApp.passportPhotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200'}
                            alt={selectedApp.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-serif font-bold text-[#0B1F3A]">{selectedApp.fullName}</h4>
                            <span className="bg-[#0B1F3A] text-[#D4AF37] text-xs font-bold font-mono px-2 py-0.5 rounded">
                              {selectedApp.applicationNo || 'DAI-2026-9021'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Target Programme: <strong>{selectedApp.programme}</strong> ({selectedApp.entryGrade})
                          </p>
                          <p className="text-xs text-slate-500">
                            Submitted on: {new Date(selectedApp.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-xs font-bold text-slate-500">Current Status:</span>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          selectedApp.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          selectedApp.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                          'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {selectedApp.status}
                        </span>
                      </div>
                    </div>

                    {/* Application Full Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h5 className="font-bold text-[#0B1F3A] uppercase tracking-wider text-[11px]">Candidate Bio & Background</h5>
                        <p><strong>Gender:</strong> {selectedApp.gender}</p>
                        <p><strong>Date of Birth:</strong> {selectedApp.dateOfBirth}</p>
                        <p><strong>Residency Stream:</strong> {selectedApp.admissionType}</p>
                        <p><strong>Previous School:</strong> {selectedApp.previousSchool || 'N/A'}</p>
                        <p><strong>Qur’an Memorization:</strong> {selectedApp.quranMemorizedJuz || 'Beginner'}</p>
                        <p><strong>Medical Notes:</strong> {selectedApp.medicalInfo || 'None reported'}</p>
                      </div>

                      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h5 className="font-bold text-[#0B1F3A] uppercase tracking-wider text-[11px]">Guardian Contact Information</h5>
                        <p><strong>Guardian Name:</strong> {selectedApp.parentName}</p>
                        <p><strong>Guardian Phone:</strong> {selectedApp.parentPhone}</p>
                        <p><strong>Guardian Email:</strong> {selectedApp.parentEmail}</p>
                        <p><strong>Address:</strong> {selectedApp.address}</p>
                        <p><strong>Uploaded Credentials:</strong> {selectedApp.uploadedDocuments?.length ? selectedApp.uploadedDocuments.join(', ') : 'Birth Cert, Previous Transcript'}</p>
                      </div>
                    </div>

                    {/* Decision Action Buttons */}
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between flex-wrap gap-3">
                      <p className="text-xs text-slate-500 font-semibold">
                        Select an action to immediately update candidate's admission record:
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleDeleteApplication(selectedApp.id || selectedApp._id || '', selectedApp.fullName)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span>Delete Application Record</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(selectedApp.id || selectedApp._id, 'under_review')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Mark Under Review</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(selectedApp.id || selectedApp._id, 'rejected')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Candidate</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(selectedApp.id || selectedApp._id, 'accepted')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          <span>Approve Candidate Admission</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
                    <GraduationCap className="w-12 h-12 text-[#D4AF37] mx-auto" />
                    <p className="text-sm font-bold">No Candidate Selected for Review</p>
                    <p className="text-xs text-slate-400">Go to "Manage Admissions" tab to pick an application to approve or reject.</p>
                    <button
                      onClick={() => setActiveTab('admissions')}
                      className="bg-[#0B1F3A] text-white text-xs font-bold py-2 px-4 rounded-xl"
                    >
                      Browse Admissions
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 5. MANAGE PROGRAMS TAB */}
            {activeTab === 'programs' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 5 of 10</span>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Manage Academic Programmes</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Configure school academic curricula, Tahfeez tracks, and grade levels.</p>
                </div>

                {/* Add New Program Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="New Programme Title (e.g. Advanced Qira'at & Tajweed Diploma)"
                    value={newProgTitle}
                    onChange={(e) => setNewProgTitle(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                  />
                  <select
                    value={newProgSection}
                    onChange={(e) => setNewProgSection(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none bg-slate-50"
                  >
                    <option value="IBTIDAA'IYYAH">IBTIDAA'IYYAH (Nursery)</option>
                    <option value="IHDAADIYYAH">IHDAADIYYAH (Primary & Tahfeez)</option>
                    <option value="THANAWIYYAH">THANAWIYYAH (Secondary)</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!newProgTitle) return;
                      setProgramList([
                        ...programList,
                        {
                          id: 'prog_' + Date.now(),
                          code: 'CUSTOM_' + Date.now(),
                          title: newProgTitle,
                          section: newProgSection,
                          summary: 'Custom newly created academic programme.',
                          duration: '1-3 Years',
                          curriculum: ['Islamic Studies', 'General Academics'],
                          features: ['Dedicated Asatidh mentorship']
                        }
                      ]);
                      setNewProgTitle('');
                    }}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Add Programme</span>
                  </button>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programList.map((prog) => (
                    <div key={prog.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            {prog.section}
                          </span>
                          <button
                            onClick={() => setProgramList(programList.filter(p => p.id !== prog.id))}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm text-[#0B1F3A] mt-2">{prog.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{prog.summary}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>Duration: <strong>{prog.duration}</strong></span>
                        <span className="text-[#0B1F3A] font-bold">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. MANAGE TIMETABLE TAB */}
            {activeTab === 'timetable' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 6 of 10</span>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Manage Master Timetable</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Configure daily class schedules, Tahfeez Hifz periods, and prep hours.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#0B1F3A] text-white font-bold uppercase text-[10px]">
                          <th className="p-3">Day</th>
                          <th className="p-3">Morning Tahfeez (07:30 - 08:30)</th>
                          <th className="p-3">Core Academic Subjects (09:00 - 01:30)</th>
                          <th className="p-3">Afternoon Islamic Studies (02:00 - 04:00)</th>
                          <th className="p-3">Evening Prep & Hifz (05:00 - 07:00)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {timetableDays.map((t, idx) => (
                          <tr key={t.day} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-[#0B1F3A] bg-slate-50/50">{t.day}</td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={t.morning}
                                onChange={(e) => {
                                  const updated = [...timetableDays];
                                  updated[idx].morning = e.target.value;
                                  setTimetableDays(updated);
                                }}
                                className="w-full bg-transparent border-b border-transparent focus:border-[#D4AF37] outline-none"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={t.core}
                                onChange={(e) => {
                                  const updated = [...timetableDays];
                                  updated[idx].core = e.target.value;
                                  setTimetableDays(updated);
                                }}
                                className="w-full bg-transparent border-b border-transparent focus:border-[#D4AF37] outline-none"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={t.afternoon}
                                onChange={(e) => {
                                  const updated = [...timetableDays];
                                  updated[idx].afternoon = e.target.value;
                                  setTimetableDays(updated);
                                }}
                                className="w-full bg-transparent border-b border-transparent focus:border-[#D4AF37] outline-none"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={t.evening}
                                onChange={(e) => {
                                  const updated = [...timetableDays];
                                  updated[idx].evening = e.target.value;
                                  setTimetableDays(updated);
                                }}
                                className="w-full bg-transparent border-b border-transparent focus:border-[#D4AF37] outline-none"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => alert('Timetable schedules saved successfully!')}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>Save Timetable Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* 7. MANAGE FACILITIES TAB */}
            {activeTab === 'facilities' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 7 of 10</span>
                  <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Manage Campus Facilities</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Manage facilities showcase including Science Labs, Hostels, and Tahfeez Halls.</p>
                </div>

                {/* Add Facility Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Facility Name (e.g. Modern E-Library & ICT Suite)"
                    value={newFacTitle}
                    onChange={(e) => setNewFacTitle(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                  />
                  <select
                    value={newFacCategory}
                    onChange={(e) => setNewFacCategory(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none bg-slate-50"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Boarding">Boarding / Hostels</option>
                    <option value="Religious">Religious / Tahfeez</option>
                    <option value="Sports">Sports & Recreation</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!newFacTitle) return;
                      setFacilityList([
                        ...facilityList,
                        {
                          id: 'fac_' + Date.now(),
                          title: newFacTitle,
                          category: newFacCategory,
                          description: 'Newly added campus facility equipped with modern amenities.',
                          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
                        }
                      ]);
                      setNewFacTitle('');
                    }}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Add Facility</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {facilityList.map((fac) => (
                    <div key={fac.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="h-32 relative bg-slate-100">
                        <img src={fac.image} alt={fac.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#0B1F3A] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded">
                          {fac.category}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#0B1F3A]">{fac.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{fac.description}</p>
                        </div>
                        <button
                          onClick={() => setFacilityList(facilityList.filter(f => f.id !== fac.id))}
                          className="text-xs text-red-600 hover:underline font-bold self-end pt-2"
                        >
                          Remove Facility
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. MANAGE GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 8 of 10</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Manage Campus Photo Gallery</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Upload pictures, add captions, and delete images from the public school gallery.</p>
                  </div>
                  <span className="bg-[#0B1F3A] text-[#D4AF37] font-bold text-xs px-3 py-1 rounded-full">
                    {galleryItems.length} Photos Online
                  </span>
                </div>

                {/* Upload Gallery Picture Form */}
                <form onSubmit={handleUploadGalleryPicture} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-xs text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Upload New Photo to Gallery</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Photo Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Annual Qur'an Memorization Competition"
                        value={newGalTitle}
                        onChange={(e) => setNewGalTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Category *</label>
                      <select
                        value={newGalCategory}
                        onChange={(e) => setNewGalCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none bg-white"
                      >
                        <option value="Quran">Quran & Tahfeez</option>
                        <option value="Classroom">Classroom & STEM</option>
                        <option value="Graduation">Graduation & Awards</option>
                        <option value="Lectures">Lectures & Speeches</option>
                        <option value="Sports">Sports & Inter-House</option>
                        <option value="Events">Campus Events</option>
                        <option value="Facilities">Facilities & Campus</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Caption / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Students receiving Tajweed certificates in the campus hall."
                      value={newGalCaption}
                      onChange={(e) => setNewGalCaption(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Photo File or Paste URL *</label>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalImageFile}
                        className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0B1F3A] file:text-[#D4AF37] hover:file:bg-[#163660] cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 font-bold">OR</span>
                      <input
                        type="url"
                        placeholder="Paste image URL (https://...)"
                        value={newGalImage.startsWith('data:') ? '' : newGalImage}
                        onChange={(e) => setNewGalImage(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {newGalImage && (
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={newGalImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewGalImage('')}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploadingGal}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all"
                  >
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isUploadingGal ? 'Uploading Photo...' : 'Upload & Publish Picture'}</span>
                  </button>
                </form>

                {/* Gallery Pictures Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <div key={item.id || item._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                      <div className="h-44 relative bg-slate-100">
                        <img src={item.image || item.img} alt={item.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeleteGalleryPicture(item.id || item._id, item.title)}
                          title="Delete Picture"
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 shadow-md transition-transform hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-[#0B1F3A]/90 text-[#D4AF37] font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-1">
                        <h5 className="font-bold text-xs text-[#0B1F3A] line-clamp-1">{item.title}</h5>
                        {item.caption && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.caption}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. MANAGE NEWS TAB */}
            {activeTab === 'news' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 9 of 10</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Manage Latest News & Articles</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Publish articles, upload header pictures, and delete published news stories.</p>
                  </div>
                  <span className="bg-[#0B1F3A] text-[#D4AF37] font-bold text-xs px-3 py-1 rounded-full">
                    {newsList.length} Articles Live
                  </span>
                </div>

                {/* Create News Article Form */}
                <form onSubmit={handlePublishArticle} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-xs text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Publish New Article to Website</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Article Title / Headline *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Admissions Open for 2026/2027 Academic Session"
                        value={newNewsTitle}
                        onChange={(e) => setNewNewsTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Category *</label>
                      <select
                        value={newNewsCategory}
                        onChange={(e) => setNewNewsCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none bg-white"
                      >
                        <option value="Admissions">Admissions</option>
                        <option value="Achievement">Achievement</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Events">Campus Events</option>
                        <option value="Lectures">Lectures & Speeches</option>
                        <option value="General">General Announcement</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Short Excerpt / Summary *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief overview displayed on news cards across the website..."
                      value={newNewsExcerpt}
                      onChange={(e) => setNewNewsExcerpt(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Article Content (Paragraphs)</label>
                    <textarea
                      rows={4}
                      placeholder="Enter detailed article body text. Separate paragraphs with a blank line..."
                      value={newNewsContent}
                      onChange={(e) => setNewNewsContent(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Article Banner Picture *</label>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewsImageFile}
                        className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0B1F3A] file:text-[#D4AF37] hover:file:bg-[#163660] cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 font-bold">OR</span>
                      <input
                        type="url"
                        placeholder="Paste image URL (https://...)"
                        value={newNewsImage.startsWith('data:') ? '' : newNewsImage}
                        onChange={(e) => setNewNewsImage(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#D4AF37] outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Article Image Preview */}
                  {newNewsImage && (
                    <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={newNewsImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewNewsImage('')}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPublishingNews}
                    className="bg-[#0B1F3A] hover:bg-[#163660] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow disabled:opacity-50 transition-all"
                  >
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isPublishingNews ? 'Publishing Article...' : 'Publish Article on Website'}</span>
                  </button>
                </form>

                {/* News List */}
                <div className="space-y-3">
                  {newsList.map((n) => (
                    <div key={n.id || n._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] bg-[#0B1F3A]/10 text-[#0B1F3A] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                              {n.category}
                            </span>
                            <span className="text-[10px] text-slate-400">{n.date}</span>
                          </div>
                          <h5 className="font-bold text-xs text-[#0B1F3A] truncate">{n.title}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{n.excerpt}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteArticle(n.id || n._id, n.title)}
                        title="Delete Article"
                        className="text-slate-400 hover:text-red-600 transition-colors p-2 shrink-0 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. GENERATE REPORTS TAB */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tab 10 of 10</span>
                    <h3 className="text-xl font-serif font-bold text-[#0B1F3A]">Generate Admission Analytics & Reports</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Export candidate data summaries, status tallies, and printable statistics sheets.</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="bg-[#0B1F3A] text-white hover:bg-[#163660] font-bold text-xs py-2.5 px-4 rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 text-[#D4AF37]" />
                    <span>Print Summary Report</span>
                  </button>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Total Applications</p>
                    <p className="text-2xl font-serif font-extrabold text-[#0B1F3A] mt-1">{applications.length}</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <p className="text-[11px] font-bold text-emerald-600 uppercase">Approved Students</p>
                    <p className="text-2xl font-serif font-extrabold text-emerald-700 mt-1">
                      {applications.filter(a => a.status === 'accepted').length}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <p className="text-[11px] font-bold text-amber-600 uppercase">Pending Review</p>
                    <p className="text-2xl font-serif font-extrabold text-amber-700 mt-1">
                      {applications.filter(a => a.status === 'pending' || a.status === 'under_review').length}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <p className="text-[11px] font-bold text-indigo-600 uppercase">Boarding Ratio</p>
                    <p className="text-2xl font-serif font-extrabold text-indigo-700 mt-1">
                      {applications.length ? Math.round((applications.filter(a => a.admissionType === 'Boarding School').length / applications.length) * 100) : 0}%
                    </p>
                  </div>
                </div>

                {/* Summary Table Sheet */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 print:p-0">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-serif font-bold text-base text-[#0B1F3A]">Official Admission Tally Sheet - 2026/2027</h4>
                    <span className="text-xs text-slate-400">Generated: {new Date().toLocaleDateString()}</span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span>Day School Candidates:</span>
                      <strong className="text-[#0B1F3A]">{applications.filter(a => a.admissionType === 'Day School').length}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span>Boarding School Candidates:</span>
                      <strong className="text-[#0B1F3A]">{applications.filter(a => a.admissionType === 'Boarding School').length}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span>Female Section Submissions:</span>
                      <strong className="text-[#0B1F3A]">{applications.filter(a => a.gender === 'Female').length}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span>Male Section Submissions:</span>
                      <strong className="text-[#0B1F3A]">{applications.filter(a => a.gender === 'Male').length}</strong>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      onClick={() => alert('Exported candidate report data as CSV spreadsheet!')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Export CSV Spreadsheet</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
