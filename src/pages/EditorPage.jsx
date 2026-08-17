import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, ChevronLeft, LayoutTemplate, Image, AlignLeft, Edit3, Save, CheckCircle, Loader2
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

export default function EditorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    resume, selectedTemplate, themeColor, fontFamily, sectionOrder,
    fontSize, textAlignment,
    isDirty, resetDirty, editorPhase, setEditorPhase
  } = useResumeStore();

  const [previewScale, setPreviewScale] = useState(0.65);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const templateMeta = TEMPLATES.find((t) => t.id === selectedTemplate);

  const handleSaveTop = async () => {
    if (!user) return;
    setSaving(true);
    try {
      localStorage.setItem(`social-cv-resume-${user.uid}`, JSON.stringify({
        resume, templateId: selectedTemplate, themeColor, fontFamily, sectionOrder, updatedAt: Date.now(),
      }));

      try {
        const resumeRef = doc(db, 'resumes', user.uid);
        await setDoc(resumeRef, {
          resume, templateId: selectedTemplate, themeColor, fontFamily, sectionOrder, updatedAt: Date.now(),
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Firebase save failed, but saved locally:', dbErr);
      }

      resetDirty();
      setSaved(true);
      toast.success('Resume saved successfully! ✅');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      toast.error(`Save failed: ${err.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  const renderTopBar = () => (
    <motion.header
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
        style={{
          display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#6B7280', fontWeight: 500, fontFamily: 'Inter',
          padding: '6px 10px', borderRadius: 8,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#0D0D0F'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6B7280'; }}
      >
        <ChevronLeft size={16} /> Templates
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.08)', margin: '0 4px' }} />

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo.png"
          alt="Social-CV"
          style={{ height: 42, width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {templateMeta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#F3F0FF', borderRadius: 999, marginLeft: 4, border: '1px solid rgba(108,71,255,0.15)' }}>
          <LayoutTemplate size={12} style={{ color: '#6C47FF' }} />
          <span style={{ fontSize: '0.75rem', color: '#6C47FF', fontWeight: 600 }}>{templateMeta.name}</span>
          {templateMeta.hasPhoto ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.6rem', padding: '1px 7px', background: 'rgba(255,107,53,0.12)', color: '#FF6B35', borderRadius: 999, fontWeight: 700, border: '1px solid rgba(255,107,53,0.2)' }}><Image size={8} /> PHOTO</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.6rem', padding: '1px 7px', background: 'rgba(108,71,255,0.08)', color: '#6C47FF', borderRadius: 999, fontWeight: 700, border: '1px solid rgba(108,71,255,0.15)' }}><AlignLeft size={8} /> TEXT</span>
          )}
        </div>
      )}

      {isDirty && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#FFFBEB', borderRadius: 999, border: '1px solid rgba(234,179,8,0.25)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308' }} />
          <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 600 }}>Unsaved changes</span>
        </div>
      )}

      {/* Right Side actions in Wizard Phase */}
      {editorPhase === 'wizard' && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleSaveTop}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', borderRadius: 10,
              background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
              color: saved ? '#10b981' : '#374151',
              fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle size={13} style={{ color: '#10b981' }} /> : <Save size={13} />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Progress'}
          </button>
          
          <button
            onClick={() => setEditorPhase('canvas')}
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

      {/* Right Side action in Canvas Phase */}
      {editorPhase === 'canvas' && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setEditorPhase('wizard')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', borderRadius: 10,
              background: '#FAFAFA', border: '1.5px solid rgba(0,0,0,0.12)',
              color: '#374151',
              fontSize: '0.82rem', fontWeight: 600,
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
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA', overflow: 'hidden' }}>
        {renderTopBar()}
        <div className="scrollbar-thin" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 60px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <StepperBar />
            <WizardForm />
          </div>
        </div>
      </div>
    );
  }

  // Canvas Phase
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#FDFCFF', overflow: 'hidden' }}>
      {renderTopBar()}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Live Preview Area */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: '#F3F4F6' }}>
          <div style={{
            padding: '8px 24px', flexShrink: 0,
            borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Live Preview
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.68rem', color: '#9CA3AF', marginRight: 4 }}>Zoom</span>
              {[0.45, 0.55, 0.65, 0.8, 1].map((z) => (
                <button
                  key={z}
                  onClick={() => setPreviewScale(z)}
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
              background: '#EAEAEF',
            }}
          >
            <div style={{
              transform: `scale(${previewScale})`,
              transformOrigin: 'top center',
              width: `${794 / previewScale}px`,
              marginBottom: `${-(1 - previewScale) * 1123}px`,
            }}>
              <div style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)', overflow: 'hidden', background: '#fff' }}>
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
        <div style={{ width: 340, flexShrink: 0, borderLeft: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}>
          <CanvasToolbar />
        </div>
      </div>
    </div>
  );
}
