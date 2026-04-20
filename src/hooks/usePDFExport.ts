import { useResumeStore } from '@/store/useResumeStore'
import { exportToPDF } from '@/lib/pdfExport'

export function usePDFExport() {
  const isExporting = useResumeStore((s) => s.isExporting)
  const setExporting = useResumeStore((s) => s.setExporting)
  const name = useResumeStore((s) => s.resumeData.personalInfo.fullName)
  const template = useResumeStore((s) => s.activeTemplate)
  const data = useResumeStore((s) => s.resumeData)

  const handleExport = async () => {
    if (isExporting) return
    setExporting(true)
    try {
      await exportToPDF(name, template, data)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return { handleExport, isExporting }
}
