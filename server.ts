import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_dev_jwt_secret_change_in_production";
const MONGODB_URI = process.env.MONGODB_URI || "";

// MongoDB Mongoose Schemas & Interfaces
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
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['applicant', 'parent', 'student', 'admin'], default: 'applicant' },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

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
  userId: { type: String },
  applicationNo: { type: String },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  programme: { type: String, required: true },
  admissionType: { type: String, required: true },
  entryGrade: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, required: true },
  address: { type: String, required: true },
  previousSchool: { type: String },
  quranMemorizedJuz: { type: String },
  medicalInfo: { type: String },
  passportPhotoUrl: { type: String },
  uploadedDocuments: [{ type: String }],
  status: { type: String, enum: ['pending', 'under_review', 'accepted', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

const ApplicationModel = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

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
  createdAt: { type: Date, default: Date.now }
});

const ContactModel = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

// News / Article Schema
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
  createdAt: { type: Date, default: Date.now }
});

const NewsArticleModel = mongoose.models.NewsArticle || mongoose.model<INewsArticle>("NewsArticle", NewsArticleSchema);

// Gallery Item Schema
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
  createdAt: { type: Date, default: Date.now }
});

const GalleryItemModel = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

// In-Memory Storage Fallback if MongoDB is not connected
let isMongoConnected = false;
let mongoErrorMessage = "";

const inMemoryUsers: any[] = [];
const inMemoryApplications: any[] = [];
const inMemoryContacts: any[] = [];

// Seed default news articles for fallback/seed
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
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
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

const inMemoryNews: any[] = DEFAULT_NEWS_SEED.map((item, idx) => ({ ...item, id: `news_seed_${idx + 1}` }));
const inMemoryGallery: any[] = DEFAULT_GALLERY_SEED.map((item, idx) => ({ ...item, id: `gal_seed_${idx + 1}` }));

// Initialize MongoDB Connection
async function connectToMongo() {
  if (!MONGODB_URI) {
    console.log("ℹ️ MONGODB_URI not set. Running with In-Memory Storage mode.");
    mongoErrorMessage = "MONGODB_URI environment variable is not configured. Using local session database.";
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      dbName: 'darulanwar_db',
      serverSelectionTimeoutMS: 8000,
    });
    isMongoConnected = true;
    console.log("✅ Successfully connected to MongoDB Database: darulanwar_db!");

    // Seed default admin & sample application if empty so collections & database appear in MongoDB Atlas UI immediately
    await initializeDatabase();
  } catch (err: any) {
    isMongoConnected = false;
    mongoErrorMessage = err?.message || "Failed to connect to MongoDB instance.";
    console.warn("⚠️ MongoDB connection warning:", mongoErrorMessage);
    console.log("ℹ️ Fallback: Running with In-Memory Storage mode.");
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
      console.log("🌱 Created default admin user in MongoDB Atlas: admin@darulanwar.edu.ng");
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
      console.log("🌱 Created sample application in MongoDB Atlas.");
    }

    // 3. Ensure initial seed news articles if empty
    const newsCount = await (NewsArticleModel as any).countDocuments();
    if (newsCount === 0) {
      await (NewsArticleModel as any).insertMany(DEFAULT_NEWS_SEED);
      console.log("🌱 Seeded default news articles in MongoDB Atlas.");
    }

    // 4. Ensure initial seed gallery items if empty
    const galleryCount = await (GalleryItemModel as any).countDocuments();
    if (galleryCount === 0) {
      await (GalleryItemModel as any).insertMany(DEFAULT_GALLERY_SEED);
      console.log("🌱 Seeded default gallery items in MongoDB Atlas.");
    }
  } catch (err) {
    console.error("Error during DB initialization/seeding:", err);
  }
}

connectToMongo();

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
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // 1. Database Status Endpoint
  app.get("/api/db-status", async (req, res) => {
    let stats = null;
    if (isMongoConnected) {
      try {
        const usersCount = await (UserModel as any).countDocuments();
        const appsCount = await (ApplicationModel as any).countDocuments();
        const contactsCount = await (ContactModel as any).countDocuments();
        stats = {
          databaseName: 'darulanwar_db',
          collections: {
            users: usersCount,
            applications: appsCount,
            contacts: contactsCount,
          }
        };
      } catch (err: any) {
        console.error("Error fetching stats:", err);
      }
    }

    res.json({
      connected: isMongoConnected,
      type: isMongoConnected ? "mongodb" : "memory",
      message: isMongoConnected
        ? "Connected to MongoDB Cluster ('darulanwar_db')"
        : (mongoErrorMessage || "Operating in local memory mode"),
      stats,
      mongoErrorMessage: isMongoConnected ? null : mongoErrorMessage
    });
  });

  // 2. Auth: Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { fullName, email, password, phone, role } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const passwordHash = await bcrypt.hash(password, 10);

      if (isMongoConnected) {
        const existingUser = await (UserModel as any).findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({ error: "An account with this email already exists" });
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
      } else {
        // In-Memory Fallback
        const existingUser = inMemoryUsers.find(u => u.email === normalizedEmail);
        if (existingUser) {
          return res.status(400).json({ error: "An account with this email already exists" });
        }

        const id = "mem_usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
        const newUser = {
          id,
          _id: id,
          fullName,
          email: normalizedEmail,
          passwordHash,
          phone,
          role: role || 'applicant',
          createdAt: new Date(),
        };

        inMemoryUsers.push(newUser);

        const token = generateToken({
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        });

        return res.status(201).json({
          token,
          user: {
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            createdAt: newUser.createdAt,
          },
        });
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      res.status(500).json({ error: error.message || "Failed to register user" });
    }
  });

  // 3. Auth: Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (isMongoConnected) {
        const user = await (UserModel as any).findOne({ email: normalizedEmail });
        if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken({
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        });

        return res.json({
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
      } else {
        // In-Memory Fallback
        const user = inMemoryUsers.find(u => u.email === normalizedEmail);
        if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        });

        return res.json({
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
          },
        });
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      res.status(500).json({ error: error.message || "Failed to log in" });
    }
  });

  // 4. Auth: Get Current User Profile
  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthenticated" });

      if (isMongoConnected) {
        const user = await (UserModel as any).findById(req.user.id).select("-passwordHash");
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json({
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
        });
      } else {
        const user = inMemoryUsers.find(u => u.id === req.user?.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // 5. Applications: Submit Admission Application
  app.post("/api/applications", optionalAuthToken, async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body;

      if (!data.fullName || !data.parentName || !data.parentPhone || !data.parentEmail || !data.programme) {
        return res.status(400).json({ error: "Missing required application fields" });
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

      if (isMongoConnected) {
        const savedApp = await ApplicationModel.create(applicationDoc);
        return res.status(201).json({
          success: true,
          message: "Application successfully recorded in MongoDB!",
          application: {
            ...savedApp.toObject(),
            id: savedApp._id.toString(),
          },
        });
      } else {
        const id = "app_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
        const savedApp = {
          ...applicationDoc,
          _id: id,
          id: id,
        };
        inMemoryApplications.push(savedApp);

        return res.status(201).json({
          success: true,
          message: "Application recorded in database session!",
          application: savedApp,
        });
      }
    } catch (error: any) {
      console.error("Application Submit Error:", error);
      res.status(500).json({ error: error.message || "Failed to submit application" });
    }
  });

  // 6. Applications: Get User Applications or All Applications
  app.get("/api/applications", optionalAuthToken, async (req: AuthRequest, res: Response) => {
    try {
      const emailQuery = req.query.email as string;

      if (isMongoConnected) {
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
      } else {
        let apps = inMemoryApplications;
        if (req.user) {
          apps = inMemoryApplications.filter(a => a.userId === req.user?.id || a.parentEmail.toLowerCase() === req.user?.email.toLowerCase());
        } else if (emailQuery) {
          apps = inMemoryApplications.filter(a => a.parentEmail.toLowerCase() === emailQuery.toLowerCase());
        }
        return res.json(apps);
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // 7. Contact Messages Endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }

      if (isMongoConnected) {
        const contactDoc = await ContactModel.create({
          name,
          email,
          phone,
          subject: subject || "General Inquiry",
          message,
        });
        return res.status(201).json({ success: true, id: contactDoc._id.toString() });
      } else {
        const id = "cnt_" + Date.now();
        inMemoryContacts.push({ id, name, email, phone, subject, message, createdAt: new Date() });
        return res.status(201).json({ success: true, id });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // 8. Admin Routes: Admin Authentication & Application Management
  app.post("/api/admin/login", async (req: Request, res: Response) => {
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
        return res.status(401).json({ error: "Invalid Admin Credentials or Passcode" });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Admin authentication failed" });
    }
  });

  app.get("/api/admin/applications", async (req: Request, res: Response) => {
    try {
      if (isMongoConnected) {
        const apps = await (ApplicationModel as any).find({}).sort({ submittedAt: -1 });
        return res.json(apps.map((app: any) => ({
          ...app.toObject(),
          id: app._id.toString(),
        })));
      } else {
        return res.json(inMemoryApplications);
      }
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch all applications for admin" });
    }
  });

  app.patch("/api/admin/applications/:id/status", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'under_review', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      if (isMongoConnected) {
        const updatedApp = await (ApplicationModel as any).findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        if (!updatedApp) return res.status(404).json({ error: "Application not found" });

        return res.json({
          success: true,
          application: {
            ...updatedApp.toObject(),
            id: updatedApp._id.toString()
          }
        });
      } else {
        const appIndex = inMemoryApplications.findIndex(a => a.id === id || a._id === id);
        if (appIndex === -1) return res.status(404).json({ error: "Application not found" });

        inMemoryApplications[appIndex].status = status;
        return res.json({
          success: true,
          application: inMemoryApplications[appIndex]
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  app.delete("/api/admin/applications/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isMongoConnected) {
        const deletedApp = await (ApplicationModel as any).findByIdAndDelete(id);
        if (!deletedApp) return res.status(404).json({ error: "Application not found" });

        return res.json({
          success: true,
          message: "Application deleted successfully from database"
        });
      } else {
        const appIndex = inMemoryApplications.findIndex(a => a.id === id || a._id === id);
        if (appIndex === -1) return res.status(404).json({ error: "Application not found" });

        inMemoryApplications.splice(appIndex, 1);
        return res.json({
          success: true,
          message: "Application deleted successfully"
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // --- NEWS & ARTICLES ENDPOINTS ---
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      if (isMongoConnected) {
        const articles = await (NewsArticleModel as any).find().sort({ createdAt: -1 });
        const formatted = articles.map((doc: any) => ({
          ...doc.toObject(),
          id: doc._id.toString()
        }));
        return res.json(formatted);
      } else {
        return res.json(inMemoryNews);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      res.status(500).json({ error: "Failed to fetch news articles" });
    }
  });

  app.post("/api/news", async (req: Request, res: Response) => {
    try {
      const { title, date, category, author, readTime, image, excerpt, content } = req.body;

      if (!title || !image || !excerpt) {
        return res.status(400).json({ error: "Title, image, and excerpt are required" });
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

      if (isMongoConnected) {
        const createdDoc = await (NewsArticleModel as any).create(newArticle);
        const savedArticle = {
          ...createdDoc.toObject(),
          id: createdDoc._id.toString()
        };
        return res.status(201).json(savedArticle);
      } else {
        const memoryArticle = {
          ...newArticle,
          id: `news_${Date.now()}`
        };
        inMemoryNews.unshift(memoryArticle);
        return res.status(201).json(memoryArticle);
      }
    } catch (err) {
      console.error("Error creating news article:", err);
      res.status(500).json({ error: "Failed to publish news article" });
    }
  });

  app.delete("/api/news/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isMongoConnected) {
        const deleted = await (NewsArticleModel as any).findByIdAndDelete(id);
        if (!deleted) {
          // Check if it's a seed or memory string
          const idx = inMemoryNews.findIndex(n => n.id === id);
          if (idx !== -1) inMemoryNews.splice(idx, 1);
        }
        return res.json({ success: true, message: "Article deleted successfully" });
      } else {
        const idx = inMemoryNews.findIndex(n => n.id === id || n._id === id);
        if (idx !== -1) {
          inMemoryNews.splice(idx, 1);
        }
        return res.json({ success: true, message: "Article deleted successfully" });
      }
    } catch (err) {
      console.error("Error deleting news article:", err);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // --- GALLERY PICTURES ENDPOINTS ---
  app.get("/api/gallery", async (req: Request, res: Response) => {
    try {
      if (isMongoConnected) {
        const items = await (GalleryItemModel as any).find().sort({ createdAt: -1 });
        const formatted = items.map((doc: any) => ({
          ...doc.toObject(),
          id: doc._id.toString()
        }));
        return res.json(formatted);
      } else {
        return res.json(inMemoryGallery);
      }
    } catch (err) {
      console.error("Error fetching gallery items:", err);
      res.status(500).json({ error: "Failed to fetch gallery items" });
    }
  });

  app.post("/api/gallery", async (req: Request, res: Response) => {
    try {
      const { title, category, image, caption, date } = req.body;

      if (!title || !image) {
        return res.status(400).json({ error: "Title and image are required" });
      }

      const newGalleryItem = {
        title,
        category: category || "General",
        image,
        caption: caption || title,
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: new Date()
      };

      if (isMongoConnected) {
        const createdDoc = await (GalleryItemModel as any).create(newGalleryItem);
        const savedItem = {
          ...createdDoc.toObject(),
          id: createdDoc._id.toString()
        };
        return res.status(201).json(savedItem);
      } else {
        const memoryItem = {
          ...newGalleryItem,
          id: `gal_${Date.now()}`
        };
        inMemoryGallery.unshift(memoryItem);
        return res.status(201).json(memoryItem);
      }
    } catch (err) {
      console.error("Error uploading gallery item:", err);
      res.status(500).json({ error: "Failed to upload gallery picture" });
    }
  });

  app.delete("/api/gallery/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isMongoConnected) {
        const deleted = await (GalleryItemModel as any).findByIdAndDelete(id);
        if (!deleted) {
          const idx = inMemoryGallery.findIndex(g => g.id === id);
          if (idx !== -1) inMemoryGallery.splice(idx, 1);
        }
        return res.json({ success: true, message: "Picture deleted successfully" });
      } else {
        const idx = inMemoryGallery.findIndex(g => g.id === id || g._id === id);
        if (idx !== -1) {
          inMemoryGallery.splice(idx, 1);
        }
        return res.json({ success: true, message: "Picture deleted successfully" });
      }
    } catch (err) {
      console.error("Error deleting gallery picture:", err);
      res.status(500).json({ error: "Failed to delete picture" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
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

startServer();
