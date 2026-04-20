import type { ResumeData } from '@/types/resume'
import { formatDateRange } from '@/lib/utils'
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react'

interface Props { data: ResumeData; isPrintMode?: boolean }

const ACCENT = '#4f46e5'
const ACCENT_LIGHT = '#eef2ff'

const grouped = (skills: ResumeData['skills']) => {
  const map: Record<string, ResumeData['skills']> = {}
  for (const s of skills) {
    if (!map[s.category]) map[s.category] = []
    map[s.category].push(s)
  }
  return map
}

const LEVEL_WIDTH: Record<string, string> = {
  beginner: '25%', intermediate: '55%', advanced: '80%', expert: '100%'
}

export function ModernTechTemplate({ data, isPrintMode }: Props) {
  const { personalInfo: p, experience, projects, skills, education, certifications } = data
  const skillGroups = grouped(skills)

  return (
    <div className="resume-page flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: ACCENT }} className="px-8 py-7 text-white">
        <h1 className="text-[20pt] font-bold tracking-tight">{p.fullName || 'Your Name'}</h1>
        {p.title && <p className="mt-0.5 text-[11pt] font-light opacity-90">{p.title}</p>}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {p.email && <ContactItem icon={<Mail size={11} />} label={p.email} />}
          {p.phone && <ContactItem icon={<Phone size={11} />} label={p.phone} />}
          {p.location && <ContactItem icon={<MapPin size={11} />} label={p.location} />}
          {p.linkedIn && <ContactItem icon={<Linkedin size={11} />} label={p.linkedIn} />}
          {p.github && <ContactItem icon={<Github size={11} />} label={p.github} />}
          {p.portfolio && <ContactItem icon={<Globe size={11} />} label={p.portfolio} />}
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 gap-0">
        {/* Main column — 65% */}
        <div className="flex-[65] border-r border-slate-100 px-7 py-6 space-y-5">
          {p.summary && (
            <div>
              <SectionLabel color={ACCENT}>Summary</SectionLabel>
              <p className="text-[10pt] text-slate-700 leading-relaxed mt-1">{p.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <SectionLabel color={ACCENT}>Experience</SectionLabel>
              <div className="space-y-4 mt-1">
                {experience.map((role) => (
                  <div key={role.id} className="relative pl-4 border-l-2 border-slate-100">
                    <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-[10.5pt] text-slate-900">{role.title}</p>
                        <p className="text-[9.5pt] text-slate-500">{[role.company, role.location].filter(Boolean).join(' · ')}</p>
                      </div>
                      <p className="text-[9pt] text-slate-400 shrink-0">{formatDateRange(role.startDate, role.endDate, role.current)}</p>
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {role.bullets.filter((b) => b.trim()).map((b, i) => (
                        <li key={i} className="flex gap-1.5 text-[9.5pt] text-slate-700">
                          <span className="shrink-0 mt-1" style={{ color: ACCENT }}>▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {role.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {role.technologies.map((t) => (
                          <span key={t} className="rounded px-1.5 py-0.5 text-[8pt] font-mono font-medium" style={{ background: ACCENT_LIGHT, color: ACCENT }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionLabel color={ACCENT}>Projects</SectionLabel>
              <div className="space-y-3 mt-1">
                {projects.map((proj) => (
                  <div key={proj.id} className="rounded-lg p-3" style={{ background: '#f8faff' }}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-[10pt]">{proj.name}</p>
                      {proj.repoUrl && <p className="text-[8.5pt] text-slate-400">{proj.repoUrl}</p>}
                    </div>
                    {proj.description && <p className="text-[9pt] text-slate-500 mt-0.5">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {proj.technologies.map((t) => (
                          <span key={t} className="rounded px-1.5 py-0.5 text-[8pt] font-mono font-medium" style={{ background: ACCENT_LIGHT, color: ACCENT }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <ul className="mt-1.5 space-y-0.5">
                      {proj.bullets.filter((b) => b.trim()).map((b, i) => (
                        <li key={i} className="flex gap-1.5 text-[9pt] text-slate-700">
                          <span className="shrink-0 mt-0.5" style={{ color: ACCENT }}>▸</span><span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — 35% */}
        <div className="flex-[35] px-6 py-6 space-y-5 bg-slate-50">
          {skills.length > 0 && (
            <div>
              <SectionLabel color={ACCENT}>Skills</SectionLabel>
              <div className="space-y-3 mt-2">
                {Object.entries(skillGroups).map(([cat, catSkills]) => (
                  <div key={cat}>
                    <p className="text-[8.5pt] font-semibold uppercase tracking-wider text-slate-400 mb-1">{cat}</p>
                    <div className="space-y-1">
                      {catSkills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between">
                            <p className="text-[9.5pt] text-slate-700">{skill.name}</p>
                            <p className="text-[8pt] text-slate-400 capitalize">{skill.level}</p>
                          </div>
                          <div className="mt-0.5 h-1 w-full rounded-full bg-slate-200">
                            <div className="h-full rounded-full transition-all" style={{ width: LEVEL_WIDTH[skill.level], background: ACCENT }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <SectionLabel color={ACCENT}>Education</SectionLabel>
              <div className="space-y-3 mt-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-semibold text-[10pt] text-slate-800">{edu.institution}</p>
                    <p className="text-[9pt] text-slate-600">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</p>
                    <p className="text-[8.5pt] text-slate-400">{formatDateRange(edu.startDate, edu.endDate, false)}</p>
                    {(edu.gpa || edu.honors) && <p className="text-[8.5pt] text-slate-500 mt-0.5">{[edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' · ')}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <SectionLabel color={ACCENT}>Certifications</SectionLabel>
              <div className="space-y-2 mt-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="rounded-lg border border-indigo-100 bg-white p-2.5">
                    <p className="font-medium text-[9.5pt] text-slate-800">{cert.name}</p>
                    <p className="text-[8.5pt] text-slate-500">{cert.issuer}</p>
                    {cert.issueDate && <p className="text-[8pt] mt-0.5" style={{ color: ACCENT }}>{cert.issueDate.slice(0, 7)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 text-[9pt] opacity-90">
      {icon}{label}
    </span>
  )
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <h2 className="text-[10pt] font-bold uppercase tracking-wider" style={{ color }}>{children}</h2>
      <div className="flex-1 h-px" style={{ background: `${color}30` }} />
    </div>
  )
}
