import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { TEMPLATES } from '@/templates/templateMeta';
import { LogOut, FileText, CheckCircle, Share2, Copy, Eye, ExternalLink, Image, AlignLeft, Mail, Repeat2, Bell, Moon, Sun } from 'lucide-react';
import { doc, onSnapshot, collection, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/Toast';
import { CoverLetterModal } from '@/components/CoverLetterModal';
import ProfileDropdown from '@/components/ui/ProfileDropdown';

// ── Profile Completion Ring ───────────────────────────────────────────────────
function CompletionRing({ resume }) {
  const sections = [
    { label: 'Name',       done: !!(resume?.personalInfo?.name) },
    { label: 'Email',      done: !!(resume?.personalInfo?.email) },
    { label: 'Summary',    done: !!(resume?.summary?.trim()) },
    { label: 'Experience', done: (resume?.experience?.length ?? 0) > 0 },
    { label: 'Education',  done: (resume?.education?.length ?? 0) > 0 },
    { label: 'Skills',     done: (resume?.skills?.length ?? 0) > 0 },
  ];
  const done = sections.filter(s => s.done).length;
  const pct  = Math.round((done / sections.length) * 100);
  const radius = 28, circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  const color = pct === 100 ? '#10B981' : pct >= 60 ? '#6C47FF' : '#F59E0B';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={72} height={72} style={{ flexShrink: 0 }}>
        <circle cx={36} cy={36} r={radius} fill="none" stroke="rgba(108,71,255,0.1)" strokeWidth={6} />
        <circle
          cx={36} cy={36} r={radius} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x={36} y={40} textAnchor="middle" fontSize={13} fontWeight={800} fill={color}>{pct}%</text>
      </svg>
      <div>
        <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 4 }}>
          {pct === 100 ? '🎉 CV Complete!' : `Profile ${pct}% done`}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {sections.map(s => (
            <span key={s.label} style={{
              fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', borderRadius: 999,
              background: s.done ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)',
              color: s.done ? '#059669' : '#9CA3AF',
              border: `1px solid ${s.done ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.08)'}`,
            }}>
              {s.done ? '✓' : '○'} {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Template Card ─────────────────────────────────────────────────────────────
function TemplateCard({ tmpl, isSelected, onClick, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.14)' }}
      style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
        border: isSelected ? '2.5px solid #6C47FF' : '1.5px solid rgba(0,0,0,0.08)',
        boxShadow: isSelected
          ? '0 0 0 4px rgba(108,71,255,0.12), 0 12px 32px rgba(0,0,0,0.1)'
          : '0 4px 16px rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s', position: 'relative',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          width: 24, height: 24, borderRadius: '50%', background: '#6C47FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(108,71,255,0.4)',
        }}>
          <CheckCircle size={14} color="#fff" fill="#fff" />
        </div>
      )}
      <div style={{ height: 130, background: tmpl.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: '3.2rem' }}>{tmpl.emoji}</span>
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, background: tmpl.hasPhoto ? 'rgba(255,107,53,0.92)' : 'rgba(108,71,255,0.92)', color: '#fff', fontSize: '0.62rem', fontWeight: 700 }}>
            {tmpl.hasPhoto ? <><Image size={10} /> With Photo</> : <><AlignLeft size={10} /> No Photo</>}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <span style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>
            {tmpl.category}
          </span>
        </div>
      </div>
      <div style={{ padding: '16px 18px 20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 4 }}>{tmpl.name}</h3>
        <p style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.55, marginBottom: 14 }}>{tmpl.desc}</p>
        <div style={{ padding: '8px 12px', borderRadius: 8, background: isSelected ? 'rgba(108,71,255,0.08)' : '#F8F8FC', color: isSelected ? '#6C47FF' : '#6B7280', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, border: `1px solid ${isSelected ? 'rgba(108,71,255,0.2)' : 'rgba(0,0,0,0.06)'}` }}>
          {isSelected ? '✓ Selected' : 'Use Template →'}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { selectedTemplate, setTemplate, resume } = useResumeStore();
  const [publicData, setPublicData]       = useState(null);
  const [activeFilter, setActiveFilter]   = useState('all');
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [interactions, setInteractions]   = useState({ likes: 0, views: 0, comments: [] });
  const [allowRecruiterView, setAllowRecruiterView] = useState(user?.allowRecruiterView || false);
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const prevInteractions = useRef({ likes: 0, views: 0, comments: 0 });

  // ── Real-time resume data ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, 'resumes', user.uid), (snap) => {
      if (snap.exists()) setPublicData(snap.data());
    }, console.error);
    return () => unsub();
  }, [user?.uid]);

  // ── Real-time HR interaction analytics (onSnapshot, not one-time getDocs) ──
  useEffect(() => {
    if (!user?.uid) return;
    const unsubViews    = onSnapshot(collection(db, 'interactions', user.uid, 'views'),    viewsSnap    => {
      setInteractions(prev => {
        const next = { ...prev, views: viewsSnap.size };
        if (viewsSnap.size > prevInteractions.current.views) setHasNewActivity(true);
        prevInteractions.current.views = viewsSnap.size;
        return next;
      });
    }, console.error);
    const unsubLikes    = onSnapshot(collection(db, 'interactions', user.uid, 'likes'),    likesSnap    => {
      setInteractions(prev => {
        const next = { ...prev, likes: likesSnap.size };
        if (likesSnap.size > prevInteractions.current.likes) setHasNewActivity(true);
        prevInteractions.current.likes = likesSnap.size;
        return next;
      });
    }, console.error);
    const unsubComments = onSnapshot(collection(db, 'interactions', user.uid, 'comments'), commentsSnap => {
      const comments = commentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInteractions(prev => {
        if (commentsSnap.size > prevInteractions.current.comments) setHasNewActivity(true);
        prevInteractions.current.comments = commentsSnap.size;
        return { ...prev, comments };
      });
    }, console.error);
    return () => { unsubViews(); unsubLikes(); unsubComments(); };
  }, [user?.uid]);

  const toggleVisibility = async () => {
    if (!user?.uid) return;
    const newVal = !allowRecruiterView;
    setAllowRecruiterView(newVal);
    try {
      await updateDoc(doc(db, 'users', user.uid), { allowRecruiterView: newVal });
      toast.success(newVal ? 'Your CV is now visible to HRs! 🚀' : 'Your CV is now private. 🔒');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update visibility.');
      setAllowRecruiterView(!newVal);
    }
  };

  const handleSelect = (id) => { setTemplate(id); navigate('/editor'); };
  const publicUrl = `${window.location.origin}/p/${user?.uid}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success('Link copied! 🔗');
  };

  const filtered = activeFilter === 'all'
    ? TEMPLATES
    : activeFilter === 'photo'
    ? TEMPLATES.filter(t => t.hasPhoto)
    : TEMPLATES.filter(t => !t.hasPhoto);

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#0A0A10' : '#FDFCFF', transition: 'background 0.3s ease' }}>

      {/* ── Navbar ── */}
      <nav className="dashboard-nav" style={{ position: 'sticky', top: 0, zIndex: 50, background: isDark ? 'rgba(10,10,16,0.95)' : 'rgba(253,252,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`, padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6', border: 'none', cursor: 'pointer',
              color: isDark ? '#A1A1BB' : '#374151', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'; e.currentTarget.style.color = isDark ? '#F0F0FF' : '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6'; e.currentTarget.style.color = isDark ? '#A1A1BB' : '#374151'; }}
            aria-label="Go Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img src="/logo.png" alt="Social-CV" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
            <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#F0F0FF' : '#0D0D0F', letterSpacing: '-0.01em' }}>
              Social<span style={{ color: '#6C47FF' }}>-CV</span>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setShowCoverLetter(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(108,71,255,0.1), rgba(74,47,217,0.08))', border: '1.5px solid rgba(108,71,255,0.25)', color: '#6C47FF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.2s' }}
          >
            <Mail size={14} /> Cover Letter
          </button>

          {/* ── Dark Mode Toggle ── */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isDark ? 'rgba(108,71,255,0.15)' : '#F3F4F6',
              color: isDark ? '#A78BFA' : '#6B7280',
              transition: 'all 0.25s ease',
              boxShadow: isDark ? '0 0 0 1px rgba(108,71,255,0.3)' : 'none',
            }}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={17} />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={17} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <ProfileDropdown user={user} logout={logout} theme={isDark ? 'dark' : 'light'} />
        </div>
      </nav>

      <div className="dashboard-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>

        {/* ── Page header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(108,71,255,0.08)', borderRadius: 999, border: '1px solid rgba(108,71,255,0.18)', marginBottom: 16 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6C47FF' }}>✦ 6 TEMPLATES AVAILABLE</span>
          </div>
          <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: isDark ? '#F0F0FF' : '#0D0D0F', letterSpacing: '-0.04em', marginBottom: 10 }}>
            Choose your template
          </h1>
          <p style={{ fontSize: '1rem', color: isDark ? '#A1A1BB' : '#5A5A72' }}>Pick a design and start building your resume instantly. You can switch anytime.</p>
        </motion.div>



        {/* ── Public link panel ── */}
        {publicData && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            style={{ background: isDark ? '#111118' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 18, padding: '22px 26px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,71,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={20} style={{ color: '#6C47FF' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#F0F0FF' : '#0D0D0F', marginBottom: 2 }}>Your Public Link is Live!</p>
                <p style={{ fontSize: '0.8rem', color: isDark ? '#A1A1BB' : '#6B7280' }}>Share with recruiters and on your LinkedIn profile.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 420 }}>
              <div style={{ flex: 1, padding: '9px 14px', background: isDark ? '#0A0A10' : '#F8F8FC', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
                <span style={{ fontSize: '0.78rem', color: isDark ? '#A1A1BB' : '#5A5A72', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{publicUrl}</span>
              </div>
              <button onClick={handleCopyLink} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(108,71,255,0.1)', border: '1px solid rgba(108,71,255,0.2)', color: '#6C47FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Copy size={15} />
              </button>
              <a href={publicUrl} target="_blank" rel="noreferrer" style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.06)' : '#F8F8FC', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: isDark ? '#A1A1BB' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <ExternalLink size={15} />
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Eye size={16} style={{ color: '#6C47FF' }} />
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isDark ? '#F0F0FF' : '#0D0D0F' }}>{publicData.views || 0}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Link Views</span>
            </div>
          </motion.div>
        )}

        {/* ── HR Analytics & Visibility Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: 'linear-gradient(135deg, #0A0A10 0%, #1A1A24 100%)', borderRadius: 20, padding: '32px', color: '#F0F0FF', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, boxShadow: '0 24px 60px rgba(10,10,16,0.15)', position: 'relative' }}
        >
          {/* New Activity Badge */}
          <AnimatePresence>
            {hasNewActivity && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                onClick={() => setHasNewActivity(false)}
                style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6, background: '#EF4444', borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}
              >
                <Bell size={12} color="#fff" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>New Activity!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ fontSize: '1.6rem' }}>🚀</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Get Discovered by HRs</h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 1.6, marginBottom: 24, maxWidth: 440 }}>
              Allow top recruiters to discover your CV in their talent feed. Toggle off anytime to stay private.
            </p>
            {/* Toggle Switch */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ width: 52, height: 28, borderRadius: 999, background: allowRecruiterView ? '#10B981' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'all 0.3s ease' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: allowRecruiterView ? 27 : 3, transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: allowRecruiterView ? '#10B981' : '#9CA3AF' }}>
                {allowRecruiterView ? 'Recruiters can see your CV' : 'Your CV is Private'}
              </span>
              <input type="checkbox" checked={allowRecruiterView} onChange={toggleVisibility} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'HR Views',            value: interactions.views,           color: '#6C47FF' },
              { label: 'Shortlists',           value: interactions.likes,           color: '#EF4444' },
              { label: 'Feedback',             value: interactions.comments.length, color: '#F59E0B' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px', minWidth: 120 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
                <motion.div key={value} initial={{ scale: 1.3 }} animate={{ scale: 1 }} style={{ fontSize: '2.2rem', fontWeight: 800, color }}>{value}</motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── HR Feedback Comments ── */}
        {interactions.comments.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D0D0F', marginBottom: 16 }}>💬 Feedback from Recruiters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {interactions.comments.map((c, i) => (
                <div key={c.id || i} style={{ background: isDark ? '#1A1A24' : '#F8F8FC', borderRadius: 12, padding: '16px 20px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6C47FF', marginBottom: 6 }}>
                    {c.hrName || 'Anonymous HR'}{c.hrCompany ? ` · ${c.hrCompany}` : ''}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: isDark ? '#D1D1E0' : '#374151', lineHeight: 1.5 }}>{c.text}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[
            { key: 'all',      label: `All Templates (${TEMPLATES.length})` },
            { key: 'nophoto',  label: '✏️ No Photo' },
            { key: 'photo',    label: '📷 With Photo' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveFilter(key)}
              style={{ padding: '8px 18px', borderRadius: 999, border: `1.5px solid ${activeFilter === key ? '#6C47FF' : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`, background: activeFilter === key ? 'rgba(108,71,255,0.08)' : isDark ? 'rgba(255,255,255,0.04)' : '#fff', color: activeFilter === key ? '#6C47FF' : isDark ? '#A1A1BB' : '#6B7280', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.18s ease' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Template Grid ── */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {filtered.map((tmpl, idx) => (
            <TemplateCard key={tmpl.id} tmpl={tmpl} isSelected={selectedTemplate === tmpl.id} onClick={() => handleSelect(tmpl.id)} idx={idx} />
          ))}
        </div>
      </div>

      {showCoverLetter && <CoverLetterModal onClose={() => setShowCoverLetter(false)} />}

      {/* ── Floating Switch to HR Mode button ── */}
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        onClick={() => navigate('/auth?role=hr')}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 20px', borderRadius: 999,
          background: 'linear-gradient(135deg, #1A1A24, #0A0A10)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff', fontSize: '0.82rem', fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
          fontFamily: 'Inter',
        }}
        whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.32)' }}
        whileTap={{ scale: 0.97 }}
      >
        <Repeat2 size={15} />
        Switch to HR Mode
      </motion.button>
    </div>
  );
}
