import assert from 'node:assert/strict'
import { before, describe, it, mock } from 'node:test'
import { importResumeJson } from '@/lib/jsonPortability'
import { DEMO_RESUME } from '@/constants/demoData'
import { EMPTY_RESUME } from '@/types/resume'

// Node provides File/Blob but no FileReader; the importer only needs readAsText().
class FakeFileReader {
  result = null
  onload = null
  onerror = null

  readAsText(file) {
    file.text().then(
      (text) => {
        this.result = text
        this.onload?.()
      },
      () => this.onerror?.(),
    )
  }
}

before(() => {
  globalThis.FileReader = FakeFileReader
})

function jsonFile(content) {
  const text = typeof content === 'string' ? content : JSON.stringify(content)
  return new File([text], 'resume.json', { type: 'application/json' })
}

const pick = (object, keys) => Object.fromEntries(keys.map((key) => [key, object[key]]))

const INLINE_JPEG = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a'
const INLINE_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

describe('importResumeJson', () => {
  it('round-trips a resume exported by the app', async () => {
    const exported = {
      ...DEMO_RESUME,
      personalInfo: { ...DEMO_RESUME.personalInfo, photo: INLINE_JPEG },
    }

    assert.deepEqual(await importResumeJson(jsonFile(exported)), exported)
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

    assert.deepEqual(Object.keys(data), Object.keys(EMPTY_RESUME))
    assert.deepEqual(data.personalInfo, { ...EMPTY_RESUME.personalInfo, title: 'Engineer' })
    assert.deepEqual(data.experience, [])
    assert.equal(data.projects.length, 1)
    assert.deepEqual(pick(data.projects[0], ['name', 'bullets', 'technologies', 'repoUrl']), {
      name: 'Tooling',
      bullets: ['Shipped it'],
      technologies: [],
      repoUrl: '',
    })
    assert.deepEqual(pick(data.skills[0], ['name', 'level', 'category']), { name: 'Go', level: 'intermediate', category: '' })
    assert.deepEqual(pick(data.education[0], ['institution', 'coursework', 'gpa']), { institution: 'MIT', coursework: ['Algorithms'], gpa: '' })
    assert.deepEqual(pick(data.certifications[0], ['name', 'url']), { name: 'CKA', url: '' })
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
    assert.deepEqual(data.skills.map((s) => s.name), ['Go', 'Rust', 'Zig', 'C'])
    assert.ok(ids.every((id) => typeof id === 'string' && id.length > 0))
    assert.equal(new Set(ids).size, ids.length)
  })

  it('falls back to an empty resume when the JSON is not an object', async () => {
    for (const content of ['[]', 'null', '"text"', '123']) {
      assert.deepEqual(await importResumeJson(jsonFile(content)), EMPTY_RESUME)
    }
  })

  it('rejects files that are not valid JSON', async () => {
    await assert.rejects(importResumeJson(jsonFile('{ "personalInfo": ')), { message: 'Invalid JSON file' })
  })

  // Security: the photo ends up in <img src>. Only base64 data-URL raster images
  // (what the photo uploader produces) may come in through an import — never a
  // URL the browser would fetch.
  it('keeps photos that are base64 raster data URLs', async () => {
    for (const photo of [INLINE_JPEG, INLINE_PNG]) {
      const data = await importResumeJson(jsonFile({ personalInfo: { photo } }))
      assert.equal(data.personalInfo.photo, photo)
    }
  })

  it('drops every other photo value', async () => {
    const unsafePhotos = [
      'https://tracker.example/pixel.gif?who=victim',
      'http://192.168.0.1/admin/reboot',
      '//tracker.example/pixel.gif',
      'javascript:alert(1)',
      'file:///etc/passwd',
      'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
      'data:image/svg+xml;base64,PHN2Zy8+',
      'data:image/png;base64,AAAA" onerror="alert(1)',
      ' data:image/png;base64,AAAA',
    ]

    for (const photo of unsafePhotos) {
      const data = await importResumeJson(jsonFile({ personalInfo: { fullName: 'Ada', photo } }))
      assert.equal(data.personalInfo.photo, '', photo)
      assert.equal(data.personalInfo.fullName, 'Ada')
    }
  })

  it('rejects oversized files without reading them', async () => {
    const readAsText = mock.method(FakeFileReader.prototype, 'readAsText')
    const huge = jsonFile(`{"personalInfo":{"summary":"${'a'.repeat(5 * 1024 * 1024)}"}}`)

    // Reduce the outcome to a short string so a failure does not print 5 MB of text.
    const outcome = await importResumeJson(huge).then(
      () => 'imported',
      (err) => err.message,
    )

    assert.match(outcome, /too large/i)
    assert.equal(readAsText.mock.callCount(), 0)

    readAsText.mock.restore()
  })
})
