import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData, PersonalInfo, Role, Project, Skill, Education, Certification, TemplateId } from '@/types/resume'
import { EMPTY_RESUME } from '@/types/resume'
import { generateId } from '@/lib/utils'

interface ResumeStore {
  // Data
  resumeData: ResumeData

  // Personal Info
  setPersonalInfo: (data: Partial<PersonalInfo>) => void

  // Experience
  addExperience: () => void
  updateExperience: (id: string, data: Partial<Role>) => void
  removeExperience: (id: string) => void
  reorderExperience: (fromIndex: number, toIndex: number) => void

  // Projects
  addProject: () => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void

  // Skills
  addSkill: (name: string, category: string) => void
  updateSkill: (id: string, data: Partial<Skill>) => void
  removeSkill: (id: string) => void

  // Education
  addEducation: () => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void

  // Certifications
  addCertification: () => void
  updateCertification: (id: string, data: Partial<Certification>) => void
  removeCertification: (id: string) => void

  // Reset
  resetResume: () => void
  loadDemoData: (data: ResumeData) => void

  // UI State (not persisted)
  currentStep: number
  activeTemplate: TemplateId
  previewZoom: number
  isExporting: boolean
  atsExpanded: boolean

  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setTemplate: (id: TemplateId) => void
  setZoom: (zoom: number) => void
  setExporting: (val: boolean) => void
  toggleAts: () => void

  // Job description matcher
  jobDescription: string
  setJobDescription: (jd: string) => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: EMPTY_RESUME,

      setPersonalInfo: (data) =>
        set((s) => ({ resumeData: { ...s.resumeData, personalInfo: { ...s.resumeData.personalInfo, ...data } } })),

      addExperience: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            experience: [
              ...s.resumeData.experience,
              { id: generateId(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [''], technologies: [] },
            ],
          },
        })),

      updateExperience: (id, data) =>
        set((s) => ({
          resumeData: { ...s.resumeData, experience: s.resumeData.experience.map((e) => (e.id === id ? { ...e, ...data } : e)) },
        })),

      removeExperience: (id) =>
        set((s) => ({ resumeData: { ...s.resumeData, experience: s.resumeData.experience.filter((e) => e.id !== id) } })),

      reorderExperience: (from, to) =>
        set((s) => {
          const arr = [...s.resumeData.experience]
          const [item] = arr.splice(from, 1)
          arr.splice(to, 0, item)
          return { resumeData: { ...s.resumeData, experience: arr } }
        }),

      addProject: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            projects: [
              ...s.resumeData.projects,
              { id: generateId(), name: '', description: '', bullets: [''], technologies: [], repoUrl: '', liveUrl: '', startDate: '', endDate: '' },
            ],
          },
        })),

      updateProject: (id, data) =>
        set((s) => ({
          resumeData: { ...s.resumeData, projects: s.resumeData.projects.map((p) => (p.id === id ? { ...p, ...data } : p)) },
        })),

      removeProject: (id) =>
        set((s) => ({ resumeData: { ...s.resumeData, projects: s.resumeData.projects.filter((p) => p.id !== id) } })),

      addSkill: (name, category) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            skills: [...s.resumeData.skills, { id: generateId(), name, level: 'intermediate', category }],
          },
        })),

      updateSkill: (id, data) =>
        set((s) => ({
          resumeData: { ...s.resumeData, skills: s.resumeData.skills.map((sk) => (sk.id === id ? { ...sk, ...data } : sk)) },
        })),

      removeSkill: (id) =>
        set((s) => ({ resumeData: { ...s.resumeData, skills: s.resumeData.skills.filter((sk) => sk.id !== id) } })),

      addEducation: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            education: [
              ...s.resumeData.education,
              { id: generateId(), institution: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '', honors: '', coursework: [] },
            ],
          },
        })),

      updateEducation: (id, data) =>
        set((s) => ({
          resumeData: { ...s.resumeData, education: s.resumeData.education.map((e) => (e.id === id ? { ...e, ...data } : e)) },
        })),

      removeEducation: (id) =>
        set((s) => ({ resumeData: { ...s.resumeData, education: s.resumeData.education.filter((e) => e.id !== id) } })),

      addCertification: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            certifications: [
              ...s.resumeData.certifications,
              { id: generateId(), name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', url: '' },
            ],
          },
        })),

      updateCertification: (id, data) =>
        set((s) => ({
          resumeData: { ...s.resumeData, certifications: s.resumeData.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)) },
        })),

      removeCertification: (id) =>
        set((s) => ({ resumeData: { ...s.resumeData, certifications: s.resumeData.certifications.filter((c) => c.id !== id) } })),

      resetResume: () => set({ resumeData: EMPTY_RESUME }),
      loadDemoData: (data) => set({ resumeData: data }),

      // UI State
      currentStep: 0,
      activeTemplate: 'modern-tech',
      previewZoom: 0.6,
      isExporting: false,
      atsExpanded: true,

      goToStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
      setTemplate: (id) => set({ activeTemplate: id }),
      setZoom: (zoom) => set({ previewZoom: zoom }),
      setExporting: (val) => set({ isExporting: val }),
      toggleAts: () => set((s) => ({ atsExpanded: !s.atsExpanded })),

      jobDescription: '',
      setJobDescription: (jd) => set({ jobDescription: jd }),
    }),
    {
      name: 'ai-resume-builder-v1',
      partialize: (state) => ({ resumeData: state.resumeData, activeTemplate: state.activeTemplate }),
    }
  )
)
