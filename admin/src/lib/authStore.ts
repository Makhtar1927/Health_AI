'use client';

import { create } from 'zustand';
import { supabase } from './supabase';

export interface UserSession {
  email: string;
  role: 'doctor' | 'nurse' | 'radiology' | 'pharmacist' | 'reception' | 'cashier' | 'patient' | 'admin_hospital' | 'admin_pharmacy' | 'superadmin';
  name: string;
  details: Record<string, any>;
}

export interface LocalUserRecord {
  email: string;
  passwordHash: string;
  role: UserSession['role'];
  name: string;
  suspended?: boolean;
  details: any;
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserSession['role']) => Promise<boolean>;
  register: (email: string, password: string, role: UserSession['role'], name: string, details: Record<string, any>) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
  clearError: () => void;
  
  // Administrative Operations (Centralized via Backend API)
  getUsersByRoles: (roles: UserSession['role'][]) => Promise<LocalUserRecord[]>;
  createStaffAccount: (email: string, passwordHash: string, role: UserSession['role'], name: string, details: Record<string, any>) => Promise<boolean>;
  toggleUserSuspension: (email: string) => Promise<boolean>;
  transferUserAffiliation: (email: string, newAffiliation: string) => Promise<boolean>;
  getFacilities: () => Promise<any[]>;
}

const isClient = typeof window !== 'undefined';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getLocalSession = (): UserSession | null => {
  if (!isClient) return null;
  try {
    const data = localStorage.getItem('sunu-sante-session');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading session from localStorage', e);
    return null;
  }
};

const saveLocalSession = (session: UserSession | null) => {
  if (!isClient) return;
  try {
    if (session) {
      localStorage.setItem('sunu-sante-session', JSON.stringify(session));
    } else {
      localStorage.removeItem('sunu-sante-session');
    }
  } catch (e) {
    console.error('Error saving session to localStorage', e);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: () => {
    const session = getLocalSession();
    if (session) {
      set({ user: session, isAuthenticated: true });
    }
  },

  login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Attempt Supabase login if client is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (!error && data?.user) {
            const name = data.user.user_metadata?.name || email.split('@')[0];
            const details = data.user.user_metadata?.details || {};
            const userRole = data.user.user_metadata?.role || role;
            const suspended = data.user.user_metadata?.suspended || false;

            if (suspended) {
              set({ error: 'Ce compte a été suspendu par un administrateur.', isLoading: false });
              return false;
            }

            if (userRole !== role) {
              set({ 
                error: `Ce compte n'est pas enregistré en tant que ${role}.`, 
                isLoading: false 
              });
              return false;
            }

            const session: UserSession = { email, role: userRole, name, details };
            saveLocalSession(session);
            set({ user: session, isAuthenticated: true, isLoading: false });
            return true;
          }
        } catch (supabaseErr) {
          console.warn('Supabase Auth failed, falling back to backend API', supabaseErr);
        }
      }

      // 2. Call Central Backend API
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || 'Erreur d\'authentification', isLoading: false });
        return false;
      }

      const session: UserSession = data.user;
      saveLocalSession(session);
      set({ user: session, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Une erreur de connexion au serveur est survenue.', isLoading: false });
      return false;
    }
  },

  register: async (email, password, role, name, details) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Attempt Supabase Auth Sign Up if configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const origin = typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : 'https://healthaiadmin-sn.vercel.app';
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${origin}/auth/confirmed`,
              data: {
                name,
                role,
                suspended: false,
                details
              }
            }
          });
          
          if (error) throw error;
        } catch (supabaseErr) {
          console.warn('Supabase Sign Up failed, falling back to backend database saving', supabaseErr);
        }
      }

      // 2. Call Central Backend API
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name, details })
      });

      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || 'Erreur lors de la création du compte.', isLoading: false });
        return false;
      }

      const session: UserSession = data.user;
      saveLocalSession(session);
      set({ user: session, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Erreur lors de la création du compte.', isLoading: false });
      return false;
    }
  },

  logout: () => {
    saveLocalSession(null);
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      supabase.auth.signOut().catch(console.error);
    }
    set({ user: null, isAuthenticated: false });
  },

  getUsersByRoles: async (roles) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/users?roles=${roles.join(',')}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.users || [];
    } catch (e) {
      console.error('Error fetching users by roles', e);
      return [];
    }
  },

  createStaffAccount: async (email, password, role, name, details) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/create-staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name, details })
      });
      return res.ok;
    } catch (e) {
      console.error('Error creating staff account', e);
      return false;
    }
  },

  toggleUserSuspension: async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/toggle-suspension`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return res.ok;
    } catch (e) {
      console.error('Error toggling user suspension', e);
      return false;
    }
  },

  transferUserAffiliation: async (email, newAffiliation) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newAffiliation })
      });
      return res.ok;
    } catch (e) {
      console.error('Error transferring user affiliation', e);
      return false;
    }
  },

  getFacilities: async () => {
    try {
      const res = await fetch(`${API_URL}/api/facilities`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.facilities || [];
    } catch (e) {
      console.error('Error fetching facilities', e);
      return [];
    }
  }
}));
