import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DatabaseStatus, StoredApplication } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  dbStatus: DatabaseStatus | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string, phone?: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  myApplications: StoredApplication[];
  fetchMyApplications: () => Promise<void>;
  checkDbStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('darulanwar_token'));
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [myApplications, setMyApplications] = useState<StoredApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check DB Status
  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.warn("DB status check error:", err);
    }
  };

  // Fetch Current User from JWT Token
  const fetchCurrentUser = async (authToken: string) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Token expired or invalid
        try {
          localStorage.removeItem('darulanwar_token');
        } catch (e) {
          console.warn('LocalStorage error:', e);
        }
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth me check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Applications
  const fetchMyApplications = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/applications', { headers });
      if (res.ok) {
        const apps = await res.json();
        setMyApplications(apps);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
    }
  };

  useEffect(() => {
    checkDbStatus();
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user || token) {
      fetchMyApplications();
    }
  }, [user, token]);

  const parseResponse = async (res: Response, defaultErrMsg: string) => {
    try {
      const text = await res.text();
      if (!text || !text.trim()) {
        if (res.status === 401) return { success: false, error: 'Invalid email or password' };
        if (res.status === 400) return { success: false, error: 'Please check your information and try again.' };
        return { success: false, error: `${defaultErrMsg}. Please try again.` };
      }
      try {
        const json = JSON.parse(text);
        if (!res.ok) {
          return { success: false, error: json.error || defaultErrMsg };
        }
        return { success: true, ...json };
      } catch {
        if (res.status === 401) return { success: false, error: 'Invalid email or password' };
        return { success: false, error: `${defaultErrMsg}. Please try again.` };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network connection failed. Please check your internet.' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      if (!cleanEmail || !cleanPassword) {
        return { success: false, error: 'Please enter your email and password.' };
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      const parsed = await parseResponse(res, 'Invalid email or password');

      if (!parsed.success) {
        return { success: false, error: parsed.error };
      }

      setToken(parsed.token);
      setUser(parsed.user);
      try {
        localStorage.setItem('darulanwar_token', parsed.token);
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      await fetchMyApplications();

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Server network error' };
    }
  };

  const register = async (fullName: string, email: string, password: string, phone?: string, role?: string) => {
    try {
      const cleanName = (fullName || '').trim();
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();
      const cleanPhone = (phone || '').trim();

      if (!cleanName || !cleanEmail || !cleanPassword) {
        return { success: false, error: 'Full name, email, and password are required.' };
      }

      if (cleanPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: cleanName, email: cleanEmail, password: cleanPassword, phone: cleanPhone, role: role || 'parent' })
      });

      const parsed = await parseResponse(res, 'Registration failed');

      if (!parsed.success) {
        return { success: false, error: parsed.error };
      }

      setToken(parsed.token);
      setUser(parsed.user);
      try {
        localStorage.setItem('darulanwar_token', parsed.token);
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      await fetchMyApplications();

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Server network error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMyApplications([]);
    try {
      localStorage.removeItem('darulanwar_token');
    } catch (e) {
      console.warn('LocalStorage remove failed:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        dbStatus,
        isLoading,
        login,
        register,
        logout,
        myApplications,
        fetchMyApplications,
        checkDbStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
