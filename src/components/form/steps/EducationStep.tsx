import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { AddItemButton } from '@/components/shared/AddItemButton'
import { RemoveButton } from '@/components/shared/RemoveButton'
import { TagInput } from '@/components/form/fields/TagInput'
import type { Education } from '@/types/resume'

const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"

function EducationCard({ edu, index }: { edu: Education; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const update = useResumeStore((s) => s.updateEducation)
  const remove = useResumeStore((s) => s.removeEducation)

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">{edu.institution || 'University Name'}</p>
          <p className="text-sm text-slate-500 truncate">{[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree & Field'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RemoveButton onClick={() => remove(edu.id)} label="" />
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-slate-400 hover:text-slate-700">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-slate-100 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Institution</label>
            <input className={inputClass} placeholder="UC Berkeley" value={edu.institution} onChange={(e) => update(edu.id, { institution: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Degree</label>
              <input className={inputClass} placeholder="Bachelor of Science" value={edu.degree} onChange={(e) => update(edu.id, { degree: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Field of Study</label>
              <input className={inputClass} placeholder="Computer Science" value={edu.field} onChange={(e) => update(edu.id, { field: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Location</label>
              <input className={inputClass} placeholder="Berkeley, CA" value={edu.location} onChange={(e) => update(edu.id, { location: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">GPA (optional)</label>
              <input className={inputClass} placeholder="3.8" value={edu.gpa} onChange={(e) => update(edu.id, { gpa: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Start</label>
              <input type="month" className={inputClass} value={edu.startDate} onChange={(e) => update(edu.id, { startDate: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">End (or expected)</label>
              <input type="month" className={inputClass} value={edu.endDate} onChange={(e) => update(edu.id, { endDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Honors / Awards (optional)</label>
            <input className={inputClass} placeholder="Magna Cum Laude, Dean's List" value={edu.honors} onChange={(e) => update(edu.id, { honors: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Relevant Coursework (optional)</label>
            <TagInput tags={edu.coursework} onChange={(coursework) => update(edu.id, { coursework })} placeholder="Distributed Systems, Algorithms..." />
          </div>
        </div>
      )}
    </div>
  )
}

export function EducationStep() {
  const education = useResumeStore((s) => s.resumeData.education)
  const addEducation = useResumeStore((s) => s.addEducation)

  return (
    <div>
      <SectionHeader title="Education" description="Include GPA if 3.5+ and you're within 3 years of graduation." />
      <div className="space-y-3">
        {education.map((edu, i) => <EducationCard key={edu.id} edu={edu} index={i} />)}
      </div>
      <AddItemButton label="Add Education" onClick={addEducation} />
    </div>
  )
}
