// Nordic — No Photo | Warm cream, elegant serif headings
export function NordicTemplate({ resume, themeColor, fontFamily, sectionOrder = ['experience', 'education', 'skills', 'projects'] }) {
  const { personal, experience, education, skills, projects } = resume;
  const accent  = themeColor || '#8B6914';
  const ff      = fontFamily || "'Georgia', serif";
  const bodyFf  = "'Inter', sans-serif";

  const renderSection = (id) => {
    switch (id) {
      case 'experience':
        if (!experience?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: '1em', fontWeight: 700, color: '#1A1208', marginBottom: 18, letterSpacing: '0.01em' }}>
              Work Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={exp.id} style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                  {idx < experience.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: `${accent}33`, marginTop: 4 }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <p style={{ fontSize: '0.82em', fontWeight: 700, color: '#1A1208', fontFamily: bodyFf }}>{exp.role}</p>
                      <p style={{ fontSize: '0.73em', color: accent, fontWeight: 600, fontFamily: bodyFf }}>{exp.company}</p>
                    </div>
                    <span style={{ fontSize: '0.65em', color: '#9C8B72', fontFamily: bodyFf, whiteSpace: 'nowrap' }}>
                      {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets?.filter(Boolean).map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginTop: 5 }}>
                      <span style={{ color: accent, fontSize: '0.65em', lineHeight: 1.8, flexShrink: 0 }}>›</span>
                      <p style={{ fontSize: '0.72em', color: '#5A4A36', lineHeight: 1.7, fontFamily: bodyFf }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ height: 1, background: `${accent}33`, marginTop: 6 }} />
          </div>
        );

      case 'education':
        if (!education?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: '1em', fontWeight: 700, color: '#1A1208', marginBottom: 14, letterSpacing: '0.01em' }}>Education</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: '0.78em', fontWeight: 700, color: '#1A1208', fontFamily: bodyFf }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <p style={{ fontSize: '0.7em', color: '#7A6A50', fontFamily: bodyFf }}>{edu.school}</p>
                  <p style={{ fontSize: '0.63em', color: '#9C8B72', fontFamily: bodyFf }}>
                    {edu.startDate}{edu.startDate && '–'}{edu.endDate}
                    {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: `${accent}33`, marginTop: 6 }} />
          </div>
        );

      case 'skills':
        if (!skills?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: '1em', fontWeight: 700, color: '#1A1208', marginBottom: 14, letterSpacing: '0.01em' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((sk) => (
                <span key={sk} style={{
                  fontSize: '0.68em', padding: '4px 10px',
                  border: `1px solid ${accent}55`, borderRadius: 4,
                  color: '#4A3C28', background: `${accent}0D`,
                  fontFamily: bodyFf,
                }}>{sk}</span>
              ))}
            </div>
            <div style={{ height: 1, background: `${accent}33`, marginTop: 16 }} />
          </div>
        );

      case 'projects':
        if (!projects?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: '1em', fontWeight: 700, color: '#1A1208', marginBottom: 16, letterSpacing: '0.01em' }}>Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: 12, paddingLeft: 14, borderLeft: `2px solid ${accent}55` }}>
                  <p style={{ fontSize: '0.78em', fontWeight: 700, color: '#1A1208', fontFamily: bodyFf }}>{proj.name}</p>
                  {proj.tech && <p style={{ fontSize: '0.65em', color: accent, margin: '3px 0', fontFamily: bodyFf }}>{proj.tech}</p>}
                  {proj.description && <p style={{ fontSize: '0.71em', color: '#5A4A36', lineHeight: 1.6, fontFamily: bodyFf }}>{proj.description}</p>}
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: `${accent}33`, marginTop: 6 }} />
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ background: '#FAF7F2', fontFamily: ff, color: '#2C2416', height: '100%', boxSizing: 'border-box' }}>
      {/* ── Header ── */}
      <div style={{ padding: '44px 52px 32px', borderBottom: `2px solid ${accent}` }}>
        <h1 style={{ fontSize: '2.4em', fontWeight: 700, letterSpacing: '-0.01em', color: '#1A1208', lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '0.92em', color: accent, fontWeight: 400, fontStyle: 'italic', marginTop: 6, fontFamily: bodyFf }}>
            {personal.title}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 14, fontSize: '0.7em', color: '#7A6A50', fontFamily: bodyFf, wordSpacing: '1px' }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github   && <span>{personal.github}</span>}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '28px 52px' }}>
        {personal.summary && (
          <div style={{ marginBottom: 28, paddingBottom: 22, borderBottom: `1px solid ${accent}44` }}>
            <p style={{ fontSize: '0.78em', color: '#4A3C28', lineHeight: 1.9, fontFamily: bodyFf }}>{personal.summary}</p>
          </div>
        )}

        {sectionOrder.map(renderSection)}
      </div>
    </div>
  );
}
