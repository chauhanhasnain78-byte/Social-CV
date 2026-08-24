import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useResumeStore } from '@/store/resumeStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync resume from Firebase to local Zustand store
  const syncResumeFromFirebase = async (uid) => {
    try {
      const docRef = doc(db, 'resumes', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const store = useResumeStore.getState();
        if (data.resume) {
          store.loadResume(data.resume);
          if (data.templateId) store.setTemplate(data.templateId);
          if (data.themeColor) store.setThemeColor(data.themeColor);
          if (data.fontFamily) store.setFontFamily(data.fontFamily);
          if (data.sectionOrder) store.setSectionOrder(data.sectionOrder);
          if (data.fontSize) store.setFontSize(data.fontSize);
          if (data.textAlignment) store.setTextAlignment(data.textAlignment);
        }
      }
    } catch (err) {
      console.error("Failed to sync resume from Firebase:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
        await syncResumeFromFirebase(firebaseUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async ({ name, email, password }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    const sessionUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
    };
    setUser(sessionUser);
    return sessionUser;
  };

  const login = async ({ email, password }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const sessionUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
    setUser(sessionUser);
    await syncResumeFromFirebase(userCredential.user.uid);
    return sessionUser;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    useResumeStore.getState().resetResume(); // Clear local store on logout so next user doesn't see it
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
