// src/pages/AuthPage.jsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LoginForm  } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PERKS = [
  { icon: Zap,    label: 'Live Preview',        desc: 'Every edit reflected in real-time' },
  { icon: Shield, label: 'ATS Optimized',       desc: 'Built to beat applicant tracking systems' },
  { icon: Star,   label: '6 Premium Templates', desc: 'Without & with photo — all professional' },
];

const SOCIAL_PROOF = ['10K+ CVs created', 'Free forever', 'No credit card'];

export default function AuthPage({ onBack }) {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();

  // Jab login successful ho, toh seedha Landing Page par wapas le jao
  useEffect(() => {
    if (!loading && user) {
      if (onBack) onBack();
      navigate('/');
    }
  }, [user, loading, navigate, onBack]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8F6FF 0%, #FDFCFF 50%, #FFF8F6 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,71,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Back button */}
      {onBack && (
        <div style={{ position: 'relative', zIndex: 10, padding: '20px 32px' }}>
          <button onClick={onBack} className="btn-ghost-light" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, maxWidth: 1000, width: '100%', alignItems: 'center' }}>

          {/* ── Left: Brand hero ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
              <img src="/logo.png" alt="Social-CV" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
            </div>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(108,71,255,0.08)', borderRadius: 999, border: '1px solid rgba(108,71,255,0.18)', marginBottom: 20, width: 'fit-content' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C47FF', letterSpacing: '0.04em' }}>✦ FREE TO START — NO CARD NEEDED</span>
            </div>

            {/* Headline */}
            <div style={{ marginBottom: 32 }}>
              <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', color: '#0D0D0F', marginBottom: 16 }}>
                Build a resume<br />
                <span style={{ background: 'linear-gradient(135deg,#6C47FF,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  that gets you hired.
                </span>
              </h1>
              <p style={{ fontSize: '1rem', color: '#5A5A72', lineHeight: 1.72, maxWidth: 380 }}>
                Live preview, ATS optimization, and 6 professional templates — all in one intelligent workspace.
              </p>
            </div>

            {/* Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {PERKS.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(135deg, rgba(108,71,255,0.1), rgba(108,71,255,0.06))', border: '1px solid rgba(108,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(108,71,255,0.1)' }}>
                    <Icon size={17} style={{ color: '#6C47FF' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: '0.78rem', color: '#6B7280' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social proof pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SOCIAL_PROOF.map((p) => (
                <div key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(16,185,129,0.07)', borderRadius: 999, border: '1px solid rgba(16,185,129,0.18)' }}>
                  <CheckCircle2 size={11} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#059669' }}>{p}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Auth card ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(24px)',
              borderRadius: 28,
              padding: '44px 40px',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 24px 80px rgba(108,71,255,0.1), 0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
            }}
          >
            {/* Card header */}
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D0D0F', marginBottom: 6, letterSpacing: '-0.03em' }}>
                {tab === 'login' ? 'Welcome back 👋' : 'Create your account 🚀'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 500 }}>
                {tab === 'login'
                  ? 'Sign in to continue building your resume.'
                  : 'Join thousands of professionals. It\'s free.'}
              </p>
            </div>

            {/* Tab switcher — enhanced */}
            <div style={{ display: 'flex', background: '#F3F2F8', borderRadius: 14, padding: 4, marginBottom: 32, border: '1px solid rgba(108,71,255,0.08)', position: 'relative' }}>
              {['login', 'signup'].map((t) => (
                <button
                  key={t}
                  id={`auth-tab-${t}`}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: '11px 0',
                    borderRadius: 11, border: 'none', cursor: 'pointer',
                    fontSize: '0.875rem', fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    background: tab === t ? '#fff' : 'transparent',
                    color: tab === t ? '#6C47FF' : '#9CA3AF',
                    boxShadow: tab === t ? '0 2px 12px rgba(108,71,255,0.15), 0 1px 4px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.25s ease',
                    letterSpacing: tab === t ? '-0.01em' : '0',
                  }}
                >
                  {t === 'login' ? '🔐 Login' : '✨ Sign Up'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === 'login'
                  ? <LoginForm  onSwitchTab={() => setTab('signup')} />
                  : <SignupForm onSwitchTab={() => setTab('login')} />
                }
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
