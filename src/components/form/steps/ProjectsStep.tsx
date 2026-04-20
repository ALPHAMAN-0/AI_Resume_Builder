import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { AddItemButton } from '@/components/shared/AddItemButton'
import { RemoveButton } from '@/components/shared/RemoveButton'
import { RichTextArea } from '@/components/form/fields/RichTextArea'
import { TagInput } from '@/components/form/fields/TagInput'
import type { Project } from '@/types/resume'

const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const update = useResumeStore((s) => s.updateProject)
  const remove = useResumeStore((s) => s.removeProject)

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">{project.name || 'New Project'}</p>
          <p className="text-xs text-slate-400 truncate">{project.technologies.slice(0, 3).join(', ') || 'No technologies added'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RemoveButton onClick={() => remove(project.id)} label="" />
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-slate-400 hover:text-slate-700">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-slate-100 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Project Name</label>
            <input className={inputClass} placeholder="OpenSearch Accelerator" value={project.name} onChange={(e) => update(project.id, { name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Brief Description</label>
            <input className={inputClass} placeholder="Open-source query optimization library for Elasticsearch" value={project.description} onChange={(e) => update(project.id, { description: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">Key Highlights</label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <RichTextArea
                bullets={project.bullets}
                onChange={(bullets) => update(project.id, { bullets })}
                placeholder="Improved p99 search latency from 450ms to 85ms, reducing query costs by 60%"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Technologies</label>
            <TagInput tags={project.technologies} onChange={(technologies) => update(project.id, { technologies })} placeholder="Go, Redis, PostgreSQL..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">GitHub / Repo URL</label>
              <input className={inputClass} placeholder="github.com/you/project" value={project.repoUrl} onChange={(e) => update(project.id, { repoUrl: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Live URL (optional)</label>
              <input className={inputClass} placeholder="yourproject.com" value={project.liveUrl} onChange={(e) => update(project.id, { liveUrl: e.target.value })} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProjectsStep() {
  const projects = useResumeStore((s) => s.resumeData.projects)
  const addProject = useResumeStore((s) => s.addProject)

  return (
    <div>
      <SectionHeader title="Projects" description="Showcase your best work. Include metrics and GitHub links." />
      <div className="space-y-3">
        {projects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
      </div>
      <AddItemButton label="Add Project" onClick={addProject} />
    </div>
  )
}
