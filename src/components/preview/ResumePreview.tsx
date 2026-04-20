import { useResumeStore } from '@/store/useResumeStore'
import type { TemplateId, ResumeData } from '@/types/resume'
import { ModernTechTemplate } from './templates/ModernTechTemplate'
import { ClassicExecutiveTemplate } from './templates/ClassicExecutiveTemplate'
import { TwoColumnCreativeTemplate } from './templates/TwoColumnCreativeTemplate'
import { ATSMinimalTemplate } from './templates/ATSMinimalTemplate'

interface TemplateProps { data: ResumeData; isPrintMode?: boolean }
const TEMPLATE_MAP: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  'modern-tech': ModernTechTemplate,
  'classic-executive': ClassicExecutiveTemplate,
  'two-column-creative': TwoColumnCreativeTemplate,
  'ats-minimal': ATSMinimalTemplate,
}

export function ResumePreview() {
  const resumeData = useResumeStore((s) => s.resumeData)
  const activeTemplate = useResumeStore((s) => s.activeTemplate)
  const zoom = useResumeStore((s) => s.previewZoom)
  const setZoom = useResumeStore((s) => s.setZoom)

  const Template = TEMPLATE_MAP[activeTemplate]

  return (
    <div className="flex h-full flex-col">
      {/* Zoom controls */}
      <div className="flex items-center justify-end gap-2 border-b border-slate-100 bg-white px-4 py-2">
        <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.3))} className="px-2 py-0.5 text-sm text-slate-500 hover:text-slate-800">−</button>
        <span className="text-xs text-slate-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(Math.min(zoom + 0.1, 1.2))} className="px-2 py-0.5 text-sm text-slate-500 hover:text-slate-800">+</button>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-slate-200 p-6 flex justify-center">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', width: '794px', minHeight: '1123px' }}>
          <div className="shadow-2xl ring-1 ring-black/5">
            <Template data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PrintRoot() {
  const resumeData = useResumeStore((s) => s.resumeData)
  const activeTemplate = useResumeStore((s) => s.activeTemplate)
  const Template = TEMPLATE_MAP[activeTemplate]

  return (
    <div
      id="resume-print-root"
      style={{ visibility: 'hidden', position: 'absolute', top: 0, left: '-9999px', width: '794px', background: 'white' }}
    >
      <Template data={resumeData} isPrintMode />
    </div>
  )
}
