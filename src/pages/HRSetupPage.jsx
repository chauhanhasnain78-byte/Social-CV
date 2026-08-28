import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from '@/components/ui/Toast';
import { Building2, Briefcase, FileText, ArrowRight, Loader2, LogOut, MapPin } from 'lucide-react';
import ProfileDropdown from '@/components/ui/ProfileDropdown';

const JOB_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'UI/UX Designer', 'Data Analyst', 'Data Scientist', 'Product Manager',
  'DevOps Engineer', 'Mobile Developer', 'Machine Learning Engineer',
  'Business Analyst', 'QA Engineer', 'Sales Executive', 'Marketing Manager',
  'HR Manager', 'Finance Analyst', 'Content Writer', 'Graphic Designer',
  'Other',
];

function SmartLocationField({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!value || value.trim().length < 2 || !showDropdown) {
      setApiSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(value) + '&layer=city&limit=5');
        const data = await res.json();
        const results = [];
        if (data && data.features) {
          data.features.forEach(f => {
            const p = f.properties;
            let fullName = p.name;
            if (p.state && p.state !== p.name) fullName += ', ' + p.state;
            if (p.country) fullName += ', ' + p.country;
            if (!results.find(r => r.full === fullName)) {
              results.push({ city: p.name, state: p.state || '', country: p.country || '', full: fullName });
            }
          });
        }
        setApiSuggestions(results);
      } catch (err) {
        console.error('Location fetch error:', err);
      }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [value, showDropdown]);

  const handleBlur = () => {
    setTimeout(() => { setShowDropdown(false); setActiveIndex(-1); }, 200);
  };

  const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  const handleChange = (e) => {
    const val = toTitleCase(e.target.value);
    onChange(val);
    setActiveIndex(-1);
    setShowDropdown(val.trim() !== '');
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.full);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const fallbackSuggestions = !value ? [
    { city: 'Mumbai', state: 'Maharashtra', country: 'India', full: 'Mumbai, Maharashtra, India' },
    { city: 'Delhi', state: '', country: 'India', full: 'Delhi, India' },
    { city: 'Bangalore', state: 'Karnataka', country: 'India', full: 'Bangalore, Karnataka, India' },
    { city: 'Remote', state: '', country: '', full: 'Remote' }
  ] : [];

  const displaySuggestions = value && value.trim().length >= 2 ? apiSuggestions : fallbackSuggestions;

  const handleKeyDown = (e) => {
    if (!showDropdown || displaySuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < displaySuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (activeIndex >= 0 && activeIndex < displaySuggestions.length) {
        e.preventDefault();
        handleSelect(displaySuggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Location *</label>
      <div style={{ position: 'relative' }}>
        <MapPin size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          type="text" required placeholder="e.g. Bhopal"
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          className="glass-input"
          style={{ width: '100%', paddingLeft: 42 }}
        />
        {loading && value && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <div style={{ width: 14, height: 14, border: '2px solid #E5E7EB', borderTopColor: '#6C47FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{'@keyframes spin { 100% { transform: rotate(360deg); } }'}</style>
          </div>
        )}
      </div>
      {showDropdown && displaySuggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden', padding: 4 }}>
          {displaySuggestions.map((sugg, i) => (
            <div
              key={i} id={'loc-sugg-' + i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(sugg); }}
              onMouseEnter={() => setActiveIndex(i)}
              style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: activeIndex === i ? 'rgba(108,71,255,0.08)' : 'transparent', transition: 'background 0.1s' }}
            >
              <MapPin size={14} color={activeIndex === i ? '#6C47FF' : '#9CA3AF'} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0D0D0F' }}>{sugg.city}</div>
                {(sugg.state || sugg.country) && (
                  <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                    {sugg.state && sugg.country ? `${sugg.state}, ${sugg.country}` : sugg.state || sugg.country}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const POPULAR_COMPANIES = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla",
  "Adobe", "Salesforce", "Uber", "Airbnb", "Spotify", "Stripe",
  "TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra",
  "IBM", "Oracle", "Cisco", "Intel", "Cognizant", "Accenture", "Capgemini",
  "Deloitte", "PwC", "EY", "KPMG", "Goldman Sachs", "JPMorgan Chase", "Morgan Stanley",
  "Paytm", "Flipkart", "Zomato", "Swiggy", "Ola", "Razorpay", "Cred", "Zerodha"
];

function SmartCompanyField({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  const handleChange = (e) => {
    let val = e.target.value.replace(/[^a-zA-Z0-9\s.&-]/g, '');
    
    // Gibberish guard (Smart implementation)
    if (val) {
      if (/([a-zA-Z])\1{3,}/.test(val.toLowerCase())) return;
      if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(val.replace(/[\s0-9]/g, ''))) return;
    }

    val = toTitleCase(val);
    onChange(val);
    setActiveIndex(-1);
    setShowDropdown(val.trim() !== '');
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => { setShowDropdown(false); setActiveIndex(-1); }, 200);
  };

  // Filter based on input, hide if exact match
  const displaySuggestions = POPULAR_COMPANIES
    .filter(c => c.toLowerCase().includes((value || '').toLowerCase()))
    .filter(c => c.toLowerCase() !== (value || '').trim().toLowerCase())
    .slice(0, 5);

  const handleKeyDown = (e) => {
    if (!showDropdown || displaySuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < displaySuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (activeIndex >= 0 && activeIndex < displaySuggestions.length) {
        e.preventDefault();
        handleSelect(displaySuggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Company Name *</label>
      <div style={{ position: 'relative' }}>
        <Building2 size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          type="text" required placeholder="e.g. Google, Infosys, Startup XYZ"
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          className="glass-input"
          style={{ width: '100%', paddingLeft: 42 }}
        />
      </div>
      {showDropdown && displaySuggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden', padding: 4 }}>
          {displaySuggestions.map((sugg, i) => (
            <div
              key={i} id={'comp-sugg-' + i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(sugg); }}
              onMouseEnter={() => setActiveIndex(i)}
              style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: activeIndex === i ? 'rgba(108,71,255,0.08)' : 'transparent', transition: 'background 0.1s' }}
            >
              <Building2 size={14} color={activeIndex === i ? '#6C47FF' : '#9CA3AF'} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0D0D0F' }}>{sugg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const POPULAR_HR_TITLES = [
  "Recruiter", "Senior Recruiter", "Talent Acquisition Specialist", "Talent Acquisition Manager", 
  "HR Manager", "HR Generalist", "HR Director", "VP of Human Resources", "Technical Recruiter", 
  "Hiring Manager", "Founder", "CEO", "CTO", "Head of People", "People Operations Manager",
  "Talent Sourcer", "Chief Human Resources Officer"
];

function SmartTitleField({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  const handleChange = (e) => {
    let val = e.target.value.replace(/[^a-zA-Z\s.-]/g, '');

    // Gibberish guard (Smart implementation)
    if (val) {
      if (/([a-zA-Z])\1{3,}/.test(val.toLowerCase())) return;
      if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(val.replace(/[\s0-9]/g, ''))) return;
    }

    val = toTitleCase(val);
    onChange(val);
    setActiveIndex(-1);
    setShowDropdown(val.trim() !== '');
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => { setShowDropdown(false); setActiveIndex(-1); }, 200);
  };

  // Filter based on input, hide if exact match
  const displaySuggestions = POPULAR_HR_TITLES
    .filter(c => c.toLowerCase().includes((value || '').toLowerCase()))
    .filter(c => c.toLowerCase() !== (value || '').trim().toLowerCase())
    .slice(0, 5);

  const handleKeyDown = (e) => {
    if (!showDropdown || displaySuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < displaySuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (activeIndex >= 0 && activeIndex < displaySuggestions.length) {
        e.preventDefault();
        handleSelect(displaySuggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Your Job Title (optional)</label>
      <div style={{ position: 'relative' }}>
        <Briefcase size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input
          type="text" placeholder="e.g. Senior HR Manager, Talent Acquisition Lead"
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          className="glass-input"
          style={{ width: '100%', paddingLeft: 42 }}
        />
      </div>
      {showDropdown && displaySuggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden', padding: 4 }}>
          {displaySuggestions.map((sugg, i) => (
            <div
              key={i} id={'title-sugg-' + i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(sugg); }}
              onMouseEnter={() => setActiveIndex(i)}
              style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: activeIndex === i ? 'rgba(108,71,255,0.08)' : 'transparent', transition: 'background 0.1s' }}
            >
              <Briefcase size={14} color={activeIndex === i ? '#6C47FF' : '#9CA3AF'} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0D0D0F' }}>{sugg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HRSetupPage() {
  const { user, logout, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: user?.company || '',
    yourTitle: user?.yourTitle || '',
    hiringFor: JOB_ROLES.includes(user?.hiringFor) ? user?.hiringFor : (user?.hiringFor ? 'Other' : ''),
    customRole: !JOB_ROLES.includes(user?.hiringFor) && user?.hiringFor ? user?.hiringFor : '',
    jobDescription: user?.jobDescription || '',
    location: user?.location || '',
    employmentType: user?.employmentType || 'Full-time',
  });
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!user) return;
    
    const timeout = setTimeout(async () => {
      try {
        const finalRole = form.hiringFor === 'Other' ? form.customRole : form.hiringFor;
        await updateDoc(doc(db, 'users', user.uid), {
          company: form.company.trim(),
          yourTitle: form.yourTitle.trim(),
          hiringFor: finalRole,
          jobDescription: form.jobDescription.trim(),
          location: form.location.trim(),
          employmentType: form.employmentType,
          hrSetupDone: !!(form.company.trim() && form.hiringFor && form.jobDescription.trim().length >= 30),
        });
        await refreshUserProfile();
      } catch (err) {
        console.error("Auto save failed", err);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form]); // removed user to prevent infinite loop on refreshUserProfile

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company.trim()) { toast.error('Company name required'); return; }
    if (!form.hiringFor) { toast.error('Select the role you are hiring for'); return; }
    if (form.jobDescription.trim().length < 30) { toast.error('Job description too short (min 30 characters)'); return; }

    const isGibberish = (text) => {
      if (!text) return false;
      if (/([a-zA-Z])\1{3,}/.test(text.toLowerCase())) return true; // 4+ repeating letters
      if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(text.replace(/[\s0-9]/g, ''))) return true; // 6+ consonants in a row (ignore spaces/numbers)
      return false;
    };

    if (isGibberish(form.company)) { toast.error('Please enter a proper Company Name'); return; }
    if (isGibberish(form.yourTitle)) { toast.error('Please enter a proper Job Title'); return; }
    if (form.hiringFor === 'Other' && isGibberish(form.customRole)) { toast.error('Please enter a proper Role'); return; }

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
      {/* ── Premium Navbar ── */}
      <nav style={{ 
        width: '100%', padding: '0 40px', height: 64, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(253,252,255,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Social-CV" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
          <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D0D0F', letterSpacing: '-0.01em' }}>
            Social<span style={{ color: '#6C47FF' }}>-CV</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProfileDropdown user={user} logout={logout} theme="light" />
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
          <SmartCompanyField value={form.company} onChange={val => setForm({ ...form, company: val })} />

          {/* Your Title */}
          <SmartTitleField value={form.yourTitle} onChange={val => setForm({ ...form, yourTitle: val })} />

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
                onChange={e => {
                  let val = e.target.value.replace(/[^a-zA-Z\s.-]/g, '');
                  if (val) {
                    if (/([a-zA-Z])\1{3,}/.test(val.toLowerCase())) return;
                    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(val.replace(/[\s0-9]/g, ''))) return;
                    val = val.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
                  }
                  setForm({ ...form, customRole: val });
                }}
                className="glass-input"
                style={{ width: '100%' }}
              />
            </div>
          )}

          {/* Location + Type row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SmartLocationField 
              value={form.location} 
              onChange={val => setForm({ ...form, location: val })} 
            />
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
