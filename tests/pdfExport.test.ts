import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportToPDF } from '@/lib/pdfExport'
import { DEMO_RESUME } from '@/constants/demoData'
import type { ResumeData } from '@/types/resume'

interface SavedPdf {
  filename: string
  content: string
  pages: number
}

const { saved, html2canvas } = vi.hoisted(() => ({
  saved: [] as SavedPdf[],
  html2canvas: vi.fn(),
}))

// jsPDF's save() starts a browser download (or writes a file under Node).
// Capture the generated document instead; everything else is the real library.
vi.mock('jspdf', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jspdf')>()
  const jsPDF = actual.jsPDF
  const api = jsPDF.API as unknown as { save: (this: InstanceType<typeof jsPDF>, filename: string) => unknown }
  api.save = function (filename) {
    saved.push({ filename, content: this.output(), pages: this.getNumberOfPages() })
    return this
  }
  return { ...actual, default: jsPDF }
})

vi.mock('html2canvas', () => ({ default: html2canvas }))

// Smallest valid JPEG (1×1 px) — stands in for a rendered page slice.
const TINY_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA='

beforeEach(() => {
  saved.length = 0
  html2canvas.mockReset()
  // Only the clock is faked (file names carry today's date); timers stay real.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-01-15T12:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('exportToPDF', () => {
  it('exports the ATS template as a text-layer PDF without rasterizing the page', async () => {
    await exportToPDF(DEMO_RESUME.personalInfo.fullName, 'ats-minimal', DEMO_RESUME)

    expect(html2canvas).not.toHaveBeenCalled()
    expect(saved).toHaveLength(1)
    const [pdf] = saved
    expect(pdf.filename).toBe('Alex_Chen_ATS_2026-01-15.pdf')
    expect(pdf.content.startsWith('%PDF-')).toBe(true)
    expect(pdf.content).not.toContain('/Subtype /Image')
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
      expect(pdf.content).toContain(text)
    }
  })

  // Security: same Object.prototype collision as in the on-screen templates.
  it('exports skills whose category collides with Object.prototype keys', async () => {
    const data: ResumeData = {
      ...DEMO_RESUME,
      skills: [
        { id: 'a', name: 'Alpha', level: 'expert', category: 'constructor' },
        { id: 'b', name: 'Bravo', level: 'advanced', category: '__proto__' },
      ],
    }

    await exportToPDF('Alex Chen', 'ats-minimal', data)

    expect(saved).toHaveLength(1)
    for (const text of ['(constructor: ) Tj', '(Alpha) Tj', '(__proto__: ) Tj', '(Bravo) Tj']) {
      expect(saved[0].content).toContain(text)
    }
  })

  it('splits a tall visual template into letter-size pages and hides the print root again', async () => {
    const canvasWidth = 794 * 3 // print root width × html2canvas scale
    const pageHeightPx = 279.4 * (canvasWidth / 215.9)
    const printRoot = { style: {} as Record<string, string> }

    html2canvas.mockResolvedValue({
      width: canvasWidth,
      height: Math.round(pageHeightPx * 2.5),
      // Every row is white, so any row is a safe place to break the page.
      getContext: () => ({
        getImageData: (_x: number, _y: number, width: number) => ({ data: new Uint8ClampedArray(width * 4).fill(255) }),
      }),
    })
    vi.stubGlobal('document', {
      getElementById: (id: string) => (id === 'resume-print-root' ? printRoot : null),
      createElement: () => ({
        width: 0,
        height: 0,
        getContext: () => ({ fillStyle: '', fillRect: () => {}, drawImage: () => {} }),
        toDataURL: () => TINY_JPEG,
      }),
    })

    await exportToPDF('Alex Chen', 'modern-tech', DEMO_RESUME)

    expect(html2canvas).toHaveBeenCalledWith(printRoot, expect.objectContaining({ scale: 3, width: 794, backgroundColor: '#ffffff' }))
    expect(saved).toHaveLength(1)
    expect(saved[0].filename).toBe('Alex_Chen_Resume_2026-01-15.pdf')
    expect(saved[0].pages).toBe(3)
    expect(saved[0].content).toContain('/Subtype /Image')
    expect(printRoot.style).toMatchObject({ visibility: 'hidden', position: 'absolute', left: '-9999px' })
  })
})
