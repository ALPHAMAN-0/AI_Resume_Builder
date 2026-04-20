export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type TemplateId = 'modern-tech' | 'classic-executive' | 'two-column-creative' | 'ats-minimal' | 'elegant-cream'

export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  linkedIn: string
  github: string
  portfolio: string
  summary: string
}

export interface Role {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
  technologies: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  bullets: string[]
  technologies: string[]
  repoUrl: string
  liveUrl: string
  startDate: string
  endDate: string
}

export interface Skill {
  id: string
  name: string
  level: SkillLevel
  category: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa: string
  honors: string
  coursework: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId: string
  url: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Role[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  certifications: Certification[]
}

export interface ATSCategoryScore {
  name: string
  score: number
  maxScore: number
  feedback: string[]
  passed: boolean
}

export interface ATSResult {
  totalScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  categories: {
    contactCompleteness: ATSCategoryScore
    sectionCompleteness: ATSCategoryScore
    actionVerbs: ATSCategoryScore
    quantifiableMetrics: ATSCategoryScore
    keywordDensity: ATSCategoryScore
    formatOptimization: ATSCategoryScore
  }
  topSuggestions: string[]
}

export interface TemplateConfig {
  id: TemplateId
  name: string
  description: string
  accentColor: string
  bestFor: string[]
}

export interface AppState {
  currentStep: number
  activeTemplate: TemplateId
  previewZoom: number
  isExporting: boolean
  atsExpanded: boolean
}

export const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  experience: [],
  projects: [],
  skills: [],
  education: [],
  certifications: [],
}
