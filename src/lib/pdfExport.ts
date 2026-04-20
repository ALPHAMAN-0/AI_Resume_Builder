import type { ResumeData, TemplateId } from '@/types/resume'
import { exportATSPdf } from './atsPdfExport'

const PAGE_WIDTH_PX = 794

// Find a safe page-break row near the target offset by scanning the canvas for
// an empty (all-white) horizontal strip. Prevents text from being sliced in half.
function findSafePageBreak(canvas: HTMLCanvasElement, targetY: number, searchWindow: number): number {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return targetY

  const minY = Math.max(0, targetY - searchWindow)
  const maxY = Math.min(canvas.height, targetY)

  // Scan upward from target looking for a run of white rows
  for (let y = maxY - 1; y >= minY; y--) {
    const row = ctx.getImageData(0, y, canvas.width, 1).data
    let isBlank = true
    // Sample every 4th pixel (RGBA strides of 16) for speed
    for (let i = 0; i < row.length; i += 16) {
      // If any channel is noticeably darker than white, this row has content
      if (row[i] < 245 || row[i + 1] < 245 || row[i + 2] < 245) {
        isBlank = false
        break
      }
    }
    if (isBlank) return y
  }

  // No blank row found — fall back to the fixed offset
  return targetY
}

async function exportVisualPdf(name: string): Promise<void> {
  // Code-split: load heavy libs only on export click
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const printRoot = document.getElementById('resume-print-root')
  if (!printRoot) throw new Error('Print root not found')

  // Make print root visible and positioned for capture
  printRoot.style.visibility = 'visible'
  printRoot.style.position = 'fixed'
  printRoot.style.top = '0'
  printRoot.style.left = '0'
  printRoot.style.zIndex = '-1'

  // Wait for web fonts (Inter, Playfair Display, JetBrains Mono) to fully load
  // before capturing — otherwise html2canvas snapshots a fallback font and text
  // widths/positions are wrong.
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready
  }

  // Extra beat for layout + paint after making the root visible
  await new Promise((r) => setTimeout(r, 300))

  try {
    const canvas = await html2canvas(printRoot, {
      scale: 3, // Higher scale = sharper text in the PDF
      useCORS: true,
      backgroundColor: '#ffffff',
      width: PAGE_WIDTH_PX,
      windowWidth: PAGE_WIDTH_PX,
      logging: false,
    })

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
    const pageWidthMM = 215.9
    const pageHeightMM = 279.4

    const pxPerMM = canvas.width / pageWidthMM
    const pageHeightPx = pageHeightMM * pxPerMM

    // Figure out page break Y-offsets (in canvas pixels), preferring blank rows
    const breakPoints: number[] = [0]
    let nextBreak = pageHeightPx
    while (nextBreak < canvas.height) {
      // Look up to 15% of a page height above the target for whitespace
      const safeY = findSafePageBreak(canvas, nextBreak, Math.floor(pageHeightPx * 0.15))
      // Guard against tiny slices when we snap too close to the previous break
      const clamped = safeY - breakPoints[breakPoints.length - 1] < pageHeightPx * 0.5
        ? nextBreak
        : safeY
      breakPoints.push(clamped)
      nextBreak = clamped + pageHeightPx
    }
    breakPoints.push(canvas.height)

    // Render each slice onto its own page using a per-page off-screen canvas
    // so jsPDF gets an image exactly sized to that page's content (no cropping tricks).
    for (let i = 0; i < breakPoints.length - 1; i++) {
      const startY = breakPoints[i]
      const endY = breakPoints[i + 1]
      const sliceHeight = endY - startY
      if (sliceHeight <= 0) continue

      const slice = document.createElement('canvas')
      slice.width = canvas.width
      slice.height = sliceHeight
      const sctx = slice.getContext('2d')
      if (!sctx) continue
      sctx.fillStyle = '#ffffff'
      sctx.fillRect(0, 0, slice.width, slice.height)
      sctx.drawImage(canvas, 0, startY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

      const sliceHeightMM = (sliceHeight / canvas.width) * pageWidthMM
      const imgData = slice.toDataURL('image/jpeg', 0.92) // JPEG keeps file size reasonable
      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidthMM, sliceHeightMM)
    }

    const date = new Date().toISOString().split('T')[0]
    const filename = `${name || 'Resume'}_Resume_${date}.pdf`.replace(/\s+/g, '_')
    pdf.save(filename)
  } finally {
    printRoot.style.visibility = 'hidden'
    printRoot.style.position = 'absolute'
    printRoot.style.top = '0'
    printRoot.style.left = '-9999px'
    printRoot.style.zIndex = ''
  }
}

export async function exportToPDF(name: string, template: TemplateId, data: ResumeData): Promise<void> {
  // ATS Optimized template uses native text rendering — produces a real text-layer PDF
  // that ATS systems (Workday, Greenhouse, Lever) can actually parse.
  if (template === 'ats-minimal') {
    await exportATSPdf(data)
    return
  }
  // Other templates use html2canvas — visual fidelity wins over ATS parseability.
  await exportVisualPdf(name)
}
