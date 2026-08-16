// src/context/AuthContext.jsx
// Local auth — works without Firebase. All data saved in localStorage.
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const USERS_KEY  = 'social-cv-users-db';
const SESSION_KEY = 'social-cv-session';

function loadUsers()  { try { return JSON.parse(localStorage.getItem(USERS_KEY)  || '{}'); } catch { return {}; } }
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function loadSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } }
function saveSession(u) { localStorage.setItem(SESSION_KEY, JSON.stringify(u)); }
function clearSession()  { localStorage.removeItem(SESSION_KEY); }

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const signup = async ({ name, email, password }) => {
    const users = loadUsers();
    const emailKey = email.toLowerCase().trim();

    if (users[emailKey]) {
      const err = new Error('Email already registered.');
      err.code = 'auth/email-already-in-use';
      throw err;
    }
    if (password.length < 6) {
      const err = new Error('Password too weak.');
      err.code = 'auth/weak-password';
      throw err;
    }

    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const newUser = {
      uid,
      displayName: name,
      email: emailKey,
      createdAt: Date.now(),
      plan: 'free',
    };

    // Store hashed-ish password (simple, not cryptographic — good enough for demo)
    users[emailKey] = { ...newUser, password };
    saveUsers(users);

    const sessionUser = { uid, displayName: name, email: emailKey, plan: 'free' };
    saveSession(sessionUser);
    setUser(sessionUser);
    return sessionUser;
  };

  const login = async ({ email, password }) => {
    const users  = loadUsers();
    const emailKey = email.toLowerCase().trim();
    const stored = users[emailKey];

    if (!stored) {
      const err = new Error('No account found with this email.');
      err.code = 'auth/user-not-found';
      throw err;
    }
    if (stored.password !== password) {
      const err = new Error('Incorrect password.');
      err.code = 'auth/wrong-password';
      throw err;
    }

    const sessionUser = { uid: stored.uid, displayName: stored.displayName, email: emailKey, plan: stored.plan };
    saveSession(sessionUser);
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
