import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useAuth } from '@/context/AuthContext';
import {
  Palette, Download, Target, Save, CheckCircle,
  Loader2, Share2, Type, GripVertical, FileText, Mail
} from 'lucide-react';
import { exportResumePDF } from '@/utils/pdfService';
import { scoreResume } from '@/utils/atsEngine';
import { toast } from '@/components/ui/Toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { ATSModal } from '@/components/ats/ATSModal';
import RatingModal from '@/components/ui/RatingModal';
import { updateHighestAtsScore, incrementResumesCount } from '@/services/statsService';
import { CoverLetterModal } from '@/components/CoverLetterModal';
import { fireDownloadConfetti } from '@/utils/confetti';


import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FONTS = [
  { label: 'Modern',  value: 'sans-serif' },
  { label: 'Classic', value: 'serif' },
  { label: 'Mono',    value: 'monospace' },
];
const COLORS = ['#6C47FF', '#1B4FD8', '#0d9488', '#be185d', '#FF6B35', '#8B6914', '#0D0D0F', '#6B7280'];

const SECTION_LABELS = {
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects'
};

function SortableSectionItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.85 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isDragging ? '#F3F0FF' : '#FAFAFA',
        border: isDragging ? '1px solid #6C47FF' : '1px solid rgba(0,0,0,0.06)',
        borderRadius: 10,
        marginBottom: 8
      }}
    >
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dm-text, #374151)' }}>
        {SECTION_LABELS[id]}
      </span>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--dm-muted-light, #9CA3AF)' }}>
        <GripVertical size={16} />
      </div>
    </div>
  );
}

export function CanvasToolbar() {
  const { user } = useAuth();
  const {
    resume, selectedTemplate, themeColor, setThemeColor,
    fontFamily, setFontFamily, atsResult, setAtsResult,
    sectionOrder, setSectionOrder, isDirty, resetDirty,
    fontSize, setFontSize, textAlignment, setTextAlignment
  } = useResumeStore();

  const [showATS, setShowATS]     = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [scanning, setScanning]   = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      const newOrder = Array.from(sectionOrder);
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);
      setSectionOrder(newOrder);
    }
  };

  const handleATSScan = () => {
    setScanning(true);
    setTimeout(() => {
      const result = scoreResume(resume);
      setAtsResult(result);
      setShowATS(true);
      setScanning(false);
      updateHighestAtsScore(result.score);
      toast.info(`ATS Score: ${result.score}/100 — ${result.grade}`, { title: '📊 Scan Complete' });
    }, 900);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const name = resume.personal.name || 'My-Resume';
      await exportResumePDF(`${name}-Social-CV`);
      toast.success('PDF downloaded successfully!', { title: '✅ Export Complete' });
      // 🎉 Confetti celebration!
      fireDownloadConfetti();
      // Increment global resume creation count
      incrementResumesCount().catch(console.error);
      
      // Trigger rating modal
      setTimeout(() => setShowRating(true), 1500);
      
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };


  const handleSave = async () => {
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

  const handleShare = () => {
    if (!user) return;
    const publicUrl = `${window.location.origin}/p/${user.uid}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('Public link copied! 🔗', { title: '✅ Share Ready' });
  };

  const scoreColor = atsResult
    ? atsResult.score >= 85 ? '#10b981' : atsResult.score >= 70 ? '#22c55e' : atsResult.score >= 50 ? '#eab308' : '#ef4444'
    : null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderLeft: '1px solid rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dm-border, rgba(0,0,0,0.06))', background: 'var(--dm-surface, #FAFAFA)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Palette size={18} style={{ color: '#6C47FF' }} /> Design & Export
        </h3>
        {isDirty && (
          <span style={{ fontSize: '0.75rem', color: '#eab308', fontWeight: 600, display: 'block', marginTop: 4 }}>
            • Unsaved changes
          </span>
        )}
      </div>

      {/* Scrollable controls */}
      <div className="scrollbar-thin" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        
        {/* ATS Score Row */}
        {atsResult && (
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${scoreColor}0A`, padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${scoreColor}20` }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: scoreColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Score</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: scoreColor }}>{atsResult.score}/100</span>
            </div>
            <button
              onClick={() => setShowATS(true)}
              style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--dm-bg, #fff)', border: `1px solid ${scoreColor}40`, color: scoreColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              View Details
            </button>
          </div>
        )}

        {/* Global Styles */}
        <div style={{ marginBottom: 32 }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dm-muted, #6B7280)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Typography & Color</h4>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
            <Type size={14} /> Font Style
          </label>
          <div style={{ marginBottom: 16 }}>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', fontSize: '0.85rem', fontWeight: 500,
                borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', background: 'var(--dm-surface, #FAFAFA)',
                color: 'var(--dm-text, #374151)', cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="sans-serif">Modern (Sans-Serif)</option>
              <option value="serif">Classic (Serif)</option>
              <option value="monospace">Mono</option>
              <option value="Arial, Helvetica, sans-serif">Arial</option>
              <option value='"Times New Roman", Times, serif'>Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, Geneva, sans-serif">Verdana</option>
              <option value='"Courier New", Courier, monospace'>Courier New</option>
              <option value='"Trebuchet MS", sans-serif'>Trebuchet MS</option>
              <option value="Impact, sans-serif">Impact</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                Text Size
              </label>
              <input
                type="number"
                value={fontSize === 'sm' ? 14 : fontSize === 'md' ? 16 : fontSize === 'lg' ? 18 : parseInt(fontSize) || 16}
                onChange={(e) => setFontSize(e.target.value)}
                min="8" max="48"
                style={{
                  width: '100%', padding: '8px 12px', fontSize: '0.85rem', fontWeight: 600,
                  borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', background: 'var(--dm-surface, #FAFAFA)',
                  color: 'var(--dm-text, #374151)', outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
                Alignment
              </label>
              <div style={{ display: 'flex', gap: 4, background: 'var(--dm-surface, #FAFAFA)', padding: 4, borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }}>
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => setTextAlignment(align)}
                    style={{
                      flex: 1, padding: '6px 0', fontSize: '0.75rem', fontWeight: 600,
                      borderRadius: 6, cursor: 'pointer', border: 'none',
                      background: textAlignment === align ? '#fff' : 'transparent',
                      color: textAlignment === align ? '#6C47FF' : '#6B7280',
                      boxShadow: textAlignment === align ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                      textTransform: 'capitalize'
                    }}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>
            <Palette size={14} /> Theme Color
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setThemeColor(c)}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: c,
                  border: themeColor === c ? '3px solid #0D0D0F' : '2px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  boxShadow: themeColor === c ? `0 0 0 4px ${c}30` : 'none',
                  transition: 'all 0.18s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Section Reordering */}
        <div style={{ marginBottom: 32 }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dm-muted, #6B7280)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Reorder Sections</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--dm-muted-light, #9CA3AF)', marginBottom: 12 }}>Drag to change the vertical order of sections.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              {sectionOrder.map((id) => (
                <SortableSectionItem key={id} id={id} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

      </div>

      {/* Sticky Bottom Actions */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', background: 'var(--dm-surface, #FAFAFA)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px', borderRadius: 10,
            background: 'linear-gradient(135deg,#6C47FF,#4A2FD9)',
            border: 'none', color: '#fff',
            fontSize: '0.88rem', fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(108,71,255,0.3)',
          }}
        >
          {exporting ? <><Loader2 size={15} className="animate-spin" /> Exporting PDF…</> : <><Download size={15} /> Download PDF</>}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px', borderRadius: 10,
              background: 'var(--dm-bg, #fff)', border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.12))',
              color: saved ? '#10b981' : '#374151',
              fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <CheckCircle size={13} style={{ color: '#10b981' }} /> : <Save size={13} />}
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save CV'}
          </button>
          
          <button
            onClick={handleShare}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px', borderRadius: 10,
              background: 'var(--dm-bg, #fff)', border: '1.5px solid var(--dm-border-strong, rgba(0,0,0,0.12))',
              color: 'var(--dm-text, #374151)', fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <Share2 size={13} /> Share Link
          </button>
        </div>

        <button
          onClick={() => setShowCoverLetter(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '10px', borderRadius: 10,
            background: '#F0EDFF', border: '1.5px solid rgba(108,71,255,0.25)',
            color: '#6C47FF', fontSize: '0.82rem', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Mail size={14} /> Generate Cover Letter
        </button>

        <button
          onClick={handleATSScan}
          disabled={scanning}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '10px', borderRadius: 10,
            background: '#FFF7ED', border: '1.5px solid rgba(255,107,53,0.25)',
            color: '#FF6B35', fontSize: '0.82rem', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {scanning ? <><Loader2 size={14} className="animate-spin" /> Scoring CV…</> : <><Target size={14} /> Score CV against ATS</>}
        </button>

      </div>

      {showATS && atsResult && <ATSModal result={atsResult} onClose={() => setShowATS(false)} />}
      <RatingModal isOpen={showRating} onClose={() => setShowRating(false)} />
      {showCoverLetter && <CoverLetterModal onClose={() => setShowCoverLetter(false)} />}
    </div>
  );
}

