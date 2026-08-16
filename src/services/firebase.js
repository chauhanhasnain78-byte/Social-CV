// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDO4FGhKWc44huhmp9JVHiNNPLJxOTuBJA",
  authDomain: "social-cv-ec137.firebaseapp.com",
  projectId: "social-cv-ec137",
  storageBucket: "social-cv-ec137.firebasestorage.app",
  messagingSenderId: "897078365088",
  appId: "1:897078365088:web:4af8a629e691c0ff3a72c5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
