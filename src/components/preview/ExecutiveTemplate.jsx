export function ExecutiveTemplate({ resume, themeColor, fontFamily }) {
  const { personal, experience, education, skills, projects } = resume;
  const dark = themeColor || '#0f172a';
  const gold = '#b8860b';

  return (
    <div style={{  fontFamily: fontFamily || "'Georgia',serif", background:'#fff' }}>
      {/* Header */}
      <div style={{ background:dark, padding:'32px 40px', color:'#fff' }}>
        <h1 style={{ fontSize:'2em', fontWeight:400, letterSpacing:'0.05em', color:'#fff' }}>{personal.name || 'YOUR NAME'}</h1>
        <div style={{ width:60, height:2, background:gold, margin:'10px 0' }} />
        {personal.title && <p style={{ fontSize:'0.8em', color:'rgba(255,255,255,0.65)', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:"'Inter',sans-serif" }}>{personal.title}</p>}
        {(personal.linkedin || personal.github || personal.website) && (
          <div style={{ display:'flex', gap:20, marginTop:10, fontSize:'0.7em', fontFamily:"'Inter',sans-serif" }}>
            {personal.linkedin && <span style={{ fontSize:'0.72em', color:'rgba(255,255,255,0.5)' }}>{personal.linkedin}</span>}
            {personal.github   && <span style={{ fontSize:'0.72em', color:'rgba(255,255,255,0.5)' }}>{personal.github}</span>}
          </div>
        )}
        <div style={{ display:'flex', gap:24, marginTop:12, fontSize:'0.7em', color:'rgba(255,255,255,0.55)', fontFamily:"'Inter',sans-serif" }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </div>
      <div style={{ padding:'30px 40px' }}>
        {personal.summary && (
          <div style={{ marginBottom:22, paddingBottom:18, borderBottom:`1px solid #e5e7eb` }}>
            <p style={{ fontSize:'0.77em', color:'#374151', lineHeight:1.85 }}>{personal.summary}</p>
          </div>
        )}
        {skills.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <h3 style={{ fontSize:'0.65em', fontWeight:700, color:gold, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:12, fontFamily:"'Inter',sans-serif" }}>Core Competencies</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
              {skills.map((sk) => (
                <div key={sk} style={{ fontSize:'0.7em', color:'#374151', padding:'5px 10px', background:'#f8fafc', border:'1px solid #e5e7eb', borderLeft:`3px solid ${gold}` }}>{sk}</div>
              ))}
            </div>
          </div>
        )}
        {experience.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <h3 style={{ fontSize:'0.65em', fontWeight:700, color:gold, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:14, fontFamily:"'Inter',sans-serif" }}>Professional Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid #f3f4f6', paddingBottom:6, marginBottom:8 }}>
                  <div>
                    <p style={{ fontSize:'0.82em', fontWeight:700, color:dark }}>{exp.role}</p>
                    <p style={{ fontSize:'0.72em', color:gold }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize:'0.65em', color:'#9ca3af', fontFamily:"'Inter',sans-serif" }}>{exp.startDate}{exp.startDate && '–'}{exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bullets?.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:4 }}>
                    <span style={{ color:gold, fontSize:'0.6em', lineHeight:1.9, flexShrink:0, fontFamily:"'Inter',sans-serif" }}>◆</span>
                    <p style={{ fontSize:'0.72em', color:'#4b5563', lineHeight:1.7 }}>{b}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {education.length > 0 && (
          <div>
            <h3 style={{ fontSize:'0.65em', fontWeight:700, color:gold, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:10, fontFamily:"'Inter',sans-serif" }}>Education</h3>
            {education.map((edu) => (
              <div key={edu.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div>
                  <p style={{ fontSize:'0.78em', fontWeight:700, color:dark }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p style={{ fontSize:'0.7em', color:'#6b7280', fontFamily:"'Inter',sans-serif" }}>{edu.school}</p>
                </div>
                <span style={{ fontSize:'0.65em', color:'#9ca3af', fontFamily:"'Inter',sans-serif" }}>{edu.endDate}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
