import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import {
  collection, query, where, getDocs, doc, getDoc,
  setDoc, deleteDoc, addDoc, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { toast } from '@/components/ui/Toast';
import { ResumePreview } from '@/components/preview/ResumePreview';
import {
  Heart, MessageSquare, Eye, ChevronDown, ChevronUp,
  X, Send, Briefcase, MapPin, Search, LogOut, Settings, Repeat2,
} from 'lucide-react';

// ── Full CV Modal ─────────────────────────────────────────────────────────────
function FullCVModal({ candidateId, candidateResume, templateId, themeColor, fontFamily, onClose, hrUser }) {
  useEffect(() => {
    const viewRef = doc(db, 'interactions', candidateId, 'views', hrUser.uid);
    setDoc(viewRef, {
      hrUid: hrUser.uid,
      hrName: hrUser.displayName || hrUser.email,
      hrCompany: hrUser.company || '',
      timestamp: serverTimestamp(),
    }).catch(console.error);
  }, [candidateId, hrUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 820, maxHeight: '90vh', overflow: 'auto', borderRadius: 20, boxShadow: '0 40px 100px rgba(0,0,0,0.5)', background: '#fff', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'sticky', top: 12, right: 12, float: 'right', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, marginRight: 12, marginTop: 12 }}>
          <X size={18} />
        </button>
        <div style={{ clear: 'both' }} />
        <ResumePreview resume={candidateResume} templateId={templateId || 'minimal-pro'} themeColor={themeColor || '#6C47FF'} fontFamily={fontFamily || 'inter'} />
      </motion.div>
    </motion.div>
  );
}

// ── Comment Drawer ────────────────────────────────────────────────────────────
function CommentDrawer({ candidateId, hrUser, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const commentsRef = collection(db, 'interactions', candidateId, 'comments');
    const unsub = onSnapshot(commentsRef, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)));
    });
    return unsub;
  }, [candidateId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'interactions', candidateId, 'comments'), {
        hrUid: hrUser.uid,
        hrName: hrUser.displayName || hrUser.email,
        hrCompany: hrUser.company || '',
        text: text.trim(),
        timestamp: serverTimestamp(),
      });
      setText('');
      toast.success('Feedback sent to candidate!', { title: '💬 Comment Sent' });
    } catch (err) {
      toast.error('Failed to send comment.');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, background: '#fff', zIndex: 200, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0D0D0F' }}>💬 Give Feedback</div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>The candidate will see your message</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={20} color="#6B7280" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {comments.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem', marginTop: 40 }}>No feedback yet. Be the first!</div>
        )}
        {comments.map(c => (
          <div key={c.id} style={{ background: '#F9FAFB', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6C47FF', marginBottom: 4 }}>
              {c.hrName} {c.hrCompany ? `· ${c.hrCompany}` : ''}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>{c.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8 }}>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="e.g. Great profile! Missing GitHub projects…"
          rows={3}
          style={{ flex: 1, borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.12)', padding: '10px 12px', fontSize: '0.85rem', fontFamily: 'Inter', resize: 'none', outline: 'none', color: '#374151' }}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSend(); }}
        />
        <button onClick={handleSend} disabled={sending || !text.trim()}
          style={{ background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)', border: 'none', borderRadius: 12, width: 44, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!text.trim() || sending) ? 0.5 : 1 }}
        >
          <Send size={18} color="#fff" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Candidate Card ────────────────────────────────────────────────────────────
function CandidateCard({ candidate, hrUser, onNext, onPrev, onPass, totalCount, currentIndex }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showFullCV, setShowFullCV] = useState(false);
  const { resume, templateId, themeColor, fontFamily } = candidate;
  const name = `${resume?.personalInfo?.firstName || ''} ${resume?.personalInfo?.lastName || ''}`.trim() || 'Anonymous';
  const headline = resume?.personalInfo?.jobTitle || 'Professional';
  const skills = resume?.skills?.filter(s => s.name)?.slice(0, 4) || [];
  const latestExp = resume?.experience?.[0];

  useEffect(() => {
    if (!candidate.uid) return;
    getDoc(doc(db, 'interactions', candidate.uid, 'likes', hrUser.uid)).then(snap => { if (snap.exists()) setLiked(true); });
    getDocs(collection(db, 'interactions', candidate.uid, 'likes')).then(snap => setLikeCount(snap.size));
  }, [candidate.uid, hrUser.uid]);

  const handleLike = async () => {
    const likeRef = doc(db, 'interactions', candidate.uid, 'likes', hrUser.uid);
    if (liked) {
      await deleteDoc(likeRef);
      setLiked(false);
      setLikeCount(c => Math.max(0, c - 1));
    } else {
      await setDoc(likeRef, { hrUid: hrUser.uid, hrName: hrUser.displayName || hrUser.email, hrCompany: hrUser.company || '', timestamp: serverTimestamp() });
      setLiked(true);
      setLikeCount(c => c + 1);
      toast.success('Candidate shortlisted! ❤️');
    }
  };

  return (
    <motion.div
      key={candidate.uid}
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.14)', overflow: 'hidden', position: 'relative' }}
    >
      {/* Top gradient strip */}
      <div style={{ background: `linear-gradient(135deg, ${themeColor || '#6C47FF'}22, ${themeColor || '#6C47FF'}08)`, borderBottom: `3px solid ${themeColor || '#6C47FF'}30`, padding: '28px 28px 20px' }}>
        {/* Counter dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9CA3AF' }}>{currentIndex + 1} / {totalCount} candidates</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: Math.min(totalCount, 5) }).map((_, i) => (
              <div key={i} style={{ width: i === currentIndex % 5 ? 20 : 6, height: 6, borderRadius: 999, background: i === currentIndex % 5 ? (themeColor || '#6C47FF') : '#E5E7EB', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>

        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${themeColor || '#6C47FF'}, ${themeColor || '#6C47FF'}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', boxShadow: `0 6px 20px ${themeColor || '#6C47FF'}40` }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.03em' }}>{name}</div>
            <div style={{ fontSize: '0.88rem', color: themeColor || '#6C47FF', fontWeight: 600 }}>{headline}</div>
            {resume?.personalInfo?.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>
                <MapPin size={11} /> {resume.personalInfo.city}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map((s, i) => (
              <span key={i} style={{ padding: '4px 10px', borderRadius: 999, background: `${themeColor || '#6C47FF'}15`, border: `1px solid ${themeColor || '#6C47FF'}30`, fontSize: '0.72rem', fontWeight: 600, color: themeColor || '#6C47FF' }}>
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Latest experience */}
      {latestExp && (
        <div style={{ padding: '16px 28px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Latest Experience</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0D0D0F' }}>{latestExp.role || 'Role'}</div>
          <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{latestExp.company || ''}</div>
          {latestExp.bullets?.[0] && (
            <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>
              • {latestExp.bullets[0].substring(0, 100)}{latestExp.bullets[0].length > 100 ? '…' : ''}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ padding: '16px 28px', display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* ❌ Pass */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={onPass}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', cursor: 'pointer', background: '#F9FAFB', color: '#6B7280', fontWeight: 700, fontSize: '0.82rem' }}
        >
          <X size={14} /> Pass
        </motion.button>
        {/* ❤️ Like */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={handleLike}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer', background: liked ? 'linear-gradient(135deg,#FF6B6B,#FF4444)' : '#FFF0F0', color: liked ? '#fff' : '#EF4444', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.2s' }}
        >
          <Heart size={15} fill={liked ? '#fff' : 'none'} />
          {liked ? 'Liked' : 'Like'}{likeCount > 0 ? ` (${likeCount})` : ''}
        </motion.button>
        {/* 💬 Feedback */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={() => setShowComments(true)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer', background: '#F0F4FF', color: '#6C47FF', fontWeight: 700, fontSize: '0.82rem' }}
        >
          <MessageSquare size={15} /> Feedback
        </motion.button>
        {/* 👁️ Full CV */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={() => setShowFullCV(true)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)', color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}
        >
          <Eye size={15} /> Full CV
        </motion.button>
      </div>

      {/* Prev/Next navigation */}
      <div style={{ padding: '0 28px 20px', display: 'flex', gap: 8 }}>
        <button onClick={onPrev} disabled={currentIndex === 0}
          style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: currentIndex === 0 ? 0.4 : 1, fontWeight: 600, fontSize: '0.8rem', color: '#374151' }}
        >
          <ChevronUp size={16} /> Previous
        </button>
        <button onClick={onNext} disabled={currentIndex === totalCount - 1}
          style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', cursor: currentIndex === totalCount - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: currentIndex === totalCount - 1 ? 0.5 : 1, fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}
        >
          Next <ChevronDown size={16} />
        </button>
      </div>

      <AnimatePresence>
        {showFullCV && <FullCVModal candidateId={candidate.uid} candidateResume={resume} templateId={templateId} themeColor={themeColor} fontFamily={fontFamily} hrUser={hrUser} onClose={() => setShowFullCV(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showComments && <CommentDrawer candidateId={candidate.uid} hrUser={hrUser} onClose={() => setShowComments(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main HR Feed Page ─────────────────────────────────────────────────────────
export default function HRFeedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [passedUids, setPassedUids] = useState(new Set()); // ← tracks passed candidates
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    loadCandidates();
  }, [user]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'SEEKER'), where('allowRecruiterView', '==', true))
      );
      const seekerUids = usersSnap.docs.map(d => d.id);
      if (seekerUids.length === 0) { setLoading(false); return; }

      const resumes = (await Promise.all(
        seekerUids.map(uid => getDoc(doc(db, 'resumes', uid)).then(snap => snap.exists() ? { uid, ...snap.data() } : null))
      )).filter(Boolean);
      setCandidates(resumes);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  const handlePass = (uid) => {
    setPassedUids(prev => new Set([...prev, uid]));
    // Move to next without incrementing if last
    setCurrentIndex(i => Math.min(filtered.length - 2, i));
  };

  // Filter: exclude passed candidates + search
  const filtered = candidates.filter(c => {
    if (passedUids.has(c.uid)) return false;
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    const name = `${c.resume?.personalInfo?.firstName || ''} ${c.resume?.personalInfo?.lastName || ''}`.toLowerCase();
    const title = (c.resume?.personalInfo?.jobTitle || '').toLowerCase();
    const skills = (c.resume?.skills || []).map(sk => sk.name?.toLowerCase()).join(' ');
    return name.includes(s) || title.includes(s) || skills.includes(s);
  });

  const currentCandidate = filtered[currentIndex];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0A0A10 0%, #0F0F1A 50%, #0A0A10 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,16,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Social-CV" style={{ height: 42, objectFit: 'contain' }} />
            <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F0F0FF', letterSpacing: '-0.01em' }}>
              Social<span style={{ color: '#6C47FF' }}>-CV</span>
            </span>
          </div>
          <div style={{ height: 24, width: 1, background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F0F0FF', letterSpacing: '-0.01em' }}>Talent Feed</div>
            {user?.company && (
              <div style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Briefcase size={12} /> {user.company} · {user.hiringFor || 'Recruiter'}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 400, margin: '0 32px' }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text" placeholder="Search by name, role, or skill…"
            value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentIndex(0); }}
            style={{ width: '100%', padding: '10px 16px 10px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: '#F0F0FF', fontSize: '0.88rem', outline: 'none', fontFamily: 'Inter', transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(108,71,255,0.5)'; }}
            onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.15)' }} />
            ) : (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#6C47FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 500 }}>
              Hi, <strong style={{ color: '#F0F0FF' }}>{user?.displayName?.split(' ')[0] || 'there'}</strong> 👋
            </span>
          </div>
          <button onClick={() => navigate('/hr-setup')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#F0F0FF', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
            <Settings size={14} /> Edit Job
          </button>
          <button onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#F0F0FF' }}>
            <div className="animate-spin" style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid rgba(108,71,255,0.2)', borderTopColor: '#6C47FF', margin: '0 auto 16px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading talent pool…</div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 400, color: '#F0F0FF' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>
              {passedUids.size > 0 && candidates.length > 0 ? '✅' : '🔍'}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
              {passedUids.size > 0 && candidates.length > 0 ? "You've reviewed everyone!" : searchTerm ? 'No matching candidates' : 'No candidates yet'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6 }}>
              {passedUids.size > 0 && candidates.length > 0
                ? 'Check back later for new talent.'
                : searchTerm
                ? 'Try a different skill or name.'
                : 'Job seekers who enable "Recruiter View" will appear here. Check back soon!'}
            </div>
          </motion.div>
        ) : (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              {currentCandidate && (
                <CandidateCard
                  key={currentCandidate.uid}
                  candidate={currentCandidate}
                  hrUser={user}
                  currentIndex={currentIndex}
                  totalCount={filtered.length}
                  onNext={() => setCurrentIndex(i => Math.min(filtered.length - 1, i + 1))}
                  onPrev={() => setCurrentIndex(i => Math.max(0, i - 1))}
                  onPass={() => handlePass(currentCandidate.uid)}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Bottom stats ── */}
      {!loading && filtered.length > 0 && (
        <div style={{ padding: '12px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#6B7280', fontSize: '0.78rem' }}>
          👔 Hiring for <strong style={{ color: '#F59E0B' }}>{user?.hiringFor || 'Open Role'}</strong>
          {user?.company && <> at <strong style={{ color: '#F0F0FF' }}>{user.company}</strong></>}
          &nbsp;·&nbsp; {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} in queue
          {passedUids.size > 0 && <> · <span style={{ color: '#6C47FF' }}>{passedUids.size} passed</span></>}
        </div>
      )}

      {/* ── Floating Switch to Seeker Mode ── */}
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        onClick={() => navigate('/auth?role=seeker')}
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#F0F0FF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: 'Inter' }}
        whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.12)' }}
        whileTap={{ scale: 0.97 }}
      >
        <Repeat2 size={15} /> Switch to Seeker Mode
      </motion.button>
    </div>
  );
}
