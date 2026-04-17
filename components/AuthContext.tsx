
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider, OperationType, handleFirestoreError, serverTimestamp } from '../firebase';
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, orderBy, addDoc, updateDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'teacher' | 'admin';
  specialization?: string;
  bio?: string;
  createdAt: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => Promise<void>;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'معلم مبدع',
              photoURL: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
              role: 'teacher',
              createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          } else {
            setUser(userDoc.data() as UserProfile);
          }
        } catch (err) {
          console.error("User profile fetch error:", err);
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setSavedPlans([]);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Listen for community posts (Remote)
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setCommunityPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Posts snapshot error:", err);
      handleFirestoreError(err, OperationType.GET, 'posts');
    });
  }, []);

  const login = async () => {
    setError(null);
    try {
      if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        throw new Error("Firebase API Key is missing. Please check your environment variables in settings.");
      }
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login Error:", err);
      let message = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      if (err.code === "auth/popup-blocked") {
        message = "تم حظر النافذة المنبثقة. يرجى السماح بالمنبثقات في متصفحك.";
      } else if (err.code === "auth/unauthorized-domain") {
        message = "هذا النطاق غير مصرح به في إعدادات Firebase الخاصة بك.";
      } else if (err.message?.includes("Firebase API Key is missing")) {
        message = err.message;
      }
      setError(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!auth.currentUser || !user) return;
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    try {
      // Update Firebase Auth profile if displayName or photoURL changed
      if (data.displayName || data.photoURL) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: data.displayName || auth.currentUser.displayName,
          photoURL: data.photoURL || auth.currentUser.photoURL
        });
      }
      // Update Firestore
      await updateDoc(userDocRef, data);
      setUser({ ...user, ...data });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  const savePlan = async (plan: any) => {
    if (!isLoggedIn || !user) return;
    const newPlan = { 
      ...plan, 
      authorId: user.uid, 
      createdAt: serverTimestamp() 
    };
    try {
      await addDoc(collection(db, 'lessonPlans'), newPlan);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'lessonPlans');
    }
  };

  const addPost = async (content: string, imageUrl?: string) => {
    if (!isLoggedIn || !user) return;
    const newPost = {
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      content,
      imageUrl: imageUrl || null,
      likesCount: 0,
      createdAt: serverTimestamp()
    };
    try {
      await addDoc(collection(db, 'posts'), newPost);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, login, logout, user, savedPlans, communityPosts, savePlan, addPost, updateUserProfile, isAuthReady, error 
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
