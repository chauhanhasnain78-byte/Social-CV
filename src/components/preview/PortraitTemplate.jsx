// Portrait — WITH Photo | Circular photo in indigo sidebar
export function PortraitTemplate({ resume, themeColor, fontFamily, sectionOrder = ['experience', 'education', 'skills', 'projects'] }) {
  const { personal, experience, education, skills, projects } = resume;
  const indigo = themeColor || '#6C47FF';
  const ff = fontFamily || "'Inter', sans-serif";

  const ContactRow = ({ icon, text }) => text ? (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.67em', color: 'rgba(255,255,255,0.75)', marginBottom: 7 }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ wordBreak: 'break-all', lineHeight: 1.5, wordSpacing: '1px' }}>{text}</span>
    </div>
  ) : null;

  const leftOrder = sectionOrder.filter(id => ['skills'].includes(id));
  const rightOrder = sectionOrder.filter(id => ['experience', 'education', 'projects'].includes(id));

  const renderSection = (id) => {
    switch (id) {
      case 'skills':
        if (!skills?.length) return null;
        return (
          <div key={id}>
            <h3 style={{ fontSize: '0.58em', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {skills.map((sk) => (
                <div key={sk} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.67em' }}>•</span>
                  <span style={{ fontSize: '0.67em', color: '#fff' }}>{sk}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        if (!experience?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 20, height: 2, background: indigo, borderRadius: 2 }} />
              <h2 style={{ fontSize: '0.62em', fontWeight: 700, color: indigo, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Experience</h2>
            </div>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: `2px solid ${indigo}33` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <p style={{ fontSize: '0.8em', fontWeight: 700, color: '#111827' }}>{exp.role}</p>
                    <p style={{ fontSize: '0.71em', color: indigo, fontWeight: 600 }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: '0.63em', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {exp.startDate}{exp.startDate && '–'}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets?.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 7, marginTop: 5 }}>
                    <span style={{ color: indigo, fontSize: '0.6em', lineHeight: 1.9, flexShrink: 0 }}>▸</span>
                    <p style={{ fontSize: '0.71em', color: '#4B5563', lineHeight: 1.65 }}>{b}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (!education?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 20, height: 2, background: indigo, borderRadius: 2 }} />
              <h2 style={{ fontSize: '0.62em', fontWeight: 700, color: indigo, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Education</h2>
            </div>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: '0.78em', fontWeight: 700, color: '#111827' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ fontSize: '0.7em', color: '#6B7280' }}>{edu.school}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                </div>
                <span style={{ fontSize: '0.63em', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {edu.startDate}{edu.startDate && '–'}{edu.endDate}
                </span>
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (!projects?.length) return null;
        return (
          <div key={id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 20, height: 2, background: indigo, borderRadius: 2 }} />
              <h2 style={{ fontSize: '0.62em', fontWeight: 700, color: indigo, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Projects</h2>
            </div>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: '0.78em', fontWeight: 700, color: '#111827' }}>{proj.name}</p>
                {proj.tech && <p style={{ fontSize: '0.65em', color: indigo, margin: '2px 0' }}>{proj.tech}</p>}
                {proj.description && <p style={{ fontSize: '0.7em', color: '#4B5563', lineHeight: 1.6 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', fontFamily: ff, height: '100%', boxSizing: 'border-box' }}>
      {/* ── Sidebar ── */}
      <div style={{ width: '33%', background: `linear-gradient(180deg, ${indigo} 0%, #4A2FD9 100%)`, padding: '36px 22px', display: 'flex', flexDirection: 'column', gap: 0, boxSizing: 'border-box' }}>
        {/* Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          {personal.photo ? (
            <img
              src={personal.photo}
              alt={personal.name}
              style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.35)', marginBottom: 14 }}
            />
          ) : (
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2em', fontWeight: 800, color: '#fff', marginBottom: 14 }}>
              {personal.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <h1 style={{ fontSize: '1em', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 4, wordBreak: 'break-word' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '0.65em', color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1.4 }}>
              {personal.title}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 20 }} />

        {/* Contact */}
        <div style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: '0.58em', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Contact</h3>
          <ContactRow icon="✉" text={personal.email} />
          <ContactRow icon="✆" text={personal.phone} />
          <ContactRow icon="⌖" text={personal.location} />
          {personal.linkedin && <ContactRow icon="in" text={personal.linkedin} />}
          {personal.github   && <ContactRow icon="gh" text={personal.github} />}
          {personal.website  && <ContactRow icon="🌐" text={personal.website} />}
        </div>

        {/* Left Sections */}
        {leftOrder.map(renderSection)}
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, padding: '32px 28px', background: '#FFFFFF', boxSizing: 'border-box' }}>
        {personal.summary && (
          <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '0.76em', color: '#374151', lineHeight: 1.85 }}>{personal.summary}</p>
          </div>
        )}

        {/* Right Sections */}
        {rightOrder.map(renderSection)}
      </div>
    </div>
  );
}
