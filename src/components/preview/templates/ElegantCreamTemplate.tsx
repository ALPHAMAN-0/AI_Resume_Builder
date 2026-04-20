import type { ResumeData } from '@/types/resume'
import { Phone, Mail, MapPin, User } from 'lucide-react'

interface Props { data: ResumeData; isPrintMode?: boolean; accent?: string }

const CREAM = '#f1e6d1'       // warm beige background
const CREAM_EDGE = '#e8dcc2'  // slightly darker for photo border
const NAVY = '#23304d'        // dark navy for name
const BROWN = '#8b6a3a'       // brown accent (dots, bars)
const BROWN_LIGHT = '#e5d3b4' // light brown for empty dots / bar track
const BODY = '#444'           // body text

const LEVEL_DOTS: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, expert: 4,
}

const DEFAULT_ACCENT = '#5d40cc' // purple

function splitSkills(skills: ResumeData['skills']) {
  const langs = skills.filter((s) => s.category === 'Languages')
  const others = skills.filter((s) => s.category !== 'Languages')
  return { langs, others }
}

function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ElegantCreamTemplate({ data, accent }: Props) {
  const { personalInfo: p, experience, projects, skills, education } = data
  const ACCENT = accent || DEFAULT_ACCENT
  const { langs, others } = splitSkills(skills)
  const initials = initialsOf(p.fullName)

  return (
    <div className="resume-page flex relative" style={{ fontFamily: 'Inter, system-ui, sans-serif', color: BODY }}>
      {/* Left sidebar — cream background all the way down */}
      <div className="w-[270px] shrink-0 flex flex-col" style={{ background: CREAM }}>
        {/* Photo circle */}
        <div className="px-5 pt-10 pb-4 flex justify-center">
          <div
            className="w-[170px] h-[170px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: '#ffffff', border: `5px solid ${CREAM_EDGE}`, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
          >
            {initials ? (
              <span className="text-[36pt] font-bold" style={{ color: NAVY }}>{initials}</span>
            ) : (
              <User size={64} style={{ color: CREAM_EDGE }} />
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="px-6 pt-4 pb-5">
          <h2 className="text-[18pt] font-bold mb-4" style={{ color: ACCENT }}>Contact</h2>
          <div className="space-y-3 text-[9.5pt]">
            {p.phone && <ContactRow icon={<Phone size={13} />}>{p.phone}</ContactRow>}
            {p.email && <ContactRow icon={<Mail size={13} />}>{p.email}</ContactRow>}
            {p.location && <ContactRow icon={<MapPin size={13} />}>{p.location}</ContactRow>}
          </div>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="px-6 pt-2 pb-5">
            <h2 className="text-[18pt] font-bold mb-4" style={{ color: ACCENT }}>Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex gap-2.5">
                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: BROWN }} />
                  <div className="flex-1">
                    {edu.degree && <p className="font-bold text-[10.5pt] uppercase tracking-wide" style={{ color: NAVY }}>{edu.degree}</p>}
                    {(edu.field || edu.institution) && (
                      <p className="text-[9.5pt] font-semibold uppercase tracking-wide" style={{ color: NAVY }}>
                        {edu.institution}
                      </p>
                    )}
                    {edu.field && <p className="text-[9pt]" style={{ color: BODY }}>{edu.field}</p>}
                    {edu.endDate && <p className="text-[9pt]" style={{ color: BODY }}>{edu.endDate.slice(0, 4)}</p>}
                    {edu.gpa && <p className="text-[9pt]" style={{ color: BODY }}>GPA- {edu.gpa} (out of 5.00)</p>}
                    {edu.location && <p className="text-[9pt] font-bold" style={{ color: BODY }}>{edu.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {others.length > 0 && (
          <div className="px-6 pt-2 pb-6">
            <h2 className="text-[18pt] font-bold mb-4" style={{ color: ACCENT }}>Skills</h2>
            <div className="space-y-2">
              {others.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between gap-2">
                  <span className="text-[10pt]" style={{ color: BODY }}>{skill.name}</span>
                  <div className="flex gap-1 shrink-0">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: i <= (LEVEL_DOTS[skill.level] || 0) ? BROWN : BROWN_LIGHT }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header strip — cream with name + career objective */}
        <div className="px-8 pt-9 pb-7 relative" style={{ background: CREAM }}>
          <h1 className="text-[26pt] font-extrabold leading-[1.05] uppercase break-words" style={{ color: NAVY, letterSpacing: '-0.01em' }}>
            {p.fullName || 'YOUR NAME'}
          </h1>
          {p.title && (
            <p className="mt-1 text-[11pt] font-medium" style={{ color: NAVY, opacity: 0.75 }}>{p.title}</p>
          )}
          {p.summary && (
            <>
              <h2 className="text-[15pt] font-bold mt-5 mb-2" style={{ color: ACCENT }}>Career Objective</h2>
              <p className="text-[9.5pt] leading-relaxed" style={{ color: BODY }}>{p.summary}</p>
            </>
          )}
        </div>

        {/* Content — white */}
        <div className="px-8 py-7 space-y-7 bg-white flex-1">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-[18pt] font-bold mb-4" style={{ color: ACCENT }}>Experience</h2>
              <div className="space-y-5">
                {experience.map((role) => (
                  <div key={role.id}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: BROWN }} />
                      <h3 className="text-[12.5pt] font-bold" style={{ color: NAVY }}>
                        {role.title}{role.company && <span className="font-semibold"> · {role.company}</span>}
                      </h3>
                    </div>
                    <div className="ml-5 space-y-0.5">
                      {role.bullets.filter((b) => b.trim()).map((bullet, i) => (
                        <p key={i} className="text-[10pt] leading-snug" style={{ color: BODY }}>{bullet}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Highlights — mapped from projects' bullets */}
          {projects.length > 0 && (
            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: BROWN }} />
                <h2 className="text-[18pt] font-bold" style={{ color: ACCENT }}>Highlights</h2>
              </div>
              <ul className="ml-5 space-y-1.5 list-disc pl-4">
                {projects.flatMap((proj) => proj.bullets).filter((b) => b.trim()).map((b, i) => (
                  <li key={i} className="text-[10pt] leading-relaxed pl-1" style={{ color: BODY }}>{b}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {langs.length > 0 && (
            <section>
              <h2 className="text-[18pt] font-bold mb-4" style={{ color: ACCENT }}>Language</h2>
              <div className="flex flex-wrap gap-6">
                {langs.map((lang) => (
                  <div key={lang.id} className="flex flex-col gap-1.5 min-w-[110px]">
                    <p className="text-[10pt]" style={{ color: BODY }}>{lang.name}</p>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: BROWN_LIGHT }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${((LEVEL_DOTS[lang.level] || 0) / 4) * 100}%`,
                          background: BROWN,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="shrink-0 mt-0.5" style={{ color: BROWN }}>{icon}</span>
      <span className="break-all" style={{ color: BODY }}>{children}</span>
    </div>
  )
}
