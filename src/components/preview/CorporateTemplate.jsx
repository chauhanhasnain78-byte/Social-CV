export function CorporateTemplate({ resume, themeColor, fontFamily }) {
  const { personal, experience, education, skills, projects } = resume;
  const navyBlue = themeColor || '#1e3a5f';
  const gold = '#c9a84c';
  const light = '#f8fafc';

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
        <div style={{ width:3, height:16, background:gold, borderRadius:2 }} />
        <h3 style={{ fontSize:'0.7em', fontWeight:700, color:navyBlue, letterSpacing:'0.1em', textTransform:'uppercase' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display:'flex', fontFamily: fontFamily || "'Inter',sans-serif" }}>
      {/* Left sidebar */}
      <div style={{ width:'32%', background:navyBlue, padding:'28px 20px', color:'#fff' }}>
        {/* Avatar */}
        <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg,${gold},#e8c97a)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, fontSize:'1.6em', fontWeight:700, color:navyBlue }}>
          {personal.name?.charAt(0) || '?'}
        </div>
        <h1 style={{ fontSize:'1.1em', fontWeight:800, lineHeight:1.2, marginBottom:4 }}>{personal.name || 'Your Name'}</h1>
        <p style={{ fontSize:'0.7em', color:gold, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:20 }}>{personal.title || 'Your Title'}</p>
        {/* Contact */}
        <div style={{ marginBottom:20, fontSize:'0.68em', lineHeight:1.9, color:'rgba(255,255,255,0.8)' }}>
          {personal.email    && <div>✉️ {personal.email}</div>}
          {personal.phone    && <div>📞 {personal.phone}</div>}
          {personal.location && <div>📍 {personal.location}</div>}
          {personal.linkedin && <div>in {personal.linkedin}</div>}
          {personal.github   && <div>gh {personal.github}</div>}
        </div>
        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 style={{ fontSize:'0.62em', fontWeight:700, color:gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Skills</h3>
            {skills.map((sk) => (
              <div key={sk} style={{ fontSize:'0.68em', color:'rgba(255,255,255,0.85)', padding:'3px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>{sk}</div>
            ))}
          </div>
        )}
      </div>
      {/* Main content */}
      <div style={{ flex:1, padding:'28px 24px', background:'#fff' }}>
        {/* Summary */}
        {personal.summary && (
          <Section title="Professional Summary">
            <p style={{ fontSize:'0.73em', color:'#374151', lineHeight:1.7 }}>{personal.summary}</p>
          </Section>
        )}
        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Work Experience">
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <div>
                    <p style={{ fontSize:'0.78em', fontWeight:700, color:navyBlue }}>{exp.role}</p>
                    <p style={{ fontSize:'0.7em', color:gold, fontWeight:600 }}>{exp.company}</p>
                  </div>
                  <p style={{ fontSize:'0.65em', color:'#9ca3af' }}>{exp.startDate}{exp.startDate && ' — '}{exp.current ? 'Present' : exp.endDate}</p>
                </div>
                {exp.bullets?.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display:'flex', gap:6, marginTop:4 }}>
                    <span style={{ color:gold, fontSize:'0.65em', lineHeight:1.8, flexShrink:0 }}>•</span>
                    <p style={{ fontSize:'0.7em', color:'#4b5563', lineHeight:1.6 }}>{b}</p>
                  </div>
                ))}
              </div>
            ))}
          </Section>
        )}
        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <div>
                    <p style={{ fontSize:'0.75em', fontWeight:700, color:navyBlue }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p style={{ fontSize:'0.7em', color:'#6b7280' }}>{edu.school}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                  </div>
                  <p style={{ fontSize:'0.65em', color:'#9ca3af' }}>{edu.startDate}{edu.startDate && '–'}{edu.endDate}</p>
                </div>
              </div>
            ))}
          </Section>
        )}
        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom:10 }}>
                <p style={{ fontSize:'0.75em', fontWeight:700, color:navyBlue }}>{proj.name}</p>
                {proj.tech && <p style={{ fontSize:'0.65em', color:gold, marginBottom:3 }}>{proj.tech}</p>}
                {proj.description && <p style={{ fontSize:'0.7em', color:'#4b5563', lineHeight:1.5 }}>{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}
