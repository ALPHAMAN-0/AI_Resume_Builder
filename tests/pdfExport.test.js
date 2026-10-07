import assert from 'node:assert/strict'
import { afterEach, before, beforeEach, describe, it, mock } from 'node:test'
import { jsPDF } from 'jspdf'
import { exportToPDF } from '@/lib/pdfExport'
import { DEMO_RESUME } from '@/constants/demoData'

// Everything below runs the real jsPDF (tests/setup/hooks.mjs points "jspdf" at the
// same browser build the app bundles). Only save() is replaced, because it would
// start a download: the generated documents are captured here instead.
const saved = []
before(() => {
  jsPDF.API.save = function (filename) {
    saved.push({ filename, content: this.output(), pages: this.getNumberOfPages() })
    return this
  }
})

// Smallest valid JPEG (1×1 px) — stands in for a rendered page slice.
const TINY_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='

beforeEach(() => {
  saved.length = 0
  globalThis.html2canvasStub = mock.fn()
})

afterEach(() => {
  delete globalThis.html2canvasStub
  delete globalThis.document
})

describe('exportToPDF', () => {
  it('exports the ATS template as a text-layer PDF without rasterizing the page', async () => {
    await exportToPDF(DEMO_RESUME.personalInfo.fullName, 'ats-minimal', DEMO_RESUME)

    assert.equal(globalThis.html2canvasStub.mock.callCount(), 0)
    assert.equal(saved.length, 1)
    const [pdf] = saved
    assert.match(pdf.filename, /^Alex_Chen_ATS_\d{4}-\d{2}-\d{2}\.pdf$/)
    assert.ok(pdf.content.startsWith('%PDF-'))
    assert.ok(!pdf.content.includes('/Subtype /Image'))
    for (const text of [
      '(Alex Chen) Tj',
      '(Senior Software Engineer) Tj',
      '(WORK EXPERIENCE) Tj',
      '(SKILLS) Tj',
      '(Languages: ) Tj',
      '(Go, TypeScript, Python) Tj',
      '(EDUCATION) Tj',
      '(UC Berkeley) Tj',
    ]) {
      assert.ok(pdf.content.includes(text), text)
    }
  })

  // Security: same Object.prototype collision as in the on-screen templates.
  it('exports skills whose category collides with Object.prototype keys', async () => {
    const data = {
      ...DEMO_RESUME,
      skills: [
        { id: 'a', name: 'Alpha', level: 'expert', category: 'constructor' },
        { id: 'b', name: 'Bravo', level: 'advanced', category: '__proto__' },
      ],
    }

    await exportToPDF('Alex Chen', 'ats-minimal', data)

    assert.equal(saved.length, 1)
    for (const text of ['(constructor: ) Tj', '(Alpha) Tj', '(__proto__: ) Tj', '(Bravo) Tj']) {
      assert.ok(saved[0].content.includes(text), text)
    }
  })

  it('splits a tall visual template into letter-size pages and hides the print root again', async () => {
    const canvasWidth = 794 * 3 // print root width × html2canvas scale
    const pageHeightPx = 279.4 * (canvasWidth / 215.9)
    const printRoot = { style: {} }

    globalThis.html2canvasStub = mock.fn(async () => ({
      width: canvasWidth,
      height: Math.round(pageHeightPx * 2.5),
      // Every row is white, so any row is a safe place to break the page.
      getContext: () => ({
        getImageData: (_x, _y, width) => ({ data: new Uint8ClampedArray(width * 4).fill(255) }),
      }),
    }))
    globalThis.document = {
      getElementById: (id) => (id === 'resume-print-root' ? printRoot : null),
      createElement: () => ({
        width: 0,
        height: 0,
        getContext: () => ({ fillStyle: '', fillRect: () => {}, drawImage: () => {} }),
        toDataURL: () => TINY_JPEG,
      }),
    }

    await exportToPDF('Alex Chen', 'modern-tech', DEMO_RESUME)

    const [target, options] = globalThis.html2canvasStub.mock.calls[0].arguments
    assert.equal(target, printRoot)
    assert.deepEqual([options.scale, options.width, options.backgroundColor], [3, 794, '#ffffff'])
    assert.equal(saved.length, 1)
    assert.match(saved[0].filename, /^Alex_Chen_Resume_\d{4}-\d{2}-\d{2}\.pdf$/)
    assert.equal(saved[0].pages, 3)
    assert.ok(saved[0].content.includes('/Subtype /Image'))
    assert.deepEqual(
      [printRoot.style.visibility, printRoot.style.position, printRoot.style.left],
      ['hidden', 'absolute', '-9999px'],
    )
  })
})
