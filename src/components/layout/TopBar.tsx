import { useRef } from 'react'
import { Download, Loader2, RotateCcw, Sparkles, FileJson, Upload } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { usePDFExport } from '@/hooks/usePDFExport'
import { TEMPLATES } from '@/constants/templates'
import { DEMO_RESUME } from '@/constants/demoData'
import { exportResumeJson, importResumeJson } from '@/lib/jsonPortability'
import type { TemplateId } from '@/types/resume'

const TEMPLATE_COLORS: Record<TemplateId, string> = {
  'modern-tech': '#4f46e5',
  'classic-executive': '#1e3a5f',
  'two-column-creative': '#0d9488',
  'ats-minimal': '#374151',
}

export function TopBar() {
  const activeTemplate = useResumeStore((s) => s.activeTemplate)
  const setTemplate = useResumeStore((s) => s.setTemplate)
  const loadDemoData = useResumeStore((s) => s.loadDemoData)
  const resetResume = useResumeStore((s) => s.resetResume)
  const resumeData = useResumeStore((s) => s.resumeData)
  const { handleExport, isExporting } = usePDFExport()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importResumeJson(file)
      loadDemoData(data)
      alert('Resume imported successfully')
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`)
    } finally {
      e.target.value = ''
    }
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold text-slate-800">ResumeAI Pro</span>
      </div>

      <div className="mx-2 h-5 w-px bg-slate-200" />

      {/* Template switcher */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-medium text-slate-500 shrink-0">Template:</span>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id as TemplateId)}
            title={`${t.name} — Best for: ${t.bestFor.join(', ')}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              activeTemplate === t.id
                ? 'border-transparent text-white shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
            }`}
            style={activeTemplate === t.id ? { background: TEMPLATE_COLORS[t.id as TemplateId] } : {}}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import resume from JSON"
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Upload size={13} /> Import
        </button>
        <button
          onClick={() => exportResumeJson(resumeData)}
          title="Export resume as JSON backup"
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <FileJson size={13} /> JSON
        </button>
        <button
          onClick={() => loadDemoData(DEMO_RESUME)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          Load Demo
        </button>
        <button
          onClick={() => { if (confirm('Clear all data?')) resetResume() }}
          className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-red-500"
          title="Reset resume"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {isExporting ? 'Exporting…' : 'Download PDF'}
        </button>
      </div>
    </header>
  )
}
