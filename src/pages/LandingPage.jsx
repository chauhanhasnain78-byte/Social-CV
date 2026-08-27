import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Zap, FileText, Users, Download, Shield, Sparkles, ChevronRight, MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import { TEMPLATES } from '@/templates/templateMeta';
import { subscribeToStats } from '@/services/statsService';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

// ── Mini resume card (animated carousel item) ────────────────────────────────
function MiniResumeCard({ tmpl, isActive }) {
  const colors = {
    'minimal-pro': { bg: '#fff', accent: '#0D0D0F', sidebar: null },
    'bold-edge':   { bg: '#EFF6FF', accent: '#1B4FD8', sidebar: '#1B4FD8' },
    'nordic':      { bg: '#FAF7F2', accent: '#8B6914', sidebar: null },
    'portrait':    { bg: '#fff', accent: '#6C47FF', sidebar: '#6C47FF' },
    'magazine':    { bg: '#fff', accent: '#be185d', sidebar: '#be185d' },
    'passport':    { bg: '#fff', accent: '#0d9488', sidebar: '#0d9488' },
  };
  const c = colors[tmpl.id] || colors['minimal-pro'];

  return (
    <motion.div
      layout
      animate={{
        scale: isActive ? 1 : 0.88,
        opacity: isActive ? 1 : 0.55,
        y: isActive ? 0 : 14,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 220, height: 300, borderRadius: 16,
        background: c.bg, overflow: 'hidden',
        boxShadow: isActive ? '0 28px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.1)' : '0 8px 24px rgba(0,0,0,0.08)',
        flexShrink: 0,
        border: isActive ? `2px solid ${c.accent}` : '2px solid transparent',
        position: 'relative',
      }}
    >
      {/* Template-specific mock layout */}
      {tmpl.id === 'minimal-pro' && (
        <div style={{ padding: 18 }}>
          <div style={{ width: 90, height: 10, background: '#111', borderRadius: 4, marginBottom: 6 }} />
          <div style={{ width: 60, height: 7, background: c.accent, borderRadius: 3, marginBottom: 16, opacity: 0.7 }} />
          {[80, 60, 72].map((w, i) => <div key={i} style={{ width: `${w}%`, height: 4, background: '#E5E7EB', borderRadius: 2, marginBottom: 5 }} />)}
          <div style={{ height: 1, background: '#E5E7EB', margin: '12px 0' }} />
          {[5,4,5,3].map((_, i) => <div key={i} style={{ width: `${[90,70,80,55][i]}%`, height: 4, background: '#F3F4F6', borderRadius: 2, marginBottom: 5 }} />)}
        </div>
      )}
      {tmpl.id === 'bold-edge' && (
        <div>
          <div style={{ background: c.accent, padding: '16px 14px' }}>
            <div style={{ width: 80, height: 9, background: '#fff', borderRadius: 3, marginBottom: 5 }} />
            <div style={{ width: 50, height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', height: 230 }}>
            <div style={{ width: '38%', background: '#EFF6FF', padding: 10 }}>
              {[70,60,80,50,65].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 4, background: '#DBEAFE', borderRadius: 2, marginBottom: 5 }} />)}
            </div>
            <div style={{ flex: 1, padding: 12 }}>
              {[90,70,80,60,85,65].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 4, background: '#F3F4F6', borderRadius: 2, marginBottom: 6 }} />)}
            </div>
          </div>
        </div>
      )}
      {tmpl.id === 'nordic' && (
        <div style={{ padding: 18 }}>
          <div style={{ width: 85, height: 11, background: '#1A1208', borderRadius: 3, marginBottom: 5 }} />
          <div style={{ width: 55, height: 6, background: c.accent, borderRadius: 2, marginBottom: 14, opacity: 0.7 }} />
          <div style={{ height: 1, background: `${c.accent}60`, marginBottom: 12 }} />
          {[80,65,75].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 4, background: '#E8E0D0', borderRadius: 2, marginBottom: 5 }} />)}
          <div style={{ height: 1, background: `${c.accent}40`, margin: '10px 0' }} />
          {[3,4].map((_,i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.accent, flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: '80%', height: 4, background: '#2C2416', borderRadius: 2, marginBottom: 4 }} />
                <div style={{ width: '60%', height: 3, background: '#D4C4A0', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {tmpl.id === 'portrait' && (
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ width: '35%', background: c.accent, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', marginBottom: 8 }} />
            <div style={{ width: '80%', height: 5, background: '#fff', borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: '60%', height: 3, background: 'rgba(255,255,255,0.5)', borderRadius: 2, marginBottom: 14 }} />
            {[70,60,80,55,65].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 2, marginBottom: 4 }} />)}
          </div>
          <div style={{ flex: 1, padding: 12 }}>
            {[90,70,80,60,85,55,75].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 4, background: '#F3F4F6', borderRadius: 2, marginBottom: 6 }} />)}
          </div>
        </div>
      )}
      {tmpl.id === 'magazine' && (
        <div>
          <div style={{ background: c.accent, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 38, height: 42, borderRadius: 6, background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
            <div>
              <div style={{ width: 70, height: 8, background: '#fff', borderRadius: 3, marginBottom: 5 }} />
              <div style={{ width: 45, height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, padding: '12px 14px' }}>
              {[85,70,75,60,80,55,70].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 4, background: '#F3F4F6', borderRadius: 2, marginBottom: 5 }} />)}
            </div>
            <div style={{ width: '32%', background: '#FAFAFA', padding: 10 }}>
              {[75,60,70,50].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 3, background: '#E5E7EB', borderRadius: 2, marginBottom: 5 }} />)}
            </div>
          </div>
        </div>
      )}
      {tmpl.id === 'passport' && (
        <div>
          <div style={{ height: 6, background: c.accent }} />
          <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: `2px solid ${c.accent}` }}>
            <div style={{ width: 36, height: 42, borderRadius: 4, background: `${c.accent}25`, flexShrink: 0 }} />
            <div>
              <div style={{ width: 65, height: 8, background: '#111', borderRadius: 3, marginBottom: 5 }} />
              <div style={{ width: 42, height: 4, background: c.accent, borderRadius: 2, opacity: 0.7 }} />
            </div>
          </div>
          <div style={{ padding: '10px 14px' }}>
            {[90,70,80,60,85,55].map((w,i) => <div key={i} style={{ width:`${w}%`, height: 4, background: '#F0FDFA', borderRadius: 2, marginBottom: 5 }} />)}
          </div>
        </div>
      )}

      {/* Template name badge */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            background: c.accent, color: '#fff',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em',
            padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap',
          }}
        >
          {tmpl.name}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Stat counter card ────────────────────────────────────────────────────────
function StatCard({ value, label, suffix = '', decimals = 0 }) {
  const [count, ref] = useCounter(value);
  
  // Format based on decimals prop, since 'count' is smoothly incremented by useCounter
  // If we need decimals (like 4.8), we format it properly, but useCounter deals in integers if not careful.
  // Wait, useCounter's logic uses Math.floor. Let's just use the direct value if decimals > 0 for now
  // to keep it simple and accurate, or update useCounter. For now, we will render the raw `value` for floats
  // and use the animated `count` for integers.
  
  const displayValue = decimals > 0 ? value.toFixed(decimals) : count.toLocaleString();

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {displayValue}{suffix}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: 6, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

const Reveal = ({ children, delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    style={style}
  >
    {children}
  </motion.div>
);

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage({ onGetStarted }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [stats, setStats] = useState({ totalResumes: 0, highestAtsScore: 0, ratingSum: 0, totalRatings: 0 });
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSeekerClick = async () => {
    sessionStorage.setItem('pendingRole', 'SEEKER');
    if (user) {
      if (user.role === 'HR') {
        await logout();
        navigate('/auth?role=seeker');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth?role=seeker');
    }
    onGetStarted();
  };

  const handleHRClick = async () => {
    sessionStorage.setItem('pendingRole', 'HR');
    if (user) {
      if (user.role === 'SEEKER') {
        await logout();
        navigate('/auth?role=hr');
      } else {
        navigate(user.hrSetupDone ? '/hr-feed' : '/hr-setup');
      }
    } else {
      navigate('/auth?role=hr');
    }
    onGetStarted();
  };

  // Keep backward-compat for navbar buttons
  const handleActionClick = handleSeekerClick;

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % TEMPLATES.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Fetch real-time stats
  useEffect(() => {
    const unsubscribe = subscribeToStats((newStats) => {
      setStats(newStats);
    });
    return () => unsubscribe();
  }, []);

  const features = [
    { icon: Zap,       title: 'Live Preview',      desc: 'See every change reflected instantly on the real resume layout.',     color: '#6C47FF' },
    { icon: Shield,    title: 'ATS Optimized',     desc: 'Beat Applicant Tracking Systems with our built-in CV score engine.', color: '#0d9488' },
    { icon: Download,  title: 'One-Click PDF',     desc: 'Export pixel-perfect, print-ready PDFs in seconds.',                 color: '#be185d' },
    { icon: Users,     title: 'Public Share Link', desc: 'Get a unique URL to share your resume with recruiters online.',       color: '#F59E0B' },
    { icon: Sparkles,  title: '6 Pro Templates',   desc: '3 without photo + 3 with photo. All recruiter-approved designs.',    color: '#1B4FD8' },
    { icon: FileText,  title: 'Drag & Drop',       desc: 'Reorder every section of your resume with intuitive drag handles.',  color: '#FF6B35' },
  ];

  const avgRating = stats.totalRatings > 0 ? (stats.ratingSum / stats.totalRatings) : 5.0;

  return (
    <div style={{ background: '#FDFCFF', color: '#0D0D0F', overflowX: 'hidden' }}>

      {/* ── NAVBAR ────────────────────────────────────── */}
      <nav className="landing-nav" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(253,252,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img
            src="/logo.png"
            alt="Social-CV"
            style={{ height: 52, width: 'auto', objectFit: 'contain' }}
          />
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.01em' }}>
            Social<span style={{ color: '#6C47FF' }}>-CV</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost-light" style={{ fontSize: '0.875rem' }}>Templates</button>
          <button onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost-light" style={{ fontSize: '0.875rem' }}>Features</button>
          <button className="btn-ghost-light" onClick={handleActionClick} style={{ fontSize: '0.875rem' }}>Login</button>
          <motion.button
            className="btn-brand"
            style={{ padding: '9px 20px', fontSize: '0.85rem' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleActionClick}
          >
            Get Started Free
          </motion.button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="landing-hero" style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', alignItems: 'center',
        padding: '60px 40px',
        maxWidth: 1280, margin: '0 auto',
        gap: 80,
      }}>
        {/* Left copy */}
        <div className="landing-hero-left" style={{ flex: 1, maxWidth: 580 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Trust badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(108,71,255,0.08)', borderRadius: 999, marginBottom: 28, border: '1px solid rgba(108,71,255,0.2)' }}>
              <Star size={13} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6C47FF' }}>Rated #1 Resume Builder by Students</span>
            </div>

            <h1 className="font-display" style={{
              fontSize: 'clamp(2.8rem, 5vw, 4rem)',
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#0D0D0F', marginBottom: 22,
            }}>
              Build a resume<br />
              that <span style={{
                background: 'linear-gradient(135deg, #6C47FF 0%, #FF6B35 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>gets you hired.</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#5A5A72', lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
              6 premium templates, live preview, ATS score checker, and one-click PDF export —
              all in one intelligent workspace. <strong style={{ color: '#0D0D0F' }}>Free to start.</strong>
            </p>

            {/* ── TWO DOORS — Role Selector ── */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              {/* Job Seeker card */}
              <motion.button
                whileHover={{ scale: 1.04, y: -3, boxShadow: '0 24px 48px rgba(108,71,255,0.28)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSeekerClick}
                style={{
                  flex: '1 1 200px', minWidth: 200, padding: '20px 24px',
                  borderRadius: 20, border: '2px solid rgba(108,71,255,0.3)',
                  background: 'linear-gradient(135deg, rgba(108,71,255,0.08) 0%, rgba(108,71,255,0.03) 100%)',
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 8px 24px rgba(108,71,255,0.12)',
                  transition: 'all 0.25s ease',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <div style={{ fontSize: '2rem' }}>👨‍💻</div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#6C47FF', marginBottom: 4, letterSpacing: '-0.02em' }}>
                    I'm a Job Seeker
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#5A5A72', lineHeight: 1.5 }}>
                    Build an ATS-beating CV & get discovered by top recruiters
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6C47FF', fontSize: '0.8rem', fontWeight: 700 }}>
                  Create My CV <ArrowRight size={14} />
                </div>
              </motion.button>

              {/* HR / Recruiter card */}
              <motion.button
                whileHover={{ scale: 1.04, y: -3, boxShadow: '0 24px 48px rgba(245,158,11,0.25)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleHRClick}
                style={{
                  flex: '1 1 200px', minWidth: 200, padding: '20px 24px',
                  borderRadius: 20, border: '2px solid rgba(245,158,11,0.35)',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(255,107,53,0.04) 100%)',
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 8px 24px rgba(245,158,11,0.12)',
                  transition: 'all 0.25s ease',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <div style={{ fontSize: '2rem' }}>👔</div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#D97706', marginBottom: 4, letterSpacing: '-0.02em' }}>
                    I'm an HR / Recruiter
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#5A5A72', lineHeight: 1.5 }}>
                    Browse top talent CVs in a swipeable Reels-style feed
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D97706', fontSize: '0.8rem', fontWeight: 700 }}>
                  Find Talent <ArrowRight size={14} />
                </div>
              </motion.button>
            </div>


            {/* Social proof row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {/* NIE Logo */}
              <div style={{
                height: 48,
                background: '#fff', border: '2px solid #FDFCFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, padding: '4px 8px',
                overflow: 'hidden'
              }}>
                <img src="/nie-logo.png" alt="NIE Logo" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                  {[1,2,3,4,5].map((s) => <Star key={s} size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
                </div>
                <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>
                  Trusted by <strong style={{ color: '#0D0D0F' }}>Nav India Enterprises</strong>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Template carousel */}
        <motion.div
          className="landing-hero-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
        >
          {/* Carousel */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 320, position: 'relative' }}>
            {TEMPLATES.map((tmpl, i) => {
              const offset = i - activeIdx;
              const visible = Math.abs(offset) <= 1;
              if (!visible && Math.abs(offset) > 1) return null;
              return (
                <MiniResumeCard
                  key={tmpl.id}
                  tmpl={tmpl}
                  isActive={i === activeIdx}
                />
              );
            })}
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6 }}>
            {TEMPLATES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  width: i === activeIdx ? 24 : 8,
                  height: 8, borderRadius: 999,
                  background: i === activeIdx ? '#6C47FF' : '#E0E0F0',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────── */}
      <section style={{ background: '#0D0D0F', padding: '52px 40px' }}>
        <div className="landing-stats-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <StatCard value={stats.totalResumes} label="Resumes Created" suffix="+" decimals={0} />
          <StatCard value={6} label="Premium Templates" suffix="" decimals={0} />
          <StatCard value={stats.highestAtsScore} label="Highest ATS Score" suffix="%" decimals={0} />
          <StatCard value={avgRating} label="Average Rating" suffix="★" decimals={1} />
        </div>
      </section>

      {/* ── TEMPLATES SHOWCASE ────────────────────────── */}
      <section id="templates-section" className="landing-section-pad" style={{ padding: '100px 40px', maxWidth: 1280, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(108,71,255,0.08)', borderRadius: 999, marginBottom: 20, border: '1px solid rgba(108,71,255,0.18)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6C47FF' }}>✦ 6 PREMIUM TEMPLATES</span>
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0D0D0F', lineHeight: 1.1, marginBottom: 16 }}>
            Every style. Every personality.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#5A5A72', maxWidth: 520, margin: '0 auto' }}>
            From ultra-minimal to editorial magazine — pick the design that tells your story.
          </p>
        </Reveal>

        <div className="landing-templates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {TEMPLATES.map((tmpl, i) => (
            <Reveal key={tmpl.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(0,0,0,0.14)' }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{
                  borderRadius: 18, overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  background: '#fff',
                }}
                onClick={handleActionClick}
              >
                {/* Color preview gradient */}
                <div style={{ height: 120, background: tmpl.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '3rem' }}>{tmpl.emoji}</span>
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 999,
                      background: tmpl.hasPhoto ? 'rgba(255,107,53,0.9)' : 'rgba(108,71,255,0.9)',
                      color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                    }}>
                      {tmpl.hasPhoto ? '📷 With Photo' : '✏️ No Photo'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.62rem', fontWeight: 600 }}>
                      {tmpl.category}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '18px 20px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0D0D0F' }}>{tmpl.name}</h3>
                    <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.6 }}>{tmpl.desc}</p>
                  <button
                    onClick={handleActionClick}
                    style={{
                      marginTop: 16, padding: '8px 16px',
                      background: '#0D0D0F', color: '#fff',
                      border: 'none', borderRadius: 8,
                      fontSize: '0.8rem', fontWeight: 600,
                      cursor: 'pointer', width: '100%',
                      transition: 'background 0.2s',
                    }}
                  >
                    Use This Template →
                  </button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────── */}
      <section id="features-section" className="landing-section-pad" style={{ padding: '80px 40px', background: '#F8F8FC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0D0D0F', marginBottom: 14 }}>
              Everything you need. Nothing you don't.
            </h2>
            <p style={{ fontSize: '1rem', color: '#5A5A72', maxWidth: 480, margin: '0 auto' }}>
              Built for students and professionals who want results, not complexity.
            </p>
          </Reveal>

          <div className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {features.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: '#fff', borderRadius: 16, padding: '26px 24px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${feat.color}14`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <feat.icon size={20} style={{ color: feat.color }} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 6 }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.65 }}>{feat.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section style={{ padding: '100px 40px' }}>
        <Reveal>
          <div style={{
            maxWidth: 780, margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, #6C47FF 0%, #4A2FD9 100%)',
            borderRadius: 28, padding: '64px 52px',
            boxShadow: '0 32px 80px rgba(108,71,255,0.3)',
          }}>
            <div style={{ fontSize: '2.8rem', marginBottom: 16 }}>🚀</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
              Ready to stand out in class?
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', marginBottom: 36, maxWidth: 420, margin: '0 auto 36px' }}>
              Join thousands of students who built their dream resumes with Social-CV.
              It's completely free.
            </p>
            <motion.button
              onClick={handleActionClick}
              style={{
                padding: '16px 42px', borderRadius: 999,
                background: '#fff', color: '#6C47FF',
                fontSize: '1rem', fontWeight: 800,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
              whileHover={{ scale: 1.06, boxShadow: '0 16px 48px rgba(0,0,0,0.25)' }}
              whileTap={{ scale: 0.97 }}
            >
              Build My Resume Now →
            </motion.button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 28 }}>
              {['Free forever', 'No credit card', '6 templates'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '32px 40px' }}>
        <div className="landing-footer-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={13} color="#fff" />
            </div>
            <span className="font-display" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0D0D0F' }}>
              Social<span style={{ color: '#6C47FF' }}>-CV</span>
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
            © 2025 Social-CV. Built with ❤️ for students.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map((l) => (
              <button 
                key={l} 
                onClick={() => {
                  if (l === 'Privacy') setShowPrivacy(true);
                  if (l === 'Terms') setShowTerms(true);
                  if (l === 'Contact') setShowContact(true);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: '#6B7280', fontFamily: 'Inter' }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── MODALS ────────────────────────────────────── */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
            onClick={() => setShowPrivacy(false)}
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, opacity: 0 }}
              style={{
                background: '#fff', borderRadius: 24, width: '100%', maxWidth: 600,
                maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0D0D0F' }}>Privacy Policy</h3>
                <button onClick={() => setShowPrivacy(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#9CA3AF' }}>&times;</button>
              </div>
              <div className="scrollbar-thin" style={{ padding: '32px', overflowY: 'auto', fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p><strong>1. Data Collection:</strong> Social-CV stores your resume data securely using Firebase. We only collect the information you voluntarily enter into your resume.</p>
                <p><strong>2. Data Usage:</strong> Your data is used exclusively to generate your resume PDF and maintain your session. We do not sell, rent, or share your personal information with third parties.</p>
                <p><strong>3. Public Link:</strong> If you use the "Public Share Link" feature, anyone with the link can view your resume. You can disable this at any time by deleting the resume.</p>
                <p><strong>4. Local Storage:</strong> We use browser localStorage to autosave your progress so you never lose your work.</p>
                <p><strong>5. Analytics:</strong> We track anonymous usage statistics to improve our service, but these contain no personally identifiable information.</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showTerms && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
            onClick={() => setShowTerms(false)}
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, opacity: 0 }}
              style={{
                background: '#fff', borderRadius: 24, width: '100%', maxWidth: 600,
                maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0D0D0F' }}>Terms of Service</h3>
                <button onClick={() => setShowTerms(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#9CA3AF' }}>&times;</button>
              </div>
              <div className="scrollbar-thin" style={{ padding: '32px', overflowY: 'auto', fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p><strong>1. Free Service:</strong> Social-CV is provided as a free tool for students and professionals. There are no hidden fees for the core resume builder features.</p>
                <p><strong>2. User Content:</strong> You are solely responsible for the accuracy and legality of the content you include in your resume. Social-CV is not responsible for verifying your employment history, education, or skills.</p>
                <p><strong>3. ATS Scoring:</strong> Our built-in ATS checker provides guidance based on common industry patterns. However, we do not guarantee that a high score will result in a job interview or offer.</p>
                <p><strong>4. Service Availability:</strong> While we strive for 100% uptime, Social-CV is provided "as-is". We are not liable for any lost data, so we recommend downloading your PDF frequently.</p>
                <p><strong>5. Fair Use:</strong> Please do not abuse the platform, attempt to hack the database, or use our service to generate malicious content.</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showContact && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, opacity: 0 }}
              style={{
                background: '#fff', borderRadius: 24, width: '100%', maxWidth: 500,
                maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0D0D0F' }}>Contact Us</h3>
                <button onClick={() => setShowContact(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#9CA3AF' }}>&times;</button>
              </div>
              <div className="scrollbar-thin" style={{ padding: '32px', overflowY: 'auto', fontSize: '0.95rem', color: '#4B5563', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(108,71,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} style={{ color: '#6C47FF' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 2 }}>Email Address</h4>
                    <a href="mailto:chauhanhasnain78@gmail.com" style={{ color: '#6C47FF', textDecoration: 'none', fontWeight: 500 }}>chauhanhasnain78@gmail.com</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 2 }}>Phone Number</h4>
                    <a href="tel:+918355966364" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>+91 83559 66364</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37,211,102,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={18} style={{ color: '#25D366' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 2 }}>WhatsApp</h4>
                    <a href="https://wa.me/918355966364" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>+91 83559 66364</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,107,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} style={{ color: '#FF6B35' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 2 }}>Office Address</h4>
                    <p style={{ margin: 0 }}>Nav India Enterprises, ground floor, Patni Chawl, 81-Morland Rd, Mohammed Shahid Marg, Mumbai Central, Maharashtra 400008</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
