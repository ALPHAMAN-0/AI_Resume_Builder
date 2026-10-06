import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ATSMinimalTemplate } from '@/components/preview/templates/ATSMinimalTemplate'
import { ClassicExecutiveTemplate } from '@/components/preview/templates/ClassicExecutiveTemplate'
import { ElegantCreamTemplate } from '@/components/preview/templates/ElegantCreamTemplate'
import { ModernTechTemplate } from '@/components/preview/templates/ModernTechTemplate'
import { TwoColumnCreativeTemplate } from '@/components/preview/templates/TwoColumnCreativeTemplate'
import { DEMO_RESUME } from '@/constants/demoData'
import type { ResumeData } from '@/types/resume'

const TEMPLATES: Array<[string, ComponentType<{ data: ResumeData }>]> = [
  ['Modern Tech', ModernTechTemplate],
  ['Classic Executive', ClassicExecutiveTemplate],
  ['Creative Pro', TwoColumnCreativeTemplate],
  ['ATS Optimized', ATSMinimalTemplate],
  ['Elegant Cream', ElegantCreamTemplate],
]

const render = (Template: ComponentType<{ data: ResumeData }>, data: ResumeData) =>
  renderToStaticMarkup(createElement(Template, { data }))

describe('resume templates', () => {
  // Security: a category named after an Object.prototype member used to throw while
  // grouping skills. The preview is rendered from persisted data, so one imported
  // file left the app blank on every load.
  it.each(TEMPLATES)('%s renders skills whose category collides with Object.prototype keys', (_name, Template) => {
    const data: ResumeData = {
      ...DEMO_RESUME,
      skills: [
        { id: 'a', name: 'Alpha', level: 'expert', category: 'constructor' },
        { id: 'b', name: 'Bravo', level: 'advanced', category: '__proto__' },
        { id: 'c', name: 'Charlie', level: 'beginner', category: 'toString' },
        { id: 'd', name: 'Delta', level: 'intermediate', category: 'hasOwnProperty' },
      ],
    }

    const html = render(Template, data)

    for (const name of ['Alpha', 'Bravo', 'Charlie', 'Delta']) expect(html).toContain(name)
  })

  it.each(TEMPLATES)('%s escapes markup in user-supplied text', (_name, Template) => {
    const data: ResumeData = {
      ...DEMO_RESUME,
      personalInfo: { ...DEMO_RESUME.personalInfo, fullName: '<img src=x onerror=alert(1)>' },
      experience: [{ ...DEMO_RESUME.experience[0], bullets: ['<script>alert(1)</script>'] }],
    }

    const html = render(Template, data)

    expect(html).not.toContain('<script')
    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
  })
})
