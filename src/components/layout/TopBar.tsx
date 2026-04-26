import { useRef } from 'react'
import { Download, Loader2, RotateCcw, FileJson, Upload, Moon, Sun } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { usePDFExport } from '@/hooks/usePDFExport'
import { TEMPLATES } from '@/constants/templates'
import { DEMO_RESUME } from '@/constants/demoData'
import { exportResumeJson, importResumeJson } from '@/lib/jsonPortability'
import { AccentPicker, getAccentForTemplate } from './AccentPicker'
import type { TemplateId } from '@/types/resume'
import logoUrl from '@/assets/logo.png'

export function TopBar() {
  const activeTemplate = useResumeStore((s) => s.activeTemplate)
  const setTemplate = useResumeStore((s) => s.setTemplate)
  const accents = useResumeStore((s) => s.templateAccents)
  const loadDemoData = useResumeStore((s) => s.loadDemoData)
  const resetResume = useResumeStore((s) => s.resetResume)
  const resumeData = useResumeStore((s) => s.resumeData)
  const theme = useResumeStore((s) => s.theme)
  const toggleTheme = useResumeStore((s) => s.toggleTheme)
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
    <header className="flex h-14 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <img src={logoUrl} alt="ResumeAI Pro" className="h-8 w-8 rounded-lg object-cover" />
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">ResumeAI Pro</span>
      </div>

      <div className="mx-2 h-5 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Template switcher */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">Template:</span>
        {TEMPLATES.map((t) => {
          const accent = getAccentForTemplate(t.id, accents)
          const active = activeTemplate === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id as TemplateId)}
              title={`${t.name} — Best for: ${t.bestFor.join(', ')}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                active
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
              }`}
              style={active ? { background: accent } : {}}
            >
              {t.name}
            </button>
          )
        })}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Accent color picker (only for Modern Tech / Creative Pro) */}
        <AccentPicker />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-600 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import resume from JSON"
          className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <Upload size={13} /> Import
        </button>
        <button
          onClick={() => exportResumeJson(resumeData)}
          title="Export resume as JSON backup"
          className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <FileJson size={13} /> JSON
        </button>
        <button
          onClick={() => loadDemoData(DEMO_RESUME)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          Load Demo
        </button>
        <button
          onClick={() => { if (confirm('Clear all data?')) resetResume() }}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-400 hover:text-red-500"
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
