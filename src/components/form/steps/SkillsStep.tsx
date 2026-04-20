import { useState } from 'react'
import { X } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { SectionHeader } from '@/components/shared/SectionHeader'
import type { Skill, SkillLevel } from '@/types/resume'

const CATEGORIES = ['Languages', 'Frameworks', 'Infrastructure', 'Databases', 'Tools', 'Other']
const LEVELS: { value: SkillLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-slate-200 text-slate-600' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-700' },
  { value: 'advanced', label: 'Advanced', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'expert', label: 'Expert', color: 'bg-brand-100 text-brand-700' },
]

function SkillBadge({ skill }: { skill: Skill }) {
  const update = useResumeStore((s) => s.updateSkill)
  const remove = useResumeStore((s) => s.removeSkill)
  const levelInfo = LEVELS.find((l) => l.value === skill.level) || LEVELS[1]

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-3 pr-1.5 py-1 shadow-sm">
      <span className="text-sm font-medium text-slate-700">{skill.name}</span>
      <select
        value={skill.level}
        onChange={(e) => update(skill.id, { level: e.target.value as SkillLevel })}
        className={`rounded-full px-1.5 py-0.5 text-xs font-medium border-none outline-none cursor-pointer ${levelInfo.color}`}
      >
        {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
      </select>
      <button onClick={() => remove(skill.id)} className="ml-0.5 text-slate-300 hover:text-red-400">
        <X size={13} />
      </button>
    </div>
  )
}

export function SkillsStep() {
  const skills = useResumeStore((s) => s.resumeData.skills)
  const addSkill = useResumeStore((s) => s.addSkill)
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const handleAdd = (category: string) => {
    const val = (inputs[category] || '').trim()
    if (val) {
      addSkill(val, category)
      setInputs((prev) => ({ ...prev, [category]: '' }))
    }
  }

  return (
    <div>
      <SectionHeader title="Skills" description="Add your technical skills by category. Click a skill to adjust its level." />
      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const catSkills = skills.filter((s) => s.category === category)
          return (
            <div key={category}>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{category}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {catSkills.map((skill) => <SkillBadge key={skill.id} skill={skill} />)}
              </div>
              <div className="flex gap-2">
                <input
                  value={inputs[category] || ''}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [category]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(category)}
                  placeholder={`Add ${category.toLowerCase()} skill...`}
                  className="flex-1 rounded-lg border border-dashed border-slate-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
                <button
                  onClick={() => handleAdd(category)}
                  disabled={!(inputs[category] || '').trim()}
                  className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
