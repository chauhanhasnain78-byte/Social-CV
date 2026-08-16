export function StartupTemplate({ resume, themeColor, fontFamily }) {
  const { personal, experience, education, skills, projects } = resume;
  const tc = themeColor || '#7c3aed';

  return (
    <div style={{  fontFamily: fontFamily || "'Inter',sans-serif", background:'#fff' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${tc} 0%,#db2777 100%)`, padding:'32px 36px', color:'#fff' }}>
        <h1 style={{ fontSize:'1.8em', fontWeight:900, letterSpacing:'-0.02em' }}>{personal.name || 'Your Name'}</h1>
        <p style={{ fontSize:'0.9em', opacity:0.9, marginTop:4, fontWeight:500 }}>{personal.title}</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginTop:14, fontSize:'0.72em', opacity:0.85 }}>
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <span>☎ {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>LinkedIn · {personal.linkedin}</span>}
          {personal.github   && <span>GitHub · {personal.github}</span>}
        </div>
      </div>
      <div style={{ padding:'28px 36px' }}>
        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom:20, padding:16, background:'#f5f3ff', borderRadius:12, borderLeft:'3px solid ${tc}' }}>
            <p style={{ fontSize:'0.75em', color:'#4b5563', lineHeight:1.7 }}>{personal.summary}</p>
          </div>
        )}
        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <h3 style={{ fontSize:'0.68em', fontWeight:700, color:'${tc}', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Skills & Technologies</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {skills.map((sk) => (
                <span key={sk} style={{ fontSize:'0.68em', padding:'4px 12px', borderRadius:999, background:'#f5f3ff', border:'1px solid #ddd6fe', color:'#6d28d9', fontWeight:500 }}>{sk}</span>
              ))}
            </div>
          </div>
        )}
        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <h3 style={{ fontSize:'0.68em', fontWeight:700, color:'${tc}', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom:16, paddingLeft:14, borderLeft:'2px solid #e9d5ff' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <div>
                    <p style={{ fontSize:'0.8em', fontWeight:700, color:'#1f2937' }}>{exp.role}</p>
                    <p style={{ fontSize:'0.72em', color:'${tc}', fontWeight:600 }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize:'0.65em', color:'#9ca3af' }}>{exp.startDate}{exp.startDate && '–'}{exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bullets?.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display:'flex', gap:6, marginTop:5 }}>
                    <span style={{ color:'${tc}', fontSize:'0.7em', lineHeight:1.8, flexShrink:0 }}>→</span>
                    <p style={{ fontSize:'0.72em', color:'#4b5563', lineHeight:1.6 }}>{b}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <h3 style={{ fontSize:'0.68em', fontWeight:700, color:'${tc}', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Education</h3>
            {education.map((edu) => (
              <div key={edu.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div>
                  <p style={{ fontSize:'0.75em', fontWeight:700, color:'#1f2937' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ fontSize:'0.7em', color:'#6b7280' }}>{edu.school}</p>
                </div>
                <span style={{ fontSize:'0.65em', color:'#9ca3af' }}>{edu.endDate}</span>
              </div>
            ))}
          </div>
        )}
        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h3 style={{ fontSize:'0.68em', fontWeight:700, color:'${tc}', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Projects</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ padding:12, background:'#f5f3ff', borderRadius:10 }}>
                  <p style={{ fontSize:'0.75em', fontWeight:700, color:'#1f2937' }}>{proj.name}</p>
                  {proj.tech && <p style={{ fontSize:'0.63em', color:'${tc}', margin:'3px 0' }}>{proj.tech}</p>}
                  {proj.description && <p style={{ fontSize:'0.68em', color:'#6b7280', lineHeight:1.5 }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
