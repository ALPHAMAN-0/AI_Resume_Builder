import type { ResumeData, TemplateId } from '@/types/resume'
import { exportATSPdf } from './atsPdfExport'

const PAGE_WIDTH_PX = 794

async function exportVisualPdf(name: string): Promise<void> {
  // Code-split: load heavy libs only on export click
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const printRoot = document.getElementById('resume-print-root')
  if (!printRoot) throw new Error('Print root not found')

  printRoot.style.visibility = 'visible'
  printRoot.style.position = 'fixed'
  printRoot.style.top = '0'
  printRoot.style.left = '0'
  printRoot.style.zIndex = '-1'

  await new Promise((r) => setTimeout(r, 100))

  try {
    const canvas = await html2canvas(printRoot, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: PAGE_WIDTH_PX,
      windowWidth: PAGE_WIDTH_PX,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })

    const pageWidthMM = 215.9
    const pageHeightMM = 279.4
    const canvasHeightMM = (canvas.height / canvas.width) * pageWidthMM
    const totalPages = Math.ceil(canvasHeightMM / pageHeightMM)

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage()
      const yOffset = -(i * pageHeightMM)
      pdf.addImage(imgData, 'PNG', 0, yOffset, pageWidthMM, canvasHeightMM)
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
