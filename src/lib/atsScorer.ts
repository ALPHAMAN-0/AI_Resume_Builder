import type { ResumeData, ATSResult, ATSCategoryScore } from '@/types/resume'
import { ACTION_VERBS, WEAK_PHRASES } from '@/constants/actionVerbs'
import { ROLE_KEYWORDS, detectRoleType } from '@/constants/atsKeywords'

function scoreContact(data: ResumeData): ATSCategoryScore {
  const { personalInfo: p } = data
  let score = 0
  const feedback: string[] = []

  if (p.email && p.email.includes('@')) score += 3
  else feedback.push('Add a valid email address')

  if (p.phone && /\d{7,}/.test(p.phone.replace(/\D/g, ''))) score += 3
  else feedback.push('Add a phone number')

  if (p.linkedIn) score += 3
  else feedback.push('Add your LinkedIn profile URL — recruiters check this first')

  if (p.github || p.portfolio) score += 3
  else feedback.push('Add your GitHub or portfolio URL to showcase your work')

  if (p.location) score += 3
  else feedback.push('Add your city and state — many ATS systems filter by location')

  return { name: 'Contact Info', score, maxScore: 15, feedback, passed: score >= 12 }
}

function scoreSections(data: ResumeData): ATSCategoryScore {
  let score = 0
  const feedback: string[] = []

  if (data.experience.length > 0) score += 4
  else feedback.push('Add at least one work experience entry')

  if (data.skills.length > 0) score += 4
  else feedback.push('Add your technical skills')

  if (data.education.length > 0) score += 4
  else feedback.push('Add your education history')

  if (data.projects.length > 0) score += 4
  else feedback.push('Add at least one project to demonstrate hands-on work')

  const summary = data.personalInfo.summary
  if (summary.length >= 100 && summary.length <= 600) {
    score += 4
  } else if (summary.length > 0) {
    score += 2
    if (summary.length < 100) feedback.push('Expand your summary to at least 100 characters — ATS parses this section first')
    if (summary.length > 600) feedback.push('Shorten your summary to under 600 characters to avoid truncation')
  } else {
    feedback.push('Add a professional summary — ATS systems parse this section first')
  }

  return { name: 'Section Coverage', score, maxScore: 20, feedback, passed: score >= 16 }
}

function scoreActionVerbs(data: ResumeData): ATSCategoryScore {
  const allBullets: string[] = [
    ...data.experience.flatMap((e) => e.bullets),
    ...data.projects.flatMap((p) => p.bullets),
  ].filter((b) => b.trim().length > 0)

  if (allBullets.length === 0) {
    return { name: 'Action Verbs', score: 0, maxScore: 20, feedback: ['Add bullet points to your experience and projects'], passed: false }
  }

  let strongCount = 0
  const verbUsage: Record<string, number> = {}
  const weakFound: string[] = []

  for (const bullet of allBullets) {
    const firstWord = bullet.trim().toLowerCase().split(/\s+/)[0]
    if (ACTION_VERBS.has(firstWord)) {
      strongCount++
      verbUsage[firstWord] = (verbUsage[firstWord] || 0) + 1
    }
    for (const weak of WEAK_PHRASES) {
      if (bullet.toLowerCase().startsWith(weak)) {
        weakFound.push(weak)
        break
      }
    }
  }

  const ratio = strongCount / allBullets.length
  const score = Math.round(ratio * 20)
  const feedback: string[] = []

  if (weakFound.length > 0) {
    feedback.push(`Replace weak phrases like "${weakFound[0]}" with strong verbs like "Led", "Built", "Architected"`)
  }

  const repeated = Object.entries(verbUsage).filter(([, count]) => count >= 3)
  if (repeated.length > 0) {
    feedback.push(`"${repeated[0][0]}" appears ${repeated[0][1]} times — vary your action verbs for variety`)
  }

  if (ratio < 0.6) {
    feedback.push(`${strongCount} of ${allBullets.length} bullets start with strong action verbs — aim for 80%+`)
  }

  return { name: 'Action Verbs', score, maxScore: 20, feedback, passed: score >= 14 }
}

function scoreMetrics(data: ResumeData): ATSCategoryScore {
  const allBullets = [
    ...data.experience.flatMap((e) => e.bullets),
    ...data.projects.flatMap((p) => p.bullets),
  ].filter((b) => b.trim().length > 0)

  if (allBullets.length === 0) {
    return { name: 'Quantified Results', score: 0, maxScore: 20, feedback: ['Add bullet points with measurable results'], passed: false }
  }

  const metricsRegex = /(\d+[\w%+]*|\$[\d,.]+[KMB]?|[\d.]+[x×]|[\d,]+\s*(users?|requests?|transactions?|events?|customers?|engineers?))/i
  const withMetrics = allBullets.filter((b) => metricsRegex.test(b))
  const ratio = withMetrics.length / allBullets.length
  const score = Math.round(Math.min(ratio / 0.4, 1) * 20)

  const feedback: string[] = []
  if (ratio < 0.4) {
    feedback.push(`Only ${withMetrics.length} of ${allBullets.length} bullets include numbers — add metrics like "reduced latency by 40%" or "served 1M+ users"`)
  }
  if (ratio < 0.2) {
    feedback.push('Quantify your impact: response times, user counts, cost savings, team sizes, percentages')
  }

  return { name: 'Quantified Results', score, maxScore: 20, feedback, passed: score >= 12 }
}

function scoreKeywords(data: ResumeData): ATSCategoryScore {
  const roleType = detectRoleType(data.personalInfo.title)
  const keywords = ROLE_KEYWORDS[roleType]
  const targetCount = 15

  const resumeText = [
    data.personalInfo.summary,
    ...data.experience.flatMap((e) => [...e.bullets, ...e.technologies]),
    ...data.projects.flatMap((p) => [...p.bullets, ...p.technologies]),
    ...data.skills.map((s) => s.name),
  ].join(' ').toLowerCase()

  const matched = keywords.filter((kw) => resumeText.includes(kw.toLowerCase()))
  const score = Math.round(Math.min(matched.length / targetCount, 1) * 15)

  const missing = keywords.filter((kw) => !resumeText.includes(kw.toLowerCase())).slice(0, 4)
  const feedback: string[] = []

  if (missing.length > 0) {
    feedback.push(`Missing high-value keywords for ${roleType.toUpperCase()} roles: ${missing.slice(0, 3).map((k) => `"${k}"`).join(', ')}`)
  }
  if (score < 10) {
    feedback.push(`Found ${matched.length}/${targetCount} role-specific keywords — add more to pass keyword filters`)
  }

  return { name: 'Keyword Match', score, maxScore: 15, feedback, passed: score >= 10 }
}

function scoreFormat(data: ResumeData): ATSCategoryScore {
  let score = 0
  const feedback: string[] = []

  if (data.personalInfo.fullName && !/[<>{}|\\^`~]/.test(data.personalInfo.fullName)) score += 2
  else feedback.push('Remove special characters from your name')

  const hasConsistentDates = data.experience.every((e) => !e.startDate || /^\d{4}-\d{2}$/.test(e.startDate))
  if (hasConsistentDates) score += 2
  else feedback.push('Use consistent date formats (YYYY-MM) across all entries')

  if (data.experience.length <= 5) score += 2
  else feedback.push('Consider trimming to 4–5 most relevant roles for optimal length')

  const totalBullets = data.experience.reduce((sum, e) => sum + e.bullets.filter((b) => b.trim()).length, 0)
  if (totalBullets >= 4 && totalBullets <= 20) score += 2
  else if (totalBullets > 20) feedback.push('Trim bullet points — aim for 3–5 per role for readability')

  if (data.skills.length >= 5) score += 2
  else feedback.push('Add at least 5 skills to ensure keyword coverage')

  return { name: 'Format & Length', score, maxScore: 10, feedback, passed: score >= 8 }
}

export function scoreResume(data: ResumeData): ATSResult {
  const contact = scoreContact(data)
  const sections = scoreSections(data)
  const verbs = scoreActionVerbs(data)
  const metrics = scoreMetrics(data)
  const keywords = scoreKeywords(data)
  const format = scoreFormat(data)

  const totalScore = contact.score + sections.score + verbs.score + metrics.score + keywords.score + format.score

  const grade: ATSResult['grade'] =
    totalScore >= 85 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 55 ? 'C' : totalScore >= 40 ? 'D' : 'F'

  const allFeedback = [
    ...([contact, sections, verbs, metrics, keywords, format]
      .filter((c) => !c.passed)
      .sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))
      .flatMap((c) => c.feedback.slice(0, 1))),
  ]

  return {
    totalScore,
    grade,
    categories: {
      contactCompleteness: contact,
      sectionCompleteness: sections,
      actionVerbs: verbs,
      quantifiableMetrics: metrics,
      keywordDensity: keywords,
      formatOptimization: format,
    },
    topSuggestions: allFeedback.slice(0, 3),
  }
}
