// Bold Edge — No Photo | Strong navy header, 2-column layout
export function BoldEdgeTemplate({ resume, themeColor, fontFamily, sectionOrder = ['experience', 'education', 'skills', 'projects'] }) {
  const { personal, experience, education, skills, projects } = resume;
  const navy  = themeColor || '#1B4FD8';
  const ff    = fontFamily || "'Inter', sans-serif";

  const SectionTitle = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 4, height: 18, background: navy, borderRadius: 2 }} />
      <h2 style={{ fontSize: '0.65em', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: navy }}>{children}</h2>
    </div>
  );

  const leftOrder = sectionOrder.filter(id => ['skills', 'education'].includes(id));
  const rightOrder = sectionOrder.filter(id => ['experience', 'projects'].includes(id));

  const renderSection = (id) => {
    switch (id) {
      case 'skills':
        if (!skills?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 24 }}>
            <SectionTitle>Skills</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {skills.map((sk) => (
                <div key={sk} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: navy, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.72em', color: '#374151' }}>{sk}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!education?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 24 }}>
            <SectionTitle>Education</SectionTitle>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: '0.75em', fontWeight: 700, color: '#111827' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </p>
                <p style={{ fontSize: '0.68em', color: '#6B7280', marginTop: 2 }}>{edu.school}</p>
                <p style={{ fontSize: '0.63em', color: '#9CA3AF', marginTop: 2 }}>
                  {edu.startDate}{edu.startDate && '–'}{edu.endDate}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        );

      case 'experience':
        if (!experience?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 22 }}>
            <SectionTitle>Experience</SectionTitle>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <p style={{ fontSize: '0.82em', fontWeight: 700, color: '#111827' }}>{exp.role}</p>
                    <p style={{ fontSize: '0.72em', color: navy, fontWeight: 600 }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: '0.63em', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {exp.startDate}{exp.startDate && ' – '}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={{ marginTop: 7 }}>
                  {exp.bullets?.filter(Boolean).map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: navy, fontSize: '0.6em', lineHeight: 1.9, flexShrink: 0 }}>▪</span>
                      <p style={{ fontSize: '0.72em', color: '#4B5563', lineHeight: 1.65 }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (!projects?.length) return null;
        return (
          <div key={id}>
            <SectionTitle>Projects</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ padding: '10px 12px', background: '#F8FAFF', border: `1px solid ${navy}22`, borderRadius: 8 }}>
                  <p style={{ fontSize: '0.76em', fontWeight: 700, color: '#111827' }}>{proj.name}</p>
                  {proj.tech && <p style={{ fontSize: '0.63em', color: navy, margin: '3px 0' }}>{proj.tech}</p>}
                  {proj.description && <p style={{ fontSize: '0.68em', color: '#6B7280', lineHeight: 1.5 }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: ff, background: '#FFFFFF', color: '#111827' }}>
      {/* ── Full-width header ── */}
      <div style={{ background: navy, padding: '34px 40px', color: '#fff' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '0.82em', color: 'rgba(255,255,255,0.72)', marginTop: 6, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {personal.title}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 14, fontSize: '0.7em', color: 'rgba(255,255,255,0.65)', wordSpacing: '1px' }}>
          {personal.email    && <span>✉  {personal.email}</span>}
          {personal.phone    && <span>✆  {personal.phone}</span>}
          {personal.location && <span>⌖  {personal.location}</span>}
          {personal.linkedin && <span>in  {personal.linkedin}</span>}
          {personal.github   && <span>⌥  {personal.github}</span>}
        </div>
      </div>

      {/* ── 2-column body ── */}
      <div style={{ display: 'flex', gap: 0, flex: 1 }}>
        {/* Left: narrow column */}
        <div style={{ width: '34%', background: '#F8FAFF', padding: '28px 22px', borderRight: '1px solid #E5E7EB' }}>
          {leftOrder.map(renderSection)}

          {(personal.linkedin || personal.github || personal.website) && (
            <div style={{ marginTop: 24 }}>
              <SectionTitle>Links</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {personal.linkedin && <span style={{ fontSize: '0.68em', color: navy, wordBreak: 'break-all' }}>{personal.linkedin}</span>}
                {personal.github   && <span style={{ fontSize: '0.68em', color: navy, wordBreak: 'break-all' }}>{personal.github}</span>}
                {personal.website  && <span style={{ fontSize: '0.68em', color: navy, wordBreak: 'break-all' }}>{personal.website}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Right: main column */}
        <div style={{ flex: 1, padding: '28px 28px' }}>
          {personal.summary && (
            <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid #E5E7EB' }}>
              <p style={{ fontSize: '0.76em', color: '#374151', lineHeight: 1.8 }}>{personal.summary}</p>
            </div>
          )}

          {rightOrder.map(renderSection)}
        </div>
      </div>
    </div>
  );
}
