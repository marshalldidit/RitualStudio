import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRow } from '@/types/database';

type AuthContextValue = {
  session: Session | null;
  userProfile: UserRow | null;
  isLoading: boolean;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Map Supabase auth error messages to user-friendly strings.
 * Avoids leaking internal details while remaining helpful.
 */
function mapAuthError(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }
  if (msg.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (msg.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (msg.includes('rate limit') || msg.includes('after') && msg.includes('seconds')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[AuthProvider] Failed to fetch user profile:', error.message);
      setProfileError(error.message);
      setUserProfile(null);
      return;
    }

    setProfileError(null);
    setUserProfile(data as UserRow);
  }, []);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session: s }, error }) => {
        if (error) {
          console.error('[AuthProvider] Session hydration error:', error.message);
        }
        setSession(s);
        if (s?.user) {
          return fetchUserProfile(s.user.id);
        }
      })
      .catch((err) => {
        console.error('[AuthProvider] Unexpected session error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      console.log('[AuthProvider] Auth state change:', event);
      setSession(s);
      if (s?.user) {
        fetchUserProfile(s.user.id);
      } else {
        setUserProfile(null);
        setProfileError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error('[AuthProvider] Sign-in error:', error.message);
          return { error: mapAuthError(error.message) };
        }
        return { error: null };
      } catch (err) {
        console.error('[AuthProvider] Sign-in unexpected error:', err);
        return { error: 'Network error. Please check your connection and try again.' };
      }
    },
    [],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      try {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          console.error('[AuthProvider] Sign-up error:', error.message);
          return { error: mapAuthError(error.message) };
        }
        return { error: null };
      } catch (err) {
        console.error('[AuthProvider] Sign-up unexpected error:', err);
        return { error: 'Network error. Please check your connection and try again.' };
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthProvider] Sign-out error:', error.message);
    }
    // onAuthStateChange listener will clear session and profile
  }, []);

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
          console.error('[AuthProvider] Reset password error:', error.message);
          return { error: mapAuthError(error.message) };
        }
        return { error: null };
      } catch (err) {
        console.error('[AuthProvider] Reset password unexpected error:', err);
        return { error: 'Network error. Please check your connection and try again.' };
      }
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await fetchUserProfile(session.user.id);
    }
  }, [session, fetchUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        session,
        userProfile,
        isLoading,
        profileError,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
