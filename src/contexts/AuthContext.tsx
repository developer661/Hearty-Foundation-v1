import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  location: string;
  bio: string;
  skills: string[];
  interests: string[];
  points: number;
  avatar_url?: string;
  user_type: 'volunteer' | 'care_facility_ngo' | 'business_partner';
  verification_status: 'not_verified' | 'in_verification' | 'partially_verified' | 'verified' | 'rejected';
  access_level: 'read_only' | 'full_access';
  org_role: 'org_admin' | 'opportunity_manager' | null;
  organization_id: string | null;
  category_interests: string[];
  username: string | null;
  platform_role: 'administrator' | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isPlatformAdmin: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data as UserProfile | null;
};

const resolveLoginEmail = async (identifier: string): Promise<string | null> => {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) return trimmed;

  const { data, error } = await supabase.rpc('resolve_login_email', { p_identifier: trimmed });
  if (error) {
    console.error('Error resolving username:', error);
    return null;
  }
  return typeof data === 'string' ? data : null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
      }
    }
  };

  useEffect(() => {
    let active = true;

    const applySession = (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession?.user) {
        setUserProfile(null);
        return;
      }
      const userId = nextSession.user.id;
      (async () => {
        const profile = await fetchUserProfile(userId);
        if (active) setUserProfile(profile);
      })();
    };

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    const email = await resolveLoginEmail(identifier);
    if (!email) {
      return { error: new Error('Invalid username/email or password.') };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: new Error('Invalid username/email or password.') };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setSession(null);
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    isPlatformAdmin: userProfile?.platform_role === 'administrator',
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
