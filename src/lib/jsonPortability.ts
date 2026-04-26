import type {
  ResumeData,
  PersonalInfo,
  Role,
  Project,
  Skill,
  Education,
  Certification,
  SkillLevel,
} from '@/types/resume'
import { EMPTY_RESUME } from '@/types/resume'
import { generateId } from '@/lib/utils'

export function exportResumeJson(data: ResumeData): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = new Date().toISOString().split('T')[0]
  a.download = `${data.personalInfo.fullName || 'Resume'}_${date}.json`.replace(/\s+/g, '_')
  a.click()
  URL.revokeObjectURL(url)
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function asBool(v: unknown): boolean {
  return typeof v === 'boolean' ? v : false
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((x): x is string => typeof x === 'string')
}

const SKILL_LEVELS: ReadonlyArray<SkillLevel> = ['beginner', 'intermediate', 'advanced', 'expert']
function asSkillLevel(v: unknown): SkillLevel {
  return SKILL_LEVELS.includes(v as SkillLevel) ? (v as SkillLevel) : 'intermediate'
}

function ensureId(v: unknown): string {
  return typeof v === 'string' && v.length > 0 ? v : generateId()
}

function sanitizeRole(raw: unknown): Role | null {
  if (!isPlainObject(raw)) return null
  const bullets = asStringArray(raw.bullets)
  return {
    id: ensureId(raw.id),
    title: asString(raw.title),
    company: asString(raw.company),
    location: asString(raw.location),
    startDate: asString(raw.startDate),
    endDate: asString(raw.endDate),
    current: asBool(raw.current),
    bullets: bullets.length > 0 ? bullets : [''],
    technologies: asStringArray(raw.technologies),
  }
}

function sanitizeProject(raw: unknown): Project | null {
  if (!isPlainObject(raw)) return null
  const bullets = asStringArray(raw.bullets)
  return {
    id: ensureId(raw.id),
    name: asString(raw.name),
    description: asString(raw.description),
    bullets: bullets.length > 0 ? bullets : [''],
    technologies: asStringArray(raw.technologies),
    repoUrl: asString(raw.repoUrl),
    liveUrl: asString(raw.liveUrl),
    startDate: asString(raw.startDate),
    endDate: asString(raw.endDate),
  }
}

function sanitizeSkill(raw: unknown): Skill | null {
  if (!isPlainObject(raw)) return null
  return {
    id: ensureId(raw.id),
    name: asString(raw.name),
    level: asSkillLevel(raw.level),
    category: asString(raw.category),
  }
}

function sanitizeEducation(raw: unknown): Education | null {
  if (!isPlainObject(raw)) return null
  return {
    id: ensureId(raw.id),
    institution: asString(raw.institution),
    degree: asString(raw.degree),
    field: asString(raw.field),
    location: asString(raw.location),
    startDate: asString(raw.startDate),
    endDate: asString(raw.endDate),
    gpa: asString(raw.gpa),
    honors: asString(raw.honors),
    coursework: asStringArray(raw.coursework),
  }
}

function sanitizeCertification(raw: unknown): Certification | null {
  if (!isPlainObject(raw)) return null
  return {
    id: ensureId(raw.id),
    name: asString(raw.name),
    issuer: asString(raw.issuer),
    issueDate: asString(raw.issueDate),
    expiryDate: asString(raw.expiryDate),
    credentialId: asString(raw.credentialId),
    url: asString(raw.url),
  }
}

function sanitizePersonalInfo(raw: unknown): PersonalInfo {
  const base: PersonalInfo = { ...EMPTY_RESUME.personalInfo }
  if (!isPlainObject(raw)) return base
  const keys = Object.keys(base) as Array<keyof PersonalInfo>
  for (const key of keys) {
    if (key in raw) base[key] = asString(raw[key])
  }
  return base
}

function sanitizeArray<T extends { id: string }>(
  raw: unknown,
  itemFn: (x: unknown) => T | null,
): T[] {
  if (!Array.isArray(raw)) return []
  const cleaned: T[] = []
  for (const item of raw) {
    const result = itemFn(item)
    if (result) cleaned.push(result)
  }
  const seen = new Set<string>()
  for (const item of cleaned) {
    while (seen.has(item.id)) item.id = generateId()
    seen.add(item.id)
  }
  return cleaned
}

function sanitizeImportedResume(parsed: unknown): ResumeData {
  const src: Record<string, unknown> = isPlainObject(parsed) ? parsed : {}
  return {
    personalInfo: sanitizePersonalInfo(src.personalInfo),
    experience: sanitizeArray(src.experience, sanitizeRole),
    projects: sanitizeArray(src.projects, sanitizeProject),
    skills: sanitizeArray(src.skills, sanitizeSkill),
    education: sanitizeArray(src.education, sanitizeEducation),
    certifications: sanitizeArray(src.certifications, sanitizeCertification),
  }
}

export function importResumeJson(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        resolve(sanitizeImportedResume(parsed))
      } catch (err) {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
