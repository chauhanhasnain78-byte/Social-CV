// src/components/CoverLetterModal.jsx
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { X, Mail, Sparkles, Copy, Check, FileDown } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

// ── Smart Cover Letter Generator ─────────────────────────────────────────────
function generateCoverLetter({ resume, company, jobTitle }) {
  const p = resume.personal || {};
  const name = p.fullName || p.name || 'Your Name';
  const title = p.title || jobTitle;
  const email = p.email || '';
  const phone = p.phone || '';
  const location = p.location || '';
  const summary = p.summary || '';

  const skills = (resume.skills || []).slice(0, 6);
  const experience = resume.experience || [];
  const education = resume.education || [];
  const projects = resume.projects || [];
  const certs = resume.certifications || [];

  // Build experience paragraph
  let expPara = '';
  if (experience.length > 0) {
    const latest = experience[0];
    const prevRoles = experience.slice(1, 3);
    const bullet = latest.bullets && latest.bullets.find(b => b.trim());
    expPara = `In my most recent role as **${latest.role || 'a professional'}** at **${latest.company || 'my previous employer'}**, I ${bullet ? bullet.toLowerCase().replace(/\.$/, '') : 'contributed to key projects and delivered measurable results'}. ${prevRoles.length > 0 ? `Prior to this, my experience at ${prevRoles.map(e => e.company).filter(Boolean).join(' and ')} further strengthened my ability to adapt and deliver in fast-paced environments.` : ''}`;
  } else {
    expPara = `As a motivated ${title}, I bring a strong foundation in my field, complemented by practical project experience and a dedication to continuous learning.`;
  }

  // Build skills sentence
  const skillsSentence = skills.length > 0
    ? `My technical toolkit includes ${skills.slice(0, -1).join(', ')}${skills.length > 1 ? `, and ${skills[skills.length - 1]}` : skills[0]}, which I am eager to apply to real-world challenges at ${company}.`
    : `I am confident that my skills and experience make me a strong candidate for the ${jobTitle} role at ${company}.`;

  // Build education line
  let eduLine = '';
  if (education.length > 0) {
    const edu = education[0];
    const deg = [edu.degree, edu.field].filter(Boolean).join(' in ');
    const school = edu.school || 'my university';
    eduLine = deg ? `I hold a ${deg} from ${school}.` : `I completed my education at ${school}.`;
  }

  // Project / cert highlight
  let bonusLine = '';
  if (projects.length > 0) {
    const projNames = projects.slice(0, 2).map(proj => proj.name).filter(Boolean);
    if (projNames.length > 0) bonusLine = `I have also built hands-on projects—including ${projNames.join(' and ')}—which reflect my passion for creating practical, impactful solutions.`;
  } else if (certs.length > 0) {
    const certNames = certs.slice(0, 2).map(c => c.name).filter(Boolean);
    if (certNames.length > 0) bonusLine = `I have further demonstrated my commitment to professional growth through certifications including ${certNames.join(' and ')}.`;
  }

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return `${today}

Hiring Manager
${company}

Subject: Application for the Position of ${jobTitle}

Dear Hiring Manager,

I am writing to express my sincere interest in the **${jobTitle}** position at **${company}**. As a dedicated and results-driven ${title}, I am excited by the opportunity to bring my skills, experience, and enthusiasm to your team.

${expPara}

${skillsSentence}

${eduLine ? eduLine + ' ' : ''}${bonusLine}

${summary ? `To briefly describe myself: ${summary.charAt(0).toLowerCase() + summary.slice(1).replace(/\.$/, '')}. ` : ''}I thrive in collaborative environments where I can contribute meaningfully while continuing to grow professionally. I am particularly drawn to ${company} for its reputation for innovation and excellence, and I am confident that my background aligns well with your requirements.

I would welcome the opportunity to discuss how my experience and vision can contribute to ${company}'s continued success. I am available at your convenience for an interview and can be reached at${phone ? ` ${phone}` : ''} or ${email || 'the contact details provided in my resume'}.

Thank you sincerely for your time and consideration. I look forward to the possibility of joining the ${company} team.

Yours sincerely,

${name}
${title}${phone ? `\n${phone}` : ''}${email ? `\n${email}` : ''}${location ? `\n${location}` : ''}`;
}

// ── Modal Component ───────────────────────────────────────────────────────────
export function CoverLetterModal({ onClose }) {
  const { resume } = useResumeStore();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'result'
  const [letter, setLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!company.trim() || !jobTitle.trim()) {
      toast.error('Please fill in both Company Name and Job Title.');
      return;
    }
    const result = generateCoverLetter({ resume, company: company.trim(), jobTitle: jobTitle.trim() });
    setLetter(result);
    setStep('result');
  };

  const handleCopy = async () => {
    const plain = letter.replace(/\*\*(.*?)\*\*/g, '$1');
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    toast.success('Cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const plain = letter.replace(/\*\*(.*?)\*\*/g, '$1');
    const blob = new Blob([plain], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover-Letter-${company.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Cover letter downloaded!');
  };

  const renderBoldText = (text) =>
    text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          <br />
        </span>
      );
    });

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,10,16,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 20,
        boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
        width: '100%', maxWidth: step === 'result' ? 720 : 500,
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', transition: 'max-width 0.35s ease',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'linear-gradient(135deg, #F8F8FF, #F3F0FF)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mail size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Cover Letter Generator ✉️
            </h2>
            <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: '2px 0 0' }}>
              {step === 'input' ? 'Enter the target company & role to generate your letter' : `Generated for ${jobTitle} at ${company}`}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 8,
            padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {step === 'input' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: 6 }}>COMPANY NAME *</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Google, Infosys, TCS..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('cl-jt')?.focus(); }}
                  style={{
                    width: '100%', padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.12)',
                    borderRadius: 12, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                    color: '#0D0D0F', background: '#FAFAFA', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', marginBottom: 6 }}>JOB TITLE / ROLE *</label>
                <input
                  id="cl-jt"
                  type="text"
                  placeholder="e.g. Software Engineer, Data Analyst..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                  style={{
                    width: '100%', padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.12)',
                    borderRadius: 12, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                    color: '#0D0D0F', background: '#FAFAFA', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6C47FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{
                padding: '12px 14px', borderRadius: 12,
                background: '#F8F8FC', border: '1px dashed rgba(108,71,255,0.25)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Sparkles size={14} color="#6C47FF" style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.5 }}>
                  The letter will be <strong>personalized</strong> using your actual resume data — your name, experience, skills, education, and projects.
                </p>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div style={{
              background: '#FAFAFA', border: '1.5px solid rgba(0,0,0,0.08)',
              borderRadius: 14, padding: '24px 28px',
              fontSize: '0.85rem', lineHeight: 1.85, color: '#1F2937',
              fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap',
            }}>
              {renderBoldText(letter)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', gap: 10, background: '#FAFAFA', flexWrap: 'wrap',
        }}>
          {step === 'input' && (
            <>
              <button onClick={onClose} style={{
                flex: 1, padding: '11px', borderRadius: 10,
                background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
                color: '#374151', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
              }}>Cancel</button>
              <button onClick={handleGenerate} style={{
                flex: 2, padding: '11px', borderRadius: 10,
                background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)',
                border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(108,71,255,0.35)',
              }}>
                <Sparkles size={14} /> Generate Cover Letter
              </button>
            </>
          )}
          {step === 'result' && (
            <>
              <button onClick={() => setStep('input')} style={{
                padding: '11px 16px', borderRadius: 10,
                background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
                color: '#374151', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
              }}>← Regenerate</button>
              <button onClick={handleCopy} style={{
                flex: 1, padding: '11px', borderRadius: 10,
                background: copied ? '#ecfdf5' : '#fff',
                border: `1.5px solid ${copied ? '#10b981' : 'rgba(0,0,0,0.12)'}`,
                color: copied ? '#10b981' : '#374151',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s',
              }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button onClick={handleDownload} style={{
                flex: 1, padding: '11px', borderRadius: 10,
                background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)',
                border: 'none', color: '#fff', fontSize: '0.82rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 4px 14px rgba(108,71,255,0.3)',
              }}>
                <FileDown size={14} /> Download .txt
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
