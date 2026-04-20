import type { ResumeData } from '@/types/resume'
import { formatDateRange } from '@/lib/utils'

// Native text-based PDF for ATS Optimized template.
// Produces a real text-layer PDF that ATS systems (Workday, Greenhouse, Lever) can parse.
export async function exportATSPdf(data: ResumeData): Promise<void> {
  const { default: jsPDF } = await import('jspdf')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 54 // 0.75 inch
  const usableWidth = pageWidth - margin * 2

  let y = margin

  const newPageIfNeeded = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }
  }

  const writeLine = (text: string, opts: { size?: number; bold?: boolean; italic?: boolean; align?: 'left' | 'center' | 'right'; indent?: number } = {}) => {
    const size = opts.size ?? 10
    const style = opts.bold && opts.italic ? 'bolditalic' : opts.bold ? 'bold' : opts.italic ? 'italic' : 'normal'
    pdf.setFont('times', style)
    pdf.setFontSize(size)
    const indent = opts.indent ?? 0
    const lines = pdf.splitTextToSize(text, usableWidth - indent) as string[]
    for (const line of lines) {
      newPageIfNeeded(size * 1.3)
      if (opts.align === 'center') {
        pdf.text(line, pageWidth / 2, y, { align: 'center' })
      } else {
        pdf.text(line, margin + indent, y)
      }
      y += size * 1.25
    }
  }

  const writeKeyValue = (left: string, right: string, opts: { size?: number; bold?: boolean } = {}) => {
    const size = opts.size ?? 10
    pdf.setFont('times', opts.bold ? 'bold' : 'normal')
    pdf.setFontSize(size)
    newPageIfNeeded(size * 1.3)
    pdf.text(left, margin, y)
    pdf.text(right, pageWidth - margin, y, { align: 'right' })
    y += size * 1.25
  }

  const sectionHeader = (title: string) => {
    y += 6
    newPageIfNeeded(30)
    pdf.setFont('times', 'bold')
    pdf.setFontSize(11)
    pdf.text(title.toUpperCase(), margin, y)
    y += 3
    pdf.setDrawColor(0)
    pdf.setLineWidth(0.75)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 10
  }

  const { personalInfo: p, experience, projects, skills, education, certifications } = data

  // Header: Name
  writeLine(p.fullName || 'Your Name', { size: 18, bold: true, align: 'center' })
  if (p.title) writeLine(p.title, { size: 11, align: 'center' })

  // Contact line (pipe-separated for max ATS compat)
  const contact = [p.email, p.phone, p.location, p.linkedIn, p.github].filter(Boolean).join(' | ')
  if (contact) writeLine(contact, { size: 10, align: 'center' })

  y += 6

  // Summary
  if (p.summary) {
    sectionHeader('Professional Summary')
    writeLine(p.summary, { size: 10 })
  }

  // Experience
  if (experience.length > 0) {
    sectionHeader('Work Experience')
    for (const role of experience) {
      writeKeyValue(role.title || '', formatDateRange(role.startDate, role.endDate, role.current), { bold: true })
      writeLine(`${role.company}${role.location ? `, ${role.location}` : ''}`, { italic: true, size: 10 })
      for (const bullet of role.bullets.filter((b) => b.trim())) {
        writeLine(`• ${bullet}`, { size: 10, indent: 6 })
      }
      y += 4
    }
  }

  // Projects
  if (projects.length > 0) {
    sectionHeader('Projects')
    for (const proj of projects) {
      writeKeyValue(proj.name, proj.repoUrl || '', { bold: true })
      if (proj.description) writeLine(proj.description, { italic: true, size: 10 })
      if (proj.technologies.length > 0) writeLine(`Technologies: ${proj.technologies.join(', ')}`, { size: 10 })
      for (const bullet of proj.bullets.filter((b) => b.trim())) {
        writeLine(`• ${bullet}`, { size: 10, indent: 6 })
      }
      y += 4
    }
  }

  // Skills — grouped by category
  if (skills.length > 0) {
    sectionHeader('Skills')
    const grouped: Record<string, string[]> = {}
    for (const s of skills) {
      if (!grouped[s.category]) grouped[s.category] = []
      grouped[s.category].push(s.name)
    }
    for (const [cat, names] of Object.entries(grouped)) {
      // Category label in bold, then names — on the same line using PDF-native emphasis
      const catLabel = `${cat}: `
      pdf.setFont('times', 'bold')
      pdf.setFontSize(10)
      const catWidth = pdf.getTextWidth(catLabel)
      newPageIfNeeded(14)
      pdf.text(catLabel, margin, y)
      pdf.setFont('times', 'normal')
      const namesText = names.join(', ')
      const lines = pdf.splitTextToSize(namesText, usableWidth - catWidth) as string[]
      pdf.text(lines[0], margin + catWidth, y)
      y += 12
      // remaining lines if wrapped
      for (let i = 1; i < lines.length; i++) {
        newPageIfNeeded(14)
        pdf.text(lines[i], margin + catWidth, y)
        y += 12
      }
    }
  }

  // Education
  if (education.length > 0) {
    sectionHeader('Education')
    for (const edu of education) {
      writeKeyValue(edu.institution, formatDateRange(edu.startDate, edu.endDate, false), { bold: true })
      const degree = [edu.degree, edu.field].filter(Boolean).join(' in ')
      if (degree) writeLine(`${degree}${edu.location ? ` — ${edu.location}` : ''}`, { size: 10 })
      const extras = [edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' · ')
      if (extras) writeLine(extras, { size: 10 })
      y += 2
    }
  }

  // Certifications
  if (certifications.length > 0) {
    sectionHeader('Certifications')
    for (const cert of certifications) {
      const left = `${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ''}`
      writeKeyValue(left, cert.issueDate ? cert.issueDate.slice(0, 7) : '', { size: 10 })
    }
  }

  const date = new Date().toISOString().split('T')[0]
  const filename = `${p.fullName || 'Resume'}_ATS_${date}.pdf`.replace(/\s+/g, '_')
  pdf.save(filename)
}
