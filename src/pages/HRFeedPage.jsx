import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
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
function CandidateCard({ candidate, hrUser, onPass }) {
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
      if (seekerUids.length === 0) {
        // Fallback to dummy candidate so user can see how it looks
        setCandidates([
          {
            uid: 'dummy_1',
            resume: {
              personalInfo: { firstName: 'Sarah', lastName: 'Jenkins', jobTitle: 'Senior UI/UX Engineer', city: 'San Francisco, CA', email: 'sarah@example.com' },
              skills: [{name: 'React'}, {name: 'TypeScript'}, {name: 'Framer Motion'}, {name: 'UI Design'}],
              experience: [{ role: 'Lead Frontend Engineer', company: 'TechCorp', bullets: ['Led the redesign of the main dashboard, improving load times by 40% and increasing user engagement by 25%.'] }]
            },
            templateId: 'minimal-pro',
            themeColor: '#6C47FF'
          },
          {
            uid: 'dummy_2',
            resume: {
              personalInfo: { firstName: 'Michael', lastName: 'Chen', jobTitle: 'Full Stack Developer', city: 'Remote', email: 'michael.c@example.com' },
              skills: [{name: 'Node.js'}, {name: 'Express'}, {name: 'MongoDB'}, {name: 'React'}, {name: 'AWS'}],
              experience: [{ role: 'Backend Developer', company: 'CloudSync Inc.', bullets: ['Architected scalable microservices handling 1M+ daily requests. Reduced server costs by 30%.'] }]
            },
            templateId: 'modern-split',
            themeColor: '#3B82F6'
          },
          {
            uid: 'dummy_3',
            resume: {
              personalInfo: { firstName: 'Aisha', lastName: 'Patel', jobTitle: 'Product Manager', city: 'New York, NY', email: 'apatel@example.com' },
              skills: [{name: 'Agile'}, {name: 'Scrum'}, {name: 'Jira'}, {name: 'Data Analysis'}, {name: 'Roadmapping'}],
              experience: [{ role: 'Senior Product Manager', company: 'FinTech Solutions', bullets: ['Launched 3 major features resulting in $2M+ ARR increase within the first year of release.'] }]
            },
            templateId: 'classic-elegant',
            themeColor: '#10B981'
          },
          {
            uid: 'dummy_4',
            resume: {
              personalInfo: { firstName: 'David', lastName: 'Kim', jobTitle: 'Data Scientist', city: 'Seattle, WA', email: 'dkim.data@example.com' },
              skills: [{name: 'Python'}, {name: 'Machine Learning'}, {name: 'SQL'}, {name: 'TensorFlow'}, {name: 'Pandas'}],
              experience: [{ role: 'Data Scientist', company: 'Retail AI', bullets: ['Built recommendation engine that improved cross-sell conversion by 18% across 5M+ users.'] }]
            },
            templateId: 'minimal-pro',
            themeColor: '#F59E0B'
          },
          {
            uid: 'dummy_5',
            resume: {
              personalInfo: { firstName: 'Elena', lastName: 'Rodriguez', jobTitle: 'Marketing Director', city: 'Austin, TX', email: 'elena.marketing@example.com' },
              skills: [{name: 'SEO/SEM'}, {name: 'Content Strategy'}, {name: 'Google Analytics'}, {name: 'Brand Management'}],
              experience: [{ role: 'Head of Marketing', company: 'GrowthX', bullets: ['Grew organic traffic by 150% in 12 months. Managed a team of 12 marketers and $5M ad budget.'] }]
            },
            templateId: 'modern-split',
            themeColor: '#EC4899'
          },
          {
            uid: 'dummy_6',
            resume: {
              personalInfo: { firstName: 'James', lastName: 'Wilson', jobTitle: 'DevOps Engineer', city: 'Chicago, IL', email: 'j.wilson.ops@example.com' },
              skills: [{name: 'Kubernetes'}, {name: 'Docker'}, {name: 'CI/CD'}, {name: 'Terraform'}, {name: 'AWS'}],
              experience: [{ role: 'DevOps Lead', company: 'SecureNet', bullets: ['Automated deployment pipelines reducing release time from 4 hours to 15 minutes with zero downtime.'] }]
            },
            templateId: 'minimal-pro',
            themeColor: '#6366F1'
          }
        ]);
        setLoading(false);
        return;
      }

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFFBEB 0%, #FDFCFF 60%, #FFF8F0 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(253,252,255,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Social-CV" style={{ height: 42, objectFit: 'contain' }} />
            <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.01em' }}>
              Social<span style={{ color: '#6C47FF' }}>-CV</span>
            </span>
          </div>
          <div style={{ height: 24, width: 1, background: 'rgba(0,0,0,0.1)' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.01em' }}>Talent Feed</div>
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
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 44px', background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 999, color: '#0D0D0F', fontSize: '0.88rem', outline: 'none', fontFamily: 'Inter', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(108,71,255,0.4)'; e.target.style.boxShadow = '0 4px 12px rgba(108,71,255,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.08)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'; }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/hr-setup')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', color: '#374151', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            onMouseOver={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#6C47FF'; e.currentTarget.style.borderColor = 'rgba(108,71,255,0.2)' }}
            onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}>
            <Settings size={14} /> Edit Job
          </button>
          <ProfileDropdown user={user} logout={handleLogout} theme="light" />
        </div>
      </nav>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: 'auto', scrollSnapType: 'y mandatory', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D0D0F' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="animate-spin" style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid rgba(108,71,255,0.2)', borderTopColor: '#6C47FF', margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading talent pool…</div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 400, color: '#0D0D0F' }}>
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
          </div>
        ) : (
          filtered.map((candidate, i) => (
            <div key={candidate.uid} style={{ 
              scrollSnapAlign: 'start', scrollSnapStop: 'always',
              minHeight: 'calc(100vh - 72px)', /* 72px is navbar height */
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              padding: '32px 24px'
            }}>
              <CandidateCard
                candidate={candidate}
                hrUser={user}
                onPass={() => handlePass(candidate.uid)}
              />
            </div>
          ))
        )}
      </div>

      {/* ── Bottom stats ── */}
      {!loading && filtered.length > 0 && (
        <div style={{ padding: '12px 24px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', color: '#6B7280', fontSize: '0.78rem' }}>
          👔 Hiring for <strong style={{ color: '#F59E0B' }}>{user?.hiringFor || 'Open Role'}</strong>
          {user?.company && <> at <strong style={{ color: '#0D0D0F' }}>{user.company}</strong></>}
          &nbsp;·&nbsp; {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} in queue
          {passedUids.size > 0 && <> · <span style={{ color: '#6C47FF' }}>{passedUids.size} passed</span></>}
        </div>
      )}

      {/* ── Floating Switch to Seeker Mode ── */}
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        onClick={() => navigate('/auth?role=seeker')}
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 999, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', color: '#374151', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', fontFamily: 'Inter' }}
        whileHover={{ scale: 1.04, background: '#F9FAFB', color: '#6C47FF' }}
        whileTap={{ scale: 0.97 }}
      >
        <Repeat2 size={15} /> Switch to Seeker Mode
      </motion.button>
    </div>
  );
}
