import type { ResumeData } from '@/types/resume'
import { formatDateRange } from '@/lib/utils'

interface Props { data: ResumeData; isPrintMode?: boolean }

const grouped = (skills: ResumeData['skills']) => {
  const map: Record<string, string[]> = {}
  for (const s of skills) {
    if (!map[s.category]) map[s.category] = []
    map[s.category].push(s.name)
  }
  return map
}

export function ClassicExecutiveTemplate({ data }: Props) {
  const { personalInfo: p, experience, projects, skills, education, certifications } = data
  const skillGroups = grouped(skills)

  return (
    <div className="resume-page px-12 py-10 text-[10.5pt] text-slate-800" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-[22pt] font-bold tracking-tight text-slate-900">{p.fullName || 'Your Name'}</h1>
        {p.title && <p className="mt-1 text-[12pt] font-normal text-slate-600 tracking-widest uppercase" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10pt' }}>{p.title}</p>}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9.5pt]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedIn && <span>{p.linkedIn}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <ExecSection title="Profile">
          <p className="text-[10pt] text-slate-700 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{p.summary}</p>
        </ExecSection>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <ExecSection title="Professional Experience">
          {experience.map((role) => (
            <div key={role.id} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[11pt] text-slate-900">{role.title}</p>
                  <p className="text-[10pt] text-slate-600 italic" style={{ fontFamily: 'Inter, sans-serif' }}>{[role.company, role.location].filter(Boolean).join(', ')}</p>
                </div>
                <p className="text-[9.5pt] text-slate-500 shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{formatDateRange(role.startDate, role.endDate, role.current)}</p>
              </div>
              <ul className="mt-2 space-y-1">
                {role.bullets.filter((b) => b.trim()).map((b, i) => (
                  <li key={i} className="flex gap-2 text-[10pt]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ExecSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ExecSection title="Notable Projects">
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <p className="font-bold text-[10.5pt]">{proj.name} {proj.technologies.length > 0 && <span className="font-normal text-[9.5pt] text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>— {proj.technologies.join(', ')}</span>}</p>
              {proj.description && <p className="text-[10pt] italic text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>{proj.description}</p>}
              <ul className="mt-1 space-y-0.5">
                {proj.bullets.filter((b) => b.trim()).map((b, i) => (
                  <li key={i} className="flex gap-2 text-[10pt]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ExecSection>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <ExecSection title="Technical Skills">
          <div className="space-y-0.5">
            {Object.entries(skillGroups).map(([cat, names]) => (
              <p key={cat} className="text-[10pt]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="font-semibold">{cat}:</span> {names.join(' · ')}
              </p>
            ))}
          </div>
        </ExecSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <ExecSection title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-[10.5pt]">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</p>
                <p className="text-[10pt] italic text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {(edu.gpa || edu.honors) && <p className="text-[9.5pt] text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>{[edu.gpa ? `GPA ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' · ')}</p>}
              </div>
              <p className="text-[9.5pt] text-slate-500 shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>{formatDateRange(edu.startDate, edu.endDate, false)}</p>
            </div>
          ))}
        </ExecSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <ExecSection title="Certifications">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between text-[10pt]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span><span className="font-medium">{cert.name}</span>{cert.issuer ? ` — ${cert.issuer}` : ''}</span>
              <span className="text-slate-500">{cert.issueDate?.slice(0, 7)}</span>
            </div>
          ))}
        </ExecSection>
      )}
    </div>
  )
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-[10pt] uppercase tracking-[0.15em] font-bold text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>{title}</h2>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      {children}
    </div>
  )
}
