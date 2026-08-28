import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '@/services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
          if (data.templateId)   store.setTemplate(data.templateId);
          if (data.themeColor)   store.setThemeColor(data.themeColor);
          if (data.fontFamily)   store.setFontFamily(data.fontFamily);
          if (data.sectionOrder) store.setSectionOrder(data.sectionOrder);
          if (data.fontSize)     store.setFontSize(data.fontSize);
          if (data.textAlignment) store.setTextAlignment(data.textAlignment);
        }
      }
    } catch (err) {
      console.error("Failed to sync resume from Firebase:", err);
    }
  };

  // Read user profile (role, company etc.) from Firestore
  const getUserProfile = async (uid) => {
    try {
      const profileRef = doc(db, 'users', uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) return profileSnap.data();
    } catch (err) {
      console.error("Failed to read user profile:", err);
    }
    return {};
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        const pendingRole = sessionStorage.getItem('pendingRole') || 'SEEKER';
        const sessionUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: profile.role || pendingRole,         // 'SEEKER' | 'HR'
          company: profile.company || '',
          yourTitle: profile.yourTitle || '',
          hiringFor: profile.hiringFor || '',
          jobDescription: profile.jobDescription || '',
          location: profile.location || '',
          employmentType: profile.employmentType || 'Full-time',
          hrSetupDone: profile.hrSetupDone || false,
          allowRecruiterView: profile.allowRecruiterView ?? false,
        };
        setUser(sessionUser);
        // Only sync resume for job seekers
        if (sessionUser.role === 'SEEKER') {
          await syncResumeFromFirebase(firebaseUser.uid);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async ({ name, email, password, role = 'SEEKER' }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });

    // Save role to Firestore users/{uid}
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      role,
      displayName: name,
      email,
      createdAt: Date.now(),
      allowRecruiterView: false,
      hrSetupDone: false,
    });

    const sessionUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
      role,
      hrSetupDone: false,
      allowRecruiterView: false,
    };
    setUser(sessionUser);
    return sessionUser;
  };

  const login = async ({ email, password, targetRole = null }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const profile = await getUserProfile(uid);

    // If user came from a different portal door, switch their role in Firestore
    let finalRole = profile.role || 'SEEKER';
    let finalHrSetupDone = profile.hrSetupDone || false;
    if (targetRole && targetRole !== finalRole) {
      await updateDoc(doc(db, 'users', uid), { role: targetRole });
      finalRole = targetRole;
      // If switching to HR for the first time, mark setup as not done
      if (targetRole === 'HR') finalHrSetupDone = false;
    }

    const sessionUser = {
      uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      role: finalRole,
      company: profile.company || '',
      yourTitle: profile.yourTitle || '',
      hiringFor: profile.hiringFor || '',
      jobDescription: profile.jobDescription || '',
      location: profile.location || '',
      employmentType: profile.employmentType || 'Full-time',
      hrSetupDone: finalHrSetupDone,
      allowRecruiterView: profile.allowRecruiterView ?? false,
    };
    setUser(sessionUser);
    if (sessionUser.role === 'SEEKER') {
      await syncResumeFromFirebase(uid);
    }
    return sessionUser;
  };

  const loginWithGoogle = async ({ role = 'SEEKER' } = {}) => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const uid = firebaseUser.uid;

    // Check if this user already has a Firestore doc
    const profileSnap = await getDoc(doc(db, 'users', uid));

    let finalRole = role;
    let hrSetupDone = false;

    if (profileSnap.exists()) {
      // Returning Google user — respect existing role, but allow portal switch
      const existing = profileSnap.data();
      finalRole = existing.role || role;
      hrSetupDone = existing.hrSetupDone || false;
      // If they're switching portal role via Google, update it
      if (role !== finalRole) {
        await updateDoc(doc(db, 'users', uid), { role });
        finalRole = role;
        if (role === 'HR') hrSetupDone = false;
      }
    } else {
      // Brand new Google user — create Firestore doc
      await setDoc(doc(db, 'users', uid), {
        role,
        displayName: firebaseUser.displayName || '',
        email: firebaseUser.email,
        createdAt: Date.now(),
        allowRecruiterView: false,
        hrSetupDone: false,
      });
    }

    const sessionUser = {
      uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      role: finalRole,
      hrSetupDone,
      allowRecruiterView: profileSnap.exists() ? (profileSnap.data().allowRecruiterView ?? false) : false,
      company: profileSnap.exists() ? (profileSnap.data().company || '') : '',
      yourTitle: profileSnap.exists() ? (profileSnap.data().yourTitle || '') : '',
      hiringFor: profileSnap.exists() ? (profileSnap.data().hiringFor || '') : '',
      jobDescription: profileSnap.exists() ? (profileSnap.data().jobDescription || '') : '',
      location: profileSnap.exists() ? (profileSnap.data().location || '') : '',
      employmentType: profileSnap.exists() ? (profileSnap.data().employmentType || 'Full-time') : 'Full-time',
    };
    setUser(sessionUser);
    if (finalRole === 'SEEKER') await syncResumeFromFirebase(uid);
    return sessionUser;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    useResumeStore.getState().resetResume();
  };

  // Refresh user profile from Firestore (called after HR setup)
  const refreshUserProfile = async () => {
    if (!user?.uid) return;
    const profile = await getUserProfile(user.uid);
    setUser(prev => ({
      ...prev,
      ...profile,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, refreshUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
