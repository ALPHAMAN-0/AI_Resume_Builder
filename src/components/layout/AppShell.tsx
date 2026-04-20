import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { FormWizard } from '@/components/form/FormWizard'
import { ResumePreview, PrintRoot } from '@/components/preview/ResumePreview'
import { ATSPanel } from '@/components/ats/ATSPanel'
import { JDMatcher } from '@/components/ats/JDMatcher'
import { usePDFExport } from '@/hooks/usePDFExport'
import { useResumeStore } from '@/store/useResumeStore'

export function AppShell() {
  const { handleExport } = usePDFExport()
  const theme = useResumeStore((s) => s.theme)

  // Apply dark class to <html> for Tailwind dark: variants to activate
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        handleExport()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleExport])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className="flex w-[420px] shrink-0 flex-col overflow-hidden border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <FormWizard />
        </div>

        {/* Preview panel — resume preview background stays neutral gray in both modes */}
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-100 dark:bg-slate-900">
          <ResumePreview />
        </div>

        {/* ATS sidebar */}
        <div className="flex w-[280px] shrink-0 flex-col overflow-y-auto border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Resume Intelligence</h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">ATS score + JD match</p>
          </div>
          <ATSPanel />
          <JDMatcher />
        </div>
      </div>

      {/* Hidden print root — always mounted, off-screen */}
      <PrintRoot />
    </div>
  )
}
