// Magazine — WITH Photo | Editorial full-width header, photo beside name
export function MagazineTemplate({ resume, themeColor, fontFamily, sectionOrder = ['experience', 'education', 'skills', 'projects'] }) {
  const { personal, experience, education, skills, projects } = resume;
  const rose = themeColor || '#be185d';
  const ff   = fontFamily || "'Inter', sans-serif";

  const SecHead = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <h2 style={{ fontSize: '0.6em', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: rose }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: `${rose}30` }} />
    </div>
  );

  const leftOrder = sectionOrder.filter(id => ['experience', 'projects'].includes(id));
  const rightOrder = sectionOrder.filter(id => ['education', 'skills'].includes(id));

  const renderSection = (id) => {
    switch (id) {
      case 'experience':
        if (!experience?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 24 }}>
            <SecHead>Experience</SecHead>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div>
                    <p style={{ fontSize: '0.82em', fontWeight: 700, color: '#111827' }}>{exp.role}</p>
                    <p style={{ fontSize: '0.72em', color: rose, fontWeight: 600 }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: '0.63em', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: 12 }}>
                    {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets?.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span style={{ color: rose, fontSize: '0.6em', lineHeight: 1.9, flexShrink: 0 }}>◆</span>
                    <p style={{ fontSize: '0.72em', color: '#4B5563', lineHeight: 1.65 }}>{b}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (!projects?.length) return null;
        return (
          <div key={id}>
            <SecHead>Projects</SecHead>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: '0.78em', fontWeight: 700, color: '#111827' }}>{proj.name}</p>
                {proj.tech && <p style={{ fontSize: '0.65em', color: rose, margin: '2px 0' }}>{proj.tech}</p>}
                {proj.description && <p style={{ fontSize: '0.71em', color: '#4B5563', lineHeight: 1.6 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (!education?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 24 }}>
            <SecHead>Education</SecHead>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: '0.76em', fontWeight: 700, color: '#111827' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                <p style={{ fontSize: '0.69em', color: '#6B7280', marginTop: 2 }}>{edu.school}</p>
                <p style={{ fontSize: '0.63em', color: '#9CA3AF', marginTop: 2 }}>
                  {edu.startDate}{edu.startDate && '–'}{edu.endDate}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        );

      case 'skills':
        if (!skills?.length) return null;
        return (
          <div key={id}>
            <SecHead>Skills</SecHead>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((sk) => (
                <span key={sk} style={{
                  fontSize: '0.65em', padding: '3px 10px', borderRadius: 4,
                  background: `${rose}12`, border: `1px solid ${rose}35`,
                  color: rose, fontWeight: 500,
                }}>{sk}</span>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: ff, background: '#FFFFFF', color: '#111827', boxSizing: 'border-box' }}>
      {/* ── Magazine-style header ── */}
      <div style={{ background: rose, padding: '28px 36px', display: 'flex', alignItems: 'center', gap: 28, boxSizing: 'border-box' }}>
        {/* Photo (left of name) */}
        <div style={{ flexShrink: 0 }}>
          {personal.photo ? (
            <img
              src={personal.photo}
              alt={personal.name}
              style={{ width: 90, height: 90, borderRadius: 10, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)' }}
            />
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: 10, background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4em', fontWeight: 900, color: '#fff' }}>
              {personal.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Name + title + contact */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2em', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '0.85em', color: 'rgba(255,255,255,0.75)', marginTop: 6, fontWeight: 500, fontStyle: 'italic' }}>
              {personal.title}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 12, fontSize: '0.68em', color: 'rgba(255,255,255,0.7)', wordSpacing: '1px' }}>
            {personal.email    && <span>{personal.email}</span>}
            {personal.phone    && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.github   && <span>{personal.github}</span>}
          </div>
        </div>
      </div>

      {/* ── Body: 2-column ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0, flex: 1, boxSizing: 'border-box' }}>
        {/* Left main */}
        <div style={{ padding: '28px 32px', borderRight: '1px solid #F3F4F6', boxSizing: 'border-box' }}>
          {personal.summary && (
            <div style={{ marginBottom: 24, padding: '14px 16px', background: `${rose}0A`, borderLeft: `3px solid ${rose}`, borderRadius: '0 8px 8px 0' }}>
              <p style={{ fontSize: '0.76em', color: '#374151', lineHeight: 1.85 }}>{personal.summary}</p>
            </div>
          )}

          {leftOrder.map(renderSection)}
        </div>

        {/* Right sidebar */}
        <div style={{ padding: '28px 22px', background: '#FAFAFA', boxSizing: 'border-box' }}>
          {rightOrder.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
