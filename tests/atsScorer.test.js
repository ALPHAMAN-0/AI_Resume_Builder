import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { scoreResume } from '@/lib/atsScorer'
import { detectRoleType } from '@/constants/atsKeywords'
import { DEMO_RESUME } from '@/constants/demoData'
import { EMPTY_RESUME } from '@/types/resume'

function withBullets(bullets) {
  const role = { id: 'r1', title: 'Engineer', company: 'Acme', location: '', startDate: '2020-01', endDate: '', current: true, bullets, technologies: [] }
  return { ...EMPTY_RESUME, experience: [role] }
}

describe('scoreResume', () => {
  it('fails an empty resume and tells the user where to start', () => {
    const result = scoreResume(EMPTY_RESUME)
    const categories = Object.values(result.categories)

    assert.equal(result.grade, 'F')
    assert.ok(result.totalScore < 40)
    assert.ok(categories.every((c) => !c.passed))
    assert.equal(result.topSuggestions.length, 3)
    assert.equal(result.topSuggestions[0], 'Add a valid email address')
  })

  it('gives the demo resume an A and keeps every category within its weight', () => {
    const result = scoreResume(DEMO_RESUME)
    const categories = Object.values(result.categories)

    assert.equal(result.grade, 'A')
    assert.ok(result.totalScore >= 85)
    assert.equal(result.totalScore, categories.reduce((sum, c) => sum + c.score, 0))
    assert.deepEqual(categories.map((c) => c.maxScore), [15, 20, 20, 20, 15, 10])
    for (const c of categories) assert.ok(c.score >= 0 && c.score <= c.maxScore, c.name)
  })

  it('scores action verbs by the share of bullets that start with one and flags weak phrases', () => {
    const { actionVerbs } = scoreResume(withBullets(['Built a billing service', 'Responsible for deployments'])).categories

    assert.equal(actionVerbs.score, 10)
    assert.equal(actionVerbs.passed, false)
    assert.ok(actionVerbs.feedback[0].includes('"responsible for"'))
    assert.ok(actionVerbs.feedback.includes('1 of 2 bullets start with strong action verbs — aim for 80%+'))
  })

  it('gives full marks for quantified results once 40% of bullets contain a number', () => {
    const quantified = scoreResume(
      withBullets(['Cut latency by 40%', 'Served 2M users', 'Wrote docs', 'Reviewed code', 'Ran standups']),
    ).categories.quantifiableMetrics
    const vague = scoreResume(withBullets(['Wrote docs', 'Reviewed code', 'Ran standups'])).categories.quantifiableMetrics

    assert.deepEqual([quantified.score, quantified.passed, quantified.feedback], [20, true, []])
    assert.deepEqual([vague.score, vague.passed, vague.feedback.length], [0, false, 2])
  })

  it('picks the keyword bank from the job title', () => {
    assert.equal(detectRoleType('Senior Security Engineer'), 'security')
    assert.equal(detectRoleType('ML Engineer'), 'ml')
    assert.equal(detectRoleType('Data Analyst'), 'data')
    assert.equal(detectRoleType('Site Reliability Engineer'), 'devops')
    assert.equal(detectRoleType('Product Manager'), 'pm')
    assert.equal(detectRoleType('Frontend Developer'), 'swe')
    assert.equal(detectRoleType(''), 'general')

    const security = scoreResume({ ...EMPTY_RESUME, personalInfo: { ...EMPTY_RESUME.personalInfo, title: 'Security Engineer' } })
    assert.ok(security.categories.keywordDensity.feedback[0].includes('SECURITY roles'))
  })
})
