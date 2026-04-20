import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { FormWizard } from '@/components/form/FormWizard'
import { ResumePreview, PrintRoot } from '@/components/preview/ResumePreview'
import { ATSPanel } from '@/components/ats/ATSPanel'
import { JDMatcher } from '@/components/ats/JDMatcher'
import { usePDFExport } from '@/hooks/usePDFExport'

export function AppShell() {
  const { handleExport } = usePDFExport()

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
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <div className="flex w-[420px] shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-slate-50">
          <FormWizard />
        </div>

        {/* Preview panel */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ResumePreview />
        </div>

        {/* ATS sidebar */}
        <div className="flex w-[280px] shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white">
          <div className="p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resume Intelligence</h3>
            <p className="mt-0.5 text-xs text-slate-500">ATS score + JD match</p>
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
