import type { TemplateConfig } from '@/types/resume'

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Dark header, two-column layout with tech badges',
    accentColor: '#4f46e5',
    bestFor: ['Software Engineer', 'DevOps', 'Platform Engineer'],
  },
  {
    id: 'classic-executive',
    name: 'Classic Executive',
    description: 'Elegant serif typography, clean single-column',
    accentColor: '#1e3a5f',
    bestFor: ['Engineering Manager', 'Director', 'VP', 'Product Manager'],
  },
  {
    id: 'two-column-creative',
    name: 'Creative Pro',
    description: 'Colored sidebar with bold visual hierarchy',
    accentColor: '#0d9488',
    bestFor: ['Startups', 'Design-adjacent roles', 'Product'],
  },
  {
    id: 'ats-minimal',
    name: 'ATS Optimized',
    description: 'Maximum parser compatibility, zero graphics',
    accentColor: '#111827',
    bestFor: ['FAANG', 'Enterprise ATS', 'Government'],
  },
]
