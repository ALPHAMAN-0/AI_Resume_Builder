import { beforeAll, describe, expect, it, vi } from 'vitest'
import { importResumeJson } from '@/lib/jsonPortability'
import { DEMO_RESUME } from '@/constants/demoData'
import { EMPTY_RESUME } from '@/types/resume'

// Node provides File/Blob but no FileReader; the importer only needs readAsText().
class FakeFileReader {
  result: string | null = null
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  readAsText(file: Blob): void {
    file.text().then(
      (text) => {
        this.result = text
        this.onload?.()
      },
      () => this.onerror?.(),
    )
  }
}

beforeAll(() => {
  vi.stubGlobal('FileReader', FakeFileReader)
})

function jsonFile(content: unknown): File {
  const text = typeof content === 'string' ? content : JSON.stringify(content)
  return new File([text], 'resume.json', { type: 'application/json' })
}

const INLINE_JPEG = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a'

describe('importResumeJson', () => {
  it('round-trips a resume exported by the app', async () => {
    const exported = {
      ...DEMO_RESUME,
      personalInfo: { ...DEMO_RESUME.personalInfo, photo: INLINE_JPEG },
    }

    await expect(importResumeJson(jsonFile(exported))).resolves.toEqual(exported)
  })

  it('drops unknown keys and replaces wrongly typed values with safe defaults', async () => {
    const data = await importResumeJson(
      jsonFile({
        personalInfo: { fullName: 42, title: 'Engineer', isAdmin: true },
        experience: 'not-an-array',
        projects: [null, 'text', { name: 'Tooling', bullets: [1, 'Shipped it', null], technologies: 'Go' }],
        skills: [{ name: 'Go', level: 'godlike', category: 7 }],
        education: [{ institution: 'MIT', coursework: ['Algorithms', 5] }],
        certifications: [{ name: 'CKA', url: { href: 'x' } }],
        extraSection: [{ anything: true }],
      }),
    )

    expect(Object.keys(data)).toEqual(Object.keys(EMPTY_RESUME))
    expect(data.personalInfo).toEqual({ ...EMPTY_RESUME.personalInfo, title: 'Engineer' })
    expect(data.experience).toEqual([])
    expect(data.projects).toHaveLength(1)
    expect(data.projects[0]).toMatchObject({ name: 'Tooling', bullets: ['Shipped it'], technologies: [], repoUrl: '' })
    expect(data.skills[0]).toMatchObject({ name: 'Go', level: 'intermediate', category: '' })
    expect(data.education[0]).toMatchObject({ institution: 'MIT', coursework: ['Algorithms'], gpa: '' })
    expect(data.certifications[0]).toMatchObject({ name: 'CKA', url: '' })
  })

  it('gives every entry a unique, non-empty id', async () => {
    const data = await importResumeJson(
      jsonFile({
        skills: [
          { id: 'dup', name: 'Go' },
          { id: 'dup', name: 'Rust' },
          { id: '', name: 'Zig' },
          { name: 'C' },
        ],
      }),
    )

    const ids = data.skills.map((s) => s.id)
    expect(data.skills.map((s) => s.name)).toEqual(['Go', 'Rust', 'Zig', 'C'])
    expect(ids.every((id) => typeof id === 'string' && id.length > 0)).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('falls back to an empty resume when the JSON is not an object', async () => {
    for (const content of ['[]', 'null', '"text"', '123']) {
      await expect(importResumeJson(jsonFile(content))).resolves.toEqual(EMPTY_RESUME)
    }
  })

  it('rejects files that are not valid JSON', async () => {
    await expect(importResumeJson(jsonFile('{ "personalInfo": '))).rejects.toThrow('Invalid JSON file')
  })
})
