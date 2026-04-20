import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const PAGE_WIDTH_PX = 794
const PAGE_HEIGHT_PX = 1123 // US Letter at 96dpi

export async function exportToPDF(name: string): Promise<void> {
  const printRoot = document.getElementById('resume-print-root')
  if (!printRoot) throw new Error('Print root not found')

  // Make visible temporarily for rendering
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
