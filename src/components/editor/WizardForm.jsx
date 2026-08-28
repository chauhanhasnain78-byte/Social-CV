import { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import {
  User, Mail, Phone, MapPin, Link2, FileText,
  Briefcase, GraduationCap, Code2, Plus, Trash2,
  GitFork, Globe, Camera, ChevronRight, ChevronLeft, ArrowRight, Sparkles
} from 'lucide-react';
import { TEMPLATES } from '@/templates/templateMeta';

// â”€â”€ Reusable input field (LIGHT) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Field({ label, icon: Icon, value, onChange, placeholder, type = 'text', name, onlyLetters }) {
  const handleChange = (e) => {
    let val = e.target.value;
    if (onlyLetters) {
      val = val.replace(/[^a-zA-Z\s.-]/g, '');
    }
    
    // Gibberish guard (Smart implementation)
    if (val) {
      // Only block 4+ repeating identical LETTERS (numbers can legitimately repeat, e.g. 5555)
      if (/([a-zA-Z])\1{3,}/.test(val.toLowerCase())) return; 
      // Block 6+ consecutive consonants (ignoring spaces and numbers)
      if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(val.replace(/[\s0-9]/g, ''))) return; 
    }

    e.target.value = val;
    onChange(e);
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--dm-muted-light, #9CA3AF)' }} />}
        <input
          id={`field-${name}`}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          style={{
            width: '100%', padding: '9px 12px',
            paddingLeft: Icon ? '2.3rem' : '12px',
            border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.1))',
            borderRadius: 10, fontSize: '0.85rem',
            fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; }}
        />
      </div>
    </div>
  );
}

// â”€â”€ Photo Upload (LIGHT) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PhotoUpload() {
  const { resume, updatePhoto } = useResumeStore();
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updatePhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const hasPhoto = !!resume.personal.photo;

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5 }}>Profile Photo</label>
      <div
        onClick={() => !hasPhoto && fileRef.current?.click()}
        style={{
          width: '100%', height: 96,
          border: `2px dashed ${hasPhoto ? 'rgba(108,71,255,0.4)' : 'rgba(0,0,0,0.12)'}`,
          borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 14, cursor: hasPhoto ? 'default' : 'pointer',
          background: hasPhoto ? '#F8F6FF' : '#FAFAFA',
          transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
        }}
      >
        {hasPhoto ? (
          <>
            <img src={resume.personal.photo} alt="Profile" style={{ height: '100%', width: 'auto', maxWidth: '35%', objectFit: 'cover', borderRadius: 10 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6C47FF', marginBottom: 8 }}>Photo uploaded âœ“</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  style={{ fontSize: '0.72rem', padding: '5px 12px', borderRadius: 8, background: '#F3F0FF', color: '#6C47FF', border: '1px solid rgba(108,71,255,0.25)', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600 }}
                >
                  Change
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); updatePhoto(''); }}
                  style={{ fontSize: '0.72rem', padding: '5px 12px', borderRadius: 8, background: '#FEF2F2', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F3F0FF', border: '1px solid rgba(108,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={17} style={{ color: '#6C47FF' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dm-text, #374151)', marginBottom: 2 }}>Upload your photo</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--dm-muted-light, #9CA3AF)' }}>JPG, PNG Â· Max 5MB</p>
            </div>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

// â”€â”€ "Add" button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: '100%', padding: '10px',
        borderRadius: 12, background: 'var(--dm-surface, #FAFAFA)',
        border: '1.5px dashed rgba(0,0,0,0.12)',
        color: 'var(--dm-muted, #6B7280)', fontSize: '0.82rem', fontWeight: 600,
        cursor: 'pointer', fontFamily: 'Inter',
        transition: 'all 0.18s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F0FF'; e.currentTarget.style.color = '#6C47FF'; e.currentTarget.style.borderColor = 'rgba(108,71,255,0.3)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#FAFAFA'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
    >
      <Plus size={15} /> {label}
    </button>
  );
}

// â”€â”€ Entry card wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function EntryCard({ idx, label, onRemove, children }) {
  return (
    <div style={{
      padding: '16px', borderRadius: 14, marginBottom: 16,
      background: 'var(--dm-surface, #FAFAFA)', border: '1px solid var(--dm-border, rgba(0,0,0,0.06))',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted-light, #9CA3AF)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label} {idx + 1}</span>
        <button onClick={onRemove} style={{
          color: '#EF4444', background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 6, padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}><Trash2 size={12} /></button>
      </div>
      {children}
    </div>
  );
}

// â”€â”€ Main WizardForm (LIGHT) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// -- Smart Email Field --------------------------------------------------------
function SmartEmailField({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'yahoo.in', 'rediffmail.com', 'icloud.com'];

  // Common typos map
  const TYPO_MAP = {
    'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com',
    'yahoo.co': 'yahoo.com', 'yaho.com': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'hotmail.co': 'hotmail.com'
  };

  const validateEmail = (email) => {
    // Stricter regex for email
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleBlur = (e) => {
    setTimeout(() => {
      setShowDropdown(false);
      setActiveIndex(-1);
    }, 200);
    if (value && !validateEmail(value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e) => {
    // Auto trim spaces and convert to lowercase for practicality
    const val = e.target.value.replace(/\s/g, '').toLowerCase();
    onChange(val);
    setError(false);
    setActiveIndex(-1);
    if (val) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setShowDropdown(false);
    setActiveIndex(-1);
    if (!validateEmail(suggestion)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  let suggestions = [];
  if (value) {
    const parts = value.split('@');
    const prefix = parts[0];
    const domainQuery = parts[1] || '';

    if (parts.length <= 2 && prefix.length > 0) {
      // 1. Check for typos
      if (parts.length === 2 && TYPO_MAP[domainQuery]) {
        suggestions.push(prefix + '@' + TYPO_MAP[domainQuery]);
      }
      
      // 2. Normal autocomplete
      const matches = COMMON_DOMAINS
        .filter(d => d.startsWith(domainQuery) && d !== domainQuery)
        .map(d => prefix + '@' + d);
        
      suggestions = [...new Set([...suggestions, ...matches])].filter(s => s !== value);
      
      // If user hasn't typed '@' yet, show top 3 domains
      if (parts.length === 1) {
        suggestions = COMMON_DOMAINS.slice(0, 3).map(d => prefix + '@' + d);
      }
    }
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>Email</label>
      <div style={{ position: 'relative' }}>
        <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : '#9CA3AF' }} />
        <input
          id="field-email"
          type="email"
          placeholder="you@email.com"
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value) setShowDropdown(true);
          }}
          onBlur={handleBlur}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: error ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: error ? '#FEF2F2' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
          }}
        />
        {/* Suggestion hint inside input if activeIndex is matched */}
        {activeIndex === -1 && suggestions.length > 0 && value.includes('@') && suggestions[0].startsWith(value) && (
          <div style={{ position: 'absolute', left: '2.3rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--dm-muted-light, #9CA3AF)', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
            <span style={{ opacity: 0 }}>{value}</span>
            <span>{suggestions[0].slice(value.length)}</span>
          </div>
        )}
      </div>
      {error && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          Please enter a valid email (e.g., name@gmail.com)
        </span>
      )}
      
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--dm-bg, #fff)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 12, marginTop: 6, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          zIndex: 50, overflow: 'hidden', padding: '4px'
        }}>
          <div style={{ padding: '6px 10px', fontSize: '0.65rem', fontWeight: 600, color: 'var(--dm-muted-light, #9CA3AF)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Suggestions
          </div>
          {suggestions.map((sugg, i) => (
            <div
              key={i}
              onClick={() => handleSelect(sugg)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: '8px 10px', fontSize: '0.82rem', color: i === activeIndex ? '#6C47FF' : '#374151',
                background: i === activeIndex ? '#F3F0FF' : 'transparent',
                borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'background 0.15s, color 0.15s'
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span style={{ fontWeight: 500 }}>{sugg.split('@')[0]}</span>
              <span style={{ color: i === activeIndex ? '#8B71FF' : '#6B7280' }}>@{sugg.split('@')[1]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// -- Smart Phone Field --------------------------------------------------------
function SmartPhoneField({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const COUNTRY_CODES = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'US / Canada' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+61', name: 'Australia' },
    { code: '+971', name: 'United Arab Emirates' },
    { code: '+92', name: 'Pakistan' },
    { code: '+93', name: 'Afghanistan' },
    { code: '+880', name: 'Bangladesh' },
    { code: '+86', name: 'China' },
    { code: '+33', name: 'France' },
    { code: '+49', name: 'Germany' },
    { code: '+62', name: 'Indonesia' },
    { code: '+39', name: 'Italy' },
    { code: '+81', name: 'Japan' },
    { code: '+60', name: 'Malaysia' },
    { code: '+977', name: 'Nepal' },
    { code: '+64', name: 'New Zealand' },
    { code: '+63', name: 'Philippines' },
    { code: '+7', name: 'Russia' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+65', name: 'Singapore' },
    { code: '+27', name: 'South Africa' },
    { code: '+82', name: 'South Korea' },
    { code: '+34', name: 'Spain' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+46', name: 'Sweden' },
    { code: '+41', name: 'Switzerland' },
    { code: '+90', name: 'Turkey' },
    { code: '+256', name: 'Uganda' },
    { code: '+380', name: 'Ukraine' },
    { code: '+84', name: 'Vietnam' },
    { code: '+263', name: 'Zimbabwe' },
  ];

  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setActiveIndex(-1);
    }, 200);
    if (value && !validatePhone(value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const formatPhone = (val) => {
    if (!val) return '';
    if (!val.startsWith('+') && /[a-zA-Z]/.test(val)) return val;

    let clean = val.replace(/[^\d\s+]/g, '');

    const spaceIndex = clean.indexOf(' ');
    if (spaceIndex !== -1) {
      const code = clean.slice(0, spaceIndex);
      let rest = clean.slice(spaceIndex + 1).replace(/\D/g, '');
      
      // Strict 5 space 5 formatting
      if (rest.length > 5) {
        rest = rest.slice(0, 5) + ' ' + rest.slice(5, 15);
      }
      return code + ' ' + rest.trim();
    }
    return clean;
  };

  const handleChange = (e) => {
    let val = e.target.value;
    
    if (!val.startsWith('+') && /[a-zA-Z]/.test(val)) {
      onChange(val);
      setShowDropdown(true);
      setError(false);
      setActiveIndex(-1);
      return;
    }

    val = formatPhone(val);
    onChange(val);
    setError(false);
    setActiveIndex(-1);
    
    if (val && !val.includes(' ')) {
      setShowDropdown(true);
    } else if (!val) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.code + ' ');
    setShowDropdown(false);
    setActiveIndex(-1);
    setError(false);
    document.getElementById('field-phone')?.focus();
  };

  let suggestions = [];
  if (value && !value.startsWith('+') && /[a-zA-Z]/.test(value)) {
    const q = value.toLowerCase();
    suggestions = COUNTRY_CODES.filter(c => c.name.toLowerCase().includes(q) || c.code.includes(q));
  } else if (value && value.startsWith('+') && !value.includes(' ')) {
    suggestions = COUNTRY_CODES.filter(c => c.code.startsWith(value));
  } else if (!value || value.trim() === '') {
    suggestions = COUNTRY_CODES;
  }

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      const el = document.getElementById('phone-sugg-' + (activeIndex + 1));
      if (el) el.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
      const el = document.getElementById('phone-sugg-' + (activeIndex - 1));
      if (el) el.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>Phone</label>
      <div style={{ position: 'relative' }}>
        <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : '#9CA3AF' }} />
        <input
          id="field-phone"
          type="text"
          placeholder="India or +91"
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setShowDropdown(true);
          }}
          onBlur={handleBlur}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: error ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: error ? '#FEF2F2' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
          }}
        />
      </div>
      {error && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          Enter a valid phone number (min 10 digits)
        </span>
      )}
      
      {showDropdown && suggestions.length > 0 && (
        <div className="scrollbar-thin" style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--dm-bg, #fff)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 12, marginTop: 6, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          zIndex: 50, overflowY: 'auto', maxHeight: 220, padding: '4px'
        }}>
          <div style={{ padding: '8px 10px 4px', fontSize: '0.65rem', fontWeight: 600, color: 'var(--dm-muted-light, #9CA3AF)', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)' }}>
            Select Country Code
          </div>
          {suggestions.map((sugg, i) => (
             <div
              id={'phone-sugg-' + i}
              key={i}
              onClick={() => handleSelect(sugg)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: '10px 12px', fontSize: '0.82rem', color: i === activeIndex ? '#6C47FF' : '#374151',
                background: i === activeIndex ? '#F3F0FF' : 'transparent',
                borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'background 0.15s, color 0.15s'
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.9rem' }}>{sugg.name === 'India' ? '🇮🇳' : sugg.name === 'US / Canada' ? '🇺🇸' : sugg.name === 'United Kingdom' ? '🇬🇧' : sugg.name === 'Pakistan' ? '🇵🇰' : sugg.name === 'Australia' ? '🇦🇺' : sugg.name === 'United Arab Emirates' ? '🇦🇪' : '🌍'}</span>
                <span style={{ fontWeight: 500 }}>{sugg.name}</span>
              </div>
              <span style={{ fontWeight: 700, color: i === activeIndex ? '#6C47FF' : '#9CA3AF' }}>{sugg.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// -- Smart Location Field (API Driven) ----------------------------------------
function SmartLocationField({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Fetch real-time cities from open source Photon API (OpenStreetMap)
  useEffect(() => {
    // Only search if user typed at least 2 chars and dropdown is active
    if (!value || value.trim().length < 2 || !showDropdown) {
      setApiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // layer=city restricts results to cities, towns, etc.
        const res = await fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(value) + '&layer=city&limit=5');
        const data = await res.json();
        
        const results = [];
        if (data && data.features) {
          data.features.forEach(f => {
            const p = f.properties;
            let fullName = p.name;
            if (p.state && p.state !== p.name) fullName += ', ' + p.state;
            if (p.country) fullName += ', ' + p.country;
            
            // avoid exact duplicates
            if (!results.find(r => r.full === fullName)) {
              results.push({
                city: p.name,
                state: p.state || '',
                country: p.country || '',
                full: fullName
              });
            }
          });
        }
        setApiSuggestions(results);
      } catch (err) {
        console.error('Location fetch error:', err);
      }
      setLoading(false);
    }, 400); // 400ms debounce so we don't spam API

    return () => clearTimeout(timer);
  }, [value, showDropdown]);

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setActiveIndex(-1);
    }, 200);
    if (value && value.trim().length < 2) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  const handleChange = (e) => {
    const val = toTitleCase(e.target.value);
    onChange(val);
    setError(false);
    setActiveIndex(-1);
    if (val.trim() !== '') setShowDropdown(true);
    else setShowDropdown(false);
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.full);
    setShowDropdown(false);
    setActiveIndex(-1);
    setError(false);
    document.getElementById('field-location')?.focus();
  };

  // If no API results yet, show fallback defaults for empty state
  const fallbackSuggestions = !value ? [
    { city: 'Mumbai', state: 'Maharashtra', country: 'India', full: 'Mumbai, Maharashtra, India' },
    { city: 'Delhi', state: '', country: 'India', full: 'Delhi, India' },
    { city: 'Bangalore', state: 'Karnataka', country: 'India', full: 'Bangalore, Karnataka, India' }
  ] : [];

  const displaySuggestions = value && value.trim().length >= 2 ? apiSuggestions : fallbackSuggestions;

  const handleKeyDown = (e) => {
    if (!showDropdown || displaySuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < displaySuggestions.length - 1 ? prev + 1 : prev));
      const el = document.getElementById('loc-sugg-' + (activeIndex + 1));
      if (el) el.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
      const el = document.getElementById('loc-sugg-' + (activeIndex - 1));
      if (el) el.scrollIntoView({ block: 'nearest' });
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
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>Location</label>
      <div style={{ position: 'relative' }}>
        <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : '#9CA3AF' }} />
        <input
          id="field-location"
          type="text"
          placeholder="e.g. Bhopal"
          value={value || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setShowDropdown(true);
          }}
          onBlur={handleBlur}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: error ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: error ? '#FEF2F2' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
          }}
        />
        {/* Loading spinner */}
        {loading && value && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <div style={{ width: 14, height: 14, border: '2px solid #E5E7EB', borderTopColor: '#8B71FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{'@keyframes spin { 100% { transform: rotate(360deg); } }'}</style>
          </div>
        )}
      </div>
      {error && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          Location name is too short
        </span>
      )}
      
      {showDropdown && displaySuggestions.length > 0 && (
        <div className="scrollbar-thin" style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--dm-bg, #fff)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 12, marginTop: 6, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          zIndex: 50, overflowY: 'auto', maxHeight: 220, padding: '4px'
        }}>
          <div style={{ padding: '8px 10px 4px', fontSize: '0.65rem', fontWeight: 600, color: 'var(--dm-muted-light, #9CA3AF)', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)' }}>
            {value ? 'Search Results' : 'Suggested Cities'}
          </div>
          {displaySuggestions.map((sugg, i) => (
            <div
              id={'loc-sugg-' + i}
              key={i}
              onClick={() => handleSelect(sugg)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: '10px 12px', fontSize: '0.82rem', color: i === activeIndex ? '#6C47FF' : '#374151',
                background: i === activeIndex ? '#F3F0FF' : 'transparent',
                borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'background 0.15s, color 0.15s'
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} style={{ color: i === activeIndex ? '#8B71FF' : '#9CA3AF' }} />
                <span style={{ fontWeight: 600 }}>{sugg.city}</span>
              </div>
              <span style={{ color: 'var(--dm-muted-light, #9CA3AF)', fontSize: '0.75rem', textAlign: 'right', flex: 1, marginLeft: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sugg.state ? sugg.state + ', ' : ''}{sugg.country}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// -- Smart LinkedIn Field ----------------------------------------------------
function SmartLinkedInField({ value, onChange }) {
  const [error, setError] = useState(false);

  const formatLinkedIn = (val) => {
    let url = val.trim();
    if (!url) return '';
    if (!url.includes('/') && !url.includes(' ') && !url.includes('linkedin.com')) {
      return 'linkedin.com/in/' + url;
    }
    url = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    return url;
  };

  const handleBlur = (e) => {
    let val = e.target.value;
    if (!val) {
      setError(false);
      return;
    }
    val = formatLinkedIn(val);
    if (val !== e.target.value) {
      onChange(val);
    }
    const isValid = /^linkedin\.com\/in\/[a-zA-Z0-9%_-]+\/?$/.test(val);
    setError(!isValid);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (error) setError(false);
  };
  

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>
        LinkedIn
      </label>
      <div style={{ position: 'relative' }}>
        <Link2 size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : '#9CA3AF' }} />
        <input
          type="text"
          placeholder="linkedin.com/in/you"
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: error ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: error ? '#FEF2F2' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s', boxSizing: 'border-box',
          }}
          onFocus={(e) => { 
            if (!error) {
              e.target.style.borderColor = '#6C47FF'; 
              e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
            }
          }}
        />
      </div>
      {(error) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          Valid format: linkedin.com/in/username
        </span>
      )}
    </div>
  );
}

// -- Smart GitHub Field ------------------------------------------------------
function SmartGithubField({ value, onChange }) {
  const [error, setError] = useState(false);

  const formatGithub = (val) => {
    let url = val.trim();
    if (!url) return '';
    if (!url.includes('/') && !url.includes(' ') && !url.includes('github.com')) {
      return 'github.com/' + url;
    }
    url = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    return url;
  };

  const handleBlur = (e) => {
    let val = e.target.value;
    if (!val) {
      setError(false);
      return;
    }
    val = formatGithub(val);
    if (val !== e.target.value) {
      onChange(val);
    }
    const isValid = /^github\.com\/[a-zA-Z0-9_-]+\/?$/.test(val);
    setError(!isValid);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (error) setError(false);
  };
  

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>
        GitHub
      </label>
      <div style={{ position: 'relative' }}>
        <GitFork size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : '#9CA3AF' }} />
        <input
          type="text"
          placeholder="github.com/you"
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: error ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: error ? '#FEF2F2' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s', boxSizing: 'border-box',
          }}
          onFocus={(e) => { 
            if (!error) {
              e.target.style.borderColor = '#6C47FF'; 
              e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
            }
          }}
        />
      </div>
      {(error) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          Valid format: github.com/username
        </span>
      )}
    </div>
  );
}

// -- Smart Website Field -----------------------------------------------------
function SmartWebsiteField({ value, onChange }) {
  const [error, setError] = useState(false);

  const formatWebsite = (val) => {
    let url = val.trim();
    if (!url) return '';
    // Strip http/https/www to keep it clean
    url = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    return url;
  };

  const handleBlur = (e) => {
    let val = e.target.value;
    if (!val) {
      setError(false);
      return;
    }
    val = formatWebsite(val);
    if (val !== e.target.value) {
      onChange(val);
    }
    const isValid = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(val);
    setError(!isValid);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (error) setError(false);
  };
  

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>
        Website
      </label>
      <div style={{ position: 'relative' }}>
        <Globe size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : '#9CA3AF' }} />
        <input
          type="text"
          placeholder="yoursite.com"
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: error ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: error ? '#FEF2F2' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s', boxSizing: 'border-box',
          }}
          onFocus={(e) => { 
            if (!error) {
              e.target.style.borderColor = '#6C47FF'; 
              e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
            }
          }}
        />
      </div>
      {(error) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          Please enter a valid website (e.g. domain.com)
        </span>
      )}
    </div>
  );
}

// -- Smart Degree Field ------------------------------------------------------
function SmartDegreeField({ label, value, onChange, placeholder }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const ALL_DEGREES = [
    { short: "B.Sc", full: "Bachelor of Science" },
    { short: "B.Com", full: "Bachelor of Commerce" },
    { short: "B.A.", full: "Bachelor of Arts" },
    { short: "B.Tech", full: "Bachelor of Technology" },
    { short: "B.E.", full: "Bachelor of Engineering" },
    { short: "BCA", full: "Bachelor of Computer Applications" },
    { short: "BBA", full: "Bachelor of Business Administration" },
    { short: "B.Arch", full: "Bachelor of Architecture" },
    { short: "MBBS", full: "Bachelor of Medicine, Bachelor of Surgery" },
    { short: "B.Pharm", full: "Bachelor of Pharmacy" },
    { short: "B.Des", full: "Bachelor of Design" },
    { short: "LLB", full: "Bachelor of Laws" },
    { short: "BMS", full: "Bachelor of Management Studies" },
    { short: "B.Ed", full: "Bachelor of Education" },
    { short: "M.Sc", full: "Master of Science" },
    { short: "M.Com", full: "Master of Commerce" },
    { short: "M.A.", full: "Master of Arts" },
    { short: "M.Tech", full: "Master of Technology" },
    { short: "MBA", full: "Master of Business Administration" },
    { short: "MCA", full: "Master of Computer Applications" },
    { short: "Ph.D", full: "Doctor of Philosophy" },
    { short: "Diploma", full: "Diploma" },
    { short: "HSC (12th)", full: "Higher Secondary Certificate" },
    { short: "SSC (10th)", full: "Secondary School Certificate" }
  ];

  const suggestions = value 
    ? ALL_DEGREES.filter(d => 
        d.short.toLowerCase().includes(value.toLowerCase()) || 
        d.full.toLowerCase().includes(value.toLowerCase())
      )
    : ALL_DEGREES;

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  };

  const handleSelect = (deg) => {
    onChange(deg.full);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
            setActiveIndex(-1);
          }}
          onFocus={(e) => { 
            e.target.style.borderColor = '#6C47FF'; 
            e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
            setShowDropdown(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0,0,0,0.1)';
            e.target.style.boxShadow = 'none';
          }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', padding: '9px 12px',
            border: "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
          }}
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--dm-bg, #fff)', border: '1px solid #E5E7EB', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: 200, overflowY: 'auto'
        }}>
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(idx)}
              style={{
                padding: '8px 12px', cursor: 'pointer',
                background: activeIndex === idx ? '#F3F4F6' : '#fff',
                borderBottom: idx < suggestions.length - 1 ? '1px solid #F3F4F6' : 'none',
                display: 'flex', flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 500 }}>{s.short}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--dm-muted, #6B7280)' }}>{s.full}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -- Smart Study Field -------------------------------------------------------
function SmartStudyField({ label, value, degreeValue, onChange, placeholder }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const getSuggestionsForDegree = (deg) => {
    if (!deg) return ["Computer Science", "Information Technology", "Mechanical Engineering", "Finance", "Accounting", "Marketing", "Economics"];
    const d = deg.toLowerCase();
    if (d.includes('science')) return ["Computer Science", "Information Technology", "Physics", "Chemistry", "Mathematics", "Biology", "Zoology", "Botany", "Biotechnology", "Microbiology", "Statistics", "Data Science"];
    if (d.includes('commerce')) return ["Accounting", "Finance", "Banking & Insurance", "Taxation", "Financial Markets", "Business Analytics", "Corporate Secretaryship"];
    if (d.includes('arts')) return ["English Literature", "Economics", "History", "Political Science", "Psychology", "Sociology", "Geography", "Philosophy", "Fine Arts"];
    if (d.includes('engineering') || d.includes('technology')) return ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Communication", "Information Technology", "Aerospace Engineering", "Automobile Engineering"];
    if (d.includes('business') || d.includes('management')) return ["Marketing", "Human Resources (HR)", "Finance", "Operations", "International Business", "Supply Chain Management", "Retail Management"];
    if (d.includes('computer')) return ["Software Engineering", "Data Science", "Artificial Intelligence", "Web Development", "Cyber Security", "Cloud Computing"];
    if (d.includes('medicine') || d.includes('surgery') || d.includes('pharm')) return ["General Medicine", "Pharmacology", "Pharmaceutics", "Anatomy", "Physiology"];
    
    // Default fallback
    return ["Computer Science", "Finance", "Marketing", "Mechanical Engineering", "Economics", "English Literature"];
  };

  const baseSuggestions = getSuggestionsForDegree(degreeValue);
  const suggestions = value
    ? baseSuggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : baseSuggestions;

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  };

  const handleSelect = (field) => {
    onChange(field);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
            setActiveIndex(-1);
          }}
          onFocus={(e) => { 
            e.target.style.borderColor = '#6C47FF'; 
            e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
            setShowDropdown(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0,0,0,0.1)';
            e.target.style.boxShadow = 'none';
          }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', padding: '9px 12px',
            border: "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
          }}
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--dm-bg, #fff)', border: '1px solid #E5E7EB', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: 200, overflowY: 'auto'
        }}>
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(idx)}
              style={{
                padding: '8px 12px', cursor: 'pointer',
                background: activeIndex === idx ? '#F3F4F6' : '#fff',
                borderBottom: idx < suggestions.length - 1 ? '1px solid #F3F4F6' : 'none',
                display: 'flex', flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 500 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -- Smart School Field ------------------------------------------------------
function SmartSchoolField({ label, value, onChange, placeholder }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Fetch real-time schools/universities from Photon API
  useEffect(() => {
    if (!value || value.trim().length < 3 || !showDropdown) {
      setApiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchQ = encodeURIComponent(value + ' Maharashtra');
        const res = await fetch('https://photon.komoot.io/api/?q=' + searchQ + '&limit=15');
        const data = await res.json();
        
        const results = [];
        if (data && data.features) {
          data.features.forEach(f => {
            const p = f.properties;
            if (p.osm_value === 'college' || p.osm_value === 'university' || p.osm_value === 'school' || p.name?.toLowerCase().includes('college') || p.name?.toLowerCase().includes('university')) {
               let fullName = p.name;
               if (p.city && !fullName.includes(p.city)) fullName += ', ' + p.city;
               
               if (!results.find(r => r.full === fullName) && p.name) {
                 results.push({
                   full: fullName,
                   state: p.state || ''
                 });
               }
            }
          });
        }
        
        // Fallback broad search
        if (results.length === 0) {
          const res2 = await fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(value + ' college') + '&limit=15');
          const data2 = await res2.json();
          if (data2 && data2.features) {
             data2.features.forEach(f => {
                const p = f.properties;
                if (p.osm_value === 'college' || p.osm_value === 'university' || p.osm_value === 'school' || p.name?.toLowerCase().includes('college')) {
                   let fullName = p.name;
                   if (p.city && !fullName.includes(p.city)) fullName += ', ' + p.city;
                   if (!results.find(r => r.full === fullName) && p.name) {
                     results.push({ full: fullName, state: p.state || p.country || '' });
                   }
                }
             });
          }
        }

        setApiSuggestions(results);
      } catch (err) {
        console.error('School fetch error:', err);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, showDropdown]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown || apiSuggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < apiSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(apiSuggestions[activeIndex]);
    }
  };

  const handleSelect = (school) => {
    onChange(school.full);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <GraduationCap size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--dm-muted-light, #9CA3AF)' }} />
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
            setActiveIndex(-1);
          }}
          onFocus={(e) => { 
            e.target.style.borderColor = '#6C47FF'; 
            e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
            setShowDropdown(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0,0,0,0.1)';
            e.target.style.boxShadow = 'none';
          }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
          }}
        />
      </div>

      {showDropdown && (apiSuggestions.length > 0 || loading) && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--dm-bg, #fff)', border: '1px solid #E5E7EB', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: 200, overflowY: 'auto'
        }}>
          {loading && apiSuggestions.length === 0 ? (
            <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--dm-muted, #6B7280)' }}>Searching...</div>
          ) : (
            apiSuggestions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(s)}
                onMouseEnter={() => setActiveIndex(idx)}
                style={{
                  padding: '8px 12px', cursor: 'pointer',
                  background: activeIndex === idx ? '#F3F4F6' : '#fff',
                  borderBottom: idx < apiSuggestions.length - 1 ? '1px solid #F3F4F6' : 'none',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 500 }}>{s.full}</span>
                {s.state && <span style={{ fontSize: '0.7rem', color: 'var(--dm-muted, #6B7280)' }}>{s.state}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// -- Smart Month Field -------------------------------------------------------
function SmartMonthField({ label, value, onChange, isEndDate, current, onCurrentChange, currentLabel }) {
  const parseToYYYYMM = (str) => {
    if (!str || str.toLowerCase() === 'present') return '';
    if (/^\d{4}-\d{2}$/.test(str)) return str;
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const m = ("0" + (d.getMonth() + 1)).slice(-2);
      return `${d.getFullYear()}-${m}`;
    }
    return '';
  };

  const formatToDisplay = (yyyymm) => {
    if (!yyyymm) return '';
    const parts = yyyymm.split("-");
    if (parts.length === 2) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
    }
    return yyyymm;
  };

  const internalValue = parseToYYYYMM(value);

  const handleChange = (e) => {
    const raw = e.target.value;
    onChange(formatToDisplay(raw));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', letterSpacing: '0.02em' }}>
          {label}
        </label>
        {isEndDate && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: '#4B5563', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={current || false} 
              onChange={(e) => {
                onCurrentChange(e.target.checked);
                if (e.target.checked) onChange('Present');
                else onChange('');
              }} 
              style={{ cursor: 'pointer' }}
            />
            {currentLabel || 'Currently Working'}
          </label>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="month"
          value={internalValue}
          onChange={handleChange}
          disabled={isEndDate && current}
          style={{
            width: '100%', padding: '9px 12px',
            border: "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: (isEndDate && current) ? '#9CA3AF' : '#0D0D0F', 
            background: (isEndDate && current) ? '#F3F4F6' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s', boxSizing: 'border-box',
          }}
          onFocus={(e) => { 
            if (!(isEndDate && current)) {
              e.target.style.borderColor = '#6C47FF'; 
              e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0,0,0,0.1)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  );
}

const getBulletSuggestions = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('develop') || r.includes('engineer') || r.includes('program')) {
    return [
      "Designed and implemented robust, scalable system architectures to support core business operations.",
      "Optimized existing codebases for performance, significantly reducing system latency and load times.",
      "Collaborated closely with product and design teams to translate requirements into technical deliverables."
    ];
  }
  if (r.includes('design') || r.includes('ui') || r.includes('ux')) {
    return [
      "Created user-centric interfaces and interactive prototypes that enhanced overall user experience.",
      "Conducted comprehensive user research to identify pain points and drive iterative design improvements.",
      "Maintained and expanded the design system to ensure visual consistency across all digital touchpoints."
    ];
  }
  if (r.includes('market') || r.includes('seo') || r.includes('sales')) {
    return [
      "Developed and executed targeted marketing strategies that successfully expanded market reach.",
      "Managed end-to-end campaign lifecycles, from market research and ideation to post-launch analysis.",
      "Fostered strategic partnerships and client relationships to drive sustained business growth."
    ];
  }
  if (r.includes('manag') || r.includes('lead')) {
    return [
      "Directed cross-functional teams to successfully deliver complex projects within strict timelines.",
      "Identified operational inefficiencies and implemented strategic process improvements across departments.",
      "Mentored junior team members and cultivated a culture of continuous learning and accountability."
    ];
  }
  return [
    "Took ownership of critical project deliverables, consistently meeting high quality standards.",
    "Proactively identified bottlenecks in daily operations and proposed effective, scalable solutions.",
    "Collaborated with key stakeholders to align daily workflows with broader organizational goals."
  ];
};

export function WizardForm() {
  const {
    resume, updatePersonal,
    addExperience, updateExperience, removeExperience, addExpBullet, updateExpBullet, removeExpBullet,
    addEducation,  updateEducation,  removeEducation,
    addSkill,      removeSkill,
    addProject,    updateProject,    removeProject,
    addLanguage,    updateLanguage,    removeLanguage,
    addCertification, updateCertification, removeCertification,
    selectedTemplate, wizardStep, setWizardStep, setEditorPhase
  } = useResumeStore();

  const { personal, experience, education, skills, projects } = resume;
  const languages      = resume.languages      || [];
  const certifications = resume.certifications || [];
  const [skillInput, setSkillInput] = useState('');


  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate);
  const isPhotoTemplate = currentTemplate?.hasPhoto ?? false;

  const [skillError, setSkillError] = useState('');
  const handleSkillKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(/,/g, '');
      if (skills.map(s => s.toLowerCase()).includes(newSkill.toLowerCase())) {
        setSkillError('"' + newSkill + '" is already in your skills list');
        setTimeout(() => setSkillError(''), 2500);
      } else {
        addSkill(newSkill);
        setSkillInput('');
        setSkillError('');
      }
    }
  };

  const handleNext = () => {
    if (wizardStep < 5) {
      setWizardStep(wizardStep + 1);
    } else {
      setEditorPhase('canvas'); // Transition to Preview/Canvas mode
    }
  };


  const handlePrev = () => {
    if (wizardStep > 0) setWizardStep(wizardStep - 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh', background: '#FFFFFF', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--dm-border, rgba(0,0,0,0.06))' }}>
      
      {/* Content Area */}
      <div style={{ flex: 1, padding: '32px 40px' }}>
        
        {wizardStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Personal Info</h2>
            {isPhotoTemplate && <PhotoUpload />}
            <Field label="Full Name"  icon={User}    name="name" onlyLetters={true} value={personal.name}     onChange={(e) => {
              const raw = e.target.value;
              const capitalized = raw.replace(/\b\w/g, c => c.toUpperCase());
              updatePersonal('name', capitalized);
            }}     placeholder="Hasnain Chauhan" />
            <Field label="Job Title"  icon={FileText} name="title" onlyLetters={true} value={personal.title}    onChange={(e) => updatePersonal('title', e.target.value)}    placeholder="Full Stack Developer" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <SmartEmailField value={personal.email} onChange={(val) => updatePersonal('email', val)} />
              <SmartPhoneField value={personal.phone} onChange={(val) => updatePersonal('phone', val)} />
              <SmartLocationField value={personal.location} onChange={(val) => updatePersonal('location', val)} />
              <SmartWebsiteField value={personal.website} onChange={(val) => updatePersonal('website', val)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <SmartLinkedInField value={personal.linkedin} onChange={(val) => updatePersonal('linkedin', val)} />
              <SmartGithubField value={personal.github} onChange={(val) => updatePersonal('github', val)} />
            </div>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5 }}>Professional Summary</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  id="field-summary" rows={4}
                  maxLength={500}
                  placeholder="Brief professional overview highlighting your top skills and career goals..."
                  value={personal.summary || ''}
                  onChange={(e) => updatePersonal('summary', e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', paddingBottom: '24px', resize: 'none',
                    border: (personal.summary || '').length >= 500 ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)", 
                    borderRadius: 10,
                    fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                    color: 'var(--dm-text, #0D0D0F)', 
                    background: (personal.summary || '').length >= 500 ? '#FEF2F2' : '#FAFAFA',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                  }}
                  onFocus={(e) => { 
                    if ((personal.summary || '').length < 500) {
                      e.target.style.borderColor = '#6C47FF'; 
                      e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; 
                    }
                  }}
                  onBlur={(e) => { 
                    if ((personal.summary || '').length < 500) {
                      e.target.style.borderColor = 'rgba(0,0,0,0.1)'; 
                      e.target.style.boxShadow = 'none'; 
                    }
                  }}
                />
                <span style={{ 
                  position: 'absolute', bottom: '8px', right: '12px', 
                  fontSize: '0.65rem', fontWeight: 500, pointerEvents: 'none',
                  color: (personal.summary || '').length >= 500 ? '#EF4444' : '#9CA3AF' 
                }}>
                  {(personal.summary || '').length}/500
                </span>
              </div>
              {(personal.summary || '').length >= 500 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
                  Maximum character limit reached (500)
                </span>
              )}
            </div>
          </div>
        )}

        {wizardStep === 1 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Work Experience</h2>
            {experience.map((exp, idx) => (
              <EntryCard key={exp.id} idx={idx} label="Position" onRemove={() => removeExperience(exp.id)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field label="Company" name={`exp-company-${exp.id}`} value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Google" />
                  <Field label="Role"    name={`exp-role-${exp.id}`}    value={exp.role}    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Software Engineer" />
                  <SmartMonthField label="Start Date" value={exp.startDate} onChange={(val) => updateExperience(exp.id, 'startDate', val)} />
                  <SmartMonthField 
                    label="End Date" 
                    value={exp.endDate} 
                    onChange={(val) => updateExperience(exp.id, 'endDate', val)} 
                    isEndDate={true} 
                    current={exp.current} 
                    onCurrentChange={(checked) => updateExperience(exp.id, 'current', checked)} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5 }}>Bullet Points</label>
                  {exp.bullets.map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <input
                        placeholder={`Achievement ${i + 1}: Describe impact...`} value={b}
                        maxLength={150}
                        onChange={(e) => updateExpBullet(exp.id, i, e.target.value)}
                        style={{
                          flex: 1, padding: '8px 12px',
                          border: b.length >= 150 ? '1.5px solid #EF4444' : '1.5px solid rgba(0,0,0,0.1)',
                          borderRadius: 8, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
                          color: 'var(--dm-text, #0D0D0F)', background: b.length >= 150 ? '#FEF2F2' : '#fff',
                          outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { if (b.length < 150) e.target.style.borderColor = '#6C47FF'; }}
                        onBlur={(e) => { e.target.style.borderColor = b.length >= 150 ? '#EF4444' : 'rgba(0,0,0,0.1)'; }}
                      />
                      <button onClick={() => removeExpBullet(exp.id, i)} style={{ color: '#EF4444', background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addExpBullet(exp.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'none', border: 'none', color: '#6C47FF',
                    fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600,
                    padding: '4px 0',
                  }}>
                    <Plus size={13} /> Add bullet
                  </button>

                  {/* AI Suggestions Box */}
                  <div style={{ marginTop: 16, padding: '12px 14px', background: '#F8F8FC', borderRadius: 12, border: '1px dashed rgba(108,71,255,0.3)' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C47FF', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.02em' }}>
                      <Sparkles size={12} fill="#6C47FF" /> Recommended Bullets
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {getBulletSuggestions(exp.role).map((sugg, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <button
                            onClick={() => {
                              const emptyIdx = exp.bullets.findIndex(b => b.trim() === '');
                              if (emptyIdx !== -1) {
                                updateExpBullet(exp.id, emptyIdx, sugg);
                              } else {
                                updateExperience(exp.id, 'bullets', [...exp.bullets, sugg]);
                              }
                            }}
                            title="Add this bullet"
                            style={{
                              background: 'rgba(108,71,255,0.1)', color: '#6C47FF', border: 'none',
                              borderRadius: 6, padding: '4px', cursor: 'pointer', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#6C47FF'; e.currentTarget.style.color = '#FFF'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(108,71,255,0.1)'; e.currentTarget.style.color = '#6C47FF'; }}
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                          <span style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.4 }}>{sugg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addExperience} label="Add Experience" />
          </div>
        )}

        {wizardStep === 2 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Education</h2>
            {education.map((edu, idx) => (
              <EntryCard key={edu.id} idx={idx} label="Degree" onRemove={() => removeEducation(edu.id)}>
                <SmartSchoolField label="School" value={edu.school} onChange={(val) => updateEducation(edu.id, 'school', val)} placeholder="e.g. Mumbai University" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <SmartDegreeField label="Degree" value={edu.degree} onChange={(val) => updateEducation(edu.id, 'degree', val)} placeholder="B.Sc, B.Com, etc." />
                  <SmartStudyField label="Field" value={edu.field} degreeValue={edu.degree} onChange={(val) => updateEducation(edu.id, 'field', val)} placeholder="e.g. Computer Science" />
                  <SmartMonthField label="Start Date" value={edu.startDate} onChange={(val) => updateEducation(edu.id, 'startDate', val)} />
                  <SmartMonthField 
                    label="End Date" 
                    value={edu.endDate} 
                    onChange={(val) => updateEducation(edu.id, 'endDate', val)} 
                    isEndDate={true} 
                    current={edu.current} 
                    onCurrentChange={(checked) => updateEducation(edu.id, 'current', checked)}
                    currentLabel="Currently Studying"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>CGPA / Score</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 9.8"
                    value={edu.gpa || ''}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length > 1) {
                        val = val.slice(0,1) + '.' + val.slice(1, 3);
                      }
                      updateEducation(edu.id, 'gpa', val);
                    }}
                    style={{
                      width: '100%', padding: '9px 12px',
                      border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.1))',
                      borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                      color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <span style={{ fontSize: '0.62rem', color: 'var(--dm-muted-light, #9CA3AF)', marginTop: 3, display: 'block' }}>Numbers only, auto-formats to X.XX</span>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addEducation} label="Add Education" />
          </div>
        )}

        {wizardStep === 3 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Skills</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5 }}>Type a skill and press Enter</label>
              <input
                id="skill-input"
                placeholder="React, Python, Figma..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.1))', borderRadius: 10,
                  fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                  color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
              {skillError && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
                  {skillError}
                </span>
              )}
            </div>
            {skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((sk) => (
                  <div key={sk} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', background: '#F3F0FF',
                    border: '1px solid rgba(108,71,255,0.2)', borderRadius: 999,
                    color: '#6C47FF', fontSize: '0.78rem', fontWeight: 600,
                  }}>
                    <span>{sk}</span>
                    <button onClick={() => removeSkill(sk)} style={{
                      background: 'none', border: 'none',
                      color: '#EF4444', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center',
                    }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {wizardStep === 4 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Projects</h2>
            {projects.map((proj, idx) => (
              <EntryCard key={proj.id} idx={idx} label="Project" onRemove={() => removeProject(proj.id)}>
                <Field label="Project Name" name={`proj-name-${proj.id}`} value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} placeholder="Social-CV" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field label="Tech Stack"   name={`proj-tech-${proj.id}`} value={proj.tech} onChange={(e) => updateProject(proj.id, 'tech', e.target.value)} placeholder="React, Firebase, Tailwind" />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>Link</label>
                    <div style={{ position: 'relative' }}>
                      <Link2 size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--dm-muted-light, #9CA3AF)' }} />
                      <input
                        type="text"
                        placeholder="github.com/yourproject"
                        value={proj.link || ''}
                        onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                        onBlur={(e) => {
                          let val = e.target.value.trim();
                          if (val) {
                            val = val.replace(/^(https?:\/\/)?(www\.)?/, '');
                            updateProject(proj.id, 'link', val);
                          }
                          e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                          e.target.style.boxShadow = 'none';
                        }}
                        style={{
                          width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
                          border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.1))',
                          borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                          color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
                          outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5 }}>Description</label>
                  <div style={{ position: 'relative' }}>
                    <textarea rows={3}
                      maxLength={500}
                      placeholder="Brief project description..."
                      value={proj.description || ''}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', paddingBottom: '24px', resize: 'none',
                        border: (proj.description || '').length >= 500 ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
                        borderRadius: 8,
                        fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
                        color: 'var(--dm-text, #0D0D0F)', 
                        background: (proj.description || '').length >= 500 ? '#FEF2F2' : '#fff',
                        outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                      onFocus={(e) => { 
                        if ((proj.description || '').length < 500) {
                          e.target.style.borderColor = '#6C47FF'; 
                        }
                      }}
                      onBlur={(e) => { 
                        if ((proj.description || '').length < 500) {
                          e.target.style.borderColor = 'rgba(0,0,0,0.1)'; 
                        }
                      }}
                    />
                    <span style={{ 
                      position: 'absolute', bottom: '8px', right: '12px', 
                      fontSize: '0.65rem', fontWeight: 500, pointerEvents: 'none',
                      color: (proj.description || '').length >= 500 ? '#EF4444' : '#9CA3AF' 
                    }}>
                      {(proj.description || '').length}/500
                    </span>
                  </div>
                  {(proj.description || '').length >= 500 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: '0.68rem', marginTop: 6, fontWeight: 500 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
                      Maximum character limit reached (500)
                    </span>
                  )}
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addProject} label="Add Project" />
          </div>
        )}

        {wizardStep === 5 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 4 }}>Languages & Certifications</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--dm-muted-light, #9CA3AF)', marginBottom: 20 }}>Optional but powerful — boosts your ATS score and global appeal.</p>

            {/* Languages */}
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dm-text, #374151)', marginBottom: 12 }}>🌐 Languages</h3>
            {languages.map((lang, idx) => (
              <EntryCard key={lang.id} idx={idx} label="Language" onRemove={() => removeLanguage(lang.id)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field
                    label="Language"
                    name={`lang-name-${lang.id}`}
                    onlyLetters={true}
                    value={lang.language}
                    onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                    placeholder="English, Hindi, Marathi…"
                  />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>Proficiency</label>
                    <select
                      value={lang.proficiency || 'Conversational'}
                      onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                      style={{
                        width: '100%', padding: '9px 12px',
                        border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.1))', borderRadius: 10,
                        fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                        color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
                        outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option>Native / Bilingual</option>
                      <option>Professional Working</option>
                      <option>Conversational</option>
                      <option>Basic</option>
                    </select>
                  </div>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addLanguage} label="Add Language" />

            {/* Certifications */}
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dm-text, #374151)', margin: '24px 0 12px' }}>🏆 Certifications</h3>
            {certifications.map((cert, idx) => (
              <EntryCard key={cert.id} idx={idx} label="Certification" onRemove={() => removeCertification(cert.id)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field
                    label="Certification Name"
                    name={`cert-name-${cert.id}`}
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="AWS Solutions Architect, Google Analytics…"
                  />
                  <Field
                    label="Issuing Organization"
                    name={`cert-issuer-${cert.id}`}
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="Amazon, Google, Coursera…"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)', marginBottom: 5, letterSpacing: '0.02em' }}>Year</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="2024"
                    value={cert.year || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      updateCertification(cert.id, 'year', val);
                    }}
                    style={{
                      width: '100%', padding: '9px 12px',
                      border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.1))', borderRadius: 10,
                      fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                      color: 'var(--dm-text, #0D0D0F)', background: 'var(--dm-surface, #FAFAFA)',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <span style={{ fontSize: '0.62rem', color: 'var(--dm-muted-light, #9CA3AF)', marginTop: 3, display: 'block' }}>4-digit year only, e.g. 2024</span>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addCertification} label="Add Certification" />
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div style={{ padding: '24px 40px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--dm-surface, #FAFAFA)', borderRadius: '0 0 16px 16px' }}>
        <button
          onClick={handlePrev}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 10,
            background: 'transparent', border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.12))',
            color: 'var(--dm-text, #374151)', fontSize: '0.85rem', fontWeight: 600,
            cursor: wizardStep === 0 ? 'not-allowed' : 'pointer',
            opacity: wizardStep === 0 ? 0 : 1,
            pointerEvents: wizardStep === 0 ? 'none' : 'auto',
            transition: 'all 0.2s',
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <button
          onClick={handleNext}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 24px', borderRadius: 10,
            background: wizardStep === 5 ? 'linear-gradient(135deg,#6C47FF,#4A2FD9)' : '#0D0D0F',
            border: 'none',
            color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer',
            boxShadow: wizardStep === 5 ? '0 4px 14px rgba(108,71,255,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
        >
          {wizardStep === 5 ? (
            <>Generate Preview ✨ <ArrowRight size={16} /></>
          ) : (
            <>Next Step <ChevronRight size={16} /></>
          )}
        </button>
      </div>

    </div>
  );
}

