
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfigured } from '../supabase';
import { User } from '@supabase/supabase-js';

import prophoto from './prophoto.png';

interface UserProfile {
  uid: string;
  display_name: string;
  email: string;
  photo_url: string;
  role: 'teacher' | 'admin';
  specialization?: string;
  bio?: string;
  created_at: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  user: UserProfile | null;
  savedPlans: any[];
  communityPosts: any[];
  savePlan: (plan: any) => Promise<void>;
  addPost: (content: string, imageUrl?: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  isAuthReady: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) {
      setError('يرجى ضبط إعدادات Supabase (VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY) في الإعدادات لتتمكن من استخدام التطبيق.');
      setIsAuthReady(true);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setIsAuthReady(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsAuthReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!session);
  }, [session]);

  const fetchProfile = async (supabaseUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('uid', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const newProfile: UserProfile = {
          uid: supabaseUser.id,
          email: supabaseUser.email || '',
          display_name: 'عبد الرحمن نجاجرة',
          photo_url: prophoto,
          specialization: 'علم حاسوب',
          bio: 'خبير في بناء المواقع الإلكترونية وشغوف بنقل التقنية للأجيال القادمة.',
          role: 'teacher',
          created_at: new Date().toISOString()
        };
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);
        
        if (insertError) throw insertError;
        setUser(newProfile);
      } else if (error) {
        throw error;
      } else {
        setUser(data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setIsAuthReady(true);
    }
  };

  // Listen for community posts (Remote)
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setCommunityPosts(data);
      }
    };

    fetchPosts();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const login = async () => {
    setError(null);
    if (!isConfigured) {
      setError('يرجى ضبط إعدادات Supabase أولاً للتمكن من تسجيل الدخول.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(`حدث خطأ أثناء تسجيل الدخول: ${err.message}`);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    if (!isConfigured) {
      setError('يرجى ضبط إعدادات Supabase أولاً للتمكن من تسجيل الدخول.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Login Email Error:", err);
      setError(`حدث خطأ أثناء تسجيل الدخول: ${err.message}`);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!session?.user || !user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('uid', session.user.id);
      
      if (error) throw error;
      setUser({ ...user, ...data });
    } catch (error: any) {
      console.error("Update profile error:", error);
      setError(`خطأ في تحديث البيانات: ${error.message}`);
      throw error; // Re-throw to inform the UI
    }
  };

  const savePlan = async (plan: any) => {
    if (!session?.user || !user) return;
    const newPlan = { 
      ...plan, 
      author_id: session.user.id, 
      created_at: new Date().toISOString() 
    };
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .insert([newPlan]);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Save plan error:", error);
      setError(`خطأ أثناء حفظ الخطة: ${error.message}`);
    }
  };

  const addPost = async (content: string, imageUrl?: string) => {
    if (!session?.user || !user) return;
    const newPost = {
      author_uid: session.user.id,
      author_name: user.display_name,
      author_photo: user.photo_url,
      content,
      image_url: imageUrl || null,
      likes_count: 0,
      created_at: new Date().toISOString()
    };
    try {
      const { error } = await supabase
        .from('posts')
        .insert([newPost]);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Add post error:", error);
      setError(`خطأ أثناء إضافة المنشور: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, login, loginWithEmail, logout, user, savedPlans, communityPosts, savePlan, addPost, updateUserProfile, isAuthReady, error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
