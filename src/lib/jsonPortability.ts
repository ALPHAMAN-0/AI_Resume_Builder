import type { ResumeData } from '@/types/resume'
import { EMPTY_RESUME } from '@/types/resume'

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

export function importResumeJson(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        // Shallow-merge with EMPTY_RESUME so missing sections get defaults
        const merged: ResumeData = {
          personalInfo: { ...EMPTY_RESUME.personalInfo, ...(parsed.personalInfo ?? {}) },
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        }
        resolve(merged)
      } catch (err) {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
