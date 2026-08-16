// Minimal Pro — No Photo | Ultra-clean typography-first layout
export function MinimalProTemplate({ resume, themeColor, fontFamily, sectionOrder = ['experience', 'education', 'skills', 'projects'] }) {
  const { personal, experience, education, skills, projects } = resume;
  const accent = themeColor || '#0D0D0F';
  const ff = fontFamily || "'Inter', sans-serif";

  const Rule = () => <div style={{ height: 1, background: '#E5E7EB', margin: '14px 0' }} />;

  const renderSection = (id) => {
    switch (id) {
      case 'experience':
        if (!experience?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '0.62em', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                  <div>
                    <span style={{ fontSize: '0.82em', fontWeight: 700, color: '#111827' }}>{exp.role}</span>
                    {exp.company && <span style={{ fontSize: '0.78em', fontWeight: 400, color: '#6B7280' }}> — {exp.company}</span>}
                  </div>
                  <span style={{ fontSize: '0.65em', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets?.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span style={{ color: '#D1D5DB', fontSize: '0.7em', lineHeight: 1.8, flexShrink: 0 }}>—</span>
                    <p style={{ fontSize: '0.73em', color: '#4B5563', lineHeight: 1.7 }}>{b}</p>
                  </div>
                ))}
              </div>
            ))}
            <Rule />
          </div>
        );

      case 'education':
        if (!education?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '0.62em', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: '0.8em', fontWeight: 700, color: '#111827' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ fontSize: '0.72em', color: '#6B7280' }}>{edu.school}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                </div>
                <span style={{ fontSize: '0.65em', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                  {edu.startDate}{edu.startDate && '–'}{edu.endDate}
                </span>
              </div>
            ))}
            <Rule />
          </div>
        );

      case 'skills':
        if (!skills?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '0.62em', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 12 }}>
              Skills
            </h2>
            <p style={{ fontSize: '0.75em', color: '#374151', lineHeight: 1.9 }}>
              {skills.join('  ·  ')}
            </p>
            <Rule />
          </div>
        );

      case 'projects':
        if (!projects?.length) return null;
        return (
          <div key={id}>
            <h2 style={{ fontSize: '0.62em', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontSize: '0.8em', fontWeight: 700, color: '#111827' }}>{proj.name}</p>
                  {proj.link && <span style={{ fontSize: '0.65em', color: accent }}>{proj.link}</span>}
                </div>
                {proj.tech && <p style={{ fontSize: '0.68em', color: '#9CA3AF', margin: '3px 0' }}>{proj.tech}</p>}
                {proj.description && <p style={{ fontSize: '0.73em', color: '#4B5563', lineHeight: 1.6 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '52px 56px', fontFamily: ff, background: '#FFFFFF', color: '#111827', height: '100%', boxSizing: 'border-box' }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.6em', fontWeight: 900, letterSpacing: '-0.04em', color: '#0D0D0F', lineHeight: 1, marginBottom: 8, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '1em', color: accent, fontWeight: 600, letterSpacing: '0.01em', marginBottom: 14 }}>
            {personal.title}
          </p>
        )}
        {/* Contact row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 28px', fontSize: '0.72em', color: '#6B7280', wordSpacing: '1px' }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.github   && <span>· {personal.github}</span>}
          {personal.website  && <span>· {personal.website}</span>}
        </div>
      </div>

      <Rule />

      {/* ── Summary ── */}
      {personal.summary && (
        <>
          <p style={{ fontSize: '0.78em', color: '#374151', lineHeight: 1.85, marginBottom: 16 }}>
            {personal.summary}
          </p>
          <Rule />
        </>
      )}

      {/* ── Dynamic Sections ── */}
      {sectionOrder.map(renderSection)}
    </div>
  );
}
