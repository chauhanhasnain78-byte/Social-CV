import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultResume = {
  personal: {
    name: '', title: '', email: '', phone: '',
    location: '', linkedin: '', github: '', website: '',
    summary: '',
    photo: '', // base64 data URL for photo templates
  },
  experience: [],
  education:  [],
  skills:     [],
  projects:   [],
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resume:           defaultResume,
      selectedTemplate: 'minimal-pro',
      themeColor:       '#6C47FF',
      fontFamily:       'sans-serif',
      fontSize:         'md',     // 'sm', 'md', 'lg'
      textAlignment:    'left',   // 'left', 'center', 'right'
      atsResult:        null,
      isDirty:          false,
      editorPhase:      'wizard', // 'wizard' | 'canvas'
      wizardStep:       0,        // 0: Personal, 1: Exp, 2: Edu, 3: Skills, 4: Projects
      sectionOrder:     ['experience', 'education', 'skills', 'projects'],

      // Personal
      updatePersonal: (key, value) =>
        set((s) => ({ resume: { ...s.resume, personal: { ...s.resume.personal, [key]: value } }, isDirty: true })),

      updatePhoto: (base64) =>
        set((s) => ({ resume: { ...s.resume, personal: { ...s.resume.personal, photo: base64 } }, isDirty: true })),

      // Template / style
      // Template / style
      setTemplate:     (id)    => set({ selectedTemplate: id }),
      setThemeColor:   (color) => set({ themeColor: color, isDirty: true }),
      setFontFamily:   (font)  => set({ fontFamily: font,  isDirty: true }),
      setFontSize:     (size)  => set({ fontSize: size, isDirty: true }),
      setTextAlignment:(align) => set({ textAlignment: align, isDirty: true }),
      setAtsResult:    (r)     => set({ atsResult: r }),
      resetDirty:      ()      => set({ isDirty: false }),
      setEditorPhase:  (phase) => set({ editorPhase: phase }),
      setWizardStep:   (step)  => set({ wizardStep: step }),
      setSectionOrder: (order) => set({ sectionOrder: order, isDirty: true }),

      // Reorder sections (drag-and-drop)
      reorderArray: (key, oldIndex, newIndex) =>
        set((s) => {
          const arr = [...s.resume[key]];
          const [moved] = arr.splice(oldIndex, 1);
          arr.splice(newIndex, 0, moved);
          return { resume: { ...s.resume, [key]: arr }, isDirty: true };
        }),

      // Experience
      addExperience: () =>
        set((s) => ({ resume: { ...s.resume, experience: [...s.resume.experience, { id: Date.now(), company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }] }, isDirty: true })),
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

      // Education
      addEducation: () =>
        set((s) => ({ resume: { ...s.resume, education: [...s.resume.education, { id: Date.now(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }] }, isDirty: true })),
      updateEducation: (id, key, value) =>
        set((s) => ({ resume: { ...s.resume, education: s.resume.education.map((e) => e.id === id ? { ...e, [key]: value } : e) }, isDirty: true })),
      removeEducation: (id) =>
        set((s) => ({ resume: { ...s.resume, education: s.resume.education.filter((e) => e.id !== id) }, isDirty: true })),

      // Skills
      addSkill:    (skill) => set((s) => ({ resume: { ...s.resume, skills: [...new Set([...s.resume.skills, skill.trim()])] }, isDirty: true })),
      removeSkill: (skill) => set((s) => ({ resume: { ...s.resume, skills: s.resume.skills.filter((sk) => sk !== skill) }, isDirty: true })),

      // Projects
      addProject: () =>
        set((s) => ({ resume: { ...s.resume, projects: [...s.resume.projects, { id: Date.now(), name: '', description: '', tech: '', link: '' }] }, isDirty: true })),
      updateProject: (id, key, value) =>
        set((s) => ({ resume: { ...s.resume, projects: s.resume.projects.map((p) => p.id === id ? { ...p, [key]: value } : p) }, isDirty: true })),
      removeProject: (id) =>
        set((s) => ({ resume: { ...s.resume, projects: s.resume.projects.filter((p) => p.id !== id) }, isDirty: true })),

      loadResume:  (data) => set({ resume: data, isDirty: false }),
      resetResume: ()     => set({ resume: defaultResume, isDirty: false }),
    }),
    {
      name: 'social-cv-v2',
      partialize: (s) => ({
        resume: s.resume,
        selectedTemplate: s.selectedTemplate,
        themeColor: s.themeColor,
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        textAlignment: s.textAlignment,
      }),
    }
  )
);
