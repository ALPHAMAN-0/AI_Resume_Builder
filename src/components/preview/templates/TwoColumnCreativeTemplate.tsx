import type { ResumeData } from '@/types/resume'
import { formatDateRange } from '@/lib/utils'
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react'

interface Props { data: ResumeData; isPrintMode?: boolean; accent?: string }

const DEFAULT_ACCENT = '#0d9488'
const SIDEBAR_TEXT = '#f0fdf9'

const LEVEL_DOTS = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }

const grouped = (skills: ResumeData['skills']) => {
  const map: Record<string, ResumeData['skills']> = {}
  for (const s of skills) {
    if (!map[s.category]) map[s.category] = []
    map[s.category].push(s)
  }
  return map
}

export function TwoColumnCreativeTemplate({ data, accent }: Props) {
  const { personalInfo: p, experience, projects, skills, education, certifications } = data
  const skillGroups = grouped(skills)
  const ACCENT = accent || DEFAULT_ACCENT
  const SIDEBAR_BG = ACCENT

  return (
    <div className="resume-page flex" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar — 30% */}
      <div className="w-[220px] shrink-0 flex flex-col px-5 py-7 text-white" style={{ background: SIDEBAR_BG, color: SIDEBAR_TEXT }}>
        {/* Name */}
        <div className="mb-6">
          <h1 className="text-[17pt] font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
          {p.title && <p className="mt-1 text-[9pt] font-light opacity-80 uppercase tracking-wider">{p.title}</p>}
        </div>

        {/* Contact */}
        <SideSection title="Contact">
          <div className="space-y-1.5 text-[9pt]">
            {p.email && <SideContact icon={<Mail size={10} />} label={p.email} />}
            {p.phone && <SideContact icon={<Phone size={10} />} label={p.phone} />}
            {p.location && <SideContact icon={<MapPin size={10} />} label={p.location} />}
            {p.linkedIn && <SideContact icon={<Linkedin size={10} />} label={p.linkedIn} />}
            {p.github && <SideContact icon={<Github size={10} />} label={p.github} />}
            {p.portfolio && <SideContact icon={<Globe size={10} />} label={p.portfolio} />}
          </div>
        </SideSection>

        {/* Skills */}
        {skills.length > 0 && (
          <SideSection title="Skills">
            {Object.entries(skillGroups).map(([cat, catSkills]) => (
              <div key={cat} className="mb-2">
                <p className="text-[7.5pt] uppercase tracking-wider opacity-60 mb-1">{cat}</p>
                {catSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between mb-0.5">
                    <p className="text-[9pt]">{skill.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 4 }).map((_, di) => (
                        <div key={di} className="h-1.5 w-1.5 rounded-full" style={{ background: di < (LEVEL_DOTS[skill.level] || 2) ? 'white' : 'rgba(255,255,255,0.25)' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </SideSection>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <SideSection title="Education">
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-semibold text-[9.5pt]">{edu.institution}</p>
                <p className="text-[8.5pt] opacity-80">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</p>
                <p className="text-[8pt] opacity-60">{formatDateRange(edu.startDate, edu.endDate, false)}</p>
                {edu.gpa && <p className="text-[8pt] opacity-70">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </SideSection>
        )}

        {/* Certifications in sidebar */}
        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="font-medium text-[9pt]">{cert.name}</p>
                <p className="text-[8.5pt] opacity-70">{cert.issuer}</p>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main — 70% */}
      <div className="flex-1 px-7 py-7 space-y-5 bg-white">
        {/* Summary */}
        {p.summary && (
          <div>
            <MainSection title="About Me" color={ACCENT} />
            <p className="text-[10pt] text-slate-700 leading-relaxed mt-2">{p.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <MainSection title="Experience" color={ACCENT} />
            <div className="space-y-4 mt-2">
              {experience.map((role) => (
                <div key={role.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[10.5pt] text-slate-900">{role.title}</p>
                      <p className="text-[9.5pt] font-semibold" style={{ color: ACCENT }}>{role.company}</p>
                      {role.location && <p className="text-[9pt] text-slate-400">{role.location}</p>}
                    </div>
                    <span className="rounded-full px-2.5 py-0.5 text-[8.5pt] font-medium text-white shrink-0" style={{ background: ACCENT }}>
                      {formatDateRange(role.startDate, role.endDate, role.current)}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {role.bullets.filter((b) => b.trim()).map((b, i) => (
                      <li key={i} className="flex gap-2 text-[9.5pt] text-slate-700">
                        <span className="shrink-0 font-bold" style={{ color: ACCENT }}>›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {role.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {role.technologies.map((t) => (
                        <span key={t} className="rounded-md px-2 py-0.5 text-[8pt] font-medium border" style={{ borderColor: `${ACCENT}40`, color: ACCENT }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <MainSection title="Projects" color={ACCENT} />
            <div className="space-y-3 mt-2">
              {projects.map((proj) => (
                <div key={proj.id} className="rounded-xl border p-3" style={{ borderColor: `${ACCENT}30` }}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[10pt] text-slate-800">{proj.name}</p>
                    {proj.repoUrl && <p className="text-[8.5pt] text-slate-400">{proj.repoUrl}</p>}
                  </div>
                  {proj.description && <p className="text-[9.5pt] text-slate-500 mt-0.5">{proj.description}</p>}
                  {proj.technologies.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {proj.technologies.map((t) => (
                        <span key={t} className="rounded-md px-2 py-0.5 text-[8pt] font-medium border" style={{ borderColor: `${ACCENT}40`, color: ACCENT }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <ul className="mt-1.5 space-y-0.5">
                    {proj.bullets.filter((b) => b.trim()).map((b, i) => (
                      <li key={i} className="flex gap-2 text-[9.5pt] text-slate-700">
                        <span className="shrink-0 font-bold" style={{ color: ACCENT }}>›</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[8.5pt] uppercase tracking-widest font-bold opacity-60 mb-2 border-b border-white/20 pb-1">{title}</p>
      {children}
    </div>
  )
}

function SideContact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="shrink-0 mt-0.5 opacity-70">{icon}</span>
      <span className="break-all text-[8.5pt]">{label}</span>
    </div>
  )
}

function MainSection({ title, color }: { title: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-5 w-1 rounded-full shrink-0" style={{ background: color }} />
      <h2 className="text-[12pt] font-bold text-slate-800">{title}</h2>
    </div>
  )
}
