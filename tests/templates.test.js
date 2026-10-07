import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ATSMinimalTemplate } from '@/components/preview/templates/ATSMinimalTemplate'
import { ClassicExecutiveTemplate } from '@/components/preview/templates/ClassicExecutiveTemplate'
import { ElegantCreamTemplate } from '@/components/preview/templates/ElegantCreamTemplate'
import { ModernTechTemplate } from '@/components/preview/templates/ModernTechTemplate'
import { TwoColumnCreativeTemplate } from '@/components/preview/templates/TwoColumnCreativeTemplate'
import { DEMO_RESUME } from '@/constants/demoData'

const TEMPLATES = [
  ['Modern Tech', ModernTechTemplate],
  ['Classic Executive', ClassicExecutiveTemplate],
  ['Creative Pro', TwoColumnCreativeTemplate],
  ['ATS Optimized', ATSMinimalTemplate],
  ['Elegant Cream', ElegantCreamTemplate],
]

const render = (Template, data) => ReactDOMServer.renderToStaticMarkup(React.createElement(Template, { data }))

describe('resume templates', () => {
  for (const [name, Template] of TEMPLATES) {
    // Security: a category named after an Object.prototype member used to throw while
    // grouping skills. The preview is rendered from persisted data, so one imported
    // file left the app blank on every load.
    it(`${name} renders skills whose category collides with Object.prototype keys`, () => {
      const data = {
        ...DEMO_RESUME,
        skills: [
          { id: 'a', name: 'Alpha', level: 'expert', category: 'constructor' },
          { id: 'b', name: 'Bravo', level: 'advanced', category: '__proto__' },
          { id: 'c', name: 'Charlie', level: 'beginner', category: 'toString' },
          { id: 'd', name: 'Delta', level: 'intermediate', category: 'hasOwnProperty' },
        ],
      }

      const html = render(Template, data)

      for (const skill of ['Alpha', 'Bravo', 'Charlie', 'Delta']) assert.ok(html.includes(skill), skill)
    })

    it(`${name} escapes markup in user-supplied text`, () => {
      const data = {
        ...DEMO_RESUME,
        personalInfo: { ...DEMO_RESUME.personalInfo, fullName: '<img src=x onerror=alert(1)>' },
        experience: [{ ...DEMO_RESUME.experience[0], bullets: ['<script>alert(1)</script>'] }],
      }

      const html = render(Template, data)

      assert.ok(!html.includes('<script'))
      assert.ok(!html.includes('<img src=x'))
      assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
    })
  }
})
