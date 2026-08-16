import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, Info, TrendingUp, Target, Zap, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { enhanceResumeWithAI } from '@/utils/cvEnhancer';

const BREAKDOWN_LABELS = {
  keywords:    { label:'Keyword Density',   max:40, icon:'🔍', color:'#5a4fff' },
  actionVerbs: { label:'Action Verbs',       max:20, icon:'⚡', color:'#f43f5e' },
  quantified:  { label:'Quantified Impact',  max:15, icon:'📊', color:'#f97316' },
  sections:    { label:'Section Quality',    max:15, icon:'📋', color:'#22c55e' },
  contact:     { label:'Contact & Links',    max:10, icon:'🔗', color:'#38bdf8' },
};

function ScoreRing({ score, color }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:'relative', width:144, height:144, margin:'0 auto' }}>
      <svg style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={animated ? offset : circumference}
          style={{ transition:'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)', filter:`drop-shadow(0 0 8px ${color}60)` }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:'2.5rem', fontWeight:800, color:'#fff' }}>{score}</span>
        <span style={{ fontSize:'0.7rem', color:'#64748b' }}>/ 100</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value, max, icon, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:'0.72rem', color:'#94a3b8' }}>{icon} {label}</span>
        <span style={{ fontSize:'0.72rem', fontWeight:600, color:'#fff' }}>{value}<span style={{ color:'#334155' }}>/{max}</span></span>
      </div>
      <div style={{ height:6, borderRadius:99, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:99, width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}88)`, transition:'width 1s ease 0.3s' }} />
      </div>
    </div>
  );
}

function TipCard({ tip }) {
  const colors = {
    high:   { bg:'rgba(244,63,94,0.08)',  border:'rgba(244,63,94,0.2)',  badge:'#f43f5e', label:'High Priority' },
    medium: { bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.2)', badge:'#fbbf24', label:'Medium' },
    low:    { bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.2)',  badge:'#22c55e', label:'Low' },
  };
  const c = colors[tip.priority] || colors.medium;
  return (
    <div style={{ borderRadius:12, padding:14, background:c.bg, border:`1px solid ${c.border}` }}>
      <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
        <span style={{ fontSize:'1.1rem' }}>{tip.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
            <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#fff' }}>{tip.category}</span>
            <span style={{ fontSize:'0.65rem', padding:'1px 7px', borderRadius:99, fontWeight:600, background:`${c.badge}22`, color:c.badge }}>{c.label}</span>
          </div>
          <p style={{ fontSize:'0.76rem', color:'#cbd5e1', lineHeight:1.6 }}>{tip.tip}</p>
          {tip.example && <p style={{ fontSize:'0.7rem', color:'#64748b', marginTop:4, fontStyle:'italic' }}>→ {tip.example}</p>}
        </div>
      </div>
    </div>
  );
}

export function ATSModal({ result, onClose }) {
  const overlayRef = useRef(null);
  const { resume, loadResume } = useResumeStore();

  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [changes, setChanges] = useState([]);
  const [showChanges, setShowChanges] = useState(false);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (!result) return null;
  const { score, breakdown, tips, grade, gradeColor, techFound } = result;

  const handleEnhance = async () => {
    setEnhancing(true);
    // Small delay for animation effect
    await new Promise((r) => setTimeout(r, 1200));
    const { enhanced: enhancedResume, changes: changeLog } = enhanceResumeWithAI(resume, result);
    loadResume(enhancedResume);
    setChanges(changeLog);
    setEnhanced(true);
    setEnhancing(false);
    setShowChanges(true);
  };

  return (
    <div ref={overlayRef} style={{ position:'fixed', inset:0, zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div style={{ width:'100%', maxWidth:640, borderRadius:24, overflow:'hidden', background:'#0f0f23', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 40px 80px rgba(0,0,0,0.8)', maxHeight:'90vh', overflowY:'auto' }} className="animate-scale-in">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'#0f0f23', position:'sticky', top:0, zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(90,79,255,0.15)' }}><Target size={16} style={{ color:'#a78bfa' }} /></div>
            <div>
              <h2 style={{ fontWeight:700, color:'#fff', fontSize:'0.95rem' }}>ATS Score Report</h2>
              <p style={{ fontSize:'0.68rem', color:'#475569' }}>Powered by Social-CV engine</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding:6 }}><X size={16} /></button>
        </div>

        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:24 }}>
          {/* Score Ring */}
          <div style={{ textAlign:'center' }}>
            <ScoreRing score={score} color={gradeColor} />
            <p style={{ fontSize:'1.3rem', fontWeight:800, color:gradeColor, marginTop:10 }}>{grade}</p>
            <p style={{ fontSize:'0.78rem', color:'#64748b', marginTop:4 }}>Your resume scored <strong style={{color:'#fff'}}>{score}/100</strong> on ATS compatibility</p>
          </div>

          {/* How ATS Works */}
          <div style={{ borderRadius:16, padding:16, background:'rgba(90,79,255,0.08)', border:'1px solid rgba(90,79,255,0.2)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}><Info size={14} style={{color:'#a78bfa'}} /><h3 style={{ fontWeight:600, fontSize:'0.83rem', color:'#fff' }}>How ATS Works</h3></div>
            <p style={{ fontSize:'0.77rem', color:'#94a3b8', lineHeight:1.7 }}>Applicant Tracking Systems scan resumes for keywords and structure. <strong style={{color:'#fff'}}>75% of resumes</strong> are rejected before a human reads them. Our engine checks 5 key dimensions.</p>
          </div>

          {/* Score Breakdown */}
          <div>
            <h3 style={{ fontWeight:600, fontSize:'0.83rem', color:'#fff', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}><TrendingUp size={14} style={{color:'#a78bfa'}} /> Score Breakdown</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {Object.entries(breakdown).map(([key, val]) => {
                const meta = BREAKDOWN_LABELS[key]; if (!meta) return null;
                return <BreakdownBar key={key} label={meta.label} value={val} max={meta.max} icon={meta.icon} color={meta.color} />;
              })}
            </div>
          </div>

          {/* Detected Keywords */}
          {techFound?.length > 0 && (
            <div>
              <h3 style={{ fontWeight:600, fontSize:'0.83rem', color:'#fff', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}><CheckCircle size={14} style={{color:'#4ade80'}} /> Detected Keywords ({techFound.length})</h3>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {techFound.slice(0,20).map((kw) => <span key={kw} className="badge-success">{kw}</span>)}
              </div>
            </div>
          )}

          {/* Improvement Tips */}
          {tips.length > 0 && (
            <div>
              <h3 style={{ fontWeight:600, fontSize:'0.83rem', color:'#fff', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}><Zap size={14} style={{color:'#fbbf24'}} /> Improvement Tips</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>{tips.map((tip, i) => <TipCard key={i} tip={tip} />)}</div>
            </div>
          )}

          {tips.length === 0 && (
            <div style={{ textAlign:'center', padding:'16px 0' }}>
              <CheckCircle size={32} style={{ color:'#4ade80', margin:'0 auto 8px' }} />
              <p style={{ fontWeight:600, color:'#4ade80' }}>Excellent! No major issues found.</p>
            </div>
          )}

          {/* ── AI Enhance Button ── */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:20 }}>
            {!enhanced ? (
              <button
                onClick={handleEnhance}
                disabled={enhancing}
                style={{
                  width: '100%', padding: '14px 20px', borderRadius: 14,
                  background: enhancing
                    ? 'rgba(139,92,246,0.3)'
                    : 'linear-gradient(135deg, #7c3aed, #6C47FF, #4f46e5)',
                  border: '1px solid rgba(139,92,246,0.4)',
                  color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                  cursor: enhancing ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: enhancing ? 'none' : '0 8px 32px rgba(108,71,255,0.4)',
                  transition: 'all 0.3s',
                }}
              >
                {enhancing ? (
                  <>
                    <span style={{ display:'inline-block', animation:'spin 1s linear infinite' }}>✨</span>
                    Enhancing your CV with AI…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    ✨ Enhance My CV with AI
                  </>
                )}
              </button>
            ) : (
              <div>
                {/* Success state */}
                <div style={{ borderRadius:14, padding:'14px 18px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
                  <CheckCircle size={20} style={{ color:'#10b981', flexShrink:0 }} />
                  <div>
                    <p style={{ fontWeight:700, color:'#10b981', fontSize:'0.88rem' }}>CV Enhanced Successfully!</p>
                    <p style={{ color:'#64748b', fontSize:'0.75rem', marginTop:2 }}>Your live preview has been updated. Check the canvas editor.</p>
                  </div>
                </div>

                {/* Changes log toggle */}
                <button
                  onClick={() => setShowChanges((v) => !v)}
                  style={{ width:'100%', padding:'10px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#94a3b8', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}
                >
                  <span>View {changes.length} changes made</span>
                  {showChanges ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showChanges && (
                  <div style={{ marginTop:8, padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    {changes.map((c, i) => (
                      <p key={i} style={{ fontSize:'0.78rem', color:'#cbd5e1', lineHeight:1.8 }}>{c}</p>
                    ))}
                  </div>
                )}

                {/* Close and view button */}
                <button
                  onClick={onClose}
                  style={{ width:'100%', marginTop:10, padding:'12px 20px', borderRadius:12, background:'linear-gradient(135deg,#6C47FF,#4A2FD9)', border:'none', color:'#fff', fontSize:'0.88rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(108,71,255,0.35)' }}
                >
                  View Enhanced CV →
                </button>
              </div>
            )}

            {!enhanced && (
              <p style={{ textAlign:'center', fontSize:'0.7rem', color:'#334155', marginTop:10 }}>
                AI will automatically improve action verbs, add keywords, and generate a stronger summary based on the ATS analysis above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
