import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { matchJobDescription } from '@/lib/jdMatcher'
import { EMPTY_RESUME } from '@/types/resume'

const resume = {
  ...EMPTY_RESUME,
  personalInfo: { ...EMPTY_RESUME.personalInfo, title: 'Frontend Developer', summary: 'Built machine learning dashboards' },
  skills: [
    { id: '1', name: 'React', level: 'expert', category: 'Frameworks' },
    { id: '2', name: 'TypeScript', level: 'expert', category: 'Languages' },
  ],
}

describe('matchJobDescription', () => {
  it('returns an empty result for a blank job description', () => {
    assert.deepEqual(matchJobDescription('  \n ', resume), { matchPercent: 0, matched: [], missing: [], topMissing: [] })
  })

  it('reports matched and missing keywords, ignoring filler words', () => {
    const result = matchJobDescription('We need React, TypeScript and Kubernetes experience.', resume)

    assert.deepEqual(result.matched, ['react', 'typescript'])
    assert.deepEqual(result.missing, ['need', 'kubernetes'])
    assert.equal(result.matchPercent, 50)
  })

  it('treats multi-word tech phrases as a single keyword', () => {
    const result = matchJobDescription('Experience with machine learning and system design', resume)

    assert.ok(result.matched.includes('machine learning'))
    assert.ok(result.missing.includes('system design'))
  })

  it('handles terms with regex metacharacters and ranks missing keywords by frequency', () => {
    const jd = 'C++ and C# with Node.js, CI/CD. Kubernetes, Kubernetes, Kubernetes! Terraform (a+b)* [x] \\d{2,} ^$ |'

    const result = matchJobDescription(jd, EMPTY_RESUME)

    assert.equal(result.matchPercent, 0)
    for (const term of ['c++', 'c#', 'node.js', 'ci cd', 'terraform']) assert.ok(result.missing.includes(term), term)
    assert.equal(result.topMissing[0], 'kubernetes')
    assert.ok(result.topMissing.length <= 10)
  })
})
