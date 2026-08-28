import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from '@/components/ui/Toast';
import { Building2, Briefcase, FileText, ArrowRight, Loader2 } from 'lucide-react';

const JOB_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'UI/UX Designer', 'Data Analyst', 'Data Scientist', 'Product Manager',
  'DevOps Engineer', 'Mobile Developer', 'Machine Learning Engineer',
  'Business Analyst', 'QA Engineer', 'Sales Executive', 'Marketing Manager',
  'HR Manager', 'Finance Analyst', 'Content Writer', 'Graphic Designer',
  'Other',
];

export default function HRSetupPage() {
  const { user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '',
    yourTitle: '',
    hiringFor: '',
    customRole: '',
    jobDescription: '',
    location: '',
    employmentType: 'Full-time',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim()) { toast.error('Company name required'); return; }
    if (!form.hiringFor) { toast.error('Select the role you are hiring for'); return; }
    if (form.jobDescription.trim().length < 30) { toast.error('Job description too short (min 30 characters)'); return; }

    setLoading(true);
    try {
      const finalRole = form.hiringFor === 'Other' ? form.customRole : form.hiringFor;
      await updateDoc(doc(db, 'users', user.uid), {
        company: form.company.trim(),
        yourTitle: form.yourTitle.trim(),
        hiringFor: finalRole,
        jobDescription: form.jobDescription.trim(),
        location: form.location.trim(),
        employmentType: form.employmentType,
        hrSetupDone: true,
      });
      await refreshUserProfile();
      toast.success('Profile saved! Opening candidate feed…', { title: '🎉 Setup Complete' });
      navigate('/hr-feed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFBEB 0%, #FDFCFF 60%, #FFF8F0 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* ── Navbar ── */}
      <nav style={{ 
        width: '100%', padding: '0 40px', height: 64, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'transparent', zIndex: 50, position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Social-CV" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.01em' }}>
            Social<span style={{ color: '#6C47FF' }}>-CV</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>
            Hi, <strong style={{ color: '#0D0D0F' }}>{user?.displayName?.split(' ')[0] || 'there'}</strong> 👋
          </span>
          <button onClick={() => useAuth().logout()} className="btn-ghost-light" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,71,255,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px 24px' }}>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: 560, position: 'relative', zIndex: 1,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
          borderRadius: 28, padding: '48px 44px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 24px 80px rgba(245,158,11,0.10), 0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>👔</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', background: 'rgba(245,158,11,0.1)', borderRadius: 999, border: '1px solid rgba(245,158,11,0.25)', marginBottom: 16 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706' }}>RECRUITER SETUP — ONE TIME ONLY</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.03em', marginBottom: 8 }}>
            Tell us who you're hiring
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6 }}>
            We'll match you with the right candidates from our talent pool.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Company Name */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Company Name *
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text" required placeholder="e.g. Google, Infosys, Startup XYZ"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="glass-input"
                style={{ paddingLeft: 42, width: '100%' }}
              />
            </div>
          </div>

          {/* Your Title */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Your Job Title (optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text" placeholder="e.g. Senior HR Manager, Talent Acquisition Lead"
                value={form.yourTitle}
                onChange={e => setForm({ ...form, yourTitle: e.target.value })}
                className="glass-input"
                style={{ paddingLeft: 42, width: '100%' }}
              />
            </div>
          </div>

          {/* Hiring For */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Hiring For *
            </label>
            <select
              required
              value={form.hiringFor}
              onChange={e => setForm({ ...form, hiringFor: e.target.value })}
              className="glass-input"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="">Select a job role…</option>
              {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Custom Role if Other selected */}
          {form.hiringFor === 'Other' && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Specify Role *
              </label>
              <input
                type="text" required placeholder="e.g. Blockchain Developer"
                value={form.customRole}
                onChange={e => setForm({ ...form, customRole: e.target.value })}
                className="glass-input"
                style={{ width: '100%' }}
              />
            </div>
          )}

          {/* Location + Type row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Location
              </label>
              <input
                type="text" placeholder="Bengaluru / Remote"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="glass-input"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Employment Type
              </label>
              <select
                value={form.employmentType}
                onChange={e => setForm({ ...form, employmentType: e.target.value })}
                className="glass-input"
                style={{ width: '100%', cursor: 'pointer' }}
              >
                {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FileText size={14} /> Job Description * <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 400 }}>(what skills / experience you need)</span>
              </span>
            </label>
            <textarea
              required rows={5}
              placeholder="e.g. We are looking for a React developer with 1-3 years experience. Must know Node.js, REST APIs, and have good communication skills…"
              value={form.jobDescription}
              onChange={e => setForm({ ...form, jobDescription: e.target.value })}
              className="glass-input"
              style={{ width: '100%', resize: 'vertical', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem' }}
            />
            <div style={{ fontSize: '0.72rem', color: form.jobDescription.length < 30 ? '#EF4444' : '#10b981', marginTop: 4, fontWeight: 500 }}>
              {form.jobDescription.length} chars {form.jobDescription.length < 30 ? `(need ${30 - form.jobDescription.length} more)` : '✓'}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03, boxShadow: '0 16px 40px rgba(245,158,11,0.35)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', padding: '15px',
              borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
              color: '#fff', fontSize: '1rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'Inter, sans-serif', marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Saving…</>
              : <> Open Talent Feed <ArrowRight size={18} /></>
            }
          </motion.button>
        </form>
      </motion.div>
      </div>
    </div>
  );
}
