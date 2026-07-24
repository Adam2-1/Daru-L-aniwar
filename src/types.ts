export interface AcademicProgramme {
  id: string;
  code: string;
  title: string;
  section: string;
  ageGroup: string;
  duration: string;
  iconName: string;
  summary: string;
  description: string;
  curriculumHighlights: string[];
  keySubjects: string[];
  scheduleType: 'Day' | 'Boarding' | 'Both';
}

export interface Facility {
  id: string;
  title: string;
  category: 'Spiritual' | 'Academic' | 'Residential' | 'Recreational' | 'Admin';
  image: string;
  description: string;
  features: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Quran' | 'Classroom' | 'Graduation' | 'Lectures' | 'Sports' | 'Events';
  image: string;
  caption: string;
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Parent' | 'Alumnus' | 'Student' | 'Community Leader';
  avatar: string;
  rating: number;
  quote: string;
  program: string;
}

export interface FeaturePoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlight: string;
}

export interface AdmissionApplicationData {
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  programme: string;
  admissionType: 'Day School' | 'Boarding School';
  entryGrade: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  previousSchool?: string;
  quranMemorizedJuz?: string;
  medicalInfo?: string;
  passportPhotoUrl?: string;
  uploadedDocuments?: string[];
  applicationNo?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'applicant' | 'parent' | 'student' | 'admin';
  createdAt?: string;
}

export interface StoredApplication extends AdmissionApplicationData {
  _id: string;
  id: string;
  userId?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  submittedAt: string;
  applicationNo: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface DatabaseStatus {
  connected: boolean;
  type: 'mongodb' | 'memory';
  message: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category: string;
}
