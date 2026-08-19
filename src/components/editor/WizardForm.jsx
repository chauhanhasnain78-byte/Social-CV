import { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import {
  User, Mail, Phone, MapPin, Link2, FileText,
  Briefcase, GraduationCap, Code2, Plus, Trash2,
  GitFork, Globe, Camera, ChevronRight, ChevronLeft, ArrowRight
} from 'lucide-react';
import { TEMPLATES } from '@/templates/templateMeta';

// ── Reusable input field (LIGHT) ────────────────────────────────────────────
function Field({ label, icon: Icon, value, onChange, placeholder, type = 'text', name }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5, letterSpacing: '0.02em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />}
        <input
          id={`field-${name}`}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          style={{
            width: '100%', padding: '9px 12px',
            paddingLeft: Icon ? '2.3rem' : '12px',
            border: '1.5px solid rgba(0,0,0,0.1)',
            borderRadius: 10, fontSize: '0.85rem',
            fontFamily: 'Inter, sans-serif',
            color: '#0D0D0F', background: '#FAFAFA',
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

// ── Photo Upload (LIGHT) ─────────────────────────────────────────────────────
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
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Profile Photo</label>
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
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6C47FF', marginBottom: 8 }}>Photo uploaded ✓</p>
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
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 2 }}>Upload your photo</p>
              <p style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>JPG, PNG · Max 5MB</p>
            </div>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

// ── "Add" button ─────────────────────────────────────────────────────────────
function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: '100%', padding: '10px',
        borderRadius: 12, background: '#FAFAFA',
        border: '1.5px dashed rgba(0,0,0,0.12)',
        color: '#6B7280', fontSize: '0.82rem', fontWeight: 600,
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

// ── Entry card wrapper ───────────────────────────────────────────────────────
function EntryCard({ idx, label, onRemove, children }) {
  return (
    <div style={{
      padding: '16px', borderRadius: 14, marginBottom: 16,
      background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label} {idx + 1}</span>
        <button onClick={onRemove} style={{
          color: '#EF4444', background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 6, padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}><Trash2 size={12} /></button>
      </div>
      {children}
    </div>
  );
}

// ── Main WizardForm (LIGHT) ──────────────────────────────────────────────────
// -- Smart Email Field --------------------------------------------------------
function SmartEmailField({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(false);
  const wrapperRef = useRef(null);

  const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'yahoo.in', 'rediffmail.com'];

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleBlur = (e) => {
    setTimeout(() => setShowDropdown(false), 200);
    if (value && !validateEmail(value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setError(false);
    if (val && !val.includes(' ')) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setShowDropdown(false);
    if (!validateEmail(suggestion)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  let suggestions = [];
  if (value && !value.includes(' ')) {
    const parts = value.split('@');
    const prefix = parts[0];
    const domainQuery = parts[1] || '';

    if (parts.length <= 2 && prefix.length > 0) {
      suggestions = COMMON_DOMAINS
        .filter(d => d.startsWith(domainQuery))
        .map(d => prefix + '@' + d)
        .filter(s => s !== value);
    }
  }

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5, letterSpacing: '0.02em' }}>Email</label>
      <div style={{ position: 'relative' }}>
        <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : '#9CA3AF' }} />
        <input
          id="field-email"
          type="email"
          placeholder="you@email.com"
          value={value || ''}
          onChange={handleChange}
          onFocus={() => {
            if (value && !value.includes(' ')) setShowDropdown(true);
          }}
          onBlur={handleBlur}
          style={{
            width: '100%', padding: '9px 12px', paddingLeft: '2.3rem',
            border: error ? "1.5px solid #EF4444" : "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 10, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            color: '#0D0D0F', background: error ? '#FEF2F2' : '#FAFAFA',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
          }}
        />
      </div>
      {error && (
        <span style={{ display: 'block', color: '#EF4444', fontSize: '0.65rem', marginTop: 4, fontWeight: 500 }}>
          Please enter a valid full email address (e.g., name@gmail.com)
        </span>
      )}
      
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 10, marginTop: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          zIndex: 50, overflow: 'hidden'
        }}>
          {suggestions.map((sugg, i) => (
            <div
              key={i}
              onClick={() => handleSelect(sugg)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: '8px 12px', fontSize: '0.82rem', color: '#374151',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                borderBottom: i < suggestions.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              {sugg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WizardForm() {
  const {
    resume, updatePersonal,
    addExperience, updateExperience, removeExperience, addExpBullet, updateExpBullet, removeExpBullet,
    addEducation,  updateEducation,  removeEducation,
    addSkill,      removeSkill,
    addProject,    updateProject,    removeProject,
    selectedTemplate, wizardStep, setWizardStep, setEditorPhase
  } = useResumeStore();

  const { personal, experience, education, skills, projects } = resume;
  const [skillInput, setSkillInput] = useState('');

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate);
  const isPhotoTemplate = currentTemplate?.hasPhoto ?? false;

  const handleSkillKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim().replace(/,/g, ''));
      setSkillInput('');
    }
  };

  const handleNext = () => {
    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1);
    } else {
      setEditorPhase('canvas'); // Transition to Preview/Canvas mode
    }
  };

  const handlePrev = () => {
    if (wizardStep > 0) setWizardStep(wizardStep - 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh', background: '#FFFFFF', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)' }}>
      
      {/* Content Area */}
      <div style={{ flex: 1, padding: '32px 40px' }}>
        
        {wizardStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Personal Info</h2>
            {isPhotoTemplate && <PhotoUpload />}
            <Field label="Full Name"  icon={User}    name="name"     value={personal.name}     onChange={(e) => updatePersonal('name', e.target.value)}     placeholder="Hasnain Chauhan" />
            <Field label="Job Title"  icon={FileText} name="title"    value={personal.title}    onChange={(e) => updatePersonal('title', e.target.value)}    placeholder="Full Stack Developer" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <SmartEmailField value={personal.email} onChange={(val) => updatePersonal('email', val)} />
              <Field label="Phone"    icon={Phone}   name="phone"    value={personal.phone}    onChange={(e) => updatePersonal('phone', e.target.value)}    placeholder="+92 300 0000000" />
              <Field label="Location" icon={MapPin}  name="location" value={personal.location} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="Karachi, Pakistan" />
              <Field label="Website"  icon={Globe}   name="website"  value={personal.website}  onChange={(e) => updatePersonal('website', e.target.value)}  placeholder="yoursite.com" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="LinkedIn" icon={Link2}   name="linkedin" value={personal.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/you" />
              <Field label="GitHub"   icon={GitFork} name="github"   value={personal.github}   onChange={(e) => updatePersonal('github', e.target.value)}   placeholder="github.com/you" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Professional Summary</label>
              <textarea
                id="field-summary" rows={4}
                placeholder="Brief professional overview highlighting your top skills and career goals..."
                value={personal.summary || ''}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', resize: 'none',
                  border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10,
                  fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                  color: '#0D0D0F', background: '#FAFAFA',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
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
                  <Field label="Start Date"   name={`exp-start-${exp.id}`}   value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" />
                  <Field label="End Date"     name={`exp-end-${exp.id}`}     value={exp.endDate}   onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}   placeholder="Present" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Bullet Points</label>
                  {exp.bullets.map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <input
                        placeholder={`• Achievement ${i + 1}...`} value={b}
                        onChange={(e) => updateExpBullet(exp.id, i, e.target.value)}
                        style={{
                          flex: 1, padding: '8px 12px', border: '1.5px solid rgba(0,0,0,0.1)',
                          borderRadius: 8, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
                          color: '#0D0D0F', background: '#fff', outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; }}
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
                <Field label="School" name={`edu-school-${edu.id}`} value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} placeholder="MIT" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field label="Degree" name={`edu-degree-${edu.id}`} value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="B.S." />
                  <Field label="Field"  name={`edu-field-${edu.id}`}  value={edu.field}  onChange={(e) => updateEducation(edu.id, 'field',  e.target.value)} placeholder="Computer Science" />
                  <Field label="Start Date"  name={`edu-start-${edu.id}`}  value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="2020" />
                  <Field label="End Date"    name={`edu-end-${edu.id}`}    value={edu.endDate}   onChange={(e) => updateEducation(edu.id, 'endDate',   e.target.value)} placeholder="2024" />
                </div>
                <Field label="GPA (optional)" name={`edu-gpa-${edu.id}`} value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8 / 4.0" />
              </EntryCard>
            ))}
            <AddButton onClick={addEducation} label="Add Education" />
          </div>
        )}

        {wizardStep === 3 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: 16 }}>Skills</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Type a skill and press Enter</label>
              <input
                id="skill-input"
                placeholder="React, Python, Figma..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10,
                  fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                  color: '#0D0D0F', background: '#FAFAFA', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
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
                  <Field label="Link" icon={Link2} name={`proj-link-${proj.id}`} value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} placeholder="github.com/yourproject" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Description</label>
                  <textarea rows={3}
                    placeholder="Brief project description..."
                    value={proj.description || ''}
                    onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', resize: 'none',
                      border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 8,
                      fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
                      color: '#0D0D0F', background: '#fff', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; }}
                  />
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={addProject} label="Add Project" />
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div style={{ padding: '24px 40px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA', borderRadius: '0 0 16px 16px' }}>
        <button
          onClick={handlePrev}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 10,
            background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
            color: '#374151', fontSize: '0.85rem', fontWeight: 600,
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
            background: wizardStep === 4 ? 'linear-gradient(135deg,#6C47FF,#4A2FD9)' : '#0D0D0F', 
            border: 'none',
            color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer',
            boxShadow: wizardStep === 4 ? '0 4px 14px rgba(108,71,255,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
        >
          {wizardStep === 4 ? (
            <>Generate Preview ✨ <ArrowRight size={16} /></>
          ) : (
            <>Next Step <ChevronRight size={16} /></>
          )}
        </button>
      </div>

    </div>
  );
}
