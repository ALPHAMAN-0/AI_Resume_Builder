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

export function ATSMinimalTemplate({ data }: Props) {
  const { personalInfo: p, experience, projects, skills, education, certifications } = data
  const skillGroups = grouped(skills)

  const contact = [p.email, p.phone, p.location, p.linkedIn, p.github].filter(Boolean).join(' | ')

  return (
    <div className="resume-page font-serif px-12 py-10 text-[11pt] leading-snug text-black" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-[16pt] font-bold tracking-wide">{p.fullName || 'Your Name'}</p>
        {p.title && <p className="text-[11pt] mt-0.5">{p.title}</p>}
        {contact && <p className="text-[10pt] mt-1 text-gray-700">{contact}</p>}
      </div>

      {/* Summary */}
      {p.summary && (
        <Section title="Professional Summary">
          <p className="text-[10.5pt]">{p.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Work Experience">
          {experience.map((role) => (
            <div key={role.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <p className="font-bold">{role.title}</p>
                <p className="text-[10pt]">{formatDateRange(role.startDate, role.endDate, role.current)}</p>
              </div>
              <p className="italic text-[10.5pt]">{role.company}{role.location ? `, ${role.location}` : ''}</p>
              <ul className="mt-1 space-y-0.5">
                {role.bullets.filter((b) => b.trim()).map((b, i) => (
                  <li key={i} className="flex gap-2 text-[10.5pt]"><span>•</span><span>{b}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <p className="font-bold">{proj.name}</p>
                {proj.repoUrl && <p className="text-[10pt]">{proj.repoUrl}</p>}
              </div>
              {proj.description && <p className="italic text-[10.5pt]">{proj.description}</p>}
              {proj.technologies.length > 0 && <p className="text-[10pt]">Technologies: {proj.technologies.join(', ')}</p>}
              <ul className="mt-0.5 space-y-0.5">
                {proj.bullets.filter((b) => b.trim()).map((b, i) => (
                  <li key={i} className="flex gap-2 text-[10.5pt]"><span>•</span><span>{b}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          {Object.entries(skillGroups).map(([cat, names]) => (
            <p key={cat} className="text-[10.5pt]"><span className="font-bold">{cat}:</span> {names.join(', ')}</p>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <p className="font-bold">{edu.institution}</p>
                <p className="text-[10pt]">{formatDateRange(edu.startDate, edu.endDate, false)}</p>
              </div>
              <p className="text-[10.5pt]">{[edu.degree, edu.field].filter(Boolean).join(' in ')}{edu.location ? ` — ${edu.location}` : ''}</p>
              {(edu.gpa || edu.honors) && <p className="text-[10pt]">{[edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' · ')}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between text-[10.5pt]">
              <p><span className="font-bold">{cert.name}</span>{cert.issuer ? ` — ${cert.issuer}` : ''}</p>
              <p>{cert.issueDate ? cert.issueDate.slice(0, 7) : ''}</p>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[11pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">{title}</p>
      {children}
    </div>
  )
}
