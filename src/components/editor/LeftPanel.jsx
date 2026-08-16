import { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import {
  User, Mail, Phone, MapPin, Link2, FileText,
  Briefcase, GraduationCap, Code2, Plus, Trash2,
  ChevronDown, ChevronUp, GitFork, Globe, Palette,
  GripVertical, Camera, X,
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
  horizontalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TEMPLATES } from '@/templates/templateMeta';

// ── Drag handle wrapper ─────────────────────────────────────────────────────
function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1, opacity: isDragging ? 0.85 : 1 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', position: 'relative' }}>
        <div {...attributes} {...listeners} style={{ marginTop: 14, cursor: 'grab', color: '#D1D5DB', flexShrink: 0 }}>
          <GripVertical size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}

function SortableSkillItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : 1,
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '5px 12px', background: '#F3F0FF',
      border: '1px solid rgba(108,71,255,0.2)', borderRadius: 999,
      color: '#6C47FF', fontSize: '0.78rem', fontWeight: 600,
    }}>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', opacity: 0.4 }}><GripVertical size={11} /></div>
      {children}
    </div>
  );
}

// ── Constants ───────────────────────────────────────────────────────────────
const FONTS = [
  { label: 'Modern',  value: 'sans-serif' },
  { label: 'Classic', value: 'serif' },
  { label: 'Mono',    value: 'monospace' },
];
const COLORS = ['#6C47FF', '#1B4FD8', '#0d9488', '#be185d', '#FF6B35', '#8B6914', '#0D0D0F', '#6B7280'];

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

// ── Collapsible section (LIGHT) ─────────────────────────────────────────────
function Section({ title, icon: Icon, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#F8F8FC'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: '#F3F0FF', border: '1px solid rgba(108,71,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={14} style={{ color: '#6C47FF' }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0D0D0F', fontFamily: 'Inter' }}>{title}</span>
          {badge > 0 && (
            <span style={{
              padding: '2px 8px', background: '#F3F0FF',
              border: '1px solid rgba(108,71,255,0.18)',
              borderRadius: 999, fontSize: '0.7rem',
              color: '#6C47FF', fontWeight: 700,
            }}>{badge}</span>
          )}
        </div>
        {open
          ? <ChevronUp size={14} style={{ color: '#9CA3AF' }} />
          : <ChevronDown size={14} style={{ color: '#9CA3AF' }} />
        }
      </button>
      {open && (
        <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {children}
        </div>
      )}
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
      padding: '14px 16px', borderRadius: 14,
      background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9CA3AF' }}>{label} {idx + 1}</span>
        <button onClick={onRemove} style={{
          color: '#EF4444', background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 6, padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}><Trash2 size={12} /></button>
      </div>
      {children}
    </div>
  );
}

// ── Main LeftPanel (LIGHT) ──────────────────────────────────────────────────
export function LeftPanel() {
  const {
    resume, updatePersonal,
    addExperience, updateExperience, removeExperience, addExpBullet, updateExpBullet, removeExpBullet,
    addEducation,  updateEducation,  removeEducation,
    addSkill,      removeSkill,
    addProject,    updateProject,    removeProject,
    themeColor, setThemeColor,
    fontFamily, setFontFamily,
    selectedTemplate,
  } = useResumeStore();

  const { personal, experience, education, skills, projects } = resume;
  const [skillInput, setSkillInput] = useState('');

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate);
  const isPhotoTemplate = currentTemplate?.hasPhoto ?? false;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event, key) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const items = resume[key];
      const oldIndex = items.findIndex((item) => (item.id || item) === active.id);
      const newIndex = items.findIndex((item) => (item.id || item) === over.id);
      useResumeStore.getState().reorderArray(key, oldIndex, newIndex);
    }
  };

  const handleSkillKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim().replace(/,/g, ''));
      setSkillInput('');
    }
  };

  return (
    <div className="scrollbar-thin" style={{ height: '100%', overflowY: 'auto', background: '#fff' }}>

      {/* ── Design ── */}
      <Section title="Design" icon={Palette} defaultOpen>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>Theme Color</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setThemeColor(c)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: c,
                  border: themeColor === c ? '3px solid #0D0D0F' : '2px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  boxShadow: themeColor === c ? `0 0 0 3px ${c}40` : 'none',
                  transition: 'all 0.18s',
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>Typography</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {FONTS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFontFamily(f.value)}
                style={{
                  padding: '9px 0', fontSize: '0.82rem', fontWeight: 600,
                  fontFamily: f.value, borderRadius: 10, cursor: 'pointer',
                  transition: 'all 0.18s',
                  background: fontFamily === f.value ? '#6C47FF' : '#FAFAFA',
                  border: fontFamily === f.value ? '1.5px solid #6C47FF' : '1.5px solid rgba(0,0,0,0.1)',
                  color: fontFamily === f.value ? '#fff' : '#6B7280',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Personal Info ── */}
      <Section title="Personal Info" icon={User}>
        {isPhotoTemplate && <PhotoUpload />}

        <Field label="Full Name"  icon={User}    name="name"     value={personal.name}     onChange={(e) => updatePersonal('name', e.target.value)}     placeholder="Hasnain Chauhan" />
        <Field label="Job Title"  icon={FileText} name="title"    value={personal.title}    onChange={(e) => updatePersonal('title', e.target.value)}    placeholder="Full Stack Developer" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Email"    icon={Mail}    name="email"    value={personal.email}    onChange={(e) => updatePersonal('email', e.target.value)}    placeholder="you@email.com" type="email" />
          <Field label="Phone"    icon={Phone}   name="phone"    value={personal.phone}    onChange={(e) => updatePersonal('phone', e.target.value)}    placeholder="+92 300 0000000" />
          <Field label="Location" icon={MapPin}  name="location" value={personal.location} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="Karachi, Pakistan" />
          <Field label="Website"  icon={Globe}   name="website"  value={personal.website}  onChange={(e) => updatePersonal('website', e.target.value)}  placeholder="yoursite.com" />
        </div>
        <Field label="LinkedIn" icon={Link2}   name="linkedin" value={personal.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/you" />
        <Field label="GitHub"   icon={GitFork} name="github"   value={personal.github}   onChange={(e) => updatePersonal('github', e.target.value)}   placeholder="github.com/you" />
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
      </Section>

      {/* ── Experience ── */}
      <Section title="Work Experience" icon={Briefcase} badge={experience.length}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experience')}>
          <SortableContext items={experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {experience.map((exp, idx) => (
              <SortableItem key={exp.id} id={exp.id}>
                <EntryCard idx={idx} label="Position" onRemove={() => removeExperience(exp.id)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Field label="Company" name={`exp-company-${exp.id}`} value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Google" />
                    <Field label="Role"    name={`exp-role-${exp.id}`}    value={exp.role}    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Software Engineer" />
                    <Field label="Start"   name={`exp-start-${exp.id}`}   value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" />
                    <Field label="End"     name={`exp-end-${exp.id}`}     value={exp.endDate}   onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}   placeholder="Present" />
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
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <AddButton onClick={addExperience} label="Add Experience" />
      </Section>

      {/* ── Education ── */}
      <Section title="Education" icon={GraduationCap} badge={education.length}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'education')}>
          <SortableContext items={education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {education.map((edu, idx) => (
              <SortableItem key={edu.id} id={edu.id}>
                <EntryCard idx={idx} label="Degree" onRemove={() => removeEducation(edu.id)}>
                  <Field label="School" name={`edu-school-${edu.id}`} value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} placeholder="MIT" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Field label="Degree" name={`edu-degree-${edu.id}`} value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="B.S." />
                    <Field label="Field"  name={`edu-field-${edu.id}`}  value={edu.field}  onChange={(e) => updateEducation(edu.id, 'field',  e.target.value)} placeholder="Computer Science" />
                    <Field label="Start"  name={`edu-start-${edu.id}`}  value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="2020" />
                    <Field label="End"    name={`edu-end-${edu.id}`}    value={edu.endDate}   onChange={(e) => updateEducation(edu.id, 'endDate',   e.target.value)} placeholder="2024" />
                  </div>
                  <Field label="GPA (optional)" name={`edu-gpa-${edu.id}`} value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8 / 4.0" />
                </EntryCard>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <AddButton onClick={addEducation} label="Add Education" />
      </Section>

      {/* ── Skills ── */}
      <Section title="Skills" icon={Code2} badge={skills.length}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Add skills (Enter or comma)</label>
          <input
            id="skill-input"
            placeholder="React, Python, Figma..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKey}
            style={{
              width: '100%', padding: '9px 12px',
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'skills')}>
            <SortableContext items={skills} strategy={horizontalListSortingStrategy}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.map((sk) => (
                  <SortableSkillItem key={sk} id={sk}>
                    <span style={{ fontSize: '0.76rem' }}>{sk}</span>
                    <button onClick={() => removeSkill(sk)} style={{
                      background: 'none', border: 'none',
                      color: '#EF4444', cursor: 'pointer', padding: 0, marginLeft: 2,
                      display: 'flex', alignItems: 'center',
                    }}><X size={11} /></button>
                  </SortableSkillItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Section>

      {/* ── Projects ── */}
      <Section title="Projects" icon={GitFork} badge={projects.length}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'projects')}>
          <SortableContext items={projects.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {projects.map((proj, idx) => (
              <SortableItem key={proj.id} id={proj.id}>
                <EntryCard idx={idx} label="Project" onRemove={() => removeProject(proj.id)}>
                  <Field label="Project Name" name={`proj-name-${proj.id}`} value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} placeholder="Social-CV" />
                  <Field label="Tech Stack"   name={`proj-tech-${proj.id}`} value={proj.tech} onChange={(e) => updateProject(proj.id, 'tech', e.target.value)} placeholder="React, Firebase, Tailwind" />
                  <Field label="Link" icon={Link2} name={`proj-link-${proj.id}`} value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} placeholder="github.com/yourproject" />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Description</label>
                    <textarea rows={2}
                      placeholder="Brief project description..."
                      value={proj.description || ''}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      style={{
                        width: '100%', padding: '8px 12px', resize: 'none',
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
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <AddButton onClick={addProject} label="Add Project" />
      </Section>

      <div style={{ height: 32 }} />
    </div>
  );
}
