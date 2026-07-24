import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProgrammesSection } from './components/ProgrammesSection';
import { AdmissionsSection } from './components/AdmissionsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FacilitiesSection } from './components/FacilitiesSection';
import { StudentLifeGallery } from './components/StudentLifeGallery';
import { StatsCounter } from './components/StatsCounter';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LatestNews } from './components/LatestNews';
import { CallToAction } from './components/CallToAction';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ApplicationModal } from './components/ApplicationModal';
import { DetailModal } from './components/DetailModal';
import { AuthModal } from './components/AuthModal';
import { UserPortalModal } from './components/UserPortalModal';
import { ApplicantDashboardModal, ApplicantTab } from './components/ApplicantDashboardModal';
import { AdminDashboardModal, AdminTab } from './components/AdminDashboardModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { AuthProvider } from './context/AuthContext';
import { AcademicProgramme } from './types';

function MainAppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplicantDashboardOpen, setIsApplicantDashboardOpen] = useState(false);
  const [applicantDashboardTab, setApplicantDashboardTab] = useState<ApplicantTab>('form');
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminDashboardTab, setAdminDashboardTab] = useState<AdminTab>('login');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  const handleOpenAdminDashboard = (tab: AdminTab = 'login') => {
    setAdminDashboardTab(tab);
    setIsAdminDashboardOpen(true);
  };
  const [selectedAdmissionType, setSelectedAdmissionType] = useState<'Day School' | 'Boarding School'>('Day School');
  const [selectedProgrammeCode, setSelectedProgrammeCode] = useState<string>('IHDAADIYYAH');
  const [selectedProgrammeDetail, setSelectedProgrammeDetail] = useState<AcademicProgramme | null>(null);

  // Active section observer on scroll
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const handleScroll = () => {
      const scrollY = window.scrollY;
      sections.forEach((sec) => {
        const sectionHeight = (sec as HTMLElement).offsetHeight;
        const sectionTop = (sec as HTMLElement).offsetTop - 120;
        const sectionId = sec.getAttribute('id') || '';

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenApplicantDashboard = (tab: ApplicantTab = 'form') => {
    setApplicantDashboardTab(tab);
    setIsApplicantDashboardOpen(true);
  };

  const handleOpenApplyModal = (type?: 'Day School' | 'Boarding School', programmeCode?: string) => {
    if (type) setSelectedAdmissionType(type);
    if (programmeCode) setSelectedProgrammeCode(programmeCode);
    handleOpenApplicantDashboard('form');
  };

  return (
    <div className="min-h-screen bg-white text-[#1E293B] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#0B1F3A]">
      
      {/* Sticky Header Navigation */}
      <Header
        onOpenApplyModal={(type) => handleOpenApplyModal(type)}
        onOpenAuthModal={() => handleOpenApplicantDashboard('login')}
        onOpenPortalModal={() => handleOpenApplicantDashboard('track')}
        onOpenApplicantDashboard={(tab) => handleOpenApplicantDashboard(tab)}
        activeSection={activeSection}
      />

      {/* Hero Banner */}
      <Hero
        onOpenApplyModal={() => handleOpenApplyModal()}
      />

      {/* About Section */}
      <AboutSection />

      {/* Academic Programmes */}
      <ProgrammesSection
        onSelectProgramme={(prog) => setSelectedProgrammeDetail(prog)}
        onOpenApplyModal={(code) => handleOpenApplyModal('Day School', code)}
      />

      {/* Admissions & Enrollment */}
      <AdmissionsSection
        onOpenApplyModal={(type) => handleOpenApplyModal(type)}
      />

      {/* Why Choose DARU L AN'WAR WAL IS'AD */}
      <WhyChooseUs />

      {/* Facilities Showcase */}
      <FacilitiesSection />

      {/* Student Life & Gallery */}
      <StudentLifeGallery />

      {/* Animated Counter Statistics */}
      <StatsCounter />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Latest News & Announcements */}
      <LatestNews />

      {/* Call To Action Banner */}
      <CallToAction
        onOpenApplyModal={() => handleOpenApplyModal()}
      />

      {/* Contact & FAQs */}
      <ContactSection />

      {/* Footer */}
      <Footer
        onOpenApplyModal={() => handleOpenApplyModal()}
        onOpenAdminDashboard={(tab) => handleOpenAdminDashboard(tab)}
      />

      {/* Interactive Application Portal Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        defaultAdmissionType={selectedAdmissionType}
        defaultProgrammeCode={selectedProgrammeCode}
      />

      {/* Programme Detail Modal */}
      <DetailModal
        programme={selectedProgrammeDetail}
        onClose={() => setSelectedProgrammeDetail(null)}
        onOpenApply={(code) => handleOpenApplyModal('Day School', code)}
      />

      {/* MongoDB Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Portal Modal */}
      <UserPortalModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        onOpenApply={() => handleOpenApplyModal()}
      />

      {/* Comprehensive Applicant Admission Dashboard Modal */}
      <ApplicantDashboardModal
        isOpen={isApplicantDashboardOpen}
        onClose={() => setIsApplicantDashboardOpen(false)}
        defaultTab={applicantDashboardTab}
      />

      {/* Comprehensive Administrator Control Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        defaultTab={adminDashboardTab}
      />

      {/* Floating WhatsApp Contact Widget */}
      <WhatsAppWidget />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}


