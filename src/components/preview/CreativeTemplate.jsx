export function CreativeTemplate({ resume, themeColor, fontFamily }) {
  const { personal, experience, education, skills, projects } = resume;
  const teal = themeColor || '#0d9488';
  const cyan = '#0891b2';

  const ContactRow = ({ icon, text }) => text ? (
    <div style={{ display:'flex', gap:8, alignItems:'center', fontSize:'0.68em', color:'rgba(255,255,255,0.8)', marginBottom:6 }}>
      <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.6em' }}>{icon}</span>
      <span style={{ wordBreak:'break-all' }}>{text}</span>
    </div>
  ) : null;

  return (
    <div style={{ display:'flex',  fontFamily: fontFamily || "'Inter',sans-serif" }}>
      {/* Left sidebar */}
      <div style={{ width:'30%', background:`linear-gradient(180deg,${teal} 0%,${cyan} 100%)`, padding:'28px 18px' }}>
        <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8em', fontWeight:700, color:'#fff', marginBottom:16, border:'2px solid rgba(255,255,255,0.4)' }}>
          {personal.name?.charAt(0) || '?'}
        </div>
        <h1 style={{ fontSize:'1em', fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:3 }}>{personal.name || 'Your Name'}</h1>
        <p style={{ fontSize:'0.65em', color:'rgba(255,255,255,0.75)', marginBottom:20, fontWeight:500 }}>{personal.title}</p>
        <div style={{ marginBottom:20 }}>
          <h4 style={{ fontSize:'0.6em', fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Contact</h4>
          <ContactRow icon="✉" text={personal.email} />
          <ContactRow icon="☎" text={personal.phone} />
          <ContactRow icon="📍" text={personal.location} />
          {personal.linkedin && <ContactRow icon="in" text={personal.linkedin} />}
          {personal.github   && <ContactRow icon="gh" text={personal.github} />}
        </div>
        {skills.length > 0 && (
          <div>
            <h4 style={{ fontSize:'0.6em', fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Skills</h4>
            {skills.map((sk) => (
              <div key={sk} style={{ marginBottom:6 }}>
                <span style={{ fontSize:'0.67em', color:'#fff' }}>{sk}</span>
                <div style={{ height:2, background:'rgba(255,255,255,0.15)', borderRadius:99, marginTop:2 }}>
                  <div style={{ height:'100%', width:'75%', background:'rgba(255,255,255,0.6)', borderRadius:99 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ flex:1, padding:'28px 24px', background:'#fff' }}>
        {personal.summary && (
          <div style={{ marginBottom:20, paddingBottom:16, borderBottom:'2px solid #f0fdfa' }}>
            <p style={{ fontSize:'0.74em', color:'#374151', lineHeight:1.75 }}>{personal.summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div style={{ marginBottom:18 }}>
            <h3 style={{ fontSize:'0.68em', fontWeight:700, color:teal, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>Work Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom:14, paddingLeft:12, borderLeft:`2px solid ${teal}40` }}>
                <p style={{ fontSize:'0.78em', fontWeight:700, color:'#1f2937' }}>{exp.role}</p>
                <p style={{ fontSize:'0.7em', color:teal, fontWeight:600, marginBottom:4 }}>{exp.company}</p>
                <p style={{ fontSize:'0.63em', color:'#9ca3af', marginBottom:6 }}>{exp.startDate}{exp.startDate && '–'}{exp.current ? 'Present' : exp.endDate}</p>
                {exp.bullets?.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ display:'flex', gap:6, marginBottom:3 }}>
                    <span style={{ color:teal, fontSize:'0.6em', lineHeight:1.8, flexShrink:0 }}>▸</span>
                    <p style={{ fontSize:'0.7em', color:'#4b5563', lineHeight:1.6 }}>{b}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {education.length > 0 && (
          <div style={{ marginBottom:18 }}>
            <h3 style={{ fontSize:'0.68em', fontWeight:700, color:teal, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Education</h3>
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
        {projects.length > 0 && (
          <div>
            <h3 style={{ fontSize:'0.68em', fontWeight:700, color:teal, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Projects</h3>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom:10 }}>
                <p style={{ fontSize:'0.75em', fontWeight:700, color:'#1f2937' }}>{proj.name}</p>
                {proj.tech && <p style={{ fontSize:'0.65em', color:teal, margin:'3px 0' }}>{proj.tech}</p>}
                {proj.description && <p style={{ fontSize:'0.7em', color:'#4b5563', lineHeight:1.5 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
