import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Stable ID generator ─────────────────────────────────────────────────────
const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// ── Image compression ────────────────────────────────────────────────────────
async function compressImage(base64, maxSizePx = 300, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSizePx / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64); // fallback — keep original
    img.src = base64;
  });
}

const defaultResume = {
  personal: {
    name: '', title: '', email: '', phone: '',
    location: '', linkedin: '', github: '', website: '',
    summary: '',
    photo: '',
  },
  experience:     [],
  education:      [],
  skills:         [],
  projects:       [],
  languages:      [],   // NEW — e.g. { id, language, proficiency }
  certifications: [],   // NEW — e.g. { id, name, issuer, year }
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resume:           defaultResume,
      selectedTemplate: 'minimal-pro',
      themeColor:       '#6C47FF',
      fontFamily:       'sans-serif',
      fontSize:         'md',
      textAlignment:    'left',
      atsResult:        null,
      isDirty:          false,
      editorPhase:      'wizard',
      wizardStep:       0,
      sectionOrder:     ['experience', 'education', 'skills', 'projects'],

      // ── Personal ────────────────────────────────────────────────────────────
      updatePersonal: (key, value) =>
        set((s) => ({ resume: { ...s.resume, personal: { ...s.resume.personal, [key]: value } }, isDirty: true })),

      updatePhoto: async (base64) => {
        if (!base64) {
          set((s) => ({ resume: { ...s.resume, personal: { ...s.resume.personal, photo: '' } }, isDirty: true }));
          return;
        }
        // Compress before storing to avoid localStorage overflow
        const compressed = await compressImage(base64);
        set((s) => ({ resume: { ...s.resume, personal: { ...s.resume.personal, photo: compressed } }, isDirty: true }));
      },

      // ── Template / style ────────────────────────────────────────────────────
      setTemplate:      (id)    => set({ selectedTemplate: id }),
      setThemeColor:    (color) => set({ themeColor: color, isDirty: true }),
      setFontFamily:    (font)  => set({ fontFamily: font,  isDirty: true }),
      setFontSize:      (size)  => set({ fontSize: size,    isDirty: true }),
      setTextAlignment: (align) => set({ textAlignment: align, isDirty: true }),
      setAtsResult:     (r)     => set({ atsResult: r }),
      resetDirty:       ()      => set({ isDirty: false }),
      setEditorPhase:   (phase) => set({ editorPhase: phase }),
      setWizardStep:    (step)  => set({ wizardStep: step }),
      setSectionOrder:  (order) => set({ sectionOrder: order, isDirty: true }),

      // ── Reorder sections (drag-and-drop) ────────────────────────────────────
      reorderArray: (key, oldIndex, newIndex) =>
        set((s) => {
          const arr = [...s.resume[key]];
          const [moved] = arr.splice(oldIndex, 1);
          arr.splice(newIndex, 0, moved);
          return { resume: { ...s.resume, [key]: arr }, isDirty: true };
        }),

      // ── Experience ──────────────────────────────────────────────────────────
      addExperience: () =>
        set((s) => ({
          resume: { ...s.resume, experience: [...s.resume.experience, {
            id: uid(), company: '', role: '', startDate: '', endDate: '', current: false, bullets: ['']
          }]},
          isDirty: true
        })),
      updateExperience: (id, key, value) =>
        set((s) => ({ resume: { ...s.resume, experience: s.resume.experience.map((e) => e.id === id ? { ...e, [key]: value } : e) }, isDirty: true })),
      removeExperience: (id) =>
        set((s) => ({ resume: { ...s.resume, experience: s.resume.experience.filter((e) => e.id !== id) }, isDirty: true })),
      addExpBullet: (id) =>
        set((s) => ({ resume: { ...s.resume, experience: s.resume.experience.map((e) => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e) }, isDirty: true })),
      updateExpBullet: (id, idx, val) =>
        set((s) => ({ resume: { ...s.resume, experience: s.resume.experience.map((e) => e.id === id ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) } : e) }, isDirty: true })),
      removeExpBullet: (id, idx) =>
        set((s) => ({ resume: { ...s.resume, experience: s.resume.experience.map((e) => e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e) }, isDirty: true })),

      // ── Education ───────────────────────────────────────────────────────────
      addEducation: () =>
        set((s) => ({
          resume: { ...s.resume, education: [...s.resume.education, {
            id: uid(), school: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: ''
          }]},
          isDirty: true
        })),
      updateEducation: (id, key, value) =>
        set((s) => ({ resume: { ...s.resume, education: s.resume.education.map((e) => e.id === id ? { ...e, [key]: value } : e) }, isDirty: true })),
      removeEducation: (id) =>
        set((s) => ({ resume: { ...s.resume, education: s.resume.education.filter((e) => e.id !== id) }, isDirty: true })),

      // ── Skills ──────────────────────────────────────────────────────────────
      addSkill:    (skill) => set((s) => ({ resume: { ...s.resume, skills: [...new Set([...s.resume.skills, skill.trim()])] }, isDirty: true })),
      removeSkill: (skill) => set((s) => ({ resume: { ...s.resume, skills: s.resume.skills.filter((sk) => sk !== skill) }, isDirty: true })),

      // ── Projects ────────────────────────────────────────────────────────────
      addProject: () =>
        set((s) => ({
          resume: { ...s.resume, projects: [...s.resume.projects, {
            id: uid(), name: '', description: '', tech: '', link: ''
          }]},
          isDirty: true
        })),
      updateProject: (id, key, value) =>
        set((s) => ({ resume: { ...s.resume, projects: s.resume.projects.map((p) => p.id === id ? { ...p, [key]: value } : p) }, isDirty: true })),
      removeProject: (id) =>
        set((s) => ({ resume: { ...s.resume, projects: s.resume.projects.filter((p) => p.id !== id) }, isDirty: true })),

      // ── Languages (NEW) ─────────────────────────────────────────────────────
      addLanguage: () =>
        set((s) => ({
          resume: { ...s.resume, languages: [...(s.resume.languages || []), {
            id: uid(), language: '', proficiency: 'Conversational'
          }]},
          isDirty: true
        })),
      updateLanguage: (id, key, value) =>
        set((s) => ({ resume: { ...s.resume, languages: (s.resume.languages || []).map((l) => l.id === id ? { ...l, [key]: value } : l) }, isDirty: true })),
      removeLanguage: (id) =>
        set((s) => ({ resume: { ...s.resume, languages: (s.resume.languages || []).filter((l) => l.id !== id) }, isDirty: true })),

      // ── Certifications (NEW) ────────────────────────────────────────────────
      addCertification: () =>
        set((s) => ({
          resume: { ...s.resume, certifications: [...(s.resume.certifications || []), {
            id: uid(), name: '', issuer: '', year: ''
          }]},
          isDirty: true
        })),
      updateCertification: (id, key, value) =>
        set((s) => ({ resume: { ...s.resume, certifications: (s.resume.certifications || []).map((c) => c.id === id ? { ...c, [key]: value } : c) }, isDirty: true })),
      removeCertification: (id) =>
        set((s) => ({ resume: { ...s.resume, certifications: (s.resume.certifications || []).filter((c) => c.id !== id) }, isDirty: true })),

      // ── Load / Reset ────────────────────────────────────────────────────────
      loadResume:  (data) => set({ resume: data, isDirty: false }),
      resetResume: ()     => set({ resume: defaultResume, isDirty: false }),
    }),
    {
      name: 'social-cv-v3',  // bumped version to clear stale cache
      partialize: (s) => ({
        resume:           s.resume,
        selectedTemplate: s.selectedTemplate,
        themeColor:       s.themeColor,
        fontFamily:       s.fontFamily,
        fontSize:         s.fontSize,
        textAlignment:    s.textAlignment,
        wizardStep:       s.wizardStep,
        editorPhase:      s.editorPhase,
        sectionOrder:     s.sectionOrder,
        // NOTE: atsResult is intentionally NOT persisted (it's large & stale)
      }),
    }
  )
);
