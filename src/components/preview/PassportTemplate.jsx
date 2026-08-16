// Passport — WITH Photo | Official header, teal accent, passport-form feel
export function PassportTemplate({ resume, themeColor, fontFamily, sectionOrder = ['experience', 'education', 'skills', 'projects'] }) {
  const { personal, experience, education, skills, projects } = resume;
  const teal = themeColor || '#0d9488';
  const ff   = fontFamily || "'Inter', sans-serif";

  const leftOrder = sectionOrder.filter(id => ['experience', 'projects'].includes(id));
  const rightOrder = sectionOrder.filter(id => ['education', 'skills'].includes(id));

  const renderSection = (id) => {
    switch (id) {
      case 'experience':
        if (!experience?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, borderBottom: `1px solid ${teal}40`, paddingBottom: 6 }}>
              <h2 style={{ fontSize: '0.62em', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: teal }}>Work Experience</h2>
            </div>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 16, display: 'flex', gap: 14 }}>
                <div style={{ width: 2, background: `${teal}40`, flexShrink: 0, borderRadius: 2, marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <p style={{ fontSize: '0.8em', fontWeight: 700, color: '#111827' }}>{exp.role}</p>
                      <p style={{ fontSize: '0.7em', color: teal, fontWeight: 600 }}>{exp.company}</p>
                    </div>
                    <span style={{ fontSize: '0.62em', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {exp.startDate}{exp.startDate && '–'}{exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets?.filter(Boolean).map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, marginTop: 4 }}>
                      <span style={{ color: teal, fontSize: '0.6em', lineHeight: 1.9, flexShrink: 0 }}>›</span>
                      <p style={{ fontSize: '0.71em', color: '#4B5563', lineHeight: 1.65 }}>{b}</p>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: `1px solid ${teal}40`, paddingBottom: 6 }}>
              <h2 style={{ fontSize: '0.62em', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: teal }}>Projects</h2>
            </div>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: '0.76em', fontWeight: 700, color: '#111827' }}>{proj.name}</p>
                {proj.tech && <p style={{ fontSize: '0.64em', color: teal, margin: '2px 0' }}>{proj.tech}</p>}
                {proj.description && <p style={{ fontSize: '0.7em', color: '#4B5563', lineHeight: 1.55 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (!education?.length) return null;
        return (
          <div key={id} style={{ marginBottom: 20 }}>
            <div style={{ borderBottom: `1px solid ${teal}40`, paddingBottom: 6, marginBottom: 12 }}>
              <h2 style={{ fontSize: '0.62em', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: teal }}>Education</h2>
            </div>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: '0.74em', fontWeight: 700, color: '#111827' }}>{edu.degree}</p>
                {edu.field && <p style={{ fontSize: '0.68em', color: '#6B7280' }}>{edu.field}</p>}
                <p style={{ fontSize: '0.67em', color: teal }}>{edu.school}</p>
                <p style={{ fontSize: '0.62em', color: '#9CA3AF' }}>{edu.startDate}{edu.startDate && '–'}{edu.endDate}</p>
                {edu.gpa && <p style={{ fontSize: '0.62em', color: '#9CA3AF' }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        );

      case 'skills':
        if (!skills?.length) return null;
        return (
          <div key={id}>
            <div style={{ borderBottom: `1px solid ${teal}40`, paddingBottom: 6, marginBottom: 12 }}>
              <h2 style={{ fontSize: '0.62em', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: teal }}>Skills</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {skills.map((sk) => (
                <div key={sk} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: teal, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.7em', color: '#374151' }}>{sk}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: ff, background: '#FFFFFF', color: '#111827', boxSizing: 'border-box' }}>
      {/* ── Teal accent strip at top ── */}
      <div style={{ height: 8, background: `linear-gradient(90deg, ${teal}, #0891b2)` }} />

      {/* ── Header row: photo left, info right ── */}
      <div style={{ display: 'flex', gap: 28, padding: '28px 36px', alignItems: 'flex-start', borderBottom: `2px solid ${teal}`, boxSizing: 'border-box' }}>
        {/* Photo */}
        <div style={{ flexShrink: 0 }}>
          {personal.photo ? (
            <img
              src={personal.photo}
              alt={personal.name}
              style={{ width: 96, height: 108, objectFit: 'cover', borderRadius: 6, border: `2px solid ${teal}`, display: 'block' }}
            />
          ) : (
            <div style={{ width: 96, height: 108, borderRadius: 6, background: `${teal}15`, border: `2px solid ${teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.6em', fontWeight: 800, color: teal }}>
              {personal.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Name + info */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.85em', fontWeight: 900, color: '#0D0D0F', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '0.8em', color: teal, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              {personal.title}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
            {[
              { label: 'Email',    val: personal.email    },
              { label: 'Phone',    val: personal.phone    },
              { label: 'Location', val: personal.location },
              { label: 'LinkedIn', val: personal.linkedin },
              { label: 'GitHub',   val: personal.github   },
              { label: 'Website',  val: personal.website  },
            ].filter(f => f.val).map(({ label, val }) => (
              <div key={label}>
                <p style={{ fontSize: '0.55em', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 1 }}>{label}</p>
                <p style={{ fontSize: '0.7em', color: '#374151', wordBreak: 'break-all', wordSpacing: '1px' }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, padding: '22px 36px', boxSizing: 'border-box' }}>
        {personal.summary && (
          <div style={{ marginBottom: 20, padding: '12px 16px', background: `${teal}0C`, border: `1px solid ${teal}25`, borderRadius: 8 }}>
            <p style={{ fontSize: '0.75em', color: '#374151', lineHeight: 1.8 }}>{personal.summary}</p>
          </div>
        )}

        {/* 3-column grid for compact data */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.6fr 1fr', gap: 24 }}>
          {/* Experience */}
          <div style={{ gridColumn: '1 / 3' }}>
            {leftOrder.map(renderSection)}
          </div>

          {/* Right column: Education + Skills */}
          <div>
            {rightOrder.map(renderSection)}
          </div>
        </div>
      </div>


      {/* ── Bottom strip ── */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${teal}, #0891b2)`, marginTop: 'auto' }} />
    </div>
  );
}
