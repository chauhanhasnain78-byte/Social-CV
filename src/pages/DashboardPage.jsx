import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { useAuth } from '@/context/AuthContext';
import { TEMPLATES } from '@/templates/templateMeta';
import { LogOut, FileText, CheckCircle, Share2, Copy, Eye, ExternalLink, Image, AlignLeft, Mail } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/Toast';
import { CoverLetterModal } from '@/components/CoverLetterModal';


// Mini template preview card
function TemplateCard({ tmpl, isSelected, onClick, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.14)' }}
      style={{
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        border: isSelected ? '2.5px solid #6C47FF' : '1.5px solid rgba(0,0,0,0.08)',
        boxShadow: isSelected
          ? '0 0 0 4px rgba(108,71,255,0.12), 0 12px 32px rgba(0,0,0,0.1)'
          : '0 4px 16px rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          width: 24, height: 24, borderRadius: '50%',
          background: '#6C47FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(108,71,255,0.4)',
        }}>
          <CheckCircle size={14} color="#fff" fill="#fff" />
        </div>
      )}

      {/* Color gradient preview */}
      <div style={{
        height: 130, background: tmpl.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: '3.2rem' }}>{tmpl.emoji}</span>
        {/* Photo badge */}
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 999,
            background: tmpl.hasPhoto ? 'rgba(255,107,53,0.92)' : 'rgba(108,71,255,0.92)',
            color: '#fff', fontSize: '0.62rem', fontWeight: 700,
          }}>
            {tmpl.hasPhoto ? <><Image size={10} /> With Photo</> : <><AlignLeft size={10} /> No Photo</>}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <span style={{
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(0,0,0,0.45)', color: '#fff',
            fontSize: '0.6rem', fontWeight: 600,
          }}>
            {tmpl.category}
          </span>
        </div>
      </div>

      {/* Card info */}
      <div style={{ padding: '16px 18px 20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 4 }}>{tmpl.name}</h3>
        <p style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.55, marginBottom: 14 }}>{tmpl.desc}</p>
        <div style={{
          padding: '8px 12px', borderRadius: 8,
          background: isSelected ? 'rgba(108,71,255,0.08)' : '#F8F8FC',
          color: isSelected ? '#6C47FF' : '#6B7280',
          fontSize: '0.75rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          border: `1px solid ${isSelected ? 'rgba(108,71,255,0.2)' : 'rgba(0,0,0,0.06)'}`,
        }}>
          {isSelected ? '✓ Selected' : 'Use Template →'}
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { selectedTemplate, setTemplate } = useResumeStore();
  const [publicData, setPublicData] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const ref = doc(db, 'resumes', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setPublicData(snap.data());
    }, (err) => console.error(err));
    return () => unsub();
  }, [user]);

  const handleSelect = (id) => {
    setTemplate(id);
    navigate('/editor');
  };

  const publicUrl = `${window.location.origin}/p/${user?.uid}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success('Link copied to clipboard! 🔗');
  };

  const filtered = activeFilter === 'all'
    ? TEMPLATES
    : activeFilter === 'photo'
    ? TEMPLATES.filter((t) => t.hasPhoto)
    : TEMPLATES.filter((t) => !t.hasPhoto);

  return (
    <div style={{ minHeight: '100vh', background: '#FDFCFF' }}>

      {/* ── Navbar ── */}
      <nav className="dashboard-nav" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(253,252,255,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img
            src="/logo.png"
            alt="Social-CV"
            style={{ height: 44, width: 'auto', objectFit: 'contain' }}
          />
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.01em' }}>
            Social<span style={{ color: '#6C47FF' }}>-CV</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>
            Hi, <strong style={{ color: '#0D0D0F' }}>{user?.displayName?.split(' ')[0] || 'there'}</strong> 👋
          </span>
          <button
            onClick={() => setShowCoverLetter(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(108,71,255,0.1), rgba(74,47,217,0.08))',
              border: '1.5px solid rgba(108,71,255,0.25)',
              color: '#6C47FF', fontSize: '0.82rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg,#6C47FF,#4A2FD9)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'transparent'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(108,71,255,0.1), rgba(74,47,217,0.08))'; e.currentTarget.style.color = '#6C47FF'; e.currentTarget.style.borderColor = 'rgba(108,71,255,0.25)'; }}
          >
            <Mail size={14} /> Cover Letter
          </button>
          <button
            onClick={logout}
            className="btn-ghost-light"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-pad" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 44 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(108,71,255,0.08)', borderRadius: 999, border: '1px solid rgba(108,71,255,0.18)', marginBottom: 16 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6C47FF' }}>✦ 6 TEMPLATES AVAILABLE</span>
          </div>
          <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.04em', marginBottom: 10 }}>
            Choose your template
          </h1>
          <p style={{ fontSize: '1rem', color: '#5A5A72' }}>
            Pick a design and start building your resume instantly. You can switch anytime.
          </p>
        </motion.div>

        {/* ── Public link panel ── */}
        {publicData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            style={{
              background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 18, padding: '22px 26px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 24, flexWrap: 'wrap', marginBottom: 40,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,71,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={20} style={{ color: '#6C47FF' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0D0D0F', marginBottom: 2 }}>Your Public Link is Live!</p>
                <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Share with recruiters and on your LinkedIn profile.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 420 }}>
              <div style={{ flex: 1, padding: '9px 14px', background: '#F8F8FC', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.78rem', color: '#5A5A72', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{publicUrl}</span>
              </div>
              <button onClick={handleCopyLink} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(108,71,255,0.1)', border: '1px solid rgba(108,71,255,0.2)', color: '#6C47FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Copy size={15} />
              </button>
              <a href={publicUrl} target="_blank" rel="noreferrer" style={{ width: 38, height: 38, borderRadius: 10, background: '#F8F8FC', border: '1px solid rgba(0,0,0,0.08)', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <ExternalLink size={15} />
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Eye size={16} style={{ color: '#6C47FF' }} />
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D0D0F' }}>{publicData.views || 0}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Views</span>
            </div>
          </motion.div>
        )}

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[
            { key: 'all',   label: `All Templates (${TEMPLATES.length})` },
            { key: 'nophoto', label: '✏️ No Photo' },
            { key: 'photo',   label: '📷 With Photo' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                padding: '8px 18px', borderRadius: 999,
                border: `1.5px solid ${activeFilter === key ? '#6C47FF' : 'rgba(0,0,0,0.12)'}`,
                background: activeFilter === key ? 'rgba(108,71,255,0.08)' : '#fff',
                color: activeFilter === key ? '#6C47FF' : '#6B7280',
                fontSize: '0.82rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter',
                transition: 'all 0.18s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Template grid ── */}
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {filtered.map((tmpl, idx) => (
            <TemplateCard
              key={tmpl.id}
              tmpl={tmpl}
              isSelected={selectedTemplate === tmpl.id}
              onClick={() => handleSelect(tmpl.id)}
              idx={idx}
            />
          ))}
        </div>
      </div>

      {showCoverLetter && <CoverLetterModal onClose={() => setShowCoverLetter(false)} />}
    </div>
  );
}
