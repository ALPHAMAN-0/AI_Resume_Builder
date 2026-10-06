import { describe, expect, it } from 'vitest'
import { matchJobDescription } from '@/lib/jdMatcher'
import { EMPTY_RESUME, type ResumeData } from '@/types/resume'

const resume: ResumeData = {
  ...EMPTY_RESUME,
  personalInfo: { ...EMPTY_RESUME.personalInfo, title: 'Frontend Developer', summary: 'Built machine learning dashboards' },
  skills: [
    { id: '1', name: 'React', level: 'expert', category: 'Frameworks' },
    { id: '2', name: 'TypeScript', level: 'expert', category: 'Languages' },
  ],
}

describe('matchJobDescription', () => {
  it('returns an empty result for a blank job description', () => {
    expect(matchJobDescription('  \n ', resume)).toEqual({ matchPercent: 0, matched: [], missing: [], topMissing: [] })
  })

  it('reports matched and missing keywords, ignoring filler words', () => {
    const result = matchJobDescription('We need React, TypeScript and Kubernetes experience.', resume)

    expect(result.matched).toEqual(['react', 'typescript'])
    expect(result.missing).toEqual(['need', 'kubernetes'])
    expect(result.matchPercent).toBe(50)
  })

  it('treats multi-word tech phrases as a single keyword', () => {
    const result = matchJobDescription('Experience with machine learning and system design', resume)

    expect(result.matched).toContain('machine learning')
    expect(result.missing).toContain('system design')
  })

  it('handles terms with regex metacharacters and ranks missing keywords by frequency', () => {
    const jd = 'C++ and C# with Node.js, CI/CD. Kubernetes, Kubernetes, Kubernetes! Terraform (a+b)* [x] \\d{2,} ^$ |'

    const result = matchJobDescription(jd, EMPTY_RESUME)

    expect(result.matchPercent).toBe(0)
    expect(result.missing).toEqual(expect.arrayContaining(['c++', 'c#', 'node.js', 'ci cd', 'terraform']))
    expect(result.topMissing[0]).toBe('kubernetes')
    expect(result.topMissing.length).toBeLessThanOrEqual(10)
  })
})
