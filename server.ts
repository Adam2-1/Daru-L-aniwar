import express, { Request, Response, NextFunction } from "express";
import path from "path";
import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_dev_jwt_secret_change_in_production";
const MONGODB_URI = process.env.MONGODB_URI || "";

// ==========================================
// MongoDB Mongoose Schemas & Models
// ==========================================

// 1. User Schema
interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'applicant' | 'parent' | 'student' | 'admin';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['applicant', 'parent', 'student', 'admin'], default: 'applicant' },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// 2. Application Schema
interface IApplication extends Document {
  userId?: string;
  applicationNo: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  programme: string;
  admissionType: string;
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
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  submittedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  userId: { type: String, index: true },
  applicationNo: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  programme: { type: String, required: true },
  admissionType: { type: String, required: true },
  entryGrade: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, required: true, index: true },
  address: { type: String, required: true },
  previousSchool: { type: String },
  quranMemorizedJuz: { type: String },
  medicalInfo: { type: String },
  passportPhotoUrl: { type: String },
  uploadedDocuments: [{ type: String }],
  status: { type: String, enum: ['pending', 'under_review', 'accepted', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now, index: true }
});

const ApplicationModel = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

// 3. Contact Schema
interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'responded'], default: 'unread' },
  createdAt: { type: Date, default: Date.now, index: true }
});

const ContactModel = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

// 4. News / Article Schema
interface INewsArticle extends Document {
  title: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
  createdAt: Date;
}

const NewsArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, default: "Editorial Team" },
  readTime: { type: String, default: "3 min read" },
  image: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: [{ type: String }],
  createdAt: { type: Date, default: Date.now, index: true }
});

const NewsArticleModel = mongoose.models.NewsArticle || mongoose.model<INewsArticle>("NewsArticle", NewsArticleSchema);

// 5. Gallery Item Schema
interface IGalleryItem extends Document {
  title: string;
  category: string;
  image: string;
  caption: string;
  date: string;
  createdAt: Date;
}

const GalleryItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  caption: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

const GalleryItemModel = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

// Connection state tracking
let isMongoConnected = false;
let mongoErrorMessage = "";

// Default Seeds for Initial Database Provisioning
const DEFAULT_NEWS_SEED = [
  {
    title: "Admissions Open for 2026/2027 Academic Session",
    date: "July 15, 2026",
    category: "Admissions",
    author: "Registry Office",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
    excerpt: "Daru L An'war Wal Is'ad hereby invites applications from qualified candidates for admission into Ibtidaa'iyyah, Ihdaadiyyah, and Thanawiyyah sections.",
    content: [
      "We are delighted to announce that admission applications for the upcoming 2026/2027 academic session are now officially open for Day and Boarding options.",
      "Prospective candidates undergo entrance assessments evaluating Qur'anic reading readiness, English comprehension, and Mathematics aptitude.",
      "Early application is highly encouraged as hostel capacity for boarding students is limited."
    ]
  },
  {
    title: "Students Win 1st Place at National Quran & STEM Olympiad",
    date: "June 28, 2026",
    category: "Achievement",
    author: "Editorial Team",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800",
    excerpt: "Our Thanawiyyah representatives clinched the gold medal in both 30-Juz Tajweed recitation and Senior Mathematics Quiz competition.",
    content: [
      "Alhamdulillah! Our delegates represented the institution at the National Islamic & STEM Olympiad in Abuja, emerging overall champions.",
      "The Mudeer praised the dedicated teachers and parents for their continuous prayers and mentorship."
    ]
  },
  {
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

const DEFAULT_GALLERY_SEED = [
  {
    title: "Annual Qur'an Graduation Ceremony",
    category: "Graduation",
    image: "https://i.imgur.com/xqMmVj1.jpg",
    caption: "Students receiving their Tajweed Ijazah certificates before parents and scholars.",
    date: "June 2026"
  },
  {
    title: "Fajr Tahfeez Halaqah Circle",
    category: "Quran",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800",
    caption: "Early morning Qur'an recitation and revision in the serene campus mosque.",
    date: "May 2026"
  },
  {
    title: "Interactive Computer Coding Class",
    category: "Classroom",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    caption: "Secondary students learning modern web development and logic skills.",
    date: "April 2026"
  }
];

// Setup Mongoose Event Listeners
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  mongoErrorMessage = '';
  console.log("✅ Mongoose connected to MongoDB Atlas database 'darulanwar_db'");
});

mongoose.connection.on('error', (err) => {
  isMongoConnected = false;
  mongoErrorMessage = err?.message || 'MongoDB connection error';
  console.error("❌ Mongoose MongoDB connection error:", mongoErrorMessage);
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  mongoErrorMessage = 'MongoDB connection disconnected';
  console.warn("⚠️ Mongoose MongoDB connection disconnected");
});

// Initialize MongoDB Connection & Collections
async function ensureMongoConnected() {
  const currentState = mongoose.connection.readyState as number;
  if (currentState === 1) {
    isMongoConnected = true;
    mongoErrorMessage = "";
    return true;
  }

  if (currentState === 2) {
    let attempts = 0;
    while ((mongoose.connection.readyState as number) === 2 && attempts < 25) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      attempts++;
    }
    if ((mongoose.connection.readyState as number) === 1) {
      isMongoConnected = true;
      mongoErrorMessage = "";
      return true;
    }
  }

  const mongodbUri = process.env.MONGODB_URI || MONGODB_URI;
  if (!mongodbUri) {
    isMongoConnected = false;
    mongoErrorMessage = "MONGODB_URI environment variable is not configured in Vercel/environment settings.";
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongodbUri, {
      dbName: 'darulanwar_db',
      serverSelectionTimeoutMS: 8000,
    });
    isMongoConnected = true;
    mongoErrorMessage = "";
    console.log("✅ Successfully connected to MongoDB Database: darulanwar_db!");

    await initializeDatabase();
    return true;
  } catch (err: any) {
    isMongoConnected = false;
    mongoErrorMessage = err?.message || "Failed to connect to MongoDB instance.";
    console.error("❌ MongoDB connection failed:", mongoErrorMessage);
    return false;
  }
}

async function initializeDatabase() {
  try {
    // 1. Ensure admin user exists or create default admin user if database is clean
    const userCount = await (UserModel as any).countDocuments();
    if (userCount === 0) {
      const defaultAdminPasswordHash = await bcrypt.hash("Admin@12345", 10);
      await (UserModel as any).create({
        fullName: "System Administrator",
        email: "admin@darulanwar.edu.ng",
        passwordHash: defaultAdminPasswordHash,
        phone: "+2348000000000",
        role: "admin",
      });
      console.log("🌱 Provisioned default admin user in MongoDB: admin@darulanwar.edu.ng");
    }

    // 2. Ensure initial seed application if empty
    const appCount = await (ApplicationModel as any).countDocuments();
    if (appCount === 0) {
      await (ApplicationModel as any).create({
        applicationNo: "APP-2026-0001",
        fullName: "Muhammad Abdullah",
        dateOfBirth: "2012-05-15",
        gender: "Male",
        programme: "Senior Tahfiz & Arabic College",
        admissionType: "Boarding School",
        entryGrade: "JSS 1",
        parentName: "Ibrahim Abdullah",
        parentPhone: "+2348012345678",
        parentEmail: "parent@example.com",
        address: "1, Sheik Yusuf Olodan Street, off Shoremekun Str, Liasu Road, Idimu, Lagos, Nigeria",
        status: "under_review",
        submittedAt: new Date(),
      });
      console.log("🌱 Provisioned sample application in MongoDB.");
    }

    // 3. Ensure initial seed news articles if empty
    const newsCount = await (NewsArticleModel as any).countDocuments();
    if (newsCount === 0) {
      await (NewsArticleModel as any).insertMany(DEFAULT_NEWS_SEED);
      console.log("🌱 Provisioned default news articles in MongoDB.");
    }

    // 4. Ensure initial seed gallery items if empty
    const galleryCount = await (GalleryItemModel as any).countDocuments();
    if (galleryCount === 0) {
      await (GalleryItemModel as any).insertMany(DEFAULT_GALLERY_SEED);
      console.log("🌱 Provisioned default gallery items in MongoDB.");
    }
  } catch (err) {
    console.error("Error during MongoDB initialization/seeding:", err);
  }
}

// Trigger connection attempt on startup
ensureMongoConnected();

// JWT Helper
function generateToken(user: { id: string; email: string; fullName: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Authentication Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required", error: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token", error: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
}

function optionalAuthToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (!err && decoded) {
        req.user = decoded;
      }
      next();
    });
  } else {
    next();
  }
}

// Require Active MongoDB Connection Middleware
async function requireMongoDb(req: Request, res: Response, next: NextFunction) {
  const isOk = await ensureMongoConnected();
  if (!isOk) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable",
      error: `MongoDB connection is currently offline: ${mongoErrorMessage || "MONGODB_URI is not connected or reachable."}`
    });
  }
  next();
}

export const app = express();

// Enable CORS & Preflight OPTIONS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());
app.options(/(.*)/, cors());

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// 1. Database Status Endpoint
app.get(["/api/db-status", "/api/db-status/"], async (req, res) => {
  await ensureMongoConnected();
  let stats = null;
  if (isMongoConnected) {
    try {
      const usersCount = await (UserModel as any).countDocuments();
      const appsCount = await (ApplicationModel as any).countDocuments();
      const contactsCount = await (ContactModel as any).countDocuments();
      const newsCount = await (NewsArticleModel as any).countDocuments();
      const galleryCount = await (GalleryItemModel as any).countDocuments();
      stats = {
        databaseName: 'darulanwar_db',
        collections: {
          users: usersCount,
          applications: appsCount,
          contacts: contactsCount,
          news: newsCount,
          gallery: galleryCount,
        }
      };
    } catch (err: any) {
      console.error("Error fetching MongoDB stats:", err);
    }
  }

  res.json({
    connected: isMongoConnected,
    type: isMongoConnected ? "mongodb" : "offline",
    message: isMongoConnected
      ? "Connected to MongoDB Cluster ('darulanwar_db')"
      : (mongoErrorMessage || "MongoDB database is offline"),
    stats,
    mongoErrorMessage: isMongoConnected ? null : mongoErrorMessage
  });
});

  // 2. Auth: Register
  app.options(["/api/auth/register", "/api/auth/register/"], cors());
  app.get(["/api/auth/register", "/api/auth/register/"], (req, res) => {
    return res.status(400).json({ success: false, message: "Registration requires a POST request with account details." });
  });

  app.post(["/api/auth/register", "/api/auth/register/"], requireMongoDb, async (req, res) => {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      const fullName = body.fullName || body.name;
      const email = body.email;
      const password = body.password;
      const phone = body.phone;
      const role = body.role;

      if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: "Name, email, and password are required", error: "Missing required fields" });
      }

      if (String(password).length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long", error: "Password too short" });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const passwordHash = await bcrypt.hash(String(password), 10);

      const existingUser = await (UserModel as any).findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "An account with this email address already exists. Please log in instead.", error: "Email exists" });
      }

      const newUser = await UserModel.create({
        fullName,
        email: normalizedEmail,
        passwordHash,
        phone,
        role: role || 'applicant',
      });

      const token = generateToken({
        id: newUser._id.toString(),
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      });

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id.toString(),
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      });
    } catch (error: any) {
      console.error("Register Error:", error);
      res.status(500).json({ success: false, message: "Failed to register user in MongoDB", error: error.message });
    }
  });

  // 3. Auth: Login
  app.options(["/api/auth/login", "/api/auth/login/"], cors());
  app.get(["/api/auth/login", "/api/auth/login/"], (req, res) => {
    return res.status(400).json({ success: false, message: "Login requires a POST request with email and password." });
  });

  app.post(["/api/auth/login", "/api/auth/login/"], requireMongoDb, async (req, res) => {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      const email = body.email || body.username;
      const password = body.password;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required", error: "Missing fields" });
      }

      const normalizedEmail = String(email).toLowerCase().trim();

      const user = await (UserModel as any).findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, message: "No account found with this email address. Please register first.", error: "User not found" });
      }

      const isMatch = await bcrypt.compare(String(password), user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password. Please try again.", error: "Invalid password" });
      }

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Failed to log in", error: error.message });
    }
  });

  // 4. Auth: Get Current User Profile
  app.get(["/api/auth/me", "/api/auth/me/"], requireMongoDb, authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "Unauthenticated", error: "Unauthorized" });

      const user = await (UserModel as any).findById(req.user.id).select("-passwordHash");
      if (!user) return res.status(404).json({ success: false, message: "User profile not found in database", error: "User not found" });

      return res.json({
        success: true,
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Failed to fetch user profile", error: error.message });
    }
  });

  // 5. Applications: Submit Admission Application
  app.post(["/api/applications", "/api/applications/"], requireMongoDb, optionalAuthToken, async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body;

      if (!data.fullName || !data.parentName || !data.parentPhone || !data.parentEmail || !data.programme) {
        return res.status(400).json({ success: false, message: "Missing required application fields", error: "Incomplete application" });
      }

      const generatedAppNo = data.applicationNo || ("DAI-2026-" + Math.floor(1000 + Math.random() * 9000));

      const applicationDoc = {
        userId: req.user?.id || null,
        applicationNo: generatedAppNo,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        programme: data.programme,
        admissionType: data.admissionType,
        entryGrade: data.entryGrade,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        address: data.address,
        previousSchool: data.previousSchool || "",
        quranMemorizedJuz: data.quranMemorizedJuz || "",
        medicalInfo: data.medicalInfo || "",
        passportPhotoUrl: data.passportPhotoUrl || "",
        uploadedDocuments: data.uploadedDocuments || [],
        status: "pending",
        submittedAt: new Date(),
      };

      const savedApp = await ApplicationModel.create(applicationDoc);
      return res.status(201).json({
        success: true,
        message: "Application successfully recorded in MongoDB!",
        application: {
          ...savedApp.toObject(),
          id: savedApp._id.toString(),
        },
      });
    } catch (error: any) {
      console.error("Application Submit Error:", error);
      res.status(500).json({ success: false, message: "Failed to submit application to MongoDB", error: error.message });
    }
  });

  // 6. Applications: Get User Applications or All Applications
  app.get(["/api/applications", "/api/applications/"], requireMongoDb, optionalAuthToken, async (req: AuthRequest, res: Response) => {
    try {
      const emailQuery = req.query.email as string;

      let filter: any = {};
      if (req.user) {
        filter = { $or: [{ userId: req.user.id }, { parentEmail: req.user.email.toLowerCase() }] };
      } else if (emailQuery) {
        filter = { parentEmail: emailQuery.toLowerCase() };
      }

      const apps = await ApplicationModel.find(filter).sort({ submittedAt: -1 });
      return res.json(apps.map(app => ({
        ...app.toObject(),
        id: app._id.toString(),
      })));
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Failed to fetch applications from MongoDB", error: error.message });
    }
  });

  // 7. Contact Messages Endpoint
  app.post(["/api/contact", "/api/contact/"], requireMongoDb, async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Name, email, and message are required", error: "Missing fields" });
      }

      const contactDoc = await ContactModel.create({
        name,
        email,
        phone,
        subject: subject || "General Inquiry",
        message,
      });
      return res.status(201).json({ success: true, message: "Contact message saved to MongoDB", id: contactDoc._id.toString() });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Failed to send message to MongoDB", error: error.message });
    }
  });

  // 8. Admin Routes: Admin Authentication & Application Management
  app.get(["/api/admin/login", "/api/admin/login/"], (req: Request, res: Response) => {
    return res.status(400).json({ success: false, message: "Admin login requires a POST request with credentials." });
  });

  app.post(["/api/admin/login", "/api/admin/login/"], async (req: Request, res: Response) => {
    try {
      const { email, password, passcode } = req.body;
      const validAdminEmails = ["admin@darulanwar.edu.ng", "onilenlaolasunkanmi@gmail.com", "admin"];
      const validPasscodes = ["admin123", "DARUL_ADMIN_2026", "olanrewaju", "admin"];

      const isEmailValid = email && validAdminEmails.some(e => e.toLowerCase() === email.toLowerCase().trim());
      const isPassValid = (password && validPasscodes.includes(password.trim())) || (passcode && validPasscodes.includes(passcode.trim()));

      if ((isEmailValid || passcode) && isPassValid) {
        const token = jwt.sign(
          { id: "admin_super_user", email: email || "admin@darulanwar.edu.ng", role: "admin" },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.json({
          success: true,
          token,
          user: {
            id: "admin_super_user",
            fullName: "Principal / Grand Director Administrator",
            email: email || "admin@darulanwar.edu.ng",
            role: "admin"
          }
        });
      } else {
        return res.status(401).json({ success: false, message: "Invalid Admin Credentials or Passcode", error: "Unauthorized" });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, message: "Admin authentication failed", error: err.message });
    }
  });

  app.get(["/api/admin/applications", "/api/admin/applications/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const apps = await (ApplicationModel as any).find({}).sort({ submittedAt: -1 });
      return res.json(apps.map((app: any) => ({
        ...app.toObject(),
        id: app._id.toString(),
      })));
    } catch (err: any) {
      res.status(500).json({ success: false, message: "Failed to fetch all applications from MongoDB", error: err.message });
    }
  });

  app.patch(["/api/admin/applications/:id/status", "/api/admin/applications/:id/status/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'under_review', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value", error: "Invalid status" });
      }

      const updatedApp = await (ApplicationModel as any).findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updatedApp) return res.status(404).json({ success: false, message: "Application not found in MongoDB", error: "Not found" });

      return res.json({
        success: true,
        application: {
          ...updatedApp.toObject(),
          id: updatedApp._id.toString()
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: "Failed to update application status in MongoDB", error: err.message });
    }
  });

  app.delete(["/api/admin/applications/:id", "/api/admin/applications/:id/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deletedApp = await (ApplicationModel as any).findByIdAndDelete(id);
      if (!deletedApp) return res.status(404).json({ success: false, message: "Application not found in MongoDB", error: "Not found" });

      return res.json({
        success: true,
        message: "Application deleted successfully from MongoDB"
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: "Failed to delete application from MongoDB", error: err.message });
    }
  });

  // --- NEWS & ARTICLES ENDPOINTS ---
  app.get(["/api/news", "/api/news/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const articles = await (NewsArticleModel as any).find().sort({ createdAt: -1 });
      const formatted = articles.map((doc: any) => ({
        ...doc.toObject(),
        id: doc._id.toString()
      }));
      return res.json(formatted);
    } catch (err: any) {
      console.error("Error fetching news from MongoDB:", err);
      res.status(500).json({ success: false, message: "Failed to fetch news articles from MongoDB", error: err.message });
    }
  });

  app.post(["/api/news", "/api/news/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const { title, date, category, author, readTime, image, excerpt, content } = req.body;

      if (!title || !image || !excerpt) {
        return res.status(400).json({ success: false, message: "Title, image, and excerpt are required", error: "Missing required fields" });
      }

      const formattedContent = Array.isArray(content)
        ? content
        : typeof content === 'string'
        ? content.split('\n\n').filter((p: string) => p.trim().length > 0)
        : [excerpt];

      const newArticle = {
        title,
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: category || "Announcement",
        author: author || "Editorial Team",
        readTime: readTime || "3 min read",
        image,
        excerpt,
        content: formattedContent,
        createdAt: new Date()
      };

      const createdDoc = await (NewsArticleModel as any).create(newArticle);
      const savedArticle = {
        ...createdDoc.toObject(),
        id: createdDoc._id.toString()
      };
      return res.status(201).json(savedArticle);
    } catch (err: any) {
      console.error("Error creating news article in MongoDB:", err);
      res.status(500).json({ success: false, message: "Failed to publish news article to MongoDB", error: err.message });
    }
  });

  app.delete(["/api/news/:id", "/api/news/:id/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await (NewsArticleModel as any).findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "News article not found in MongoDB", error: "Not found" });
      }
      return res.json({ success: true, message: "Article deleted successfully from MongoDB" });
    } catch (err: any) {
      console.error("Error deleting news article from MongoDB:", err);
      res.status(500).json({ success: false, message: "Failed to delete article from MongoDB", error: err.message });
    }
  });

  // --- GALLERY PICTURES ENDPOINTS ---
  app.get(["/api/gallery", "/api/gallery/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const items = await (GalleryItemModel as any).find().sort({ createdAt: -1 });
      const formatted = items.map((doc: any) => ({
        ...doc.toObject(),
        id: doc._id.toString()
      }));
      return res.json(formatted);
    } catch (err: any) {
      console.error("Error fetching gallery items from MongoDB:", err);
      res.status(500).json({ success: false, message: "Failed to fetch gallery items from MongoDB", error: err.message });
    }
  });

  app.post(["/api/gallery", "/api/gallery/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const { title, category, image, caption, date } = req.body;

      if (!title || !image) {
        return res.status(400).json({ success: false, message: "Title and image are required", error: "Missing required fields" });
      }

      const newGalleryItem = {
        title,
        category: category || "General",
        image,
        caption: caption || title,
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: new Date()
      };

      const createdDoc = await (GalleryItemModel as any).create(newGalleryItem);
      const savedItem = {
        ...createdDoc.toObject(),
        id: createdDoc._id.toString()
      };
      return res.status(201).json(savedItem);
    } catch (err: any) {
      console.error("Error uploading gallery item to MongoDB:", err);
      res.status(500).json({ success: false, message: "Failed to upload gallery picture to MongoDB", error: err.message });
    }
  });

  app.delete(["/api/gallery/:id", "/api/gallery/:id/"], requireMongoDb, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await (GalleryItemModel as any).findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Gallery picture not found in MongoDB", error: "Not found" });
      }
      return res.json({ success: true, message: "Picture deleted successfully from MongoDB" });
    } catch (err: any) {
      console.error("Error deleting gallery picture from MongoDB:", err);
      res.status(500).json({ success: false, message: "Failed to delete picture from MongoDB", error: err.message });
    }
  });

  // Global Express JSON Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global express error:", err);
    if (res.headersSent) {
      return next(err);
    }
    const status = err.status || err.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: err.message || "An internal server error occurred.",
      error: err.name || "ServerError"
    });
  });

  // Explicit JSON 404 handler for unhandled /api or /api/* routes
  app.all(["/api", "/api/*"], (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API route ${req.method} ${req.path} not found`,
      error: "404 Not Found"
    });
  });

  async function startServer() {
    if (!process.env.VERCEL) {
      if (process.env.NODE_ENV !== "production") {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 DARU L AN'WAR Express & Vite server running on http://0.0.0.0:${PORT}`);
      });
    }
  }

  startServer();

  export default app;


