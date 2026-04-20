import type { ResumeData } from '@/types/resume'

// Noise words that shouldn't count as meaningful keywords.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'for', 'of', 'to', 'in', 'on', 'at', 'by',
  'with', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'must',
  'this', 'that', 'these', 'those', 'i', 'you', 'we', 'they', 'he', 'she', 'it', 'our', 'your',
  'their', 'his', 'her', 'its', 'my', 'me', 'us', 'them', 'who', 'what', 'when', 'where', 'why',
  'how', 'which', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'just', 'about',
  'also', 'into', 'up', 'out', 'down', 'over', 'under', 'again', 'further', 'once', 'here',
  'there', 'now', 'through', 'during', 'before', 'after', 'above', 'below', 'between',
  'will', 'you', 'your', 'our', 'team', 'work', 'working', 'company', 'role', 'job', 'position',
  'candidate', 'strong', 'excellent', 'ability', 'experience', 'years', 'year', 'plus', 'preferred',
  'required', 'bonus', 'nice', 'including', 'include', 'using', 'use', 'etc', 'able', 'ideal',
])

// Multi-word tech phrases that should be caught as a unit.
const PHRASES = [
  'machine learning', 'deep learning', 'neural network', 'computer vision', 'natural language',
  'data science', 'data pipeline', 'data engineering', 'big data',
  'rest api', 'graphql', 'micro services', 'microservices', 'distributed systems',
  'system design', 'unit test', 'unit testing', 'integration test', 'integration testing',
  'ci cd', 'ci/cd', 'continuous integration', 'continuous deployment', 'continuous delivery',
  'version control', 'code review', 'pair programming',
  'cloud computing', 'infrastructure as code', 'serverless',
  'event driven', 'event-driven', 'message queue', 'pub sub',
  'a/b testing', 'ab testing', 'product management', 'product manager',
  'stakeholder management', 'cross functional', 'cross-functional',
]

function tokenize(text: string): string[] {
  const lower = text.toLowerCase()
  const tokens: string[] = []

  // Catch multi-word phrases first
  for (const phrase of PHRASES) {
    if (lower.includes(phrase)) tokens.push(phrase.replace(/[\s/]+/g, ' ').trim())
  }

  // Single-word tokens (includes tech terms with dots/plus like node.js, c++)
  const words = lower.match(/[a-z][a-z0-9+#.\-]*[a-z0-9+#]|[a-z]/g) || []
  for (const w of words) {
    if (w.length < 2) continue
    if (STOPWORDS.has(w)) continue
    tokens.push(w)
  }

  return tokens
}

function resumeText(data: ResumeData): string {
  return [
    data.personalInfo.title,
    data.personalInfo.summary,
    ...data.experience.flatMap((e) => [e.title, ...e.bullets, ...e.technologies]),
    ...data.projects.flatMap((p) => [p.name, p.description, ...p.bullets, ...p.technologies]),
    ...data.skills.map((s) => s.name),
    ...data.education.flatMap((e) => [e.degree, e.field, ...e.coursework]),
    ...data.certifications.map((c) => c.name),
  ].filter(Boolean).join(' ')
}

export interface JDMatchResult {
  matchPercent: number
  matched: string[]
  missing: string[]
  topMissing: string[]
}

export function matchJobDescription(jd: string, data: ResumeData): JDMatchResult {
  if (!jd.trim()) {
    return { matchPercent: 0, matched: [], missing: [], topMissing: [] }
  }

  const jdTokens = new Set(tokenize(jd))
  const resumeTokens = new Set(tokenize(resumeText(data)))

  const matched: string[] = []
  const missing: string[] = []

  for (const t of jdTokens) {
    if (resumeTokens.has(t)) matched.push(t)
    else missing.push(t)
  }

  // Rank missing by frequency in JD (more important terms appear more often)
  const jdLower = jd.toLowerCase()
  const missingRanked = missing
    .map((term) => ({ term, count: (jdLower.match(new RegExp(`\\b${term.replace(/[+.*?()[\]\\]/g, '\\$&')}\\b`, 'g')) || []).length }))
    .sort((a, b) => b.count - a.count)
    .map((x) => x.term)

  const matchPercent = jdTokens.size === 0 ? 0 : Math.round((matched.length / jdTokens.size) * 100)

  return {
    matchPercent,
    matched,
    missing: missingRanked,
    topMissing: missingRanked.slice(0, 10),
  }
}
