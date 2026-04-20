import { Target, Copy, X } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { useJDMatch } from '@/hooks/useJDMatch'

export function JDMatcher() {
  const jd = useResumeStore((s) => s.jobDescription)
  const setJd = useResumeStore((s) => s.setJobDescription)
  const result = useJDMatch()

  const hasJd = jd.trim().length > 0
  const pct = result.matchPercent
  const color = pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Target size={15} className="text-brand-500" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Job Description Match</span>
        {hasJd && (
          <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold" style={{ color, background: `${color}20` }}>
            {pct}%
          </span>
        )}
      </div>

      <div className="px-4 pb-4 space-y-3">
        {hasJd ? (
          <>
            <div className="relative">
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{result.matched.length} keywords matched · {result.missing.length} missing</p>
            </div>

            {result.topMissing.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Missing keywords (add these):</p>
                <div className="flex flex-wrap gap-1">
                  {result.topMissing.map((k) => (
                    <span key={k} className="rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setJd('')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500"
            >
              <X size={11} /> Clear job description
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste a job description below to see which keywords are in your resume vs. missing.
            </p>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Copy size={10} />
              <span>Copy-paste the full JD for best results</span>
            </div>
          </>
        )}

        {hasJd && (
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        )}
      </div>
    </div>
  )
}
