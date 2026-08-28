import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, ChevronLeft, LayoutTemplate, Image, AlignLeft, Edit3, Save, CheckCircle, Loader2, Cloud, CloudOff, Moon, Sun
} from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { StepperBar } from '@/components/editor/StepperBar';
import { WizardForm } from '@/components/editor/WizardForm';
import { CanvasToolbar } from '@/components/editor/CanvasToolbar';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { TEMPLATES } from '@/templates/templateMeta';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { toast } from '@/components/ui/Toast';
import { fire100Confetti } from '@/utils/confetti';


// ── Completeness Calculator ───────────────────────────────────────────────────
function calcCompleteness(resume) {
  let score = 0;
  const max  = 100;

  const p = resume.personal || {};
  if (p.name)                   score += 10;
  if (p.title)                  score += 5;
  if (p.email)                  score += 8;
  if (p.phone)                  score += 5;
  if (p.location)               score += 4;
  if (p.linkedin)               score += 4;
  if (p.github || p.website)    score += 4;
  if ((p.summary || '').length > 50)  score += 10;

  if ((resume.experience || []).length > 0)  score += 15;
  if ((resume.education  || []).length > 0)  score += 12;
  if ((resume.skills     || []).length >= 3) score += 10;
  if ((resume.projects   || []).length > 0)  score += 8;
  if ((resume.languages  || []).length > 0)  score += 3;
  if ((resume.certifications || []).length > 0) score += 2;

  return Math.min(max, score);
}

// ── Progress Bar Widget (top of wizard) ──────────────────────────────────────
function CompletenessBar({ resume }) {
  const pct = calcCompleteness(resume);
  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#6C47FF' : '#eab308';

  return (
    <div style={{ marginBottom: 12, padding: '10px 16px', background: 'var(--dm-bg, #fff)', borderRadius: 12, border: '1px solid var(--dm-border, rgba(0,0,0,0.06))', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--dm-muted, #6B7280)' }}>Resume Completeness</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--dm-raised, #F3F4F6)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease, background 0.4s ease',
        }} />
      </div>
      {pct < 80 && (
        <p style={{ marginTop: 5, fontSize: '0.65rem', color: 'var(--dm-muted-light, #9CA3AF)' }}>
          {pct < 40 ? '💡 Fill in your basic info to get started' : pct < 70 ? '⚡ Adding experience & skills will boost your ATS score' : '🎯 Almost there — add a summary & links for a complete profile'}
        </p>
      )}
    </div>
  );
}

export default function EditorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    resume, selectedTemplate, themeColor, fontFamily, sectionOrder,
    fontSize, textAlignment,
    isDirty, resetDirty, editorPhase, setEditorPhase,
    isDarkMode, setDarkMode
  } = useResumeStore();

  const [previewScale, setPreviewScale] = useState(0.65);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const autoSaveTimer = useRef(null);
  const confettiFiredRef = useRef(false); // Only fire once per session

  const templateMeta = TEMPLATES.find((t) => t.id === selectedTemplate);

  // 🎉 Fire confetti when resume hits 100%
  useEffect(() => {
    const pct = calcCompleteness(resume);
    if (pct >= 100 && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      fire100Confetti();
      toast.success('Your resume is 100% complete! 🏆', { title: '🎉 Perfect Score!' });
    }
    if (pct < 100) {
      confettiFiredRef.current = false; // Reset if they remove info
    }
  }, [resume]);


  // ── Save function (shared by manual + auto) ────────────────────────────────
  const saveResume = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setSaving(true);
    else setAutoSaveStatus('saving');

    try {
      const payload = { resume, templateId: selectedTemplate, themeColor, fontFamily, sectionOrder, updatedAt: Date.now() };
      localStorage.setItem(`social-cv-resume-${user.uid}`, JSON.stringify(payload));

      try {
        await setDoc(doc(db, 'resumes', user.uid), payload, { merge: true });
      } catch (dbErr) {
        console.warn('Firebase save failed, saved locally:', dbErr);
      }

      resetDirty();
      if (!silent) {
        setSaved(true);
        toast.success('Resume saved successfully! ✅');
        setTimeout(() => setSaved(false), 3000);
      } else {
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      }
    } catch (err) {
      console.error(err);
      if (!silent) toast.error(`Save failed: ${err.message || 'Please try again.'}`);
      else setAutoSaveStatus('error');
    } finally {
      if (!silent) setSaving(false);
    }
  }, [user, resume, selectedTemplate, themeColor, fontFamily, sectionOrder, resetDirty]);

  // ── Auto-save: 30s debounce when isDirty ──────────────────────────────────
  useEffect(() => {
    if (!isDirty || !user) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveResume(true); // silent auto-save
    }, 30_000); // 30 seconds

    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [isDirty, resume, user, saveResume]);

  // ── Keyboard shortcut: Ctrl+S ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveResume(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveResume]);

  const renderAutoSaveIndicator = () => {
    if (autoSaveStatus === 'saving') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: 'var(--dm-muted, #6B7280)' }}>
        <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> Auto-saving…
      </div>
    );
    if (autoSaveStatus === 'saved') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: '#10b981' }}>
        <Cloud size={11} /> Auto-saved
      </div>
    );
    if (autoSaveStatus === 'error') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.68rem', color: '#EF4444' }}>
        <CloudOff size={11} /> Auto-save failed
      </div>
    );
    return null;
  };

  const renderTopBar = () => (
    <motion.header
      className="editor-topbar"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{
        height: 60, flexShrink: 0,
        background: 'rgba(253,252,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 10,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}
    >
      <button
        onClick={() => navigate('/dashboard')}
        aria-label="Back to Dashboard"
        style={{
          display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--dm-muted, #6B7280)', fontWeight: 500, fontFamily: 'Inter',
          padding: '6px 10px', borderRadius: 8, transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#0D0D0F'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6B7280'; }}
      >
        <ChevronLeft size={16} /> Templates
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.08)', margin: '0 4px' }} />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="Social-CV" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
      </div>

      {templateMeta && (
        <div className="editor-topbar-center" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#F3F0FF', borderRadius: 999, marginLeft: 4, border: '1px solid rgba(108,71,255,0.15)' }}>
          <LayoutTemplate size={12} style={{ color: '#6C47FF' }} />
          <span style={{ fontSize: '0.75rem', color: '#6C47FF', fontWeight: 600 }}>{templateMeta.name}</span>
          {templateMeta.hasPhoto ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.6rem', padding: '1px 7px', background: 'rgba(255,107,53,0.12)', color: '#FF6B35', borderRadius: 999, fontWeight: 700, border: '1px solid rgba(255,107,53,0.2)' }}><Image size={8} /> PHOTO</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.6rem', padding: '1px 7px', background: 'rgba(108,71,255,0.08)', color: '#6C47FF', borderRadius: 999, fontWeight: 700, border: '1px solid rgba(108,71,255,0.15)' }}><AlignLeft size={8} /> TEXT</span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
        {isDirty && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#FFFBEB', borderRadius: 999, border: '1px solid rgba(234,179,8,0.25)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308' }} />
            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 600 }}>Unsaved</span>
          </div>
        )}
        {renderAutoSaveIndicator()}
      </div>

      <div style={{ marginLeft: 'auto', marginRight: 16 }} />

      {editorPhase === 'wizard' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--dm-muted-light, #9CA3AF)', display: 'none' }} className="editor-shortcut-hint">Ctrl+S to save</span>
          <button
            onClick={() => saveResume(false)}
            disabled={saving}
            aria-label="Save resume"
            title="Save (Ctrl+S)"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', borderRadius: 10,
              background: 'var(--dm-bg, #fff)', border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.12))',
              color: saved ? '#10b981' : '#374151',
              fontSize: '0.82rem', fontWeight: 600,
              cursor: saving ? 'wait' : 'pointer', fontFamily: 'Inter',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={13} style={{ color: '#10b981' }} /> : <Save size={13} />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
          </button>

          <button
            onClick={() => setEditorPhase('canvas')}
            aria-label="Preview and design resume"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)',
              border: 'none', color: '#fff',
              fontSize: '0.82rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter',
              boxShadow: '0 4px 16px rgba(108,71,255,0.35)',
            }}
          >
            <LayoutTemplate size={13} /> Preview & Design
          </button>
        </div>
      )}

      {editorPhase === 'canvas' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setEditorPhase('wizard')}
            aria-label="Edit resume content"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', borderRadius: 10,
              background: 'var(--dm-surface, #FAFAFA)', border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.12))',
              color: 'var(--dm-text, #374151)', fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter',
            }}
          >
            <Edit3 size={13} /> Edit Content
          </button>
        </div>
      )}
    </motion.header>
  );

  if (editorPhase === 'wizard') {
    return (
      <div className={isDarkMode ? 'editor-dark-mode' : ''} style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dm-surface, #FAFAFA)', overflow: 'hidden' }}>
        {renderTopBar()}
        <div className="scrollbar-thin" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 60px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <StepperBar />
            <CompletenessBar resume={resume} />
            <WizardForm />
          </div>
        </div>
      </div>
    );
  }

  // Canvas Phase
  return (
    <div className={isDarkMode ? 'editor-dark-mode' : ''} style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dm-surface, #FDFCFF)', overflow: 'hidden' }}>
      {renderTopBar()}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Live Preview Area */}
        <div className="preview-bg" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--dm-raised, #F3F4F6)' }}>
          <div style={{
            padding: '8px 24px', flexShrink: 0,
            borderBottom: '1px solid var(--dm-border, rgba(0,0,0,0.06))', background: 'var(--dm-bg, #FAFAFA)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--dm-muted-light, #9CA3AF)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Live Preview
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--dm-muted-light, #9CA3AF)', marginRight: 4 }}>Zoom</span>
              {[0.45, 0.55, 0.65, 0.8, 1].map((z) => (
                <button
                  key={z}
                  onClick={() => setPreviewScale(z)}
                  className="editor-nav-btn"
                  style={{
                    padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                    fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 600,
                    background: previewScale === z ? '#6C47FF' : '#fff',
                    color: previewScale === z ? '#fff' : '#6B7280',
                    border: previewScale === z ? '1.5px solid #6C47FF' : '1.5px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.18s',
                  }}
                >
                  {Math.round(z * 100)}%
                </button>
              ))}
            </div>
          </div>

          <div
            className="scrollbar-thin"
            style={{
              flex: 1, overflow: 'auto', padding: '40px 32px',
              display: 'flex', justifyContent: 'center',
              background: isDarkMode ? '#0A0A10' : '#EAEAEF',
            }}
          >
            <div style={{
              transform: `scale(${previewScale})`,
              transformOrigin: 'top center',
              width: `${794 / previewScale}px`,
              marginBottom: `${-(1 - previewScale) * 1123}px`,
            }}>
              <div style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)', overflow: 'hidden', background: 'var(--dm-bg, #fff)' }}>
                <ResumePreview
                  resume={resume}
                  templateId={selectedTemplate || 'minimal-pro'}
                  themeColor={themeColor}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  textAlignment={textAlignment}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Canvas Toolbar */}
        <div className="canvas-sidebar" style={{ width: 340, flexShrink: 0, borderLeft: '1px solid var(--dm-border, rgba(0,0,0,0.08))', background: 'var(--dm-bg, #fff)' }}>
          <CanvasToolbar />
        </div>
      </div>
    </div>
  );
}

