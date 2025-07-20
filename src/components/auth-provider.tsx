'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  session: any;
  setSession: (session: any) => void;
  signIn: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);

  const signIn = async () => {
    try {
      // Redirect to backend auth endpoint
      window.location.href = `https://tweeti-backend.vercel.app/api/auth/github`;
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const signOut = () => {
    setSession(null);
    // Clear any stored auth data
    localStorage.removeItem('auth_session');
  };

  // Check for existing session on load
  useEffect(() => {
    const storedSession = localStorage.getItem('auth_session');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
