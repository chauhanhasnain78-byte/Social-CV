import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AuthPage      from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import EditorPage    from '@/pages/EditorPage';
import LandingPage   from '@/pages/LandingPage';
import WelcomePage   from '@/pages/WelcomePage';
import PublicResume  from '@/pages/PublicResume';
import HRSetupPage   from '@/pages/HRSetupPage';
import HRFeedPage    from '@/pages/HRFeedPage';

// Cinematic page-slide variants
const slideVariants = {
  enterFromRight: {
    initial:   { x: '100%', opacity: 0 },
    animate:   { x: 0,      opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit:      { x: '-8%',  opacity: 0, transition: { duration: 0.40, ease: [0.55, 0, 1, 0.45] } },
  },
  exitToLeft: {
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },
  splash: {
    initial: { opacity: 1 },
    exit:    { opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
};

// ── Inner shell: reads location INSIDE BrowserRouter (no flash bug) ──────────
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRoot = location.pathname === '/';

  // view: 'welcome', 'landing', or 'app'
  const [view, setView] = useState(isRoot ? 'welcome' : 'app');

  // Splash only on root path, skip everywhere else
  const [isSplashDone, setIsSplashDone] = useState(!isRoot);

  useEffect(() => {
    if (!isRoot) return;
    const timer = setTimeout(() => setIsSplashDone(true), 2500);
    return () => clearTimeout(timer);
  }, [isRoot]);

  useEffect(() => {
    if (!isRoot) {
      setView('app');
    } else {
      setView(prev => prev === 'app' ? 'welcome' : prev);
    }
  }, [isRoot]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#0A0A10' }}>
      <AnimatePresence mode="sync">
        {!isSplashDone ? (
          /* ─── Splash Screen ─── */
          <motion.div
            key="splash"
            initial="initial"
            exit="exit"
            variants={slideVariants.splash}
            style={{
              position: 'absolute', inset: 0, width: '100%', minHeight: '100vh',
              background: '#0A0A10', zIndex: 9999,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
            }}
          >
            <motion.img
              src="/logo.png"
              alt="Social-CV"
              style={{ width: 220, height: 'auto', objectFit: 'contain' }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="animate-spin w-8 h-8 rounded-full"
                style={{ border: '3px solid rgba(108,71,255,0.15)', borderTopColor: '#6C47FF' }} />
            </motion.div>
          </motion.div>
        ) : view === 'welcome' ? (
          /* ─── Welcome Page ─── */
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6 } }}
            exit={slideVariants.exitToLeft.exit}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#FDFCFF' }}
          >
            <WelcomePage 
              onSelectSeeker={() => setView('landing')} 
              onSelectHR={() => { 
                setView('app');
                navigate('/auth?role=hr');
              }} 
            />
          </motion.div>
        ) : view === 'landing' ? (
          /* ─── Landing Page ─── */
          <motion.div
            key="landing"
            initial={slideVariants.enterFromRight.initial}
            animate={slideVariants.enterFromRight.animate}
            exit={slideVariants.exitToLeft.exit}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#FDFCFF' }}
          >
            <LandingPage onGetStarted={() => setView('app')} onBack={() => setView('welcome')} />
          </motion.div>
        ) : (
          /* ─── App Shell ─── enters RIGHT */
          <motion.div
            key="app"
            initial={slideVariants.enterFromRight.initial}
            animate={slideVariants.enterFromRight.animate}
            exit={slideVariants.enterFromRight.exit}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#FDFCFF' }}
          >
            <Routes>
              <Route path="/auth"      element={<AuthPage onBack={() => { setView('landing'); navigate('/'); }} />} />
              <Route path="/p/:id"     element={<PublicResume />} />
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['SEEKER']}><DashboardPage /></ProtectedRoute>} />
              <Route path="/editor"    element={<ProtectedRoute allowedRoles={['SEEKER']}><EditorPage /></ProtectedRoute>} />
              <Route path="/hr-setup"  element={<ProtectedRoute allowedRoles={['HR']}><HRSetupPage /></ProtectedRoute>} />
              <Route path="/hr-feed"   element={<ProtectedRoute allowedRoles={['HR']}><HRFeedPage /></ProtectedRoute>} />
              <Route path="*"          element={<Navigate to="/auth" replace />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
