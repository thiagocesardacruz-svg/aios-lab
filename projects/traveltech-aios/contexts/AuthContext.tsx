import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isDemoMode } from '../lib/supabase';

// Demo user for development without Supabase
const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@traveltech.digital',
  app_metadata: {},
  user_metadata: { name: 'Demo User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

type Language = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ar';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  enableDemoMode: () => void;
  updateUserLanguage: (language: Language) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoModeEnabled, setDemoModeEnabled] = useState(isDemoMode);

  useEffect(() => {
    // If in demo mode, set demo user immediately
    if (demoModeEnabled) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create user record on signup
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureUserRecord(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [demoModeEnabled]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (demoModeEnabled) {
      setUser(DEMO_USER);
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  }, [demoModeEnabled]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (demoModeEnabled) {
      setUser(DEMO_USER);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  }, [demoModeEnabled]);

  const signOut = useCallback(async () => {
    if (demoModeEnabled) {
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
  }, [demoModeEnabled]);

  const enableDemoMode = useCallback(() => {
    setDemoModeEnabled(true);
    setUser(DEMO_USER);
    setLoading(false);
  }, []);

  const updateUserLanguage = useCallback(async (language: Language) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Demo mode - just update local state
    if (demoModeEnabled) {
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ language })
        .eq('id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [user, demoModeEnabled]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isDemoMode: demoModeEnabled,
      signUp,
      signIn,
      signOut,
      enableDemoMode,
      updateUserLanguage,
    }}>
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

async function ensureUserRecord(user: User) {
  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
      }, { onConflict: 'id' });

    if (error) console.error('Error creating user record:', error);
  } catch (err) {
    console.error('Error ensuring user record:', err);
  }
}
