import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from '@/components/ui/Toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AuthPage      from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import EditorPage    from '@/pages/EditorPage';
import LandingPage   from '@/pages/LandingPage';
import PublicResume  from '@/pages/PublicResume';
import HRSetupPage   from '@/pages/HRSetupPage';
import HRFeedPage    from '@/pages/HRFeedPage';

// Cinematic page-slide variants — landing exits LEFT, auth enters from RIGHT
const slideVariants = {
  // The page entering from the right
  enterFromRight: {
    initial:   { x: '100%', opacity: 0 },
    animate:   { x: 0,      opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit:      { x: '-8%',  opacity: 0, transition: { duration: 0.40, ease: [0.55, 0, 1, 0.45] } },
  },
  // The landing page exiting to the left
  exitToLeft: {
    initial:   { x: 0,      opacity: 1 },
    animate:   { x: 0,      opacity: 1 },
    exit:      { x: '-100%', opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },
  // Splash screen fade
  splash: {
    initial:   { opacity: 1 },
    exit:      { opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }
};

export default function App() {
  const [showLogin, setShowLogin] = useState(() => {
    // Agar URL '/' nahi hai, toh seedha app routes show karo (Landing page skip)
    return typeof window !== 'undefined' && window.location.pathname !== '/';
  });

  // Splash sirf '/' par dikhe — kisi bhi dusre page par refresh karne par skip karo
  const isOnRootPath = typeof window !== 'undefined' && window.location.pathname === '/';
  const [isSplashDone, setIsSplashDone] = useState(!isOnRootPath);

  useEffect(() => {
    if (!isOnRootPath) return; // splash already skip ho gaya
    const timer = setTimeout(() => {
      setIsSplashDone(true);
    }, 2500); // 2.5 seconds only on landing
    return () => clearTimeout(timer);
  }, [isOnRootPath]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />

        {/* Clip the outer container so sliding pages never create a scrollbar */}
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
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32
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
                  <div className="animate-spin w-8 h-8 rounded-full" style={{ border: '3px solid rgba(108,71,255,0.15)', borderTopColor: '#6C47FF' }} />
                </motion.div>
              </motion.div>
            ) : !showLogin ? (
              /* ─── Landing Page ─── exits to the LEFT */
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.6 } }}
                exit={slideVariants.exitToLeft.exit}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#FDFCFF' }}
              >
                <LandingPage onGetStarted={() => setShowLogin(true)} />
              </motion.div>
            ) : (
              /* ─── Auth / App Shell ─── enters from the RIGHT */
              <motion.div
                key="app"
                initial={slideVariants.enterFromRight.initial}
                animate={slideVariants.enterFromRight.animate}
                exit={slideVariants.enterFromRight.exit}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: '#FDFCFF' }}
              >
                <Routes>
                  <Route path="/auth"      element={<AuthPage onBack={() => setShowLogin(false)} />} />
                  <Route path="/p/:id"     element={<PublicResume />} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/editor"    element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
                  <Route path="/hr-setup"  element={<ProtectedRoute><HRSetupPage /></ProtectedRoute>} />
                  <Route path="/hr-feed"   element={<ProtectedRoute><HRFeedPage /></ProtectedRoute>} />
                  <Route path="*"          element={<Navigate to="/auth" replace />} />
                </Routes>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </AuthProvider>
    </BrowserRouter>
  );
}
