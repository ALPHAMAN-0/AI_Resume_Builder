import { useState } from 'react'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { AddItemButton } from '@/components/shared/AddItemButton'
import { RemoveButton } from '@/components/shared/RemoveButton'
import { RichTextArea } from '@/components/form/fields/RichTextArea'
import { DateRangePicker } from '@/components/form/fields/DateRangePicker'
import { TagInput } from '@/components/form/fields/TagInput'
import type { Role } from '@/types/resume'

const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"

function ExperienceCard({ role, index }: { role: Role; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const [dragOver, setDragOver] = useState(false)
  const update = useResumeStore((s) => s.updateExperience)
  const remove = useResumeStore((s) => s.removeExperience)
  const reorder = useResumeStore((s) => s.reorderExperience)

  return (
    <div
      className={`step-card transition-colors ${dragOver ? '!border-brand-500 !bg-brand-50 dark:!bg-brand-500/10' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const from = Number(e.dataTransfer.getData('text/plain'))
        if (!Number.isNaN(from) && from !== index) reorder(from, index)
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          draggable
          onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(index)); e.dataTransfer.effectAllowed = 'move' }}
          title="Drag to reorder"
          className="cursor-grab active:cursor-grabbing shrink-0 p-1 -m-1 hover:text-slate-500"
        >
          <GripVertical size={16} className="text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{role.title || 'New Position'}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{role.company || 'Company name'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RemoveButton onClick={() => remove(role.id)} label="" />
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-slate-400 hover:text-slate-700">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t step-card-divider p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block field-label-sm">Job Title</label>
              <input className={inputClass} placeholder="Software Engineer" value={role.title} onChange={(e) => update(role.id, { title: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block field-label-sm">Company</label>
              <input className={inputClass} placeholder="Acme Corp" value={role.company} onChange={(e) => update(role.id, { company: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block field-label-sm">Location</label>
            <input className={inputClass} placeholder="San Francisco, CA" value={role.location} onChange={(e) => update(role.id, { location: e.target.value })} />
          </div>
          <DateRangePicker
            startDate={role.startDate}
            endDate={role.endDate}
            current={role.current}
            onStartChange={(v) => update(role.id, { startDate: v })}
            onEndChange={(v) => update(role.id, { endDate: v })}
            onCurrentChange={(v) => update(role.id, { current: v, endDate: v ? '' : role.endDate })}
          />
          <div>
            <label className="mb-2 block field-label-sm">Achievements & Responsibilities</label>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
              <RichTextArea
                bullets={role.bullets}
                onChange={(bullets) => update(role.id, { bullets })}
                placeholder="Architected a real-time pipeline processing 2M events/day, reducing latency by 65%"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block field-label-sm">Technologies Used</label>
            <TagInput tags={role.technologies} onChange={(technologies) => update(role.id, { technologies })} placeholder="React, TypeScript, AWS..." />
          </div>
        </div>
      )}
    </div>
  )
}

export function ExperienceStep() {
  const experience = useResumeStore((s) => s.resumeData.experience)
  const addExperience = useResumeStore((s) => s.addExperience)

  return (
    <div>
      <SectionHeader title="Work Experience" description="List your most recent positions first. Use strong action verbs and quantify your impact." />
      <div className="space-y-3">
        {experience.map((role, i) => <ExperienceCard key={role.id} role={role} index={i} />)}
      </div>
      <AddItemButton label="Add Experience" onClick={addExperience} />
    </div>
  )
}
