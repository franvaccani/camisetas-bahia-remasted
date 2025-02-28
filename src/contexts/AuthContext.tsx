import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = 'admin@camisetasbahia.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simple authentication logic
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        const user = {
          id: '1',
          email: ADMIN_EMAIL,
          role: 'admin'
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setError('Credenciales inválidas. Por favor, verifique su email y contraseña.');
      }
    } catch (err) {
      console.error('Error during sign in:', err);
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('user');
    setLoading(false);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}