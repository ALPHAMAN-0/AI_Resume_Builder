import { describe, expect, it } from 'vitest'
import { scoreResume } from '@/lib/atsScorer'
import { detectRoleType } from '@/constants/atsKeywords'
import { DEMO_RESUME } from '@/constants/demoData'
import { EMPTY_RESUME, type ResumeData, type Role } from '@/types/resume'

function role(bullets: string[]): Role {
  return { id: 'r1', title: 'Engineer', company: 'Acme', location: '', startDate: '2020-01', endDate: '', current: true, bullets, technologies: [] }
}

function withBullets(bullets: string[]): ResumeData {
  return { ...EMPTY_RESUME, experience: [role(bullets)] }
}

describe('scoreResume', () => {
  it('fails an empty resume and tells the user where to start', () => {
    const result = scoreResume(EMPTY_RESUME)
    const categories = Object.values(result.categories)

    expect(result.grade).toBe('F')
    expect(result.totalScore).toBeLessThan(40)
    expect(categories.every((c) => !c.passed)).toBe(true)
    expect(result.topSuggestions).toHaveLength(3)
    expect(result.topSuggestions[0]).toBe('Add a valid email address')
  })

  it('gives the demo resume an A and keeps every category within its weight', () => {
    const result = scoreResume(DEMO_RESUME)
    const categories = Object.values(result.categories)

    expect(result.grade).toBe('A')
    expect(result.totalScore).toBeGreaterThanOrEqual(85)
    expect(result.totalScore).toBe(categories.reduce((sum, c) => sum + c.score, 0))
    expect(categories.map((c) => c.maxScore)).toEqual([15, 20, 20, 20, 15, 10])
    for (const c of categories) {
      expect(c.score).toBeGreaterThanOrEqual(0)
      expect(c.score).toBeLessThanOrEqual(c.maxScore)
    }
  })

  it('scores action verbs by the share of bullets that start with one and flags weak phrases', () => {
    const { actionVerbs } = scoreResume(withBullets(['Built a billing service', 'Responsible for deployments'])).categories

    expect(actionVerbs.score).toBe(10)
    expect(actionVerbs.passed).toBe(false)
    expect(actionVerbs.feedback[0]).toContain('"responsible for"')
    expect(actionVerbs.feedback).toContain('1 of 2 bullets start with strong action verbs — aim for 80%+')
  })

  it('gives full marks for quantified results once 40% of bullets contain a number', () => {
    const quantified = scoreResume(
      withBullets(['Cut latency by 40%', 'Served 2M users', 'Wrote docs', 'Reviewed code', 'Ran standups']),
    ).categories.quantifiableMetrics
    const vague = scoreResume(withBullets(['Wrote docs', 'Reviewed code', 'Ran standups'])).categories.quantifiableMetrics

    expect(quantified).toMatchObject({ score: 20, passed: true, feedback: [] })
    expect(vague.score).toBe(0)
    expect(vague.passed).toBe(false)
    expect(vague.feedback).toHaveLength(2)
  })

  it('picks the keyword bank from the job title', () => {
    expect(detectRoleType('Senior Security Engineer')).toBe('security')
    expect(detectRoleType('ML Engineer')).toBe('ml')
    expect(detectRoleType('Data Analyst')).toBe('data')
    expect(detectRoleType('Site Reliability Engineer')).toBe('devops')
    expect(detectRoleType('Product Manager')).toBe('pm')
    expect(detectRoleType('Frontend Developer')).toBe('swe')
    expect(detectRoleType('')).toBe('general')

    const security = scoreResume({ ...EMPTY_RESUME, personalInfo: { ...EMPTY_RESUME.personalInfo, title: 'Security Engineer' } })
    expect(security.categories.keywordDensity.feedback[0]).toContain('SECURITY roles')
  })
})
