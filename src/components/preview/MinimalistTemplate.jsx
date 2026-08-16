export function MinimalistTemplate({ resume, themeColor, fontFamily }) {
  const { personal, experience, education, skills, projects } = resume;

  const Rule = () => <div style={{ height:1, background:'#e5e7eb', margin:'16px 0' }} />;
  const SectionTitle = ({ children }) => (
    <h3 style={{ fontSize:'0.72em', fontWeight:700, color: themeColor || '#374151', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:10 }}>{children}</h3>
  );

  return (
    <div style={{  padding:'48px 52px', fontFamily: fontFamily || "'Inter',sans-serif", background:'#fff', color:'#1f2937' }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'2em', fontWeight:900, letterSpacing:'-0.03em', color:'#111827' }}>{personal.name || 'Your Name'}</h1>
        {personal.title && <p style={{ fontSize:'0.85em', color:'#6b7280', marginTop:4, fontWeight:500 }}>{personal.title}</p>}
        <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginTop:10, fontSize:'0.7em', color:'#6b7280' }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github   && <span>{personal.github}</span>}
        </div>
      </div>
      <Rule />
      {personal.summary && (
        <><p style={{ fontSize:'0.76em', color:'#4b5563', lineHeight:1.8 }}>{personal.summary}</p><Rule /></>
      )}
      {experience.length > 0 && (
        <><SectionTitle>Experience</SectionTitle>
        {experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <p style={{ fontSize:'0.78em', fontWeight:700 }}>{exp.role} <span style={{ fontWeight:400, color:'#6b7280' }}>@ {exp.company}</span></p>
              <span style={{ fontSize:'0.65em', color:'#9ca3af' }}>{exp.startDate}{exp.startDate && '–'}{exp.current ? 'Present' : exp.endDate}</span>
            </div>
            {exp.bullets?.filter(Boolean).map((b, i) => (
              <div key={i} style={{ display:'flex', gap:8, marginTop:4 }}>
                <span style={{ color:'#9ca3af', fontSize:'0.7em', lineHeight:1.7, flexShrink:0 }}>—</span>
                <p style={{ fontSize:'0.72em', color:'#4b5563', lineHeight:1.7 }}>{b}</p>
              </div>
            ))}
          </div>
        ))}
        <Rule /></>
      )}
      {education.length > 0 && (
        <><SectionTitle>Education</SectionTitle>
        {education.map((edu) => (
          <div key={edu.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <div>
              <p style={{ fontSize:'0.75em', fontWeight:700 }}>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
              <p style={{ fontSize:'0.7em', color:'#6b7280' }}>{edu.school}</p>
            </div>
            <span style={{ fontSize:'0.65em', color:'#9ca3af' }}>{edu.endDate}</span>
          </div>
        ))}
        <Rule /></>
      )}
      {skills.length > 0 && (
        <><SectionTitle>Skills</SectionTitle>
        <p style={{ fontSize:'0.72em', color:'#4b5563', lineHeight:1.8 }}>{skills.join(' · ')}</p></>
      )}
    </div>
  );
}
