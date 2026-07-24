import { AcademicProgramme, Facility, GalleryItem, NewsArticle, Testimonial, FeaturePoint, FAQItem } from '../types';
import heroMosqueImg from '../assets/images/hero_islamic_mosque_1784759078607.jpg';
import campusFacadeImg from '../assets/images/school_campus_facade_1784759093491.jpg';
import quranClassImg from '../assets/images/quran_memorization_class_1784759104918.jpg';

export const INSTITUTION_INFO = {
  name: "DARU L AN'WAR WAL IS'AD",
  alias: "",
  arabicTitle: "دار الأنوار والإسعاد",
  motto: "Nurturing Future Leaders Through Islamic Knowledge, Academic Excellence, and Noble Character",
  foundedYear: 2001,
  logo: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=200",
  address: "1, Sheik Yusuf Olodan Street, off Shoremekun Str, Liasu Road, Idimu, Lagos, Nigeria",
  phonePrimary: "+234 812 491 1289",
  phoneSecondary: "+234 803 123 4567",
  email: "admissions@darulanwar.edu",
  infoEmail: "info@darulanwar.edu",
  workingHours: "Mon - Sat: 7:30 AM - 5:00 PM (Boarding 24/7)",
  socials: {
    facebook: "https://facebook.com/darulanwar",
    instagram: "https://instagram.com/darulanwar",
    youtube: "https://youtube.com/@darulanwar",
    whatsapp: "https://wa.me/2348124911289?text=Hello%20Daru%20L%20An%27war%20Wal%20Is%27ad%20Admissions%2C%20I%20would%20like%20to%20make%20an%20enquiry."
  }
};

export const HERO_DATA = {
  heroImage: heroMosqueImg,
  campusImage: campusFacadeImg,
  quranClassImage: quranClassImg,
};

export const VISION_MISSION_VALUES = {
  vision: "To be a global beacon of Islamic scholarship and academic brilliance, raising upright leaders grounded in Tajweed, Tahfeez, classical Arabic, modern science, and exemplary moral virtues.",
  mission: "To provide a serene, disciplined, and technologically enhanced learning environment that harmonizes authentic Islamic education with rigorous Western academic curricula, empowering every student to excel spiritually, intellectually, and socially.",
  coreValues: [
    { title: "Tawheed & Sunnah", desc: "Anchoring every aspect of learning and personal growth in pure Islamic monotheism and prophetic traditions." },
    { title: "Adab & Character (Al-Akhlaq)", desc: "Instilling humility, respect, honesty, and refined Islamic etiquette in daily conduct." },
    { title: "Academic Rigor", desc: "Cultivating critical thinking, scientific inquiry, and technological proficiency alongside sacred sciences." },
    { title: "Leadership & Service", desc: "Preparing students to contribute meaningfully as upright leaders and compassionate global citizens." }
  ],
  mudeerWelcome: {
    name: "Sheik Yusuf Olodan",
    role: "Proprietor & Mudeer (Director of Studies)",
    quote: "At Daru L An'war Wal Is'ad, we treat every child as a sacred trust (Amanah). Our integrated approach ensures that our students memorize the Glorious Qur'an with Tajweed while mastering Mathematics, Sciences, and Modern Technology.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  }
};

export const PROGRAMMES: AcademicProgramme[] = [
  {
    id: "ibti",
    code: "IBTIDAA'IYYAH",
    title: "IBTIDAA'IYYAH (Early Childhood & Foundation)",
    section: "Nursery & Kindergarten Section",
    ageGroup: "3 - 5 Years Old",
    duration: "3 Years",
    iconName: "Baby",
    summary: "Nurturing young minds through early Qur'anic recitation, foundational Arabic letters, English literacy, and playful numerical skills.",
    description: "The Ibtidaa'iyyah section provides a loving, safe, and sensory-rich environment where toddlers embark on their spiritual and academic journey. Early Qur'an ear-training, phonics, basic Duaa, and social habits are gently nurtured.",
    curriculumHighlights: [
      "Early Tahfeez (Juz 'Amma memorization)",
      "Arabic letter recognition & writing",
      "English Phonics & Early Reading",
      "Numeracy & Cognitive Development",
      "Islamic Manners & Daily Supplications"
    ],
    keySubjects: ["An-Nooraniah", "Short Surahs", "Arabic Alphabets", "English Literacy", "Elementary Math", "Art & Moral Craft"],
    scheduleType: "Day"
  },
  {
    id: "ihda",
    code: "IHDAADIYYAH",
    title: "IHDAADIYYAH (Primary Academic & Tahfeez)",
    section: "Primary School Section",
    ageGroup: "6 - 11 Years Old",
    duration: "6 Years",
    iconName: "BookOpen",
    summary: "Solidifying Qur'an Tahfeez with Tajweed rules alongside full primary STEM, English, Social Studies, and Arabic Grammar.",
    description: "In the Ihdaadiyyah phase, students master fluent Qur'anic recitation with precise Tajweed, memorize multiple Ajzaa, and build deep foundations in Arabic language alongside national primary education standards.",
    curriculumHighlights: [
      "Intensive Tahfeez Track (Up to 15 Juz)",
      "Rules of Tajweed (Tuhfat al-Atfal & Al-Jazariyyah)",
      "Classical Arabic Grammar (Nahw & Sarf)",
      "Primary Sciences, Computer Studies & ICT",
      "Mathematics & Quantitative Reasoning"
    ],
    keySubjects: ["Qur'an Tahfeez", "Tajweed Rules", "Hadith (Forty An-Nawawi)", "Fiqh al-Ibadat", "Mathematics", "Basic Science", "ICT Skills", "English Studies"],
    scheduleType: "Both"
  },
  {
    id: "than",
    code: "THANAWIYYAH",
    title: "THANAWIYYAH (Secondary & Advanced Scholarship)",
    section: "Secondary School Section",
    ageGroup: "12 - 17 Years Old",
    duration: "6 Years (Junior & Senior)",
    iconName: "GraduationCap",
    summary: "Advanced Islamic Jurisprudence, Complete Qur'an Completion (Ijazah), Senior Secondary STEM, Humanities, and University Entrance Prep.",
    description: "Thanawiyyah is designed to produce well-rounded scholars and professionals. Students complete the entire Qur'an memorization with Tajweed certification while mastering Physics, Chemistry, Biology, Advanced Math, and ICT.",
    curriculumHighlights: [
      "Full Qur'an Completion & Sanad/Ijazah Prep",
      "Tafseer, Usul al-Fiqh & Mustafa al-Hadith",
      "Senior STEM (Physics, Chem, Biology, Further Math)",
      "JAMB / WAEC / NECO / BECE University Prep",
      "Leadership, Public Speaking & Arabic Debates"
    ],
    keySubjects: ["Tafseer al-Qur'an", "Mustalah al-Hadith", "Usul al-Fiqh", "Balagha & Adab", "Physics", "Chemistry", "Biology", "Advanced ICT & Coding"],
    scheduleType: "Both"
  }
];

export const ADMISSION_TYPES = [
  {
    type: "Day School",
    badge: "Flexible Schedule",
    tagline: "High-Caliber Integrated Day Learning",
    description: "Ideal for local families seeking top-tier Islamic and Western education with convenient school bus transport and structured afternoon Madrasah sessions.",
    features: [
      "Integrated Morning & Afternoon Curriculum",
      "Qualified & Certified Islamic & Western Teachers",
      "Air-Conditioned Modern Classrooms & Smart Boards",
      "School Bus Shuttle Services Available",
      "Nutritious Afternoon Meals & Snack Options",
      "Structured Homework & Tahfeez Revision Clinics"
    ],
    bgGradient: "from-navy-900 to-navy-800",
    ctaText: "Apply for Day School"
  },
  {
    type: "Boarding School",
    badge: "Immersive Excellence",
    tagline: "24/7 Spiritual & Academic Residency",
    description: "A transformative boarding experience featuring round-the-clock Islamic atmosphere, Tahfeez circles after Fajr & Maghrib, sports, and dedicated night prep.",
    features: [
      "Safe, Secure & Climate-Controlled Hostels",
      "Fajr & Maghrib Tahfeez Halaqah Circles",
      "Balanced Halal Culinary Menu (3 Meals + Snacks)",
      "24/7 On-Call Medical & Nursing Staff",
      "Resident Islamic Mentors & House Masters",
      "Supervised Evening Academic Study Prep"
    ],
    bgGradient: "from-amber-600/20 to-gold-500/10",
    ctaText: "Apply for Boarding School"
  }
];

export const WHY_CHOOSE_US: FeaturePoint[] = [
  {
    id: "f1",
    title: "Qualified Islamic Scholars",
    description: "Learn directly from Ijazah-certified Huffaz and scholars trained in prominent Islamic institutions worldwide.",
    iconName: "Award",
    highlight: "Certified Teachers"
  },
  {
    id: "f2",
    title: "Experienced Academic Teachers",
    description: "Dedicated STEM and Humanities educators holding B.Ed, M.Sc, and PGDE qualifications with modern teaching methods.",
    iconName: "Users",
    highlight: "Expert Educators"
  },
  {
    id: "f3",
    title: "Modern Learning Environment",
    description: "Interactive smart screens, ergonomic furniture, well-ventilated classrooms, and serene campus greenery.",
    iconName: "Sparkles",
    highlight: "Smart Campus"
  },
  {
    id: "f4",
    title: "Computer & Robotics Lab",
    description: "Hands-on ICT education, coding, basic robotics, digital Islamic research tools, and safe internet browsing.",
    iconName: "Laptop",
    highlight: "Tech-Enabled"
  },
  {
    id: "f5",
    title: "Moral Discipline & Tarbiyah",
    description: "Structured mentorship focusing on Akhlaq, self-discipline, time management, and reverence for elders.",
    iconName: "ShieldCheck",
    highlight: "Nobility & Values"
  },
  {
    id: "f6",
    title: "Safe Boarding Facilities",
    description: "Gated security with CCTV monitoring, comfortable dormitories, outdoor recreational fields, and home-like care.",
    iconName: "Home",
    highlight: "24/7 Security"
  }
];

export const FACILITIES: Facility[] = [
  {
    id: "fac-mosque",
    title: "Central Campus Mosque",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800",
    description: "An elegant, air-conditioned central mosque serving as the spiritual heart of the campus for daily prayers, Friday Khutbah, Tahfeez halaqahs, and spiritual lectures.",
    features: ["Acoustic sound system", "Marble flooring", "Ablution (Wudu) areas", "Separate women's gallery"]
  },
  {
    id: "fac-classrooms",
    title: "Modern Smart Classrooms",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
    description: "Spacious, well-lit learning spaces equipped with digital interactive projectors, ergonomic seating, and individual storage for books and Qur'an rehal.",
    features: ["Digital projectors", "Ergonomic desks", "Climate control", "High-speed Wi-Fi"]
  },
  {
    id: "fac-library",
    title: "Islamic & Academic Library",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    description: "A comprehensive library housing thousands of Islamic reference texts, Hadith encyclopedias, Arabic literature, scientific journals, and quiet reading nooks.",
    features: ["10,000+ Book volumes", "Digital catalog system", "Study carrels", "Arabic research desk"]
  },
  {
    id: "fac-hostel",
    title: "Airy Boarding Hostels",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    description: "Clean, comfortable residential rooms with individual wardrobes, study desks, laundry facilities, and resident House Parents.",
    features: ["Single & bunk beds", "Personal lockers", "24/7 Power backup", "In-house laundry"]
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Annual Qur'an Graduation Ceremony",
    category: "Graduation",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    caption: "Students receiving their Tajweed Ijazah certificates before parents and scholars.",
    date: "June 2026"
  },
  {
    id: "gal-2",
    title: "Fajr Tahfeez Halaqah Circle",
    category: "Quran",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800",
    caption: "Early morning Qur'an recitation and revision in the serene campus mosque.",
    date: "May 2026"
  },
  {
    id: "gal-3",
    title: "Interactive Computer Coding Class",
    category: "Classroom",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    caption: "Secondary students learning modern web development and logic skills.",
    date: "April 2026"
  }
];

export const STATS_DATA = [
  { value: 1200, label: "Enrolled Students", suffix: "+", desc: "Day & Boarding Learners" },
  { value: 80, label: "Qualified Staff", suffix: "+", desc: "Scholars & STEM Educators" },
  { value: 25, label: "Years of Excellence", suffix: "+", desc: "Established Legacy" },
  { value: 100, label: "Islamic Ethos", suffix: "%", desc: "Sunnah-Based Character" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Alhaji Qomorudeen Onilenla",
    role: "Parent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    rating: 5,
    quote: "Enrolling my two sons in the Boarding Thanawiyyah programme is the best decision I ever made. At 14, my eldest son completed his Qur'an memorization with flawless Tajweed, while scoring top grades in his mock WAEC exams!",
    program: "Boarding Thanawiyyah Parent"
  }
];

export const LATEST_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "Admissions Open for 2026/2027 Academic Session",
    date: "July 15, 2026",
    category: "Admissions",
    author: "Registry Office",
    readTime: "3 min read",
    image: campusFacadeImg,
    excerpt: "Daru L An'war Wal Is'ad hereby invites applications from qualified candidates for admission into Ibtidaa'iyyah, Ihdaadiyyah, and Thanawiyyah sections.",
    content: [
      "We are delighted to announce that admission applications for the upcoming 2026/2027 academic session are now officially open for Day and Boarding options.",
      "Prospective candidates undergo entrance assessments evaluating Qur'anic reading readiness, English comprehension, and Mathematics aptitude.",
      "Early application is highly encouraged as hostel capacity for boarding students is limited."
    ]
  },
  {
    id: "news-2",
    title: "Students Win 1st Place at National Quran & STEM Olympiad",
    date: "June 28, 2026",
    category: "Achievement",
    author: "Editorial Team",
    readTime: "4 min read",
    image: quranClassImg,
    excerpt: "Our Thanawiyyah representatives clinched the gold medal in both 30-Juz Tajweed recitation and Senior Mathematics Quiz competition.",
    content: [
      "Alhamdulillah! Our delegates represented the institution at the National Islamic & STEM Olympiad in Abuja, emerging overall champions.",
      "The Mudeer praised the dedicated teachers and parents for their continuous prayers and mentorship."
    ]
  },
  {
    id: "news-3",
    title: "Commissioning of New High-Tech Science & Robotics Wing",
    date: "May 10, 2026",
    category: "Infrastructure",
    author: "Media Office",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    excerpt: "The new ultramodern facility expands hands-on artificial intelligence, coding, and physical chemistry research capacity for secondary students.",
    content: [
      "In our commitment to world-class STEM education, Daru L An'war Wal Is'ad officially commissioned a modern 3-floor science wing.",
      "The lab features automated safety hoods, digital microscopes, and 3D printing stations."
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "What does DARU L AN'WAR WAL IS'AD mean?",
    answer: "DARU L AN'WAR WAL IS'AD is an Arabic title meaning 'The Abode of Lights and Happiness'. It signifies our dedication to enlightening minds with sacred Islamic knowledge and guiding students toward spiritual and academic excellence.",
    category: "General"
  },
  {
    question: "How does the school balance Islamic Studies and Western Education?",
    answer: "Our curriculum is seamlessly integrated. Mornings are dedicated to intensive Qur'an Tahfeez, Tajweed, Arabic, and Islamic studies, while the rest of the school day covers Mathematics, Sciences, English, ICT, and Humanities in line with national educational standards.",
    category: "Academics"
  },
  {
    question: "What is the age requirement for Boarding Students?",
    answer: "Boarding facilities are available for students aged 8 years and above (Primary 3/4 upwards in Ihdaadiyyah and Thanawiyyah). Younger children in Ibtidaa'iyyah attend our Day section.",
    category: "Admissions"
  },
  {
    question: "Are there scholarship opportunities for outstanding Huffaz?",
    answer: "Yes! We offer full and partial merit-based scholarships for students who demonstrate exceptional Qur'anic memorization aptitude and high academic performance.",
    category: "Financial"
  }
];

export const PRAYER_TIMES_DATA = [
  { name: "Fajr", time: "05:15 AM", status: "Completed" },
  { name: "Dhuhr", time: "01:00 PM", status: "Upcoming" },
  { name: "Asr", time: "04:15 PM", status: "Upcoming" },
  { name: "Maghrib", time: "06:45 PM", status: "Upcoming" },
  { name: "Isha", time: "08:00 PM", status: "Upcoming" }
];
